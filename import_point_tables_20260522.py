from __future__ import annotations

import argparse
import importlib.util
import json
import shutil
from collections import Counter
from datetime import datetime
from pathlib import Path

ROOT = Path(r"E:\opencode\instrument-cf")
POINT_DIR = Path("E:/\u4eea\u8868\u7ba1\u7406\u67e5\u8be2\u7cfb\u7edf\u6d4b\u8bd5\u7528\u56fe\u7eb8/\u70b9\u886820260522/20260522\u70b9\u8868")
MANIFEST_FILE = Path(r"C:\Users\bush6\manifest_final.json")
TAG_META_FILE = Path(r"C:\Users\bush6\tag_meta.json")
BACKUP_DIR = Path(r"C:\Users\bush6\backup")
REPORT_FILE = ROOT / "POINT_TABLE_20260522_IMPORT_REPORT.md"
AUDIT_JSON = ROOT / "tmp_point_table_20260522_audit.json"


def load_helpers():
    spec = importlib.util.spec_from_file_location("rebuild_point_wiring_data", ROOT / "rebuild_point_wiring_data.py")
    if not spec or not spec.loader:
        raise RuntimeError("Cannot load rebuild_point_wiring_data.py")
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def load_json(path: Path) -> dict:
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def write_json(path: Path, data: dict) -> None:
    path.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")


def backup(manifest: dict) -> tuple[Path, Path]:
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    manifest_bak = BACKUP_DIR / f"manifest_before_point_20260522_{manifest.get('version','unknown')}_{stamp}.json"
    meta_bak = BACKUP_DIR / f"tag_meta_before_point_20260522_{stamp}.json"
    shutil.copy2(MANIFEST_FILE, manifest_bak)
    shutil.copy2(TAG_META_FILE, meta_bak)
    return manifest_bak, meta_bak


def build_new_meta(helpers) -> tuple[dict, Counter]:
    meta: dict = {}
    stats: Counter = Counter()
    for path in sorted(POINT_DIR.glob("*.xls")):
        src = path.stem
        wb = helpers.xlrd.open_workbook(str(path))
        for sheet_name in helpers.DCS_SHEETS:
            if sheet_name not in wb.sheet_names():
                continue
            entries = helpers.extract_dcs_sheet(wb.sheet_by_name(sheet_name), src)
            meta.update(entries)
            stats[f"{src}:{sheet_name}"] = len(entries)
    return meta, stats


def preserve_safety(old_meta: dict, new_meta: dict) -> int:
    count = 0
    for tag, old in old_meta.items():
        if not isinstance(old, dict):
            continue
        safety = {k: old[k] for k in ("gds", "sis") if k in old and old[k]}
        if not safety:
            continue
        target = new_meta.setdefault(tag, {})
        for key, value in safety.items():
            if key not in target:
                target[key] = value
                count += 1
    return count


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--write", action="store_true")
    args = parser.parse_args()

    if not POINT_DIR.exists():
        raise SystemExit(f"Point dir not found: {POINT_DIR}")

    helpers = load_helpers()
    manifest = load_json(MANIFEST_FILE)
    old_meta = load_json(TAG_META_FILE)
    new_meta, stats = build_new_meta(helpers)

    safety_count = preserve_safety(old_meta, new_meta)

    alias_count = 0
    for tag, entry in list(new_meta.items()):
        for alias_tag in helpers.dcs_040800_equiv_aliases(tag) + helpers.dcs_to_design_040800_aliases(tag):
            if alias_tag not in new_meta:
                alias = dict(entry)
                alias["alias_of"] = tag
                alias["tag_rule"] = "040800-dcs-equivalent"
                new_meta[alias_tag] = alias
                alias_count += 1

    derived_count = helpers.derive_manifest_tags(new_meta, manifest)
    manifest_alias_count = helpers.add_040800_manifest_aliases(manifest)

    old_keys = set(old_meta)
    new_keys = set(new_meta)
    missing_from_system = sorted(tag for tag in new_keys if tag not in manifest.get("tags", {}) and tag not in old_keys)
    point_tags_without_manifest = sorted(tag for tag in new_keys if tag not in manifest.get("tags", {}))
    removed_old = sorted(old_keys - new_keys)
    added_new = sorted(new_keys - old_keys)
    changed_existing = sorted(k for k in old_keys & new_keys if old_meta.get(k) != new_meta.get(k))

    audit = {
        "mode": "write" if args.write else "dry-run",
        "point_dir": str(POINT_DIR),
        "sheet_stats": dict(stats),
        "old_tag_meta": len(old_meta),
        "new_tag_meta": len(new_meta),
        "added_new": len(added_new),
        "removed_old": len(removed_old),
        "changed_existing": len(changed_existing),
        "derived_count": derived_count,
        "alias_count": alias_count,
        "manifest_alias_count": manifest_alias_count,
        "safety_fields_preserved": safety_count,
        "point_tags_without_manifest": len(point_tags_without_manifest),
        "missing_from_system": len(missing_from_system),
        "samples": {
            "added_new": added_new[:50],
            "removed_old": removed_old[:50],
            "point_tags_without_manifest": point_tags_without_manifest[:100],
            "missing_from_system": missing_from_system[:100],
        },
    }

    lines = [
        "# 20260522 Point Table Import Report",
        "",
        f"Generated: {datetime.now().isoformat(timespec='seconds')}",
        f"Mode: {audit['mode']}",
        f"Point dir: `{POINT_DIR}`",
        "",
        "## Counts",
        f"- Old tag_meta entries: {len(old_meta)}",
        f"- New tag_meta entries after import/derive: {len(new_meta)}",
        f"- New entries not in old tag_meta: {len(added_new)}",
        f"- Old entries absent from new point tables/derivation: {len(removed_old)}",
        f"- Changed existing entries: {len(changed_existing)}",
        f"- Derived manifest entries: {derived_count}",
        f"- Alias entries added: {alias_count}",
        f"- 040800 manifest aliases added: {manifest_alias_count}",
        f"- Preserved GDS/SIS safety fields: {safety_count}",
        f"- Point tags without manifest drawing refs: {len(point_tags_without_manifest)}",
        f"- New point tags absent from previous system and without manifest refs: {len(missing_from_system)}",
        "",
        "## Source Sheet Stats",
    ]
    for key, value in sorted(stats.items()):
        lines.append(f"- {key}: {value}")
    lines += [
        "",
        "## Samples",
        f"- Added new: `{', '.join(added_new[:30])}`",
        f"- Point tags without manifest refs: `{', '.join(point_tags_without_manifest[:50])}`",
        f"- New missing from system: `{', '.join(missing_from_system[:50])}`",
    ]

    AUDIT_JSON.write_text(json.dumps(audit, ensure_ascii=False, indent=2), encoding="utf-8")
    REPORT_FILE.write_text("\n".join(lines) + "\n", encoding="utf-8")

    if args.write:
        manifest_bak, meta_bak = backup(manifest)
        version = datetime.now().strftime("%Y%m%d%H%M")
        manifest["version"] = version
        manifest["generated_at"] = datetime.now().isoformat()
        write_json(TAG_META_FILE, new_meta)
        write_json(MANIFEST_FILE, manifest)
        audit["version"] = version
        audit["manifest_backup"] = str(manifest_bak)
        audit["tag_meta_backup"] = str(meta_bak)
        AUDIT_JSON.write_text(json.dumps(audit, ensure_ascii=False, indent=2), encoding="utf-8")
        print(json.dumps(audit, ensure_ascii=False, indent=2))
    else:
        print(json.dumps(audit, ensure_ascii=False, indent=2))
        print(f"Dry-run only. Report: {REPORT_FILE}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
