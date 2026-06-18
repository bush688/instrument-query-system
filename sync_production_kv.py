"""
Safely validate and optionally sync production KV values.

Default mode is dry-run. Use --upload to write Cloudflare KV.

This script treats C:\\Users\\bush6\\manifest_final.json as the authoritative
production manifest and refuses to upload cf_manifest.json, which is only a
historical/location subset.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
from datetime import datetime
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = Path(r"E:\opencode\instrument-cf")
MANIFEST_FILE = Path(r"C:\Users\bush6\manifest_final.json")
TAG_META_FILE = Path(r"C:\Users\bush6\tag_meta.json")
TAG_LIST_FILE = Path(r"C:\Users\bush6\tag_list.json")
SEARCH_INDEX_FILE = Path(r"C:\Users\bush6\search_index.json")
BACKUP_DIR = Path(r"C:\Users\bush6\backup")
KV_NAMESPACE = os.environ.get("CF_KV_NAMESPACE_ID", "your-kv-namespace-id")

EQUIV_GROUPS = [
    ["FE", "FT", "FI"],
    ["PDT", "PDI"],
    ["PT", "PI"],
    ["LT", "LI"],
    ["TE", "TI"],
    ["AT", "AI"],
]
EQUIV_PATTERNS = [
    (re.compile(r"^(\d{0,2})(" + "|".join(group) + r")([-_].+)$"), group)
    for group in EQUIV_GROUPS
]

DEVICE_CODES = {
    "030000": "煤气化装置仪表图",
    "030100": "煤浆制备与输送仪表图",
    "030200": "气化仪表图",
    "030300": "渣水处理仪表图",
    "040100": "一氧化碳变换仪表图",
    "040200": "酸性气体脱除仪表图",
    "040300": "气体精制仪表图",
    "040500": "氨合成仪表图",
    "040800": "除氧给水仪表图",
    "040900": "硫回收仪表图",
    "090200": "尿素主装置仪表图",
    "200000": "原水加压及消防仪表图",
    "210000": "循环冷却水站仪表图",
    "290000": "余热发电仪表图",
    "300000": "动力站仪表图",
    "350200": "空分现场机柜间仪表图",
    "350300": "气化合成氨现场机柜间仪表",
    "370000": "全厂外管仪表图",
    "400100": "球罐区仪表图",
    "400200": "常压氨罐区仪表图",
    "400300": "甲醇罐区仪表图",
    "400400": "硫酸罐区仪表图",
    "400800": "汽车装卸栈台仪表图",
}


def load_json(path: Path) -> dict:
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def write_json_compact(path: Path, data: dict) -> None:
    path.write_text(
        json.dumps(data, ensure_ascii=False, separators=(",", ":")),
        encoding="utf-8",
    )


def canonicalize(tag: str) -> str:
    for pattern, group in EQUIV_PATTERNS:
        match = pattern.match(tag)
        if match:
            return match.group(1) + group[0] + match.group(3)
    return tag


def extract6(value: object) -> str | None:
    if not value:
        return None
    match = re.search(r"\b(\d{6})\b", str(value))
    return match.group(1) if match else None


def tag_subplant(tag: str, tags: dict, docs: dict) -> str | None:
    for ref in tags.get(tag, []):
        doc = docs.get(ref.get("doc_id", ""))
        if not doc:
            continue
        code = (
            extract6(doc.get("drawing_dir", ""))
            or extract6(doc.get("doc_id", ""))
            or extract6(doc.get("source_pdf", ""))
        )
        if code in DEVICE_CODES:
            return code
    return None


def is_hidden_device_tag(tag: str) -> bool:
    match = re.match(r"^(\d{2})", str(tag or ""))
    return bool(match and match.group(1) in {"30", "35"})


def norm_meta_key(tag: str) -> str:
    return str(tag or "").upper().replace("_", "-")


def lookup_meta(tag_meta: dict, tag: str) -> dict | None:
    key = norm_meta_key(tag)
    if key in tag_meta:
        return tag_meta[key]
    return tag_meta.get(key.replace("-", "_"))


def get_aliases(tag: str) -> list[str]:
    out: set[str] = set()
    seps = {tag}
    if "-" in tag:
        seps.add(tag.replace("-", "_"))
    if "_" in tag:
        seps.add(tag.replace("_", "-"))
    for value in seps:
        out.add(value)
        for pattern, group in EQUIV_PATTERNS:
            match = pattern.match(value)
            if not match:
                continue
            for other in group:
                out.add(f"{match.group(1)}{other}{match.group(3)}")
                out.add(f"{match.group(1)}{other}{match.group(3).replace('-', '_')}")
                out.add(f"{match.group(1)}{other}{match.group(3).replace('_', '-')}")
            break
    out.discard(tag)
    return sorted(out)


def location_ref_signature(ref: dict) -> str:
    return "::".join(
        [
            str(ref.get("type", "")),
            str(ref.get("doc_id", "")),
            ",".join(str(x) for x in (ref.get("pages") or [])),
            "" if ref.get("x") is None else str(ref.get("x")),
            "" if ref.get("y") is None else str(ref.get("y")),
            str(ref.get("location_floor", "")),
            str(ref.get("location_floor_el", "")),
            str(ref.get("location_floor_name", "")),
        ]
    )


def build_tag_list(manifest: dict) -> dict:
    tags = manifest.get("tags", {})
    docs = manifest.get("docs", {})

    canon_to_tag: dict[str, str] = {}
    for tag in tags:
        canon = canonicalize(tag)
        if canon not in canon_to_tag or tag == canon:
            canon_to_tag[canon] = tag

    groups: dict[str, list[str]] = {}
    for tag in canon_to_tag.values():
        key = tag_subplant(tag, tags, docs)
        if not key:
            continue
        groups.setdefault(key, []).append(tag)

    for values in groups.values():
        values.sort()

    return {"groups": groups, "total": sum(len(values) for values in groups.values())}


def build_search_index(manifest: dict, tag_meta: dict, tag_list: dict) -> dict:
    groups = tag_list.get("groups", {}) or {}
    all_tags = manifest.get("tags", {}) or {}
    tags: list[str] = []
    desc_entries: list[list[str]] = []
    seen_tags: set[str] = set()
    tag_device: dict[str, str] = {}
    group_members: dict[str, list[str]] = {}
    meta_by_tag: dict[str, dict] = {}

    for code, group_tags in groups.items():
        for tag in group_tags or []:
            if not tag or is_hidden_device_tag(tag):
                continue
            if tag not in seen_tags:
                seen_tags.add(tag)
                tags.append(tag)
            canon = canonicalize(tag)
            tag_device[tag] = code
            tag_device[canon] = code
            for alias in get_aliases(tag):
                tag_device[alias] = code

    for tag, meta in (tag_meta or {}).items():
        if not tag or is_hidden_device_tag(tag):
            continue
        if tag not in seen_tags:
            seen_tags.add(tag)
            tags.append(tag)
        desc = str((meta or {}).get("desc") or "").lower() if isinstance(meta, dict) else ""
        desc_entries.append([tag, desc])
        if isinstance(meta, dict):
            slim = {}
            for key in ("desc", "unit", "lo", "hi", "group_key", "src", "gds", "sis"):
                if key in meta:
                    slim[key] = meta[key]
            if slim:
                meta_by_tag[tag] = slim

    for tag in all_tags.keys():
        meta = lookup_meta(tag_meta, tag) or {}
        group_key = meta.get("group_key") or ""
        if not group_key:
            match = re.match(r"^(\d{0,2})([A-Z]+)[-_](.+)$", str(tag))
            if match:
                letters = match.group(2)
                func = letters[2:] if letters[:2] in {"PD", "FD"} else (letters[1:] if len(letters) > 1 else "")
                base = letters if not func else letters[: len(letters) - len(func)]
                group_key = f"{match.group(1)}{base}-{match.group(3)}"
        if not group_key:
            continue
        group_members.setdefault(group_key, []).append(tag)

    group_single_location_refs: dict[str, list[dict]] = {}
    for group_key, member_tags in group_members.items():
        refs: list[dict] = []
        seen: set[str] = set()
        for tag in member_tags:
            for ref in all_tags.get(tag, []) or []:
                if not ref or ref.get("type") != "location":
                    continue
                sig = location_ref_signature(ref)
                if sig in seen:
                    continue
                seen.add(sig)
                refs.append(ref)
        if len(refs) == 1:
            group_single_location_refs[group_key] = refs

    return {
        "groups": groups,
        "tags": tags,
        "desc_entries": desc_entries,
        "meta_by_tag": meta_by_tag,
        "tag_device": tag_device,
        "group_single_location_refs": group_single_location_refs,
    }


def manifest_stats(manifest: dict, tag_meta: dict) -> dict:
    type_counts: dict[str, int] = {}
    for refs in manifest.get("tags", {}).values():
        for ref in refs:
            typ = ref.get("type", "")
            type_counts[typ] = type_counts.get(typ, 0) + 1
    return {
        "version": manifest.get("version"),
        "generated_at": manifest.get("generated_at"),
        "tags": len(manifest.get("tags", {})),
        "docs": len(manifest.get("docs", {})),
        "tag_meta": len(tag_meta),
        "type_counts": dict(sorted(type_counts.items())),
    }


def validate_manifest(path: Path, manifest: dict, tag_meta: dict) -> None:
    if path.name.lower() == "cf_manifest.json":
        raise SystemExit("Refusing to use cf_manifest.json as production manifest.")
    if path != MANIFEST_FILE:
        raise SystemExit(f"Unexpected manifest path: {path}")
    if len(manifest.get("tags", {})) < 30_000:
        raise SystemExit("Manifest tag count is suspiciously low.")
    if len(manifest.get("docs", {})) < 5_000:
        raise SystemExit("Manifest doc count is suspiciously low.")
    # The 2026-05-10 point-table refresh rebuilds current point metadata from
    # approved point tables instead of retaining obsolete point-only entries.
    if len(tag_meta) < 20_000:
        raise SystemExit("tag_meta count is suspiciously low.")


def backup_manifest(manifest: dict) -> Path:
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    version = manifest.get("version") or datetime.now().strftime("%Y%m%d%H%M")
    stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    target = BACKUP_DIR / f"manifest_{version}_{stamp}.json"
    shutil.copy2(MANIFEST_FILE, target)
    return target


def wrangler_put_value(key: str, value: str) -> None:
    cmd = [
        "wrangler",
        "kv",
        "key",
        "put",
        "--remote",
        f"--namespace-id={KV_NAMESPACE}",
        key,
        value,
    ]
    run(cmd)


def wrangler_put_file(key: str, path: Path) -> None:
    cmd = [
        "wrangler",
        "kv",
        "key",
        "put",
        "--remote",
        f"--namespace-id={KV_NAMESPACE}",
        key,
        "--path",
        str(path),
    ]
    run(cmd)


def run(cmd: list[str]) -> None:
    result = subprocess.run(
        cmd,
        cwd=ROOT,
        text=True,
        encoding="utf-8",
        errors="replace",
        capture_output=True,
        timeout=180,
    )
    if result.returncode != 0:
        raise SystemExit(result.stderr or result.stdout)
    tail = (result.stdout + result.stderr).strip()
    if tail:
        print(tail[-500:])


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--upload", action="store_true", help="write KV values")
    parser.add_argument(
        "--skip-backup",
        action="store_true",
        help="do not create a manifest backup before upload",
    )
    args = parser.parse_args()

    manifest = load_json(MANIFEST_FILE)
    tag_meta = load_json(TAG_META_FILE)
    validate_manifest(MANIFEST_FILE, manifest, tag_meta)

    tag_list = build_tag_list(manifest)
    write_json_compact(TAG_LIST_FILE, tag_list)
    search_index = build_search_index(manifest, tag_meta, tag_list)
    write_json_compact(SEARCH_INDEX_FILE, search_index)

    stats = manifest_stats(manifest, tag_meta)
    print(json.dumps(stats, ensure_ascii=False, indent=2))
    print(
        json.dumps(
            {
                "tag_list_groups": len(tag_list["groups"]),
                "tag_list_total": tag_list["total"],
                "tag_list_file": str(TAG_LIST_FILE),
                "search_index_tags": len(search_index["tags"]),
                "search_index_desc_entries": len(search_index["desc_entries"]),
                "search_index_file": str(SEARCH_INDEX_FILE),
            },
            ensure_ascii=False,
            indent=2,
        )
    )

    if not args.upload:
        print("Dry-run complete. Use --upload to sync KV.")
        return 0

    if not args.skip_backup:
        backup = backup_manifest(manifest)
        print(f"Backup created: {backup}")

    version = str(manifest.get("version") or datetime.now().strftime("%Y%m%d%H%M"))
    updated_at = datetime.now().isoformat()

    wrangler_put_file("manifest", MANIFEST_FILE)
    wrangler_put_file("tag_meta", TAG_META_FILE)
    wrangler_put_file("tag_list", TAG_LIST_FILE)
    wrangler_put_file("search_index", SEARCH_INDEX_FILE)
    wrangler_put_value("version", version)
    wrangler_put_value("updated_at", updated_at)
    print(f"KV sync complete: version={version}, updated_at={updated_at}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
