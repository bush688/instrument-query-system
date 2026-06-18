from __future__ import annotations

import json
import shutil
from datetime import datetime
from pathlib import Path


MANIFEST_PATH = Path(r"C:\Users\bush6\manifest_final.json")
BACKUP_DIR = Path(r"C:\Users\bush6\backup")
OUT_DIR = Path(r"E:\opencode\instrument-cf\outputs\fix_region_area_location_refs_20260612\全厂外管_21216-370000-IN40")


P3 = {
    "doc_id": "loc_v2_全厂外管_21216-370000-IN40_p3",
    "floor": "全厂外管",
    "source": "全厂外管_21216-370000-IN40 第3页 引线接入点",
    "updates": {
        "37XMV-0152": (0.2950, 0.2005),
        "37XMV-0132": (0.2950, 0.2374),
        "37PV-0112": (0.2950, 0.2743),
        "37TV-0106": (0.2950, 0.3112),
        "37TE-0192": (0.2950, 0.3481),
        "37XV-0186": (0.2950, 0.3850),
        "37PT-0192": (0.2950, 0.4219),
        "37XMV-0126": (0.2950, 0.4588),
        "37TE-0106": (0.2950, 0.4957),
        "37PT-0106": (0.2950, 0.5325),
        "37PT-0112": (0.2950, 0.5695),
        "37XMV-0148": (0.7139, 0.0460),
        "37XMV-0128": (0.7139, 0.0829),
        "37XMV-0145": (0.7139, 0.1197),
        "37XMV-0125": (0.7139, 0.1567),
        "37PV-0108": (0.7139, 0.1935),
        "37PV-0105": (0.7139, 0.2307),
        "37TV-0105": (0.7139, 0.2676),
        "37TE-0108": (0.7139, 0.3042),
        "37TE-0105": (0.7139, 0.3411),
        "37TV-0108": (0.7139, 0.3780),
        "37XV-0188": (0.7139, 0.4149),
        "37XV-0185": (0.7139, 0.4518),
        "37PT-0108": (0.7139, 0.4887),
        "37PT-0105": (0.7139, 0.5256),
        "37LP-U0201": (0.7139, 0.5620),
    },
}


P4 = {
    "doc_id": "loc_v2_全厂外管_21216-370000-IN40_p4",
    "floor": "全厂外管",
    "source": "全厂外管_21216-370000-IN40 第4页 引线接入点",
    "updates": {
        "37PT-00001": (0.5030, 0.0580),
        "37PV-0107": (0.5030, 0.0840),
        "37TV-0107": (0.5030, 0.1101),
        "37FT-00001": (0.5030, 0.1623),
        "37PT-00002": (0.5030, 0.1884),
        "37PT-00003": (0.5030, 0.2145),
        "37PT-00004": (0.5030, 0.2406),
        "37TE-0107": (0.5030, 0.1623),
        "37FT-00002": (0.5030, 0.1884),
        "37FT-00003": (0.5030, 0.2145),
        "37FT-00004": (0.5030, 0.2406),
        "37XMV-0147": (0.5030, 0.2147),
        "37XV-0187": (0.5030, 0.1886),
        "37PT-0107": (0.5030, 0.1362),
        "37LP-U0205": (0.5030, 0.3680),
        "37PV-0002": (0.5030, 0.3417),
        "37PT-0002": (0.5030, 0.0580),
        "37PT-0102": (0.5030, 0.6320),
        "37PT-0104": (0.5030, 0.6581),
        "37PV-0102": (0.5030, 0.5799),
        "37PV-0104": (0.5030, 0.6060),
        "37TV-0102": (0.5030, 0.5277),
        "37TV-0104": (0.5030, 0.5538),
        "37TE-0104": (0.5030, 0.5016),
        "37XMV-0122": (0.5030, 0.4494),
        "37XMV-0124": (0.5030, 0.4755),
        "37XV-0182": (0.5030, 0.6844),
        "37XV-0184": (0.5030, 0.7105),
        "37TE-0002": (0.5030, 0.7366),
        "37TE-0102": (0.5030, 0.7627),
        "37XMV-0142": (0.5030, 0.7886),
        "37XMV-0144": (0.5030, 0.8147),
        "37LT-00001": (0.5030, 0.8408),
    },
}


def backup_manifest() -> Path:
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    target = BACKUP_DIR / f"manifest_before_370000_callout_fix_{stamp}.json"
    shutil.copy2(MANIFEST_PATH, target)
    return target


def apply_block(manifest: dict, block: dict, changes: list[dict]) -> None:
    for tag, (x, y) in block["updates"].items():
        for ref in manifest["tags"].get(tag, []):
            if ref.get("type") != "location" or ref.get("doc_id") != block["doc_id"]:
                continue
            before = {
                "x": ref.get("x"),
                "y": ref.get("y"),
                "location_match": ref.get("location_match"),
                "location_floor": ref.get("location_floor"),
                "location_floor_source": ref.get("location_floor_source"),
            }
            ref["x"] = x
            ref["y"] = y
            ref["location_match"] = "page_manual_refine"
            ref["location_floor_name"] = ref.get("location_floor_name") or block["floor"]
            ref["location_floor"] = ref.get("location_floor") or block["floor"]
            ref["location_floor_source"] = block["source"]
            changes.append(
                {
                    "tag": tag,
                    "doc_id": block["doc_id"],
                    "before": before,
                    "after": {
                        "x": x,
                        "y": y,
                        "location_match": ref["location_match"],
                        "location_floor": ref["location_floor"],
                        "location_floor_source": ref["location_floor_source"],
                    },
                }
            )
            break


def main() -> int:
    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    changes: list[dict] = []
    apply_block(manifest, P3, changes)
    apply_block(manifest, P4, changes)
    if not changes:
        print("No changes.")
        return 0

    backup = backup_manifest()
    manifest["version"] = datetime.now().strftime("%Y%m%d%H%M")
    manifest["generated_at"] = datetime.now().isoformat(timespec="seconds")
    manifest["updated_at"] = manifest["generated_at"]
    MANIFEST_PATH.write_text(json.dumps(manifest, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")

    report = {
        "change_count": len(changes),
        "backup": str(backup),
        "final_version": manifest["version"],
        "changes": changes,
    }
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    (OUT_DIR / "FIX_370000_CALLOUT_PAGES_20260614.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(json.dumps({k: v for k, v in report.items() if k != "changes"}, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
