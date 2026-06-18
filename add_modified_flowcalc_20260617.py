from __future__ import annotations

import json
import shutil
import subprocess
import sys
from datetime import datetime
from pathlib import Path

import fitz
from PIL import Image

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = Path(r"E:\opencode\instrument-cf")
SOURCE_DIR = Path(r"E:\仪表管理查询系统测试用图纸\流量")
MANIFEST = Path(r"C:\Users\bush6\manifest_final.json")
BACKUP_DIR = Path(r"C:\Users\bush6\backup")
OUT_DIR = ROOT / "tmp_flowcalc_modified_20260617"
R2_BUCKET = "instrument-images"

ITEMS = [
    {
        "tag": "03FE-02108",
        "doc_id": "FLOW-03FE-02108-MOD-20260616",
        "source": "03FE-02108.jpg",
        "label": "修改后计算书 - 03FE-02108.jpg",
    },
    {
        "tag": "03FE-02208",
        "doc_id": "FLOW-03FE-02208-MOD-20260616",
        "source": "03FE-02208.jpg",
        "label": "修改后计算书 - 03FE-02208.jpg",
    },
    {
        "tag": "03FE-02308",
        "doc_id": "FLOW-03FE-02308-MOD-20260616",
        "source": "03FE-02308.jpg",
        "label": "修改后计算书 - 03FE-02308.jpg",
    },
    {
        "tag": "04FE-02002",
        "doc_id": "FLOW-04FE-02002-MOD-20260616",
        "source": "04FE-02002-反.pdf",
        "label": "修改后计算书 - 04FE-02002-反.pdf",
    },
    {
        "tag": "04FE-02025",
        "doc_id": "FLOW-04FE-02025-MOD-20260616",
        "source": "04FE-02025-反.pdf",
        "label": "修改后计算书 - 04FE-02025-反.pdf",
    },
]


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
    output = (result.stdout + result.stderr).strip()
    if output:
        print(output[-800:])


def render_pdf(src: Path, out_dir: Path) -> list[int]:
    out_dir.mkdir(parents=True, exist_ok=True)
    pages: list[int] = []
    with fitz.open(src) as doc:
        for idx, page in enumerate(doc, start=1):
            pix = page.get_pixmap(matrix=fitz.Matrix(150 / 72, 150 / 72), alpha=False)
            out = out_dir / f"page{idx:02d}.jpg"
            pix.save(out)
            pages.append(idx)
    return pages


def render_image(src: Path, out_dir: Path) -> list[int]:
    out_dir.mkdir(parents=True, exist_ok=True)
    out = out_dir / "page01.jpg"
    with Image.open(src) as img:
        if img.mode != "RGB":
            img = img.convert("RGB")
        img.save(out, "JPEG", quality=92)
    return [1]


def upload_doc(doc_id: str, pages: list[int]) -> None:
    for page in pages:
        local = OUT_DIR / doc_id / f"page{page:02d}.jpg"
        key = f"{R2_BUCKET}/files/{doc_id}/page{page:02d}.jpg"
        run(
            [
                "wrangler",
                "r2",
                "object",
                "put",
                key,
                "--file",
                str(local),
                "--content-type",
                "image/jpeg",
                "--remote",
            ]
        )


def add_ref_once(manifest: dict, tag: str, doc_id: str, pages: list[int]) -> bool:
    refs = manifest.setdefault("tags", {}).setdefault(tag, [])
    for ref in refs:
        if ref.get("type") == "flowcalc" and ref.get("doc_id") == doc_id:
            ref["pages"] = pages
            return False
    refs.append({"type": "flowcalc", "doc_id": doc_id, "pages": pages})
    return True


def main() -> None:
    if not MANIFEST.exists():
        raise SystemExit(f"missing manifest: {MANIFEST}")

    for item in ITEMS:
        src = SOURCE_DIR / item["source"]
        if not src.exists():
            raise SystemExit(f"missing source file: {src}")

    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    version = manifest.get("version") or "unknown"
    stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    backup = BACKUP_DIR / f"manifest_{version}_{stamp}_before_modified_flowcalc.json"
    shutil.copy2(MANIFEST, backup)
    print(f"backup: {backup}")

    rendered: dict[str, list[int]] = {}
    for item in ITEMS:
        src = SOURCE_DIR / item["source"]
        out_dir = OUT_DIR / item["doc_id"]
        pages = render_pdf(src, out_dir) if src.suffix.lower() == ".pdf" else render_image(src, out_dir)
        rendered[item["doc_id"]] = pages
        upload_doc(item["doc_id"], pages)

    docs = manifest.setdefault("docs", {})
    added_refs = 0
    for item in ITEMS:
        pages = rendered[item["doc_id"]]
        docs[item["doc_id"]] = {
            "doc_id": item["doc_id"],
            "source_pdf": item["label"],
            "rendered_pages": pages,
        }
        if add_ref_once(manifest, item["tag"], item["doc_id"], pages):
            added_refs += 1

    now = datetime.now()
    manifest["version"] = now.strftime("%Y%m%d%H%M")
    manifest["generated_at"] = now.isoformat()
    manifest["updated_at"] = now.isoformat()
    MANIFEST.write_text(
        json.dumps(manifest, ensure_ascii=False, separators=(",", ":")),
        encoding="utf-8",
    )

    print(
        json.dumps(
            {
                "backup": str(backup),
                "version": manifest["version"],
                "items": [
                    {
                        "tag": item["tag"],
                        "doc_id": item["doc_id"],
                        "source": item["source"],
                        "pages": rendered[item["doc_id"]],
                    }
                    for item in ITEMS
                ],
                "new_refs": added_refs,
                "docs_total": len(docs),
                "tags_total": len(manifest.get("tags", {})),
            },
            ensure_ascii=False,
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
