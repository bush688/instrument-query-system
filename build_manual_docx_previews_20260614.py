from __future__ import annotations

import json
import shutil
import subprocess
import tempfile
from datetime import datetime
from pathlib import Path

import fitz


ROOT = Path(r"E:\opencode\instrument-cf")
MANIFEST = Path(r"C:\Users\bush6\manifest_final.json")
BACKUP_DIR = Path(r"C:\Users\bush6\backup")
SOURCE_ROOT = Path(r"E:\仪表管理查询系统测试用图纸\各类说明书")
R2_BUCKET = "instrument-images"
TMP_DIR = ROOT / "tmp_manual_docx_preview_20260614"


def run(cmd: list[str], timeout: int = 300) -> None:
    result = subprocess.run(
        cmd,
        cwd=ROOT,
        text=True,
        encoding="utf-8",
        errors="replace",
        capture_output=True,
        timeout=timeout,
    )
    if result.returncode != 0:
        raise RuntimeError(result.stderr or result.stdout or f"command failed: {cmd}")


def upload_file(path: Path, key: str, content_type: str) -> str:
    run(
        [
            "wrangler",
            "r2",
            "object",
            "put",
            f"{R2_BUCKET}/{key}",
            "--file",
            str(path),
            "--content-type",
            content_type,
            "--remote",
        ],
        timeout=300,
    )
    return f"/files/{key}"


def export_docx_to_pdf(docx_path: Path, pdf_path: Path) -> None:
    script = f"""
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0
try {{
  $doc = $word.Documents.Open('{str(docx_path).replace("'", "''")}')
  $doc.ExportAsFixedFormat('{str(pdf_path).replace("'", "''")}', 17)
  $doc.Close(0)
}} finally {{
  $word.Quit()
}}
"""
    result = subprocess.run(
        ["powershell", "-NoProfile", "-Command", script],
        cwd=ROOT,
        text=True,
        encoding="utf-8",
        errors="replace",
        capture_output=True,
        timeout=300,
    )
    if result.returncode != 0 or not pdf_path.exists():
        raise RuntimeError(result.stderr or result.stdout or "Word export failed")


def render_pdf_pages(pdf_path: Path, out_dir: Path) -> list[Path]:
    out_dir.mkdir(parents=True, exist_ok=True)
    doc = fitz.open(pdf_path)
    page_paths: list[Path] = []
    for idx, page in enumerate(doc, start=1):
        pix = page.get_pixmap(matrix=fitz.Matrix(2.0, 2.0), alpha=False)
        page_path = out_dir / f"page{idx:02}.jpg"
        pix.save(page_path)
        page_paths.append(page_path)
    doc.close()
    return page_paths


def backup_manifest(version: str) -> Path:
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup = BACKUP_DIR / f"manifest_{version}_{stamp}_before_manual_docx_preview.json"
    shutil.copy2(MANIFEST, backup)
    return backup


def main() -> None:
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    manuals = manifest.get("manuals") or {}
    version = manifest.get("version") or datetime.now().strftime("%Y%m%d%H%M")
    backup = backup_manifest(version)
    TMP_DIR.mkdir(parents=True, exist_ok=True)
    changed: list[dict] = []

    for group, items in manuals.items():
        for item in items or []:
            if str(item.get("ext") or "").lower() != ".docx":
                continue
            name = str(item.get("name") or "")
            src = SOURCE_ROOT / group / name
            if not src.exists():
                continue

            slug = f"{group}/{src.stem}"
            work_dir = TMP_DIR / src.stem
            work_dir.mkdir(parents=True, exist_ok=True)
            pdf_path = work_dir / f"{src.stem}.pdf"
            export_docx_to_pdf(src, pdf_path)
            page_files = render_pdf_pages(pdf_path, work_dir / "pages")

            pdf_key = f"manuals_preview/{group}/{src.stem}/{src.stem}.pdf"
            pdf_url = upload_file(pdf_path, pdf_key, "application/pdf")

            page_urls: list[str] = []
            for idx, page_path in enumerate(page_files, start=1):
                page_key = f"manuals_preview/{group}/{src.stem}/page{idx:02}.jpg"
                page_urls.append(upload_file(page_path, page_key, "image/jpeg"))

            item["page_urls"] = page_urls
            item["pages"] = list(range(1, len(page_urls) + 1))
            item["preview_pdf_url"] = pdf_url
            item["source_pdf"] = item.get("source_pdf") or src.name
            changed.append(
                {
                    "group": group,
                    "name": name,
                    "page_count": len(page_urls),
                    "preview_pdf_url": pdf_url,
                }
            )

    if not changed:
        print(json.dumps({"backup": str(backup), "changed": 0}, ensure_ascii=False, indent=2))
        return

    now = datetime.now()
    manifest["version"] = now.strftime("%Y%m%d%H%M")
    manifest["generated_at"] = now.isoformat(timespec="seconds")
    manifest["updated_at"] = manifest["generated_at"]
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")

    report = {
        "backup": str(backup),
        "version": manifest["version"],
        "changed": len(changed),
        "items": changed,
    }
    out = ROOT / "outputs" / "manual_docx_preview_20260614.json"
    out.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
