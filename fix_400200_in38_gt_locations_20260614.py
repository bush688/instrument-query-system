from __future__ import annotations

import json
import shutil
from datetime import datetime
from pathlib import Path


MANIFEST_PATH = Path(r"C:\Users\bush6\manifest_final.json")
BACKUP_DIR = Path(r"C:\Users\bush6\backup")
DOC_ID = "loc_v2_常压氨罐区_21216-400200-IN38_p1"

UPDATES = {
    "40GT-02201": {"x": 0.1858, "y": 0.3005, "location_floor_el": "EL+2.000"},
    "40GT-02202": {"x": 0.1870, "y": 0.3522, "location_floor_el": "EL+2.000"},
    "40GT-02203": {"x": 0.1887, "y": 0.4026, "location_floor_el": "EL+2.000"},
    "40GT-02204": {"x": 0.1535, "y": 0.4697, "location_floor_el": "EL+2.150"},
    "40GT-02205": {"x": 0.1535, "y": 0.5529, "location_floor_el": "EL+2.150"},
    "40GT-02206": {"x": 0.3876, "y": 0.3504, "location_floor_el": "EL+21.800"},
    "40GT-02207": {"x": 0.3863, "y": 0.4253, "location_floor_el": "EL+21.800"},
    "40GT-02208": {"x": 0.3880, "y": 0.2838, "location_floor_el": "EL+2.000"},
    "40GT-02209": {"x": 0.5554, "y": 0.3426, "location_floor_el": "EL+21.800"},
    "40GT-02210": {"x": 0.5562, "y": 0.4264, "location_floor_el": "EL+21.800"},
    "40GT-02211": {"x": 0.5541, "y": 0.2714, "location_floor_el": "EL+2.000"},
}


def backup_manifest() -> Path:
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    target = BACKUP_DIR / f"manifest_before_400200_in38_gt_fix_{stamp}.json"
    shutil.copy2(MANIFEST_PATH, target)
    return target


def main() -> int:
    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    changes = []
    for tag, payload in UPDATES.items():
        for ref in manifest["tags"].get(tag, []):
            if ref.get("type") != "location" or ref.get("doc_id") != DOC_ID:
                continue
            before = {
                "x": ref.get("x"),
                "y": ref.get("y"),
                "location_match": ref.get("location_match"),
                "location_floor": ref.get("location_floor"),
                "location_floor_el": ref.get("location_floor_el"),
                "location_floor_name": ref.get("location_floor_name"),
                "location_floor_source": ref.get("location_floor_source"),
            }
            ref["x"] = payload["x"]
            ref["y"] = payload["y"]
            ref["location_match"] = "page_symbol_manual"
            ref["location_floor_name"] = ref.get("location_floor_name") or "常压氨罐区"
            ref["location_floor_el"] = payload["location_floor_el"]
            ref["location_floor"] = f"{ref['location_floor_name']} {payload['location_floor_el']}"
            ref["location_floor_source"] = "常压氨罐区_21216-400200-IN38 第1页 图中符号中心"
            changes.append({"tag": tag, "before": before, "after": ref.copy()})
            break

    if not changes:
        print("No changes.")
        return 0

    backup = backup_manifest()
    manifest["version"] = datetime.now().strftime("%Y%m%d%H%M")
    manifest["generated_at"] = datetime.now().isoformat(timespec="seconds")
    manifest["updated_at"] = manifest["generated_at"]
    MANIFEST_PATH.write_text(
        json.dumps(manifest, ensure_ascii=False, separators=(",", ":")),
        encoding="utf-8",
    )

    report = {
        "doc_id": DOC_ID,
        "change_count": len(changes),
        "backup": str(backup),
        "final_version": manifest["version"],
        "changes": changes,
    }
    out = Path(r"E:\opencode\instrument-cf\outputs\fix_region_area_location_refs_20260612\常压氨罐区_21216-400200-IN38")
    out.mkdir(parents=True, exist_ok=True)
    (out / "FIX_GT_SYMBOL_CENTER_20260614.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(json.dumps({k: v for k, v in report.items() if k != "changes"}, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
