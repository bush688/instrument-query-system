from __future__ import annotations

import argparse
import glob
import json
import re
import shutil
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path

import pdfplumber


MANIFEST_PATH = Path(r"C:\Users\bush6\manifest_final.json")
BACKUP_DIR = Path(r"C:\Users\bush6\backup")
OUT_ROOT = Path(r"E:\opencode\instrument-cf\outputs\fix_region_area_location_refs_20260612")
OCR_ROOT = Path(r"E:\仪表管理查询系统测试用图纸\仪表位置图OCR")

TAG_TOKEN_RE = re.compile(r"^(?:\d{2}|SIS-)?[A-Z]{1,8}(?:/[A-Z]{1,8})?-[0-9A-Z~/_-]+$")
EL_RE = re.compile(r"EL\s*[+-]?\s*\d+(?:[.,]\d+)?", re.I)
AREA_RE = re.compile(r"^[A-ZI1L]\d{1,2}$")


MANUAL_AREA_CELL_OVERRIDES: dict[tuple[str, int], dict[str, tuple[float, float]]] = {
    (
        "常压氨罐区_21216-400200-IN40",
        1,
    ): {
        "D2": (0.1840, 0.3200),
        "D3": (0.2440, 0.3200),
        "E3": (0.2440, 0.4350),
        "F3": (0.2440, 0.5550),
        "G3": (0.2440, 0.6750),
        "J3": (0.2440, 0.6750),
        "E5": (0.5250, 0.4350),
        "F5": (0.5250, 0.5550),
        "E6": (0.6490, 0.4350),
        "F6": (0.6490, 0.5550),
        "E7": (0.7600, 0.4350),
        "F7": (0.7600, 0.5550),
    },
}


@dataclass(frozen=True)
class AreaCell:
    area: str
    x0: float
    x1: float
    y0: float
    y1: float

    @property
    def cx(self) -> float:
        return round((self.x0 + self.x1) / 2, 4)

    @property
    def cy(self) -> float:
        return round((self.y0 + self.y1) / 2, 4)

    def contains(self, x: float | None, y: float | None, pad: float = 0.01) -> bool:
        if x is None or y is None:
            return False
        return (self.x0 - pad) <= x <= (self.x1 + pad) and (self.y0 - pad) <= y <= (self.y1 + pad)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--drawing-name", required=True)
    parser.add_argument("--doc-id-prefix", default="")
    parser.add_argument("--pages", default="")
    parser.add_argument("--dry-run", action="store_true")
    return parser.parse_args()


def normalize_tag(tag: str) -> str:
    return str(tag or "").upper().replace("_", "-").strip()


def normalize_el(text: str) -> str:
    return str(text or "").upper().replace(" ", "").replace(",", ".")


def normalize_area(text: str) -> str:
    raw = str(text or "").upper().replace(" ", "")
    if len(raw) >= 2 and raw[0] in {"1", "I", "L"} and raw[1:].isdigit():
        return f"I{raw[1:]}"
    return raw


def extract_area_from_tokens(tokens: list[str]) -> str:
    # Prefer explicit letter+number cells like B7, F3.
    for token in reversed(tokens):
        raw = str(token or "").upper().replace(" ", "")
        if re.fullmatch(r"[A-Z]\d{1,2}", raw):
            return raw
    # Fallback for OCR-confused I2/I4/I6 -> 12/14/16.
    for token in reversed(tokens):
        raw = str(token or "").upper().replace(" ", "")
        if len(raw) >= 2 and raw[0] in {"1", "I", "L"} and raw[1:].isdigit():
            return f"I{raw[1:]}"
    return ""


def extract_first_el(text: str) -> str:
    m = EL_RE.search(text or "")
    return normalize_el(m.group(0)) if m else ""


def group_words_by_line(page, y_tol: float = 3.5) -> list[list[dict]]:
    words = sorted(page.extract_words(), key=lambda w: ((w["top"] + w["bottom"]) / 2, w["x0"]))
    lines: list[list[dict]] = []
    current: list[dict] = []
    current_y: float | None = None
    for word in words:
        cy = (word["top"] + word["bottom"]) / 2
        if current_y is None or abs(cy - current_y) <= y_tol:
            current.append(word)
            current_y = cy if current_y is None else (current_y + cy) / 2
        else:
            lines.append(current)
            current = [word]
            current_y = cy
    if current:
        lines.append(current)
    return lines


def looks_like_tag_token(token: str) -> bool:
    raw = normalize_tag(token)
    return bool(raw and TAG_TOKEN_RE.fullmatch(raw))


def expand_tag_variants(token: str) -> list[str]:
    raw = normalize_tag(token)
    if not raw:
        return []
    if "/" not in raw:
        return [raw]
    m = re.match(r"^(.*?)([A-Z])(?:/([A-Z]))+$", raw)
    if not m:
        return [raw]
    prefix = m.group(1)
    suffix_letters = re.findall(r"[A-Z]", raw[len(prefix):])
    return [f"{prefix}{letter}" for letter in suffix_letters]


def parse_table_rows(page) -> dict[str, dict]:
    rows: dict[str, dict] = {}
    current_el = ""
    current_area = ""
    for words in group_words_by_line(page):
        tokens = [str(w["text"]).strip() for w in words if str(w["text"]).strip()]
        if not tokens:
            continue
        joined = " ".join(tokens)
        elevation = extract_first_el(joined)
        area = extract_area_from_tokens(tokens)
        tags: list[str] = []
        for token in tokens:
            if looks_like_tag_token(token):
                tags.extend(expand_tag_variants(token))
        if elevation and area and tags:
            current_el = elevation
            current_area = area
        elif not (current_el and current_area and tags):
            continue
        for tag in tags:
            rows[normalize_tag(tag)] = {
                "tag": normalize_tag(tag),
                "elevation": current_el,
                "area": current_area,
            }
    return rows


def extract_grid_cells(page) -> dict[str, AreaCell]:
    words = page.extract_words()
    width = float(page.width)
    height = float(page.height)
    col_points: dict[int, list[float]] = {}
    row_points: dict[str, list[float]] = {}
    bottom_label_y: list[float] = []

    for word in words:
        text = str(word["text"]).strip().upper()
        x = (word["x0"] + word["x1"]) / 2
        y = (word["top"] + word["bottom"]) / 2
        if re.fullmatch(r"\d{1,2}", text) and (word["top"] < 60 or word["top"] > height - 60):
            col_points.setdefault(int(text), []).append(x)
            if word["top"] > height - 60:
                bottom_label_y.append(y)
        if re.fullmatch(r"[A-Z]", text) and (word["x0"] < 80 or word["x1"] > width - 80):
            row_points.setdefault(text, []).append(y)

    cols = {k: sum(v) / len(v) for k, v in col_points.items()}
    rows = {k: sum(v) / len(v) for k, v in row_points.items()}
    if len(cols) < 2 or len(rows) < 2:
        return {}

    bottom_y = sum(bottom_label_y) / len(bottom_label_y) if bottom_label_y else height * 0.98
    ordered_rows = [k for k in "ABCDEFGHIJKLMNOPQRSTUVWXYZ" if k in rows]
    cells: dict[str, AreaCell] = {}
    for col in sorted(cols):
        if (col + 1) not in cols:
            continue
        x0 = cols[col] / width
        x1 = cols[col + 1] / width
        for idx, row in enumerate(ordered_rows):
            y0 = rows[row] / height
            y1 = (rows[ordered_rows[idx + 1]] / height) if idx + 1 < len(ordered_rows) else (bottom_y / height)
            cells[f"{row}{col}"] = AreaCell(
                area=f"{row}{col}",
                x0=round(min(x0, x1), 4),
                x1=round(max(x0, x1), 4),
                y0=round(min(y0, y1), 4),
                y1=round(max(y0, y1), 4),
            )
    return cells


def manual_override_cells(drawing_name: str, page_no: int) -> dict[str, AreaCell]:
    raw = MANUAL_AREA_CELL_OVERRIDES.get((drawing_name, page_no), {})
    cells: dict[str, AreaCell] = {}
    half_w = 0.035
    half_h = 0.06
    for area, (cx, cy) in raw.items():
        cells[area] = AreaCell(
            area=area,
            x0=round(cx - half_w, 4),
            x1=round(cx + half_w, 4),
            y0=round(cy - half_h, 4),
            y1=round(cy + half_h, 4),
        )
    return cells


def should_replace(ref: dict, cell: AreaCell, page_no: int, elevation: str) -> bool:
    x = ref.get("x")
    y = ref.get("y")
    current_source = str(ref.get("location_floor_source", ""))
    current_floor_el = normalize_el(ref.get("location_floor_el") or ref.get("location_floor") or "")
    if x is None or y is None:
        return True
    if f"第{page_no}页" not in current_source or current_floor_el != elevation:
        return True
    if cell.contains(x, y):
        return False
    if x > 0.73 or x < 0.18 or y < 0.16:
        return True
    return abs(cell.cx - x) > 0.12 or abs(cell.cy - y) > 0.12


def iter_related_manifest_tags(tag: str) -> list[str]:
    tag = normalize_tag(tag)
    related = {tag}
    m = re.match(r"^(\d{2})(FV|LV)-(.+)$", tag)
    if m:
        related.add(f"{m.group(1)}{m.group(2)}Z-{m.group(3)}")
    m = re.match(r"^(\d{2})(F|FE|FT|FI)-(.+)$", tag)
    if m:
        base, suffix = m.group(1), m.group(3)
        for family in ("F", "FE", "FT", "FI"):
            related.add(f"{base}{family}-{suffix}")
    return sorted(related)


def backup_manifest() -> Path:
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    target = BACKUP_DIR / f"manifest_before_region_area_fix_v2_{stamp}.json"
    shutil.copy2(MANIFEST_PATH, target)
    return target


def output_dir_for(drawing_name: str) -> Path:
    safe = re.sub(r"[^\w.-]+", "_", drawing_name)
    return OUT_ROOT / safe


def find_pdf_pair(drawing_name: str) -> tuple[Path, Path]:
    ocr_matches = glob.glob(str(OCR_ROOT / f"*{drawing_name.split('_')[1]}*OCR.pdf"))
    if not ocr_matches:
        raise SystemExit(f"OCR PDF not found for {drawing_name}")
    ocr = Path(sorted(ocr_matches)[0])
    orig = Path(str(ocr).replace("_OCR.pdf", ".pdf"))
    return orig, ocr


def main() -> int:
    args = parse_args()
    drawing_name = args.drawing_name
    orig_pdf, ocr_pdf = find_pdf_pair(drawing_name)
    doc_id_prefix = args.doc_id_prefix or f"loc_v2_{drawing_name}_p"
    only_pages = {int(x) for x in args.pages.split(",") if x.strip()} if args.pages else None
    drawing_label = drawing_name.split("_", 1)[0]

    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    changes: list[dict] = []

    with pdfplumber.open(str(ocr_pdf)) as ocr_doc, pdfplumber.open(str(orig_pdf)) as orig_doc:
        for page_index in range(min(len(ocr_doc.pages), len(orig_doc.pages))):
            page_no = page_index + 1
            if only_pages and page_no not in only_pages:
                continue
            rows = parse_table_rows(ocr_doc.pages[page_index])
            cells = extract_grid_cells(orig_doc.pages[page_index])
            if not cells:
                cells = manual_override_cells(drawing_name, page_no)
            if not rows or not cells:
                continue
            doc_id = f"{doc_id_prefix}{page_no}"
            for row_tag, row in sorted(rows.items()):
                cell = cells.get(row["area"])
                if not cell:
                    continue
                for tag in iter_related_manifest_tags(row_tag):
                    for ref in manifest["tags"].get(tag, []):
                        if ref.get("type") != "location" or ref.get("doc_id") != doc_id:
                            continue
                        if not should_replace(ref, cell, page_no, row["elevation"]):
                            break
                        before = {
                            "x": ref.get("x"),
                            "y": ref.get("y"),
                            "location_floor": ref.get("location_floor", ""),
                            "location_floor_el": ref.get("location_floor_el", ""),
                            "location_floor_name": ref.get("location_floor_name", ""),
                            "location_floor_source": ref.get("location_floor_source", ""),
                            "location_match": ref.get("location_match", ""),
                        }
                        ref["x"] = cell.cx
                        ref["y"] = cell.cy
                        ref["location_match"] = "region_area_cell_center"
                        ref["location_floor_el"] = row["elevation"]
                        ref["location_floor_name"] = ref.get("location_floor_name") or drawing_label
                        ref["location_floor"] = f"{ref['location_floor_name']} {row['elevation']}".strip()
                        ref["location_floor_source"] = f"{drawing_name} 第{page_no}页 区域{row['area']}"
                        changes.append(
                            {
                                "tag": tag,
                                "row_tag": row_tag,
                                "doc_id": doc_id,
                                "page": page_no,
                                "area": row["area"],
                                "old": before,
                                "new": {
                                    "x": ref["x"],
                                    "y": ref["y"],
                                    "location_floor": ref["location_floor"],
                                    "location_floor_el": ref["location_floor_el"],
                                    "location_floor_name": ref["location_floor_name"],
                                    "location_floor_source": ref["location_floor_source"],
                                    "location_match": ref["location_match"],
                                },
                            }
                        )
                        break

    report = {
        "drawing": drawing_name,
        "orig_pdf": str(orig_pdf),
        "ocr_pdf": str(ocr_pdf),
        "change_count": len(changes),
        "changes": changes,
    }
    out_dir = output_dir_for(drawing_name)
    out_dir.mkdir(parents=True, exist_ok=True)
    report_path = out_dir / "FIX_REGION_AREA_LOCATION_REFS_V2_20260614.json"

    if changes and not args.dry_run:
        backup = backup_manifest()
        manifest["version"] = datetime.now().strftime("%Y%m%d%H%M")
        manifest["generated_at"] = datetime.now().isoformat(timespec="seconds")
        manifest["updated_at"] = manifest["generated_at"]
        MANIFEST_PATH.write_text(json.dumps(manifest, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
        report["backup"] = str(backup)
        report["final_version"] = manifest["version"]

    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    if changes:
        print(json.dumps({k: v for k, v in report.items() if k != "changes"}, ensure_ascii=False, indent=2))
    else:
        print("No changes.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
