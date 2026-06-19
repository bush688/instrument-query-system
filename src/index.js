import { WEBAPP_HTML } from './webapp.js';
import { PRESSURE_GAUGE_VENDOR_DOC_ID, PRESSURE_GAUGE_VENDOR_PAGES } from './pressure_gauge_vendor_map.js';

/**
 * 仪表位置图查询系统 — Cloudflare Worker
 *
 * 路由：
 *   GET  /                     → 网页应用（HTML）
 * API 路由：
 *   GET  /api/version          → 当前数据版本号
 *   GET  /api/manifest         → 完整索引 JSON（位号 → 文档列表）
 *   GET  /api/search?q=xxx     → 搜索位号
 *   GET  /files/{path}         → 从 R2 取图片
 *   POST /api/admin/version    → 更新版本号（需 token）
 */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}

function err(msg, status = 400) {
  return json({ error: msg }, status);
}

function contentTypeForKey(key) {
  const ext = String(key || '').split('.').pop().toLowerCase();
  if (ext === 'png') return 'image/png';
  if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg';
  if (ext === 'pdf') return 'application/pdf';
  if (ext === 'gif') return 'image/gif';
  if (ext === 'webp') return 'image/webp';
  if (ext === 'svg') return 'image/svg+xml';
  if (ext === 'txt') return 'text/plain; charset=utf-8';
  if (ext === 'html' || ext === 'htm') return 'text/html; charset=utf-8';
  if (ext === 'json') return 'application/json; charset=utf-8';
  return 'application/octet-stream';
}

/**
 * 仪表类型等价组：同一回路不同环节的位号视为同一仪表
 * 按序列表的第一个为首选（canonical）。
 * 注意：PDT/PDI 必须出现在 PT/PI 之前被匹配（更长前缀优先）。
 */
const EQUIV_GROUPS = [
  ['F', 'FE', 'FT', 'FI'], // 流量：基础回路 F 与 FE/FT/FI 视为同位号
  ['PDT', 'PDI'],       // 差压
  ['PT', 'PI'],         // 压力
  ['LT', 'LI'],         // 液位
  ['TE', 'TI'],         // 温度
  ['AT', 'AI'],         // 分析
];

const HIDDEN_DEVICE_PREFIXES = new Set(['30', '35']);

function isHiddenDeviceTag(tag) {
  const m = String(tag || '').match(/^(\d{2})/);
  return !!(m && HIDDEN_DEVICE_PREFIXES.has(m[1]));
}

function isLocalGaugeTag(tag) {
  return /^(?:\d{2})?(?:PG|TG|LG)[-_]/.test(String(tag || '').toUpperCase());
}

/** 不需要显示为独立 Tab 的 sub_type（索引、目录类） */
const SKIP_SUBTYPES = new Set(['仪表索引', '仪表专业文件目录', '参考文档']);

/**
 * 归一化 sub_type 名称：统一分隔符、全角字符等
 * '控制系统IO表_DCS' → '控制系统IO表(DCS)'
 * '仪表电_气连接图'  → '仪表电/气连接图'
 * '仪表电／气连接图' → '仪表电/气连接图'
 */
function normalizeSubType(s) {
  if (!s) return s;
  // 全角斜线 → 半角
  s = s.replace(/／/g, '/');
  // 尾部 _DCS / _SIS / _GDS / _ESD → (DCS) 等
  s = s.replace(/_([A-Z]{2,5})$/, '($1)');
  // 中文字符之间的下划线（替代 /）→ /
  s = s.replace(/([一-鿿])_([一-鿿])/g, '$1/$2');
  // 常见同义写法归一
  s = s.replace(/^保温(?:\/|_)?护(?:\/|_)?箱一览表$/, '保温(护)箱一览表');
  return s.trim();
}

function isWiringSubType(subType) {
  return /^(DCS|SIS|CCS|GDS)接线图$/.test(String(subType || ''));
}

function shouldHideLocationReferenceTab(tag, subType, hasLocationDoc) {
  if (!hasLocationDoc) return false;
  if (String(tag || '').startsWith('40')) return false;
  return subType === '仪表位置图' || subType === '位置图';
}

function buildVisibleTabLabels({
  has_jbxx = false,
  has_location = false,
  has_gds = false,
  has_datasheet = false,
  has_monitoring = false,
  has_dcs = false,
  reference_tabs = [],
  has_flowcalc = false,
  has_vendor = false,
}) {
  const labels = [];
  if (has_jbxx) labels.push('基本');
  if (has_location) labels.push('位置');
  if (has_gds) labels.push('气体报警');
  if (has_datasheet) labels.push('数据表');
  if (has_monitoring) labels.push('监控');
  if (has_dcs) labels.push('DCS程序');
  for (const rt of reference_tabs) {
    if (isWiringSubType(rt.sub_type)) {
      labels.push(rt.sub_type);
    } else {
      labels.push(rt.sub_type);
    }
  }
  if (has_flowcalc) labels.push('计算书');
  if (has_vendor) labels.push('厂商');
  return labels;
}

/**
 * 返回与给定位号等价的别名列表（不含自身）
 * 等价规则：
 *   1. 同一 EQUIV_GROUPS 组内互为别名，如 04FE-09009 <-> 04FT-09009 <-> 04FI-09009
 *   2. 分隔符 - 与 _ 视为等价，如 04TE-03006 <-> 04TE_03006
 */
function getAliases(tag) {
  const out = new Set();
  // 先生成分隔符互换的两种形式
  const seps = new Set([tag]);
  if (tag.includes('-')) seps.add(tag.replace(/-/g, '_'));
  if (tag.includes('_')) seps.add(tag.replace(/_/g, '-'));

  for (const v of seps) {
    out.add(v);
    for (const { re, group } of EQUIV_PATTERNS) {
      const m = v.match(re);
      if (!m) continue;
      for (const other of group) {
        out.add(`${m[1]}${other}${m[3]}`);
        // 同时加入分隔符变体
        out.add(`${m[1]}${other}${m[3].replace(/-/g, '_')}`);
        out.add(`${m[1]}${other}${m[3].replace(/_/g, '-')}`);
      }
      break; // 一个位号只能匹配一个组
    }
  }
  out.delete(tag);
  return Array.from(out);
}

/**
 * 将位号标准化为 tag_meta 的键格式：大写 + 连字符
 * "04pi_01005a" → "04PI-01005A"
 */
function normMetaKey(tag) {
  return tag.toUpperCase().replace(/_/g, '-');
}

/**
 * 从 tag_meta 查找某个位号的元数据。
 * 先用标准化键直接查，再尝试下划线变体（兼容少量旧数据）。
 */
function lookupMeta(tagMeta, tag) {
  if (!tagMeta) return null;
  const k = normMetaKey(tag);
  if (tagMeta[k]) return tagMeta[k];
  // 下划线变体（tag_meta 中不应存在，但防御性保留）
  const k2 = k.replace(/-/g, '_');
  return tagMeta[k2] || null;
}

function locationRefSignature(ref) {
  return [
    ref?.type || '',
    ref?.doc_id || '',
    (ref?.pages || []).join(','),
    ref?.x ?? '',
    ref?.y ?? '',
    ref?.location_floor || '',
    ref?.location_floor_el || '',
    ref?.location_floor_name || '',
  ].join('::');
}

function uniqueLocationRefs(refs) {
  const out = [];
  const seen = new Set();
  for (const ref of refs || []) {
    if (!ref || ref.type !== 'location') continue;
    const sig = locationRefSignature(ref);
    if (seen.has(sig)) continue;
    seen.add(sig);
    out.push(ref);
  }
  return out;
}

function normalizeFloorText(value) {
  let text = String(value || '').trim();
  if (!text) return '';
  text = text.replace(/\s+/g, ' ');
  text = text.replace(/^(?:\u5e73\u9762|\u4e4e\u9762)(?=[\u4e00-\u9fa5])/u, '');
  text = text.replace(/^\u5e72\u9762(?=\u6c14\u5316)/u, '');
  text = text.replace(/^j(?=\u6c14\u5316)/u, '');
  text = text.replace(/^\}\u74e2\u6c14\u5316/u, '\u6c14\u5316');
  text = text.replace(/:\u697c/g, '\u697c');
  text = text.replace(/^\d+(?=[\u4e00-\u9fa5].*\u697c)/u, '');
  return text.trim();
}

function parseInlineDeviceAndDescQuery(rawQuery) {
  const query = String(rawQuery || '').trim();
  if (!query) return { inlineDeviceFilter: '', descNeedle: '' };
  const compact = query.replace(/\s+/g, '');
  const deviceMatch = compact.match(/(?<!\d)(\d{6})(?!\d)/);
  const inlineDeviceFilter = deviceMatch ? deviceMatch[1] : '';
  const descNeedle = compact.replace(/(?<!\d)\d{6}(?!\d)/g, '').trim();
  return { inlineDeviceFilter, descNeedle };
}

function isElevationFloorText(value) {
  return /^EL\s*[+-]?\d+(?:\.\d+)?$/i.test(String(value || '').trim());
}

function inferFloorAreaFromSource(source) {
  const text = String(source || '').trim();
  if (!text) return '';
  const patterns = [
    /^loc_v2_([^_]+)_\d{6}-IN(?:38|40)/,
    /^([^_]+)_\d{6}-IN(?:38|40)/,
  ];
  for (const pattern of patterns) {
    const m = text.match(pattern);
    if (m && m[1]) return normalizeFloorText(m[1]);
  }
  return '';
}

function normalizeLocationInfo(info, fallbackSource = '') {
  const source = String(info?.location_floor_source || fallbackSource || '').trim();
  let floor = normalizeFloorText(info?.location_floor || '');
  let floorEl = normalizeFloorText(info?.location_floor_el || '');
  let floorName = normalizeFloorText(info?.location_floor_name || '');
  if (!floorEl && isElevationFloorText(floor)) floorEl = floor;
  if (!floorName && floor && !isElevationFloorText(floor)) floorName = floor;
  const area = inferFloorAreaFromSource(source);
  let display = floor;
  if (floorName && floorEl) display = `${floorName} ${floorEl}`;
  else if (floorName) display = floorName;
  else if (floorEl) display = area ? `${area} ${floorEl}` : floorEl;
  return {
    ...info,
    location_floor: display,
    location_floor_el: floorEl,
    location_floor_name: floorName,
    location_floor_source: source,
  };
}

/**
 * 模块级缓存（TTL=120s）
 * manifest   ≈ 2MB（tags + docs + manuals，无 tag_meta）
 * tag_meta   ≈ 12MB（位号元数据，按需加载）
 */
let _manifestCache = null, _manifestCacheTs = 0, _manifestCacheVersion = '';
let _tagMetaCache  = null, _tagMetaCacheTs  = 0, _tagMetaCacheVersion = '';
let _tagListCache = null, _tagListCacheTs = 0, _tagListCacheVersion = '';
let _searchIndexCache = null, _searchIndexCacheTs = 0, _searchIndexCacheVersion = '';
let _loopTailIndexCache = null, _loopTailIndexCacheVersion = '';
const LARGE_CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const VERSION_CHECK_TTL_MS = 30_000;

async function getManifest(env) {
  const now = Date.now();
  if (_manifestCache) {
    if ((now - _manifestCacheTs) < VERSION_CHECK_TTL_MS) return _manifestCache;
    try {
      const version = await env.META.get('version') || '';
      if (!version || version === _manifestCacheVersion) {
        _manifestCacheTs = now;
        return _manifestCache;
      }
    } catch (e) {
      console.warn('manifest version check failed; using stale cache', e);
      _manifestCacheTs = now;
      return _manifestCache;
    }
  }
  try {
    const manifest = await env.META.get('manifest', 'json');
    if (manifest) {
      _manifestCache = manifest;
      _manifestCacheVersion = String(manifest.version || await env.META.get('version') || '');
      _manifestCacheTs = now;
    }
    return _manifestCache;
  } catch (e) {
    console.error('manifest load failed', e);
    if (_manifestCache) return _manifestCache;
    throw e;
  }
}

async function getTagMeta(env) {
  const now = Date.now();
  const version = _manifestCacheVersion || await env.META.get('version') || '';
  if (_tagMetaCache && _tagMetaCacheVersion === version && (now - _tagMetaCacheTs) < LARGE_CACHE_TTL_MS) return _tagMetaCache;
  const manifestTagMeta = _manifestCache && _manifestCache.tag_meta;
  if (manifestTagMeta && typeof manifestTagMeta === 'object' && Object.keys(manifestTagMeta).length) {
    _tagMetaCache = manifestTagMeta;
    _tagMetaCacheTs = now;
    _tagMetaCacheVersion = version;
    return _tagMetaCache;
  }
  try {
    const tagMeta = await env.META.get('tag_meta', 'json');
    _tagMetaCache = tagMeta || {};
    _tagMetaCacheTs = now;
    _tagMetaCacheVersion = version;
    return _tagMetaCache;
  } catch (e) {
    console.error('tag_meta load failed; using fallback', e);
    if (_tagMetaCache) return _tagMetaCache;
    return {};
  }
}

async function getTagList(env, manifest) {
  const now = Date.now();
  const version = _manifestCacheVersion || String(manifest?.version || '') || await env.META.get('version') || '';
  if (_tagListCache && _tagListCacheVersion === version && (now - _tagListCacheTs) < LARGE_CACHE_TTL_MS) return _tagListCache;
  let data = null;
  try {
    data = JSON.parse(await env.META.get('tag_list') || '{}');
  } catch (e) {
    console.error('tag_list load failed; using manifest fallback', e);
    data = { groups: {} };
  }
  if (data && data.groups && !data.groups['400800']) {
    const restored = buildDeviceGroup(manifest, '400800');
    if (restored.length) data.groups['400800'] = restored;
  }
  if (data && data.groups) {
    for (const key of Object.keys(data.groups)) {
      if (key === '300000' || key.startsWith('35')) delete data.groups[key];
    }
    data.total = Object.values(data.groups).reduce((sum, tags) => sum + (tags || []).length, 0);
  }
  _tagListCache = data || { groups: {}, total: 0 };
  _tagListCacheTs = now;
  _tagListCacheVersion = version;
  return _tagListCache;
}

function reviveSearchIndex(data) {
  if (!data || typeof data !== 'object') return null;
  return {
    groups: data.groups || {},
    tags: Array.isArray(data.tags) ? data.tags : [],
    descEntries: Array.isArray(data.desc_entries) ? data.desc_entries : [],
    metaByTag: data.meta_by_tag || {},
    tagDevice: new Map(Object.entries(data.tag_device || {})),
    groupSingleLocationRefs: data.group_single_location_refs || Object.create(null),
  };
}

function buildLightweightSearchIndex(manifest) {
  const allTags = manifest?.tags || {};
  return {
    degraded: true,
    groups: {},
    tags: Object.keys(allTags).filter(t => !isHiddenDeviceTag(t)),
    descEntries: [],
    metaByTag: {},
    tagDevice: new Map(),
    groupSingleLocationRefs: Object.create(null),
  };
}

async function getSearchIndex(env, manifest, tagMeta, options = {}) {
  const now = Date.now();
  const version = _manifestCacheVersion || String(manifest?.version || '') || await env.META.get('version') || '';
  if (_searchIndexCache && _searchIndexCacheVersion === version && (now - _searchIndexCacheTs) < LARGE_CACHE_TTL_MS) return _searchIndexCache;
  try {
    const kvSearchIndex = await env.META.get('search_index', 'json');
    const revived = reviveSearchIndex(kvSearchIndex);
    if (revived && revived.tags && revived.tags.length) {
      _searchIndexCache = revived;
      _searchIndexCacheTs = now;
      _searchIndexCacheVersion = version;
      return _searchIndexCache;
    }
  } catch (e) {
    console.error('search_index load failed; using cached/lightweight fallback', e);
    if (_searchIndexCache) {
      _searchIndexCacheTs = now;
      return _searchIndexCache;
    }
  }
  if (_searchIndexCache) {
    console.warn('search_index missing or invalid; using stale cached index');
    _searchIndexCacheTs = now;
    return _searchIndexCache;
  }
  if (options.allowRuntimeFallback !== true) {
    return buildLightweightSearchIndex(manifest);
  }
  const tagList = await getTagList(env, manifest);
  const groups = tagList.groups || {};
  const allTags = manifest?.tags || {};
  const tags = [];
  const descEntries = [];
  const seenTags = new Set();
  const tagDevice = new Map();
  const groupMembers = new Map();
  for (const [code, groupTags] of Object.entries(groups)) {
    for (const t of groupTags || []) {
      if (!t || isHiddenDeviceTag(t)) continue;
      if (!seenTags.has(t)) {
        seenTags.add(t);
        tags.push(t);
      }
      tagDevice.set(t, code);
      tagDevice.set(canonicalize(t), code);
      for (const a of getAliases(t)) tagDevice.set(a, code);
    }
  }
  // Point-table-only tags may not have drawing references and therefore may
  // not appear in tag_list. Include them once here instead of scanning every
  // tag_meta key on every search request.
  for (const [t, meta] of Object.entries(tagMeta || {})) {
    if (!t || isHiddenDeviceTag(t)) continue;
    if (!seenTags.has(t)) {
      seenTags.add(t);
      tags.push(t);
    }
    if (meta && meta.desc) descEntries.push([t, String(meta.desc).toLowerCase()]);
  }
  for (const t of Object.keys(allTags)) {
    const meta = lookupMeta(tagMeta, t);
    const groupKey = (meta && meta.group_key) || computeGroupKey(t);
    if (!groupKey) continue;
    if (!groupMembers.has(groupKey)) groupMembers.set(groupKey, []);
    groupMembers.get(groupKey).push(t);
  }
  const groupSingleLocationRefs = Object.create(null);
  for (const [groupKey, memberTags] of groupMembers.entries()) {
    const refs = [];
    const seen = new Set();
    for (const t of memberTags) {
      for (const ref of allTags[t] || []) {
        if (!ref || ref.type !== 'location') continue;
        const sig = locationRefSignature(ref);
        if (seen.has(sig)) continue;
        seen.add(sig);
        refs.push(ref);
      }
    }
    if (refs.length === 1) groupSingleLocationRefs[groupKey] = refs;
  }
  _searchIndexCache = { groups, tags, descEntries, tagDevice, groupSingleLocationRefs };
  _searchIndexCacheTs = now;
  _searchIndexCacheVersion = version;
  return _searchIndexCache;
}

// ── 同仪表信号分组（按需从 tag_meta 计算，无需额外 KV）────────────────

/** 推断信号所属系统 (SIS > GDS > CCS > DCS) */
function getSigSystem(meta) {
  const sis = meta.sis;
  if (sis && typeof sis === 'object' && Object.keys(sis).some(k => sis[k] != null)) return 'SIS';
  const gds = meta.gds;
  if (gds && typeof gds === 'object' && Object.keys(gds).some(k => gds[k] != null)) return 'GDS';
  const src = (meta.src || '').toUpperCase();
  if (src.includes('CCS') || (meta.src || '').includes('压缩机')) return 'CCS';
  return 'DCS';
}

/** 硬件功能后缀 → IO 方向（降序排列确保最长匹配优先）*/
const HW_IO_ENTRIES = [
  ['ZSO','DI'],['ZSC','DI'],['ZVZ','DI'],['ZV','AI'],['ZT','AI'],['ZS','DI'],
  ['SX','DI'],['SO','DI'],['SC','DI'],
  ['YV','DO'],
  ['T','AI'],['E','AI'],['X','AI'],
  ['V','AO'],['H','AO'],
  ['S','DI'],['M','DO'],
];

/** 推断信号类型，返回 'DCS-AI' / 'SIS-DI' / 'DCS' 等 */
function getSigType(tag, meta) {
  const system = getSigSystem(meta);
  const actualIo = (meta.io || '').toUpperCase();
  if (!meta.derived && ['AI','AO','DI','DO'].includes(actualIo)) return `${system}-${actualIo}`;
  // 从功能后缀推断
  const m = tag.match(/^(\d{0,2})([A-Z]+)-/);
  if (m) {
    const letters = m[2];
    const func = ['PD','FD'].includes(letters.slice(0,2)) ? letters.slice(2)
               : letters.length > 1 ? letters.slice(1) : '';
    if (func) {
      for (const [key, io] of HW_IO_ENTRIES) {
        if (func === key || func.startsWith(key)) return `${system}-${io}`;
      }
    }
  }
  return system; // 软件块（PID控制器、报警、指示等）
}

/** 信号类型排序权重（数字越小越靠前）*/
const SIG_ORDER_MAP = {
  'DCS-AI':0,'SIS-AI':1,'GDS-AI':2,'CCS-AI':3,
  'DCS-AO':4,'SIS-AO':5,'CCS-AO':6,
  'DCS-DI':7,'SIS-DI':8,'GDS-DI':9,'CCS-DI':10,
  'DCS-DO':11,'SIS-DO':12,'CCS-DO':13,
  'DCS':14,'SIS':15,'GDS':16,'CCS':17,
};

/** 功能后缀 → 中文（按长度降序，确保最长优先匹配）*/
const FUNC_MAP_JS = [
  ['ALLL','低低低报警'],['AHHH','高高高报警'],
  ['ALL','低低报警'],['AHH','高高报警'],
  ['AL','低报警'],['AH','高报警'],
  ['ICA','指示控制报警'],
  ['IQ','指示积算'],['IC','指示控制器'],
  ['ZSO','阀开到位'],['ZSC','阀关到位'],
  ['ZVZ','阀位反馈'],['ZV','阀位'],
  ['ZT','计算变送'],['ZS','计算开关'],
  ['SO','开到位'],['SC','关到位'],['SX','特殊开关'],
  ['C','控制器'],['I','指示'],
  ['T','变送器'],['E','传感元件'],
  ['A','报警'],['V','调节阀'],
  ['S','开关'],['B','累积'],
  ['Q','积算'],['R','记录'],
  ['Z','计算值'],['X','变送器'],
  ['Y','事件'],['P','报警确认'],
  ['H','手操器'],['M','手动'],
  ['G','密度'],['W','重量'],
];

/** 提取位号功能后缀对应的中文名 */
function getFuncCn(tag) {
  const m = tag.match(/^(\d{0,2})([A-Z]+)-/);
  if (!m) return '';
  const letters = m[2];
  const func = ['PD','FD'].includes(letters.slice(0,2)) ? letters.slice(2)
             : letters.length > 1 ? letters.slice(1) : '';
  if (!func) return '测量';
  for (const [suffix, cn] of FUNC_MAP_JS) {
    if (func === suffix) return cn;
  }
  return func;
}

/**
 * 根据分组键从 tag_meta 实时计算同仪表信号列表。
 * 避免额外加载 tag_groups KV（~2.7MB → ~60MB 解析内存）。
 */
function computeGroupSignals(groupKey, tagMeta) {
  if (!groupKey || !tagMeta) return null;
  // 收集同组所有位号
  const groupTags = [];
  for (const [k, v] of Object.entries(tagMeta)) {
    if (v.group_key === groupKey) groupTags.push([k, v]);
  }
  if (groupTags.length < 2) return null;

  // 推断 base_desc：优先非推导且有描述的最短位号，去掉功能后缀
  let baseDesc = '', baseUnit = '';
  const withDesc = groupTags.filter(([,v]) => v.desc);
  const nonDerived = withDesc.filter(([,v]) => !v.derived);
  const candidates = (nonDerived.length ? nonDerived : withDesc)
    .slice().sort((a,b) => a[0].length - b[0].length);
  if (candidates.length) {
    const [, bm] = candidates[0];
    baseDesc = bm.desc || '';
    baseUnit = bm.unit || '';
    for (const [, cn] of FUNC_MAP_JS) {
      if (baseDesc.endsWith(cn)) { baseDesc = baseDesc.slice(0, -cn.length).trim(); break; }
    }
  }

  const signals = groupTags.map(([k, v]) => ({
    tag: k,
    sig_type: getSigType(k, v),
    func_cn: getFuncCn(k),
    desc: v.desc || '',
    lo: v.lo ?? null,
    hi: v.hi ?? null,
    unit: v.unit || '',
  })).sort((a, b) => {
    const oa = SIG_ORDER_MAP[a.sig_type] ?? 99;
    const ob = SIG_ORDER_MAP[b.sig_type] ?? 99;
    return oa !== ob ? oa - ob : a.tag.length - b.tag.length;
  });

  return { signals, base_desc: baseDesc, base_unit: baseUnit };
}

/** 计算位号的仪表分组键 */
function computeGroupKey(tag) {
  if (isLocalGaugeTag(tag)) return null;
  const REAL2 = new Set(['PD', 'FD']);
  const SMEAS = new Set('FLPTAHUJSWGEXZYKQVNR'.split(''));
  const m = tag.match(/^(\d{0,2})([A-Z]+)-([0-9A-Z][-0-9A-Z]*)$/);
  if (!m) return null;
  const [, prefix, letters, tagNum] = m;
  // 5位数字编号（过程测量）
  if (/^\d{5}[A-Z]?$/.test(tagNum)) {
    if (letters.length >= 2 && REAL2.has(letters.slice(0, 2))) return `${prefix}${letters.slice(0,2)}-${tagNum}`;
    if (SMEAS.has(letters[0])) return `${prefix}${letters[0]}-${tagNum}`;
  }
  // 设备编号（如EV02101A, P0112A）
  if (/^[A-Z]+\d{4,5}[A-Z]?$/.test(tagNum)) return `${prefix}-${tagNum}`;
  if (SMEAS.has(letters[0])) return `${prefix}${letters[0]}-${tagNum}`;
  return null;
}

/** 预编译等价组正则（模块加载时执行一次）*/
const EQUIV_PATTERNS = EQUIV_GROUPS.map(group => ({
  group,
  re: new RegExp('^((?:\\d{2})?)(' + group.join('|') + ')([-_].+)$'),
}));

/** 返回位号在其等价组中的 canonical 写法 —— 用于搜索去重 */
function canonicalize(tag) {
  // 分隔符统一用 -
  let canon = tag.replace(/_/g, '-');
  for (const { re, group } of EQUIV_PATTERNS) {
    const pattern = re;
    const m = canon.match(pattern);
    if (m) {
      canon = `${m[1]}${group[0]}${m[3]}`;
      break;
    }
  }
  return canon;
}

function extractDeviceCode(value) {
  if (!value) return null;
  const m = String(value).match(/\b(\d{6})\b/);
  return m ? m[1] : null;
}

function buildDeviceGroup(manifest, code) {
  const tags = manifest?.tags || {};
  const docs = manifest?.docs || {};
  const canonToTag = new Map();
  for (const tag of Object.keys(tags)) {
    const canon = canonicalize(tag);
    if (!canonToTag.has(canon) || tag === canon) canonToTag.set(canon, tag);
  }

  const result = [];
  for (const tag of canonToTag.values()) {
    const refs = tags[tag] || [];
    const matched = refs.some(ref => {
      const doc = docs[ref.doc_id] || {};
      return (
        extractDeviceCode(doc.drawing_dir) ||
        extractDeviceCode(doc.doc_id) ||
        extractDeviceCode(doc.source_pdf)
      ) === code;
    });
    if (matched) result.push(tag);
  }
  result.sort();
  return result;
}

function firstLocationInfo(docRefs, docs) {
  for (const ref of docRefs || []) {
    if (!ref || ref.type !== 'location') continue;
    const doc = docs?.[ref.doc_id] || {};
    return normalizeLocationInfo({
      location_floor: ref.location_floor || doc.location_floor || '',
      location_floor_el: ref.location_floor_el || doc.location_floor_el || '',
      location_floor_name: ref.location_floor_name || doc.location_floor_name || '',
      location_floor_source: ref.location_floor_source || doc.location_floor_source || '',
    }, ref.location_floor_source || doc.location_floor_source || ref.doc_id || doc.doc_id || '');
  }
  return normalizeLocationInfo({ location_floor: '', location_floor_el: '', location_floor_name: '', location_floor_source: '' });
}

function getLoopTailIndex(allTags) {
  const version = _manifestCacheVersion || '';
  if (_loopTailIndexCache && _loopTailIndexCacheVersion === version) return _loopTailIndexCache;
  const index = new Map();
  for (const candidate of Object.keys(allTags || {})) {
    const cm = String(candidate).match(/^(\d{2})[A-Z]+-(\d{4,5}[A-Z]?)$/);
    if (!cm) continue;
    const key = `${cm[1]}::${cm[2]}`;
    if (!index.has(key)) index.set(key, []);
    index.get(key).push(candidate);
  }
  _loopTailIndexCache = index;
  _loopTailIndexCacheVersion = version;
  return _loopTailIndexCache;
}

function inferLoopLocationInfo(tag, allTags, docs, tagMeta, searchIndex) {
  if (isLocalGaugeTag(tag)) {
    return normalizeLocationInfo({ location_floor: '', location_floor_el: '', location_floor_name: '', location_floor_source: '' });
  }
  const m = String(tag || '').match(/^(\d{2})[A-Z]+-(\d{4,5}[A-Z]?)$/);
  if (!m) return normalizeLocationInfo({ location_floor: '', location_floor_el: '', location_floor_name: '', location_floor_source: '' });
  const prefix = m[1];
  const tail = m[2];
  const floors = new Map();
  const candidateTags = getLoopTailIndex(allTags).get(`${prefix}::${tail}`) || [];
  for (const candidate of candidateTags) {
    if (candidate === tag) continue;
    const aliases = getAliases(candidate).filter(a => allTags[a]);
    const metaEntry = lookupMeta(tagMeta, candidate)
      || aliases.reduce((found, a) => found || lookupMeta(tagMeta, a), null);
    const refs = mergeDocRefsWithLocationFallback(candidate, aliases, metaEntry, allTags, searchIndex);
    const info = firstLocationInfo(refs, docs);
    if (!info.location_floor) continue;
    const key = [
      info.location_floor,
      info.location_floor_el || '',
      info.location_floor_name || '',
      info.location_floor_source || '',
    ].join('::');
    if (!floors.has(key)) floors.set(key, info);
  }
  if (floors.size === 1) return Array.from(floors.values())[0];
  return normalizeLocationInfo({ location_floor: '', location_floor_el: '', location_floor_name: '', location_floor_source: '' });
}

function mergeDocRefsWithLocationFallback(tag, aliases, tagMetaEntry, allTags, searchIndex) {
  const docRefs = [
    ...(allTags[tag] || []),
    ...aliases.flatMap(a => allTags[a] || []),
  ];
  if (isLocalGaugeTag(tag)) return docRefs;
  if (docRefs.some(ref => ref && ref.type === 'location')) return docRefs;
  const groupKey = (tagMetaEntry && tagMetaEntry.group_key) || computeGroupKey(tag);
  const fallbackRefs = groupKey && searchIndex?.groupSingleLocationRefs
    ? searchIndex.groupSingleLocationRefs[groupKey]
    : null;
  if (!fallbackRefs || !fallbackRefs.length) return docRefs;
  const seen = new Set(docRefs.map(locationRefSignature));
  for (const ref of fallbackRefs) {
    const sig = locationRefSignature(ref);
    if (seen.has(sig)) continue;
    seen.add(sig);
    docRefs.push(ref);
  }
  return docRefs;
}

function mergeMetaDefaults(primary, fallback, sourceTag) {
  if (!primary || !fallback) return primary || fallback || null;
  const out = { ...primary };
  const fields = [
    'unit', 'lo', 'hi', 'decimals',
    'io', 'sigtype', 'sqroot', 'direction',
    'module', 'station', 'addr', 'tagtype', 'src',
    'on', 'off', 'alarms', 'gds', 'sis',
  ];
  let filled = false;
  for (const field of fields) {
    const value = out[field];
    const missing = value == null || value === '' || (Array.isArray(value) && value.length === 0);
    if (missing && fallback[field] != null && fallback[field] !== '') {
      out[field] = fallback[field];
      filled = true;
    }
  }
  if (filled && sourceTag) out.param_source_tag = sourceTag;
  return out;
}

function enrichMeta(tag, meta, tagMeta) {
  if (!meta) return null;
  let out = { ...meta };
  if (isLocalGaugeTag(tag)) {
    delete out.group_key;
    delete out.base;
    return out;
  }
  const candidates = [];
  if (meta.base) candidates.push(meta.base);
  for (const alias of getAliases(tag)) candidates.push(alias);
  for (const candidate of candidates) {
    const key = normMetaKey(candidate);
    if (!key || key === normMetaKey(tag)) continue;
    const fallback = lookupMeta(tagMeta, key);
    if (fallback) out = mergeMetaDefaults(out, fallback, key);
  }
  return out;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS });
    }

    // ── 网页应用 ───────────────────────────────────
    if (path === '/' || path === '') {
      return new Response(WEBAPP_HTML, {
        headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' },
      });
    }

    // ── 图片文件（R2）──────────────────────────────
    if (path.startsWith('/files/')) {
      const decoded = decodeURIComponent(path);
      // 新上传的图：R2 key = "files/{dir}/pageXX.jpg"（带 files/ 前缀）
      const keyWithPrefix = decoded.slice(1);          // "files/400200-DCS/page02.jpg"
      // 旧上传的图：R2 key = "{dir}/pageXX.jpg"（无 files/ 前缀）
      const keyNoPrefix   = decoded.slice(7);          // "400200-DCS/page02.jpg"
      let objectKey = keyWithPrefix;
      let obj = await env.IMAGES.get(objectKey);
      if (!obj) {
        objectKey = keyNoPrefix;
        obj = await env.IMAGES.get(objectKey);
      }
      if (!obj) return err('not found', 404);

      const mime = obj.httpMetadata?.contentType || contentTypeForKey(objectKey);

      return new Response(obj.body, {
        headers: {
          ...CORS,
          'Content-Type': mime,
          'Cache-Control': 'public, max-age=604800', // 7天缓存
          'ETag': obj.httpEtag,
        },
      });
    }

    // ── 版本号 ────────────────────────────────────
    if (path === '/api/version') {
      const version = await env.META.get('version') || '0';
      const updatedAt = await env.META.get('updated_at') || '';
      return json({ version, updated_at: updatedAt });
    }

    // ── 完整索引（App 同步时下载一次）─────────────
    if (path === '/api/manifest') {
      const manifest = await getManifest(env);
      if (!manifest) return json({ tags: {}, docs: {}, version: '0' });
      return json(manifest);
    }

    // ── 搜索 ──────────────────────────────────────
    if (path === '/api/search') {
      const q = (url.searchParams.get('q') || '').toUpperCase().trim();
      const deviceParam = (url.searchParams.get('device') || '').trim();
      const explicitDeviceFilter = /^\d{6}$/.test(deviceParam) ? deviceParam : '';
      const inlineQuery = parseInlineDeviceAndDescQuery(q);
      const deviceFilter = explicitDeviceFilter || inlineQuery.inlineDeviceFilter;
      if (q.length < 2) return json({ results: [], count: 0 });

      const manifest = await getManifest(env);
      if (!manifest) return json({ results: [], count: 0 });

      const allTags = manifest.tags || {};
      const docs = manifest.docs || {};
      // 位号/数字搜索不需要加载巨大的 tag_meta；中文描述搜索才加载。
      // tag_meta 加载失败时降级为位号搜索，避免 Worker 直接返回 503。
      const needsDescSearch = /[^0-9A-Z_-]/.test(q);
      let searchIndex = null;
      let tagMeta = null;
      try {
        searchIndex = await getSearchIndex(env, manifest, manifest.tag_meta || {}, { allowRuntimeFallback: false });
      } catch (e) {
        console.error('getSearchIndex failed; using lightweight fallback', e);
        searchIndex = {
          tags: Object.keys(allTags).filter(t => !isHiddenDeviceTag(t)),
          descEntries: [],
          metaByTag: {},
          tagDevice: new Map(),
          groupSingleLocationRefs: Object.create(null),
        };
      }
      tagMeta = searchIndex.metaByTag || manifest.tag_meta || {};
      if (needsDescSearch && !searchIndex.degraded && (!searchIndex.descEntries?.length || !Object.keys(tagMeta).length)) {
        const loadedTagMeta = await getTagMeta(env);
        tagMeta = loadedTagMeta || tagMeta || {};
        if (!searchIndex.descEntries?.length) {
          searchIndex = await getSearchIndex(env, manifest, tagMeta, { allowRuntimeFallback: false });
        }
      }
      const tags = searchIndex.tags && searchIndex.tags.length
        ? searchIndex.tags
        : Object.keys(allTags).filter(t => !isHiddenDeviceTag(t));
      // 匹配时同时支持 - 和 _
      const qAlt = q.replace(/-/g, '_').replace(/_/g, '-');
      const descNeedle = inlineQuery.descNeedle;
      const qLower = q.toLowerCase();
      const descNeedleLower = descNeedle.toLowerCase();
      const rawMatched = tags.filter(t => t.includes(q) || t.includes(qAlt));

      // 按 canonical 去重：等价位号合并为一条（首选 canonical）
      const byCanon = new Map();
      for (const t of rawMatched) {
        const canon = canonicalize(t);
        const existing = byCanon.get(canon);
        // 优先保留 canonical 形式本身；否则保留第一个
        if (!existing || t === canon) byCanon.set(canon, t);
      }
      const deduped = Array.from(byCanon.values());

      // 描述模糊搜索：在 tag_meta 中查找描述含关键词的位号
      const dedupedCanons = new Set(deduped.map(t => canonicalize(t)));
      const descOnlyTags = [];
      if (needsDescSearch && tagMeta && q.length >= 2) {
        const descQuery = descNeedleLower || qLower;
        for (const [t, descLower] of searchIndex.descEntries || []) {
          if (!descLower.includes(descQuery)) continue;
          const canon = canonicalize(t);
          if (dedupedCanons.has(canon)) continue; // 已在名称匹配中
          if (!allTags[t] && !getAliases(t).some(a => allTags[a])) continue;
          if (!byCanon.has(canon)) {
            byCanon.set(canon, t);
            descOnlyTags.push(t);
          }
        }
      }

      const tagDevice = searchIndex.tagDevice || new Map();
      const getDeviceCode = t => tagDevice.get(t) || tagDevice.get(canonicalize(t)) || '';

      const deviceCounts = {};
      for (const t of [...deduped, ...descOnlyTags]) {
        const code = getDeviceCode(t);
        if (!code) continue;
        deviceCounts[code] = (deviceCounts[code] || 0) + 1;
      }

      const matchesDevice = t => !deviceFilter || getDeviceCode(t) === deviceFilter;
      const filteredNameTags = deduped.filter(matchesDevice);
      const filteredDescTags = descOnlyTags.filter(matchesDevice);

      // 合并：名称匹配优先（最多50条），描述匹配追加（最多300条，超出时返回总量提示）
      const totalDescCount = filteredDescTags.length;   // 当前装置筛选下实际找到的描述匹配总数
      const nameResults = filteredNameTags.slice(0, 50);
      const descResults = filteredDescTags.slice(0, 300);
      const allToProcess = [...nameResults, ...descResults];
      const nameCount = nameResults.length;

      const matched = allToProcess.map((t, idx) => {
          const activeAliases = getAliases(t).filter(a => allTags[a]);
          // 合并显示名：组内所有出现的变体按组顺序合并
          let display_tag = t;
          for (const group of EQUIV_GROUPS) {
            const pattern = new RegExp('^((?:\\d{2})?)(' + group.join('|') + ')([-_].+)$');
            const m = t.match(pattern);
            if (!m) continue;
            const present = group.filter(typ => {
              const v1 = `${m[1]}${typ}${m[3]}`;
              const v2 = `${m[1]}${typ}${m[3].replace(/_/g, '-')}`;
              const v3 = `${m[1]}${typ}${m[3].replace(/-/g, '_')}`;
              return allTags[v1] || allTags[v2] || allTags[v3];
            });
            if (present.length > 1) {
              display_tag = `${m[1]}${present.join('/')}${m[3]}`;
            }
            break;
          }

          // 获取描述（tag 本身 + 别名回退）
          const metaEntry = lookupMeta(tagMeta, t)
            || activeAliases.reduce((found, a) => found || lookupMeta(tagMeta, a), null);

          // 合并所有别名的类型信息，并在安全情况下补单一来源的位置图
          const docRefs = mergeDocRefsWithLocationFallback(t, activeAliases, metaEntry, allTags, searchIndex);
          const types = new Set(docRefs.map(d => d.type));
          if (PRESSURE_GAUGE_VENDOR_PAGES[t]) types.add('vendor');

          const hasLocation = types.has('location');
          const seenRefKeys = new Set();
          const seenRefSubTypes = new Set();
          const refTabNames = [];
          for (const ref of docRefs) {
            if (ref.type !== 'reference') continue;
            const doc = docs[ref.doc_id];
            if (!doc) continue;
            const rawSub = ref.sub_type || doc.sub_type || '参考文档';
            const sub = normalizeSubType(rawSub);
            if (SKIP_SUBTYPES.has(sub)) continue;
            if (shouldHideLocationReferenceTab(t, sub, hasLocation)) continue;
            const dedupKey = `${sub}::${doc.doc_id}`;
            if (seenRefKeys.has(dedupKey)) continue;
            seenRefKeys.add(dedupKey);
            if (!seenRefSubTypes.has(sub)) {
              seenRefSubTypes.add(sub);
              refTabNames.push(sub);
            }
          }
          refTabNames.sort((a, b) => a.localeCompare(b, 'zh-CN'));

          const hasJbxx = types.has('jbxx')
            || !!metaEntry
            || !!(metaEntry && (metaEntry.gds || metaEntry.sis));
          const locationInfo = firstLocationInfo(docRefs, docs);
          const effectiveLocationInfo = locationInfo.location_floor
            ? locationInfo
            : inferLoopLocationInfo(t, allTags, docs, tagMeta, searchIndex);
          const tab_labels = buildVisibleTabLabels({
            has_jbxx: hasJbxx,
            has_location: hasLocation,
            has_gds: types.has('gds'),
            has_datasheet: types.has('datasheet'),
            has_monitoring: types.has('monitoring'),
            has_dcs: types.has('dcs'),
            reference_tabs: refTabNames.map(sub_type => ({ sub_type })),
            has_flowcalc: types.has('flowcalc'),
            has_vendor: types.has('vendor'),
          });

          return {
            tag: t,
            display_tag,
            has_location:   hasLocation,
            has_datasheet:  types.has('datasheet'),
            has_flowcalc:   types.has('flowcalc'),
            has_vendor:     types.has('vendor'),
            has_gds:        types.has('gds'),
            has_jbxx:       hasJbxx,
            has_monitoring: types.has('monitoring'),
            has_dcs:        types.has('dcs'),
            has_reference:  refTabNames.length > 0,
            tab_labels,
            aliases: activeAliases,
            desc_match: idx >= nameCount,
            ...effectiveLocationInfo,
            meta: metaEntry ? { desc: metaEntry.desc || '', unit: metaEntry.unit || '', lo: metaEntry.lo ?? null, hi: metaEntry.hi ?? null } : null,
          };
        });

      return json({
        results: matched,
        count: matched.length,
        total_desc_count: totalDescCount,
        device_counts: deviceCounts,
        device_filter: deviceFilter,
      });
    }

    // ── 位号详情 ──────────────────────────────────
    if (path.startsWith('/api/instrument/')) {
      const tag = decodeURIComponent(path.slice(16)).toUpperCase();
      if (isHiddenDeviceTag(tag)) return err('位号不存在', 404);
      const manifest = await getManifest(env);
      if (!manifest) return err('manifest not loaded', 503);

      const allTags = manifest.tags || {};
      const docs = manifest.docs || {};
      const tagMeta = await getTagMeta(env);

      // 查找 tag_meta（含别名搜索）
      const aliases = getAliases(tag);
      let tagMetaEntry = lookupMeta(tagMeta, tag);
      if (!tagMetaEntry) {
        for (const a of aliases) {
          const am = lookupMeta(tagMeta, a);
          if (am) { tagMetaEntry = am; break; }
        }
      }

      // 合并别名（FE <-> FT）的文档引用
      const searchIndex = await getSearchIndex(env, manifest, tagMeta, { allowRuntimeFallback: false });
      const docRefs = mergeDocRefsWithLocationFallback(tag, aliases, tagMetaEntry, allTags, searchIndex);

      const location_docs = [];
      const seenLocationIndex = new Map();
      const datasheet_docs = [];
      const flowcalc_docs = [];
      const vendor_docs = [];
      const gds_docs = [];
      const jbxx_docs = [];
      const monitoring_docs = [];
      const dcs_docs = [];
      const seenFlowcalcKeys = new Set();
      // reference 按 sub_type 分组：{ '电缆表': [...], '控制系统IO表(DCS)': [...] }
      const ref_tab_map = {};

      // 去重：同一 doc_id 在同一 sub_type 下只出现一次（别名合并可能产生重复）
      const seenRefKeys = new Set();

      for (const ref of docRefs) {
        const doc = docs[ref.doc_id];
        if (!doc) continue;
        const pages = ref.pages || doc.rendered_pages || [];
        const dir = doc.drawing_dir || doc.doc_id;
        // 只有 rendered_pages 明确为空数组 [] 时才不生成 URL（待渲染的监控文档）
        // rendered_pages = null/undefined 是老式 jbxx 文档，仍需生成 URL
        const renderedIsEmpty = Array.isArray(doc.rendered_pages) && doc.rendered_pages.length === 0;
        const pageUrls = renderedIsEmpty
          ? []
          : pages.map(p => `/files/${dir}/page${String(p).padStart(2, '0')}.jpg`);
        const entry = {
          doc_id: doc.doc_id,
          source_pdf: doc.source_pdf || '',
          pages,
          page_urls: pageUrls,
          file_url: doc.file_url || '',
          ext: doc.ext || '',
          bboxes: ref.bboxes || null,
        };

        if (ref.type === 'location') {
          const locationEntry = normalizeLocationInfo({
            doc_id: doc.doc_id,
            drawing_label: doc.drawing_label || '',
            drawing_dir: doc.drawing_dir || '',
            page: ref.pages?.[0] ?? null,
            image_url: `/files/${doc.drawing_dir}/${doc.filename || ''}`,
            x: ref.x ?? null,
            y: ref.y ?? null,
            location_floor: ref.location_floor || doc.location_floor || '',
            location_floor_el: ref.location_floor_el || doc.location_floor_el || '',
            location_floor_name: ref.location_floor_name || doc.location_floor_name || '',
            location_floor_source: ref.location_floor_source || doc.location_floor_source || '',
          }, ref.location_floor_source || doc.location_floor_source || doc.doc_id || '');
          const locationKey = [
            doc.doc_id || '',
            locationEntry.page ?? '',
          ].join('::');
          if (seenLocationIndex.has(locationKey)) {
            const idx = seenLocationIndex.get(locationKey);
            const prev = location_docs[idx];
            const prevPrecise = prev.x != null && prev.y != null;
            const nextPrecise = locationEntry.x != null && locationEntry.y != null;
            if (!prevPrecise && nextPrecise) location_docs[idx] = locationEntry;
            continue;
          }
          seenLocationIndex.set(locationKey, location_docs.length);
          location_docs.push(locationEntry);
        } else if (ref.type === 'datasheet') {
          datasheet_docs.push(entry);
        } else if (ref.type === 'flowcalc') {
          const flowcalcKey = `${doc.doc_id}::${(pages || []).join(',')}`;
          if (seenFlowcalcKeys.has(flowcalcKey)) continue;
          seenFlowcalcKeys.add(flowcalcKey);
          flowcalc_docs.push(entry);
        } else if (ref.type === 'vendor') {
          vendor_docs.push(entry);
        } else if (ref.type === 'gds') {
          gds_docs.push({
            doc_id: doc.doc_id,
            drawing_label: doc.drawing_label || '',
            image_url: ref.image_url
              || (pages[0] ? `/files/${dir}/page${String(pages[0]).padStart(2,'0')}.jpg` : ''),
          });
        } else if (ref.type === 'jbxx') {
          // support per-tag crop image URL (overrides page_urls)
          if (ref.image_url) {
            jbxx_docs.push({ ...entry, page_urls: [ref.image_url] });
          } else {
            jbxx_docs.push(entry);
          }
        } else if (ref.type === 'monitoring') {
          monitoring_docs.push(entry);
        } else if (ref.type === 'dcs') {
          dcs_docs.push({
            ...entry,
            doc_name: doc.doc_id.replace(/^DCS-/, ''),
          });
        } else if (ref.type === 'reference') {
          const rawSub = ref.sub_type || doc.sub_type || '参考文档';
          const sub = normalizeSubType(rawSub);
          // 过滤不应显示的类型（索引、位号目录等）
          if (SKIP_SUBTYPES.has(sub)) continue;
          if (shouldHideLocationReferenceTab(tag, sub, location_docs.length > 0)) continue;
          const dedupKey = `${sub}::${doc.doc_id}`;
          if (seenRefKeys.has(dedupKey)) continue;
          seenRefKeys.add(dedupKey);
          if (!ref_tab_map[sub]) ref_tab_map[sub] = [];
          ref_tab_map[sub].push(entry);
        }
      }

      if (!vendor_docs.some(d => d.doc_id === PRESSURE_GAUGE_VENDOR_DOC_ID)) {
        const vendorPage = PRESSURE_GAUGE_VENDOR_PAGES[tag];
        if (vendorPage) {
          vendor_docs.push({
            doc_id: PRESSURE_GAUGE_VENDOR_DOC_ID,
            source_pdf: '压力表技术附件(3.29）-北京布莱迪.xlsx',
            pages: [vendorPage],
            page_urls: [`/files/${PRESSURE_GAUGE_VENDOR_DOC_ID}/page${String(vendorPage).padStart(2, '0')}.jpg`],
          });
        }
      }

      // 将 sub_type 分组转为有序数组（中文排序）
      const reference_tabs = Object.entries(ref_tab_map)
        .sort((a, b) => a[0].localeCompare(b[0], 'zh-CN'))
        .map(([sub_type, docs]) => ({ sub_type, docs }));

      // ── 同仪表关联信号（从 tag_meta 实时计算，不需额外 KV 加载）──────
      const groupKey = isLocalGaugeTag(tag)
        ? null
        : ((tagMetaEntry && tagMetaEntry.group_key) || computeGroupKey(tag));
      const groupData = computeGroupSignals(groupKey, tagMeta);
      const enrichedMeta = enrichMeta(tag, tagMetaEntry, tagMeta);
      const locationInfo = firstLocationInfo(docRefs, docs);
      const effectiveLocationInfo = locationInfo.location_floor
        ? locationInfo
        : inferLoopLocationInfo(tag, allTags, docs, tagMeta, searchIndex);
      if (enrichedMeta && effectiveLocationInfo.location_floor) {
        enrichedMeta.location_floor = effectiveLocationInfo.location_floor;
        enrichedMeta.location_floor_source = effectiveLocationInfo.location_floor_source;
      }

      return json({
        tag,
        meta: enrichedMeta || null,
        ...effectiveLocationInfo,
        aliases: aliases.filter(a => allTags[a]),
        group_key: groupKey || null,
        group_signals: groupData ? groupData.signals : null,
        group_base_desc: groupData ? groupData.base_desc : null,
        group_base_unit: groupData ? groupData.base_unit : null,
        location_docs,
        datasheet_docs,
        flowcalc_docs,
        vendor_docs,
        gds_docs,
        jbxx_docs,
        monitoring_docs,
        dcs_docs,
        reference_tabs,
        has_location:    location_docs.length > 0,
        has_datasheet:   datasheet_docs.length > 0,
        has_flowcalc:    flowcalc_docs.length > 0,
        has_vendor:      vendor_docs.length > 0,
        has_gds:         gds_docs.length > 0,
        has_jbxx:        jbxx_docs.length > 0 || !!tagMetaEntry || !!(groupData && groupData.signals && groupData.signals.length >= 2),
        has_monitoring:  monitoring_docs.length > 0,
        has_dcs:         dcs_docs.length > 0,
        has_reference:   reference_tabs.length > 0,
        has_gds_point:   !!(tagMetaEntry && tagMetaEntry.gds),
        has_sis:         !!(tagMetaEntry && tagMetaEntry.sis),
      });
    }

    // ── 位号列表（预计算，直接返回 KV 原始 JSON）──────
    if (path === '/api/tag-list') {
      const manifest = await getManifest(env);
      return json(await getTagList(env, manifest));
    }

    // ── 管理：登录 ─────────────────────────────────
    if (path === '/api/admin/login' && request.method === 'POST') {
      const body = await request.json().catch(() => ({}));
      if (!body.password || body.password !== env.ADMIN_TOKEN) {
        return err('密码错误', 401);
      }
      return json({ ok: true, token: env.ADMIN_TOKEN });
    }

    // 鉴权助手
    const requireAuth = () => {
      const token = request.headers.get('Authorization');
      return token === `Bearer ${env.ADMIN_TOKEN}`;
    };

    // ── 管理：更新版本（上传脚本调用）────────────
    if (path === '/api/admin/version' && request.method === 'POST') {
      if (!requireAuth()) return err('unauthorized', 401);
      const body = await request.json();
      await env.META.put('version', String(body.version));
      await env.META.put('updated_at', new Date().toISOString());
      _loopTailIndexCache = null;
      _loopTailIndexCacheVersion = '';
      return json({ ok: true });
    }

    // ── 管理：上传整份 manifest ────────────────────
    if (path === '/api/admin/manifest' && request.method === 'POST') {
      if (!requireAuth()) return err('unauthorized', 401);
      const body = await request.json();
      await env.META.put('manifest', JSON.stringify(body));
      _manifestCache = null;
      _manifestCacheTs = 0;
      _manifestCacheVersion = '';
      _tagListCache = null;
      _tagListCacheTs = 0;
      _searchIndexCache = null;
      _searchIndexCacheTs = 0;
      _loopTailIndexCache = null;
      _loopTailIndexCacheVersion = '';
      return json({ ok: true, tags: Object.keys(body.tags || {}).length });
    }

    // ── 管理：位号 CRUD ────────────────────────────
    // 读-改-写 manifest。无锁，单用户场景下够用。
    async function loadManifest() {
      return (await env.META.get('manifest', 'json')) || { tags: {}, docs: {}, version: '0' };
    }
    async function saveManifest(m) {
      m.version = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 12);
      m.generated_at = new Date().toISOString();
      await env.META.put('manifest', JSON.stringify(m));
      await env.META.put('version', m.version);
      await env.META.put('updated_at', new Date().toISOString());
      // 清空模块级缓存，确保下次请求读取最新数据
      _manifestCache = null;
      _manifestCacheTs = 0;
      _manifestCacheVersion = '';
      _tagListCache = null;
      _tagListCacheTs = 0;
      _searchIndexCache = null;
      _searchIndexCacheTs = 0;
      _loopTailIndexCache = null;
      _loopTailIndexCacheVersion = '';
      return m.version;
    }

    // 合并：把 from 的所有 refs 搬到 into，删除 from
    if (path === '/api/admin/tag/merge' && request.method === 'POST') {
      if (!requireAuth()) return err('unauthorized', 401);
      const { from, into } = await request.json();
      if (!from || !into) return err('missing from/into');
      const m = await loadManifest();
      if (!m.tags[from]) return err(`位号不存在: ${from}`, 404);
      m.tags[into] = [...(m.tags[into] || []), ...m.tags[from]];
      delete m.tags[from];
      const version = await saveManifest(m);
      return json({ ok: true, version });
    }

    // 删除位号（仅从 tags 表移除，不删 docs）
    if (path === '/api/admin/tag/delete' && request.method === 'POST') {
      if (!requireAuth()) return err('unauthorized', 401);
      const { tag } = await request.json();
      if (!tag) return err('missing tag');
      const m = await loadManifest();
      if (!m.tags[tag]) return err('位号不存在', 404);
      delete m.tags[tag];
      const version = await saveManifest(m);
      return json({ ok: true, version });
    }

    // 更新位号的 refs（整体替换）
    if (path === '/api/admin/tag/update' && request.method === 'POST') {
      if (!requireAuth()) return err('unauthorized', 401);
      const { tag, refs } = await request.json();
      if (!tag || !Array.isArray(refs)) return err('missing tag/refs');
      const m = await loadManifest();
      m.tags[tag] = refs;
      const version = await saveManifest(m);
      return json({ ok: true, version });
    }

    // 查询位号的原始 refs（管理员编辑用）
    if (path === '/api/admin/tag/info' && request.method === 'GET') {
      if (!requireAuth()) return err('unauthorized', 401);
      const tag = url.searchParams.get('tag');
      if (!tag) return err('missing tag');
      const m = await loadManifest();
      const refs = m.tags[tag] || [];
      return json({ tag, refs });
    }

    // 上传/替换图片（二进制 body；路径从 ?path= 读取，必须以 /files/ 开头）
    if (path === '/api/admin/image/upload' && request.method === 'POST') {
      if (!requireAuth()) return err('unauthorized', 401);
      const imgPath = url.searchParams.get('path') || '';
      if (!imgPath.startsWith('/files/')) return err('path 必须以 /files/ 开头');
      const key = imgPath.replace(/^\/files\//, '');
      const ct = request.headers.get('Content-Type') || 'image/jpeg';
      const buf = await request.arrayBuffer();
      if (!buf || buf.byteLength === 0) return err('空文件');
      if (buf.byteLength > 20 * 1024 * 1024) return err('文件过大（>20MB）');
      await env.IMAGES.put(key, buf, { httpMetadata: { contentType: ct } });
      // 同时 bump 版本号让客户端刷新
      const m = await loadManifest();
      const version = await saveManifest(m);
      return json({ ok: true, path: imgPath, size: buf.byteLength, version });
    }

    // 向位号添加一条 ref（新建栏目）
    if (path === '/api/admin/tag/add-ref' && request.method === 'POST') {
      if (!requireAuth()) return err('unauthorized', 401);
      const { tag, ref } = await request.json();
      if (!tag || !ref || !ref.type || !ref.doc_id) return err('missing tag/ref.type/ref.doc_id');
      const m = await loadManifest();
      if (!m.tags[tag]) m.tags[tag] = [];
      m.tags[tag].push(ref);
      const version = await saveManifest(m);
      return json({ ok: true, version });
    }

    // 新建文档（docs 表）——提供 doc_id + drawing_dir / source_pdf 等
    if (path === '/api/admin/doc/create' && request.method === 'POST') {
      if (!requireAuth()) return err('unauthorized', 401);
      const { doc_id, doc } = await request.json();
      if (!doc_id || !doc) return err('missing doc_id/doc');
      const m = await loadManifest();
      m.docs = m.docs || {};
      m.docs[doc_id] = { doc_id, ...doc };
      const version = await saveManifest(m);
      return json({ ok: true, version });
    }

    // 新建位号
    if (path === '/api/admin/tag/create' && request.method === 'POST') {
      if (!requireAuth()) return err('unauthorized', 401);
      const { tag, refs } = await request.json();
      if (!tag) return err('missing tag');
      const m = await loadManifest();
      if (m.tags[tag]) return err('位号已存在', 409);
      m.tags[tag] = refs || [];
      const version = await saveManifest(m);
      return json({ ok: true, version });
    }

    // ── 说明书目录 ─────────────────────────────
    if (path === '/api/manuals') {
      const manifest = await getManifest(env);
      if (!manifest) return json({ folders: {} });
      const folders = JSON.parse(JSON.stringify(manifest.manuals || {}));
      const dcsFolder = folders['DCS系统密码（ 6月5日更新）'];
      if (Array.isArray(dcsFolder)) {
        for (const item of dcsFolder) {
          if (item && item.name === 'DCS系统密码（ 6月5日更新）.docx' && !(item.page_urls && item.page_urls.length)) {
            item.pages = 3;
            item.preview_pdf_url = '/files/manuals_preview/DCS系统密码（ 6月5日更新）/DCS系统密码（ 6月5日更新）.pdf';
            item.source_pdf = 'DCS系统密码（ 6月5日更新）.pdf';
            item.page_urls = [
              '/files/manuals_preview/DCS系统密码（ 6月5日更新）/page01.jpg',
              '/files/manuals_preview/DCS系统密码（ 6月5日更新）/page02.jpg',
              '/files/manuals_preview/DCS系统密码（ 6月5日更新）/page03.jpg',
            ];
          }
        }
      }
      return json({ folders });
    }

    return err('not found', 404);
  },
};
