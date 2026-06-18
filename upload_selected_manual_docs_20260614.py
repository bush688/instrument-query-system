from __future__ import annotations

import json
import mimetypes
import shutil
import subprocess
import sys
from datetime import datetime
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = Path(r"E:\opencode\instrument-cf")
MANIFEST = Path(r"C:\Users\bush6\manifest_final.json")
BACKUP_DIR = Path(r"C:\Users\bush6\backup")
SOURCE_ROOT = Path(r"E:\仪表管理查询系统测试用图纸\各类说明书")
R2_BUCKET = "instrument-images"

SELECTED = [
    Path(r"DCS系统密码（ 6月5日更新）\DCS系统密码（ 6月5日更新）.docx"),
    Path(r"压缩机转速保护器\IMG20251211112427.jpg"),
    Path(r"压缩机转速保护器\IMG20251211112431.jpg"),
    Path(r"压缩机转速保护器\IMG20251211112436.jpg"),
    Path(r"压缩机转速保护器\IMG20251211112444.jpg"),
    Path(r"压缩机转速保护器\IMG20251211112447.jpg"),
    Path(r"压缩机转速保护器\IMG20251211112452.jpg"),
    Path(r"压缩机转速保护器\IMG20251211112513.jpg"),
    Path(r"压缩机转速保护器\IMG20251211112517.jpg"),
    Path(r"压缩机转速保护器\IMG20251211112521.jpg"),
    Path(r"压缩机转速保护器\IMG20251211112531.jpg"),
    Path(r"除给水PH计\CA9300(24VDC) pH-ORP变送器 2025-6-5 208x140mm_v2.pdf"),
    Path(r"除给水PH计\CA9300(24VDC)接触式电导变送器 2025-6-5 208x140mm_v2.pdf"),
    Path(r"仪表电缆型号、名称、用途及施工要求总结.pdf"),
]


def norm(text: str) -> str:
    return "".join(str(text or "").split()).casefold()


def r2_safe_part(text: str) -> str:
    return str(text or "_root").replace("\\", "_").replace("/", "_").strip() or "_root"


def content_type(path: Path) -> str:
    mapping = {
        ".doc": "application/msword",
        ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ".xls": "application/vnd.ms-excel",
        ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ".ppt": "application/vnd.ms-powerpoint",
        ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        ".pdf": "application/pdf",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".webp": "image/webp",
        ".txt": "text/plain; charset=utf-8",
    }
    return mapping.get(path.suffix.lower()) or mimetypes.guess_type(path.name)[0] or "application/octet-stream"


def run(cmd: list[str], timeout: int = 240) -> None:
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
        raise SystemExit(result.stderr or result.stdout)
    text = (result.stdout + result.stderr).strip()
    if text:
        print(text[-500:])


def load_manifest() -> dict:
    return json.loads(MANIFEST.read_text(encoding="utf-8"))


def backup_manifest(version: str) -> Path:
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup = BACKUP_DIR / f"manifest_{version}_{stamp}_before_selected_manual_docs.json"
    shutil.copy2(MANIFEST, backup)
    return backup


def upload_file(path: Path, group: str) -> str:
    key = f"manuals_raw/{r2_safe_part(group)}/{r2_safe_part(path.name)}"
    run([
        "wrangler",
        "r2",
        "object",
        "put",
        f"{R2_BUCKET}/{key}",
        "--file",
        str(path),
        "--content-type",
        content_type(path),
        "--remote",
    ])
    return key


def group_for(rel: Path) -> str:
    return rel.parts[0] if len(rel.parts) > 1 else "_root"


def main() -> None:
    manifest = load_manifest()
    version = manifest.get("version") or "unknown"
    backup = backup_manifest(version)
    manuals = manifest.setdefault("manuals", {})
    added = []

    for rel in SELECTED:
        src = SOURCE_ROOT / rel
        if not src.exists():
            print(f"skip missing: {src}")
            continue
        group = group_for(rel)
        items = manuals.setdefault(group, [])
        if any(norm(item.get("name")) == norm(src.name) for item in items):
            continue
        key = upload_file(src, group)
        item = {
            "name": src.name,
            "file_url": f"/files/{key}",
            "r2_key": key,
            "ext": src.suffix.lower(),
            "size": src.stat().st_size,
        }
        items.append(item)
        items.sort(key=lambda x: x.get("name", ""))
        added.append({"group": group, "name": src.name, "r2_key": key})

    now = datetime.now()
    manifest["version"] = now.strftime("%Y%m%d%H%M")
    manifest["generated_at"] = now.isoformat()
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")

    print(json.dumps({
        "backup": str(backup),
        "version": manifest["version"],
        "uploaded": len(added),
        "items": added,
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
