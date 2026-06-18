"""
生成 Cloudflare Worker 用的统一 manifest.json

输入：
  output_datasheets/global_index.json + 各 manifest.json
  output_flowcalc/global_index.json   + 各 manifest.json
  output_vendor/global_index.json     + 各 manifest.json
  output/ 位置图 PNG（从文件名解析位号）

输出：
  cf_manifest.json  → 上传到 Cloudflare KV
  cf_upload_list.txt → 需要上传到 R2 的文件路径列表

manifest 结构：
{
  "version": "20260412",
  "tags": {
    "04HV-01004": [
      {"type": "location",  "doc_id": "loc_变换_040100_page1_1",  "pages": [...]},
      {"type": "datasheet", "doc_id": "040100-P",                  "pages": [1,2]},
      {"type": "vendor",    "doc_id": "VENDOR-xxx",                "pages": [12]}
    ]
  },
  "docs": {
    "040100-P": {"doc_id": "040100-P", "source_pdf": "xxx.pdf", "rendered_pages": [1,2,...]},
    "loc_xxx":  {"doc_id": "loc_xxx", "drawing_label": "变换", "drawing_dir": "...", "filename": "xxx.png"}
  }
}
"""

import json
import re
import time
import sys
from pathlib import Path
from datetime import datetime

if '--legacy-position-processing' not in sys.argv:
    print('[STOP] build_manifest.py uses legacy data under E:\\opencode\\位置图处理.')
    print('[STOP] Current project rule: system data must originate from E:\\仪表管理查询系统测试用图纸.')
    print('[STOP] Copy and clean source files into the approved folder before processing.')
    print('[STOP] To intentionally run this legacy generator, pass --legacy-position-processing.')
    sys.exit(2)

BASE     = Path(r'E:\opencode\位置图处理')
OUT_DS   = BASE / 'output_datasheets'
OUT_FC   = BASE / 'output_flowcalc'
OUT_VD   = BASE / 'output_vendor'
OUT_LOC  = BASE / 'output'

CF_DIR   = Path(r'E:\opencode\instrument-cf')
OUT_FILE = CF_DIR / 'cf_manifest.json'
LIST_FILE = CF_DIR / 'cf_upload_list.txt'

tags: dict[str, list[dict]] = {}
docs: dict[str, dict] = {}
upload_files: list[str] = []  # (r2_key, local_path)

def add_tag(tag: str, entry: dict):
    tags.setdefault(tag, [])
    # 去重
    for e in tags[tag]:
        if e['doc_id'] == entry['doc_id'] and e['type'] == entry['type']:
            return
    tags[tag].append(entry)

# ── 1. 数据表 ────────────────────────────────────────────
print("加载数据表...")
if (OUT_DS / 'global_index.json').exists():
    gi = json.loads((OUT_DS / 'global_index.json').read_text('utf-8'))
    for t, entries in gi.items():
        for e in entries:
            doc_id = e['doc_id']
            pages = e['pages']
            add_tag(t, {'type': 'datasheet', 'doc_id': doc_id, 'pages': pages})
            if doc_id not in docs:
                mp = OUT_DS / doc_id / 'manifest.json'
                if mp.exists():
                    m = json.loads(mp.read_text('utf-8'))
                    docs[doc_id] = {
                        'doc_id': doc_id,
                        'source_pdf': m.get('source_pdf', ''),
                        'rendered_pages': m.get('rendered_pages', []),
                    }
                    for pg in m.get('rendered_pages', []):
                        local = OUT_DS / doc_id / f'page{pg:02d}.jpg'
                        if local.exists():
                            upload_files.append(f'{doc_id}/page{pg:02d}.jpg|{local}')
    print(f"  数据表位号: {len([t for t,v in tags.items() if any(e['type']=='datasheet' for e in v)])}")

# ── 2. 流量计算书 ────────────────────────────────────────
print("加载流量计算书...")
if (OUT_FC / 'global_index.json').exists():
    gi = json.loads((OUT_FC / 'global_index.json').read_text('utf-8'))
    for t, entries in gi.items():
        for e in entries:
            doc_id = e['doc_id']
            pages = e['pages']
            add_tag(t, {'type': 'flowcalc', 'doc_id': doc_id, 'pages': pages})
            if doc_id not in docs:
                mp = OUT_FC / doc_id / 'manifest.json'
                if mp.exists():
                    m = json.loads(mp.read_text('utf-8'))
                    docs[doc_id] = {
                        'doc_id': doc_id,
                        'source_pdf': m.get('source_pdf', ''),
                        'rendered_pages': m.get('rendered_pages', []),
                    }
                    for pg in m.get('rendered_pages', []):
                        local = OUT_FC / doc_id / f'page{pg:02d}.jpg'
                        if local.exists():
                            upload_files.append(f'{doc_id}/page{pg:02d}.jpg|{local}')
    print(f"  计算书位号: {len([t for t,v in tags.items() if any(e['type']=='flowcalc' for e in v)])}")

# ── 3. 厂商资料 ──────────────────────────────────────────
print("加载厂商资料...")
if (OUT_VD / 'global_index.json').exists():
    gi = json.loads((OUT_VD / 'global_index.json').read_text('utf-8'))
    for t, entries in gi.items():
        for e in entries:
            doc_id = e['doc_id']
            pages = e['pages']
            add_tag(t, {'type': 'vendor', 'doc_id': doc_id, 'pages': pages})
            if doc_id not in docs:
                mp = OUT_VD / doc_id / 'manifest.json'
                if mp.exists():
                    m = json.loads(mp.read_text('utf-8'))
                    docs[doc_id] = {
                        'doc_id': doc_id,
                        'source_pdf': m.get('source_pdf', ''),
                        'rendered_pages': m.get('rendered_pages', []),
                    }
                    for pg in m.get('rendered_pages', []):
                        local = OUT_VD / doc_id / f'page{pg:02d}.jpg'
                        if local.exists():
                            upload_files.append(f'{doc_id}/page{pg:02d}.jpg|{local}')
    print(f"  厂商资料位号: {len([t for t,v in tags.items() if any(e['type']=='vendor' for e in v)])}")

# ── 4. 位置图 v2（整页图 + coords.json，红圈由前端渲染）────
print("加载位置图 v2...")
OUT_LOC_V2 = BASE / 'output_v2'
AREA_CODE_RE = re.compile(r'_21216-(\d{6})-IN')

def drawing_label(dir_name: str) -> str:
    first = dir_name.split('_')[0]
    m = re.match(r'^(\D+)', first)
    return m.group(1) if m else first

v2_area_codes: set[str] = set()   # 已被 v2 覆盖的区域代码，v1 扫描时跳过
loc_count_v2 = 0

if OUT_LOC_V2.exists():
    for d in sorted(OUT_LOC_V2.iterdir()):
        if not d.is_dir():
            continue
        coords_path = d / 'coords.json'
        if not coords_path.exists():
            continue
        coords = json.loads(coords_path.read_text('utf-8'))
        label = drawing_label(d.name)

        # 记录已被 v2 覆盖的区域（区域代码 + 图纸类型，如 030000-IN38）
        m = AREA_CODE_RE.search(d.name)
        if m:
            # 取完整后缀 "030000-IN38" 作为 key
            suffix = d.name[d.name.index(m.group(0))+1:]  # "21216-030000-IN38"
            v2_area_codes.add(suffix)

        # 每个页面注册为一个 doc（同一页多个位号共享同一 doc）
        pages_registered: set[int] = set()
        for tag, pos in coords.items():
            page_n = pos['page']
            img_file = f'page{page_n}.jpg'
            doc_id   = f'loc_v2_{d.name}_p{page_n}'

            if doc_id not in docs:
                local_img = d / img_file
                if not local_img.exists():
                    continue
                docs[doc_id] = {
                    'doc_id': doc_id,
                    'drawing_label': label,
                    'drawing_dir': d.name,
                    'filename': img_file,
                }
                upload_files.append(f'{d.name}/{img_file}|{local_img}')

            add_tag(tag, {
                'type': 'location',
                'doc_id': doc_id,
                'x': pos['x'],
                'y': pos['y'],
            })
            loc_count_v2 += 1

print(f"  位置图 v2: {loc_count_v2} 个位号（{len(v2_area_codes)} 个区域整页图）")

# ── 5. 位置图 v1（裁剪图，跳过已被 v2 覆盖的区域）─────────
print("加载位置图 v1（旧格式）...")
PAGE_RE = re.compile(r'_page(\d+)_(\d+)_(.+)\.(png|jpg|jpeg)$', re.IGNORECASE)
loc_count = 0

if OUT_LOC.exists():
    for d in sorted(OUT_LOC.iterdir()):
        if not d.is_dir():
            continue
        # 跳过已被 v2 覆盖的区域
        m = AREA_CODE_RE.search(d.name)
        if m:
            suffix = d.name[d.name.index(m.group(0))+1:]
            if suffix in v2_area_codes:
                continue
        label = drawing_label(d.name)
        for f in sorted(d.iterdir()):
            if f.suffix.lower() not in ('.png', '.jpg', '.jpeg'):
                continue
            m = PAGE_RE.search(f.name)
            if not m:
                continue
            page, seq, tag = int(m.group(1)), int(m.group(2)), m.group(3)
            doc_id = f'loc_{d.name}_{f.stem}'
            docs[doc_id] = {
                'doc_id': doc_id,
                'drawing_label': label,
                'drawing_dir': d.name,
                'filename': f.name,
            }
            add_tag(tag, {'type': 'location', 'doc_id': doc_id, 'pages': [page]})
            upload_files.append(f'{d.name}/{f.name}|{f}')
            loc_count += 1

print(f"  位置图 v1: {loc_count} 张（旧格式裁剪图）")

# ── 输出 ─────────────────────────────────────────────────
version = datetime.now().strftime('%Y%m%d%H%M')
manifest = {
    'version': version,
    'generated_at': datetime.now().isoformat(),
    'tags': tags,
    'docs': docs,
}

OUT_FILE.write_text(json.dumps(manifest, ensure_ascii=False), encoding='utf-8')
LIST_FILE.write_text('\n'.join(upload_files), encoding='utf-8')

print(f"\nOK manifest: {len(tags)} tag, {len(docs)} docs")
print(f"OK upload list: {len(upload_files)} files")
print(f"OK output: {OUT_FILE}")
print(f"OK list: {LIST_FILE}")
print(f"OK version: {version}")
