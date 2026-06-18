// Web app HTML — served at GET /
export const WEBAPP_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#1565c0">
<link rel="icon" type="image/png" href="data:image/png;base64,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">
<meta name="application-name" content="新都化工合成氨仪表查询系统">
<meta name="description" content="新都化工合成氨装置仪表位置图、数据表、计算书及厂商资料查询系统">
<title>新都化工合成氨仪表查询系统</title>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --safe-top:env(safe-area-inset-top,0px);
  --safe-right:env(safe-area-inset-right,0px);
  --safe-bottom:env(safe-area-inset-bottom,0px);
  --safe-left:env(safe-area-inset-left,0px);
  --app-bar-h:56px;
}
html{height:100%}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;background:#f0f2f5;min-height:100dvh;overscroll-behavior:none;overflow-x:hidden;-webkit-text-size-adjust:100%;text-size-adjust:100%;padding-bottom:var(--safe-bottom)}
body.ui-lock{overflow:hidden}

/* ── App bar ─────────────────────────────── */
.app-bar{background:#1565c0;color:#fff;min-height:var(--app-bar-h);padding:var(--safe-top) calc(16px + var(--safe-right)) 0 calc(16px + var(--safe-left));display:flex;align-items:center;position:sticky;top:0;z-index:100;box-shadow:0 2px 8px rgba(0,0,0,.3)}
.app-title{font-size:17px;font-weight:600;flex:1}
.app-bar .menu-btn,.app-bar .admin-btn{background:none;border:none;color:#fff;cursor:pointer;padding:10px;border-radius:8px;font-size:14px;min-width:40px;min-height:40px}
.app-bar .menu-btn:hover,.app-bar .admin-btn:hover{background:rgba(255,255,255,.15)}
.admin-indicator{font-size:12px;background:#ff9800;color:#fff;padding:2px 8px;border-radius:10px;margin-left:8px;display:none}
.admin-indicator.on{display:inline-block}

/* ── Main layout: sidebar + content ───────── */
.main-wrap{display:flex;min-height:calc(100dvh - var(--app-bar-h) - var(--safe-top))}
.sidebar{width:280px;background:#fafafa;border-right:1px solid #e0e0e0;overflow-y:auto;max-height:calc(100dvh - var(--app-bar-h) - var(--safe-top));position:sticky;top:calc(var(--app-bar-h) + var(--safe-top));flex-shrink:0;padding-bottom:var(--safe-bottom)}
.sidebar-header{padding:12px 14px;font-size:13px;font-weight:600;color:#424242;border-bottom:1px solid #e8e8e8;background:#fff;position:sticky;top:0;z-index:2}
.station-group{border-bottom:1px solid #eee}
.station-hdr{padding:12px 14px;font-size:13px;font-weight:600;color:#1565c0;cursor:pointer;display:flex;justify-content:space-between;align-items:center;user-select:none;background:#fff;gap:10px;min-height:46px}
.station-hdr:hover{background:#f5f5f5}
.station-hdr .caret{transition:transform .15s}
.station-hdr.open .caret{transform:rotate(90deg)}
.station-tags{display:none;padding:4px 0;max-height:400px;overflow-y:auto}
.station-hdr.open+.station-tags{display:block}
.station-tag{padding:10px 14px 10px 24px;font-family:monospace;font-size:12px;color:#424242;cursor:pointer;border-left:3px solid transparent;min-height:40px;display:flex;align-items:center}
.station-tag:hover{background:#e3f2fd;border-left-color:#1565c0}
.station-filter{padding:8px 12px;background:#fff;border-bottom:1px solid #f0f0f0}
.station-filter select{width:100%;border:1px solid #d7d7d7;border-radius:8px;background:#fff;color:#333;font-size:12px;padding:10px 10px;outline:none;min-height:40px}
.station-filter select:focus{border-color:#1565c0}
/* ── Sidebar tabs ────────────────────────── */
.sidebar-tabs{display:flex;border-bottom:2px solid #e0e0e0;background:#fff;position:sticky;top:0;z-index:2}
.sb-tab{flex:1;padding:12px 4px;border:none;border-bottom:2px solid transparent;background:none;cursor:pointer;font-size:13px;font-weight:600;color:#757575;margin-bottom:-2px;min-height:44px}
.sb-tab.active{color:#1565c0;border-bottom-color:#1565c0}
.sb-tab:hover:not(.active){background:#f5f5f5}
.content-wrap{flex:1;min-width:0;display:flex;flex-direction:column;min-height:calc(100dvh - var(--app-bar-h) - var(--safe-top))}
@media (max-width:900px){
  .sidebar{position:fixed;top:calc(var(--app-bar-h) + var(--safe-top));left:0;bottom:0;z-index:90;transform:translateX(-100%);transition:transform .25s;box-shadow:2px 0 8px rgba(0,0,0,.15);max-height:none}
  .sidebar.open{transform:translateX(0)}
  .sidebar-mask{position:fixed;inset:calc(var(--app-bar-h) + var(--safe-top)) 0 0 0;background:rgba(0,0,0,.4);z-index:89;display:none}
  .sidebar-mask.show{display:block}
}
@media (min-width:901px){.menu-btn{display:none}.sidebar-mask{display:none!important}}

@media (max-width:700px){
  :root{--app-bar-h:52px}
  .app-bar{padding:var(--safe-top) calc(10px + var(--safe-right)) 0 calc(10px + var(--safe-left))}
  .app-title{font-size:15px;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .main-wrap,.content-wrap,.detail-content,.detail-inner{min-width:0}
  .sidebar{width:min(86vw,340px)}
  .search-section{padding:10px;background:#f0f2f5;position:sticky;top:calc(var(--app-bar-h) + var(--safe-top));z-index:60}
  .search-wrap{padding:0 10px;border-radius:9px}
  .search-input{padding:12px 8px;font-size:16px}
  .clear-btn{min-width:36px;min-height:36px}
  .results-count{padding:8px 12px}
  .results-toolbar{display:flex;flex-direction:column;align-items:stretch;gap:8px}
  .results-toolbar>span{display:block;min-width:0;line-height:1.5}
  .result-filter-wrap{justify-content:space-between;width:100%}
  .result-filter-label{flex-shrink:0}
  .result-device-filter{min-width:0;flex:1}
  .result-item{padding:10px 12px;display:flex;flex-direction:column;align-items:stretch;gap:8px}
  .result-main{width:100%}
  .tag-text{font-size:14px;line-height:1.35;white-space:normal;word-break:break-word}
  .tag-meta-line{font-size:12px;line-height:1.45;-webkit-line-clamp:3}
  .badges{width:100%;justify-content:flex-start;align-self:stretch;align-content:flex-start;margin-top:0}
  .badge{font-size:10px;max-width:100%;white-space:normal;word-break:break-word;text-align:left}
  .admin-actions{margin-left:0;flex-wrap:wrap}
  .detail-topbar{padding:calc(6px + var(--safe-top)) calc(6px + var(--safe-right)) 6px calc(10px + var(--safe-left));gap:6px}
  .detail-tag-txt{font-size:14px}
  .detail-tag-sub{font-size:10px;white-space:normal;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
  .tab-item{padding:12px 14px;font-size:13px;min-height:44px}
  .detail-content{padding:12px 12px calc(16px + var(--safe-bottom))}
  .meta-table td{padding:8px 10px;font-size:12px}
  .meta-table td:first-child{width:76px}
  .doc-hdr{padding:9px 10px}
  .doc-hdr .title{font-size:12px;line-height:1.4;word-break:break-word}
  .doc-hdr .meta{font-size:10px}
  .viewer-bar{padding:calc(8px + var(--safe-top)) calc(12px + var(--safe-right)) 8px calc(12px + var(--safe-left))}
  .viewer-body{padding:4px 4px calc(8px + var(--safe-bottom))}
  .status-box{padding:40px 16px}
}

/* ── Admin controls on result items ────── */
.admin-actions{display:inline-flex;gap:6px;margin-left:8px}
.ad-btn.danger{color:#d32f2f;border-color:#ffcdd2}
.ad-btn{background:#fff;border:1px solid #ccc;color:#555;padding:3px 9px;font-size:11px;border-radius:4px;cursor:pointer}
.ad-btn:hover{background:#1565c0;color:#fff;border-color:#1565c0}
.ad-btn.danger:hover{background:#d32f2f;border-color:#d32f2f}

/* ── Modal ────────────────────────────────── */
.modal{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:400;display:none;align-items:center;justify-content:center}
.modal.show{display:flex}
.modal-box{background:#fff;border-radius:10px;padding:20px;width:90%;max-width:400px;box-shadow:0 6px 32px rgba(0,0,0,.25)}
.modal-box h3{font-size:16px;margin-bottom:12px;color:#1565c0}
.modal-box label{display:block;font-size:13px;color:#555;margin-top:10px;margin-bottom:4px}
.modal-box input[type=text],.modal-box input[type=password]{width:100%;padding:8px 10px;border:1px solid #ccc;border-radius:6px;font-size:14px;font-family:monospace}
.modal-box input:focus{outline:none;border-color:#1565c0}
.modal-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:16px}
.modal-actions button{padding:8px 16px;border-radius:6px;border:none;cursor:pointer;font-size:13px}
.btn-primary{background:#1565c0;color:#fff}
.btn-primary:hover{background:#0d47a1}
.btn-cancel{background:#eee;color:#555}
.modal-err{color:#d32f2f;font-size:12px;margin-top:8px;min-height:16px}

/* ── Search box ──────────────────────────── */
.search-section{background:#fff;padding:12px;border-bottom:1px solid #e0e0e0;z-index:5}
.search-wrap{display:flex;align-items:center;background:#f5f5f5;border-radius:10px;padding:0 12px;border:1.5px solid transparent;transition:border-color .2s,background .2s}
.search-wrap:focus-within{border-color:#1565c0;background:#fff}
.search-wrap svg{flex-shrink:0;color:#9e9e9e}
.search-input{flex:1;border:none;background:transparent;padding:11px 8px;font-size:15px;outline:none;color:#212121;min-width:0}
.search-input::placeholder{color:#bdbdbd}
.clear-btn{background:none;border:none;color:#9e9e9e;cursor:pointer;font-size:18px;padding:4px;line-height:1;display:none;flex-shrink:0;border-radius:999px}

/* ── Results list ────────────────────────── */
.results-count{padding:8px 16px;font-size:12px;color:#757575}
.results-toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px;background:#f5f6f8;border-bottom:.5px solid #e5e5e5}
.result-filter-wrap{display:flex;align-items:center;gap:6px;flex-shrink:0}
.result-filter-label{font-size:12px;color:#616161}
.result-device-filter{border:1px solid #d7d7d7;border-radius:8px;background:#fff;color:#333;font-size:12px;padding:8px 10px;outline:none;min-width:118px;min-height:38px}
.result-device-filter:focus{border-color:#1565c0}
.result-item{background:#fff;padding:10px 16px;border-bottom:.5px solid #ebebeb;display:flex;align-items:flex-start;gap:10px;cursor:pointer;-webkit-tap-highlight-color:transparent;transition:background .1s}
.result-item:active{background:#e3f2fd}
.result-main{flex:1;min-width:0}
.tag-text{font-family:'SF Mono','Fira Code','Roboto Mono',monospace;font-weight:700;font-size:13.5px;color:#212121;letter-spacing:.5px;display:block}
.tag-meta-line{font-size:11.5px;color:#616161;margin-top:2px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
.tag-meta-range{color:#1565c0;font-weight:500}
.tag-floor{display:inline-block;margin-left:8px;padding:1px 7px;border-radius:10px;background:#ffebee;color:#c62828;font-size:11px;font-weight:700;vertical-align:middle}
.top-floor{margin-left:10px;color:#ffcdd2;font-size:12px;font-weight:700}
.badges{display:flex;gap:4px;flex-wrap:wrap;justify-content:flex-start;align-items:flex-start;margin-top:6px}
.badge{font-size:10px;padding:2px 7px;border-radius:20px;font-weight:600;line-height:1.4;white-space:nowrap}
.b-loc{background:#e3f2fd;color:#1565c0}
.b-ds{background:#ede7f6;color:#512da8}
.b-fc{background:#e8f5e9;color:#2e7d32}
.b-vd{background:#fff3e0;color:#e65100}
.b-gds{background:#fce4ec;color:#c62828}
.b-mon{background:#f3e5f5;color:#6a1b9a}
.b-dcs{background:#e3f2fd;color:#1565c0}
.b-ref{background:#e8f5e9;color:#2e7d32}
.b-jbxx{background:#e0f7fa;color:#00838f}
.b-desc{background:#f5f5f5;color:#757575;font-style:italic}

/* ── Status / spinner ────────────────────── */
.status-box{text-align:center;padding:60px 16px;color:#9e9e9e}
.status-icon{font-size:48px;display:block;margin-bottom:12px}
.status-box p{font-size:14px}
.spinner{width:32px;height:32px;border:3px solid #e0e0e0;border-top-color:#1565c0;border-radius:50%;animation:spin .7s linear infinite;margin:0 auto 12px}
@keyframes spin{to{transform:rotate(360deg)}}

/* ── Overlay ─────────────────────────────── */
.overlay{position:fixed;inset:0;background:rgba(0,0,0,0);z-index:200;display:none;transition:background .25s}
.overlay.show{background:rgba(0,0,0,.5)}

/* ── Detail panel (bottom sheet / side panel) */
.detail-panel{position:fixed;inset:0;background:#fff;z-index:201;display:flex;flex-direction:column;transform:translateY(100%);transition:transform .3s cubic-bezier(.34,1.3,.64,1);overflow:hidden;height:100dvh}
.detail-panel.show{transform:translateY(0)}
.detail-topbar{background:#1565c0;color:#fff;min-height:52px;padding:6px calc(8px + var(--safe-right)) 6px calc(16px + var(--safe-left));display:flex;align-items:center;gap:8px;flex-shrink:0}
.detail-tag-info{flex:1;min-width:0}
.detail-tag-txt{font-family:monospace;font-weight:700;font-size:15px;letter-spacing:.5px;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.detail-tag-sub{font-size:11px;color:rgba(255,255,255,.85);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:none}
.detail-tag-sub.show{display:block}
.icon-btn{background:none;border:none;color:#fff;font-size:20px;cursor:pointer;padding:10px;line-height:1;border-radius:50%;transition:background .15s;flex-shrink:0;min-width:40px;min-height:40px}
.icon-btn:active{background:rgba(255,255,255,.2)}

/* ── Tabs ────────────────────────────────── */
.tabs-row{display:flex;overflow-x:auto;border-bottom:1px solid #e0e0e0;flex-shrink:0;scrollbar-width:none;-webkit-overflow-scrolling:touch;scroll-snap-type:x proximity;position:sticky;top:0;background:#fff;z-index:3}
.tabs-row::-webkit-scrollbar{display:none}
.tab-item{padding:12px 18px;font-size:14px;cursor:pointer;white-space:nowrap;color:#757575;border-bottom:3px solid transparent;transition:color .15s,border-color .15s;user-select:none;-webkit-tap-highlight-color:transparent;scroll-snap-align:start}
.tab-item.active{color:#1565c0;border-bottom-color:#1565c0;font-weight:600}

/* ── Detail content ──────────────────────── */
.detail-content{flex:1;overflow-y:auto;padding:16px 16px calc(20px + var(--safe-bottom));overscroll-behavior-y:contain;-webkit-overflow-scrolling:touch}
.detail-inner{max-width:900px;margin:0 auto}

/* ── 基本信息元数据卡片 ───────────────────── */
.meta-card{background:#fff;border:1px solid #e8e8e8;border-radius:12px;margin-bottom:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.06)}
.meta-card-hdr{background:#e3f2fd;padding:10px 14px;font-size:13px;font-weight:600;color:#1565c0;border-bottom:1px solid #bbdefb}
.meta-table{width:100%;border-collapse:collapse}
.meta-table tr:not(:last-child) td{border-bottom:1px solid #f5f5f5}
.meta-table td{padding:9px 14px;font-size:13px;vertical-align:top}
.meta-table td:first-child{color:#757575;width:88px;white-space:nowrap}
.meta-table td:last-child{color:#212121;word-break:break-all}
.meta-range{color:#1565c0;font-weight:600}
.meta-source{color:#757575;font-size:12px}
.meta-io-badge{display:inline-block;padding:1px 7px;border-radius:10px;font-size:11px;font-weight:700;background:#e3f2fd;color:#1565c0}
.meta-io-badge.ao{background:#ede7f6;color:#512da8}
.meta-io-badge.di{background:#e8f5e9;color:#2e7d32}
.alarm-hdr{font-size:12px;color:#888;padding:10px 14px 4px!important;border-top:1px solid #eee;font-weight:600;letter-spacing:.5px}
.alarm-en{display:inline-block;padding:0 5px;border-radius:8px;font-size:11px;font-weight:700;background:#ffebee;color:#c62828;margin-right:2px}
.alarm-dis{display:inline-block;padding:0 5px;border-radius:8px;font-size:11px;background:#f5f5f5;color:#9e9e9e;margin-right:2px}
.alarm-lv{display:inline-block;padding:0 4px;border-radius:6px;font-size:11px;background:#fff8e1;color:#e65100;margin-right:4px}
.meta-io-badge.do{background:#fff3e0;color:#e65100}

/* ── 关联信号卡片 ────────────────────────── */
.sig-card{background:#fff;border:1px solid #e8e8e8;border-radius:12px;margin-bottom:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.06)}
.sig-card-hdr{background:#e8f5e9;padding:10px 14px;font-size:13px;font-weight:600;color:#2e7d32;border-bottom:1px solid #c8e6c9;display:flex;justify-content:space-between;align-items:center}
.sig-card-gk{font-family:monospace;font-size:11px;color:#388e3c;font-weight:400;opacity:.8}
.sig-base{padding:8px 14px 4px;font-size:13px;color:#424242;border-bottom:1px solid #f5f5f5}
.sig-base .sig-desc{font-weight:500}
.sig-base .sig-unit{color:#888;font-size:12px;margin-left:6px}
.sig-list{padding:4px 0}
.sig-row{display:flex;align-items:center;gap:8px;padding:6px 14px;cursor:pointer;transition:background .1s;border-left:3px solid transparent}
.sig-row:hover{background:#f1f8e9;border-left-color:#4caf50}
.sig-row.current{background:#e8f5e9;border-left-color:#2e7d32}
/* 信号类型徽章：{系统}-{信号方向} 或 {系统} */
.sig-badge{display:inline-block;padding:1px 6px;border-radius:8px;font-size:10px;font-weight:700;white-space:nowrap;flex-shrink:0;letter-spacing:.3px}
/* DCS 信号 */
.sb-DCS-AI{background:#e3f2fd;color:#1565c0}      /* 模拟输入 */
.sb-DCS-AO{background:#ede7f6;color:#4527a0}      /* 模拟输出 */
.sb-DCS-DI{background:#e8f5e9;color:#2e7d32}      /* 数字输入 */
.sb-DCS-DO{background:#fff3e0;color:#e65100}      /* 数字输出 */
.sb-DCS{background:#f5f5f5;color:#616161}         /* DCS软件功能块 */
/* SIS 安全仪表系统 */
.sb-SIS-AI{background:#ffebee;color:#b71c1c}
.sb-SIS-DI{background:#ffcdd2;color:#b71c1c}
.sb-SIS-DO{background:#ffccbc;color:#bf360c}
.sb-SIS{background:#fce4ec;color:#880e4f}
/* GDS 气体检测系统 */
.sb-GDS-AI{background:#fce4ec;color:#c62828}
.sb-GDS-DI{background:#f8bbd0;color:#c62828}
.sb-GDS{background:#fce4ec;color:#ad1457}
/* CCS 压缩机控制系统 */
.sb-CCS-AI{background:#e0f7fa;color:#006064}
.sb-CCS-DI{background:#b2ebf2;color:#006064}
.sb-CCS-DO{background:#b2dfdb;color:#004d40}
.sb-CCS{background:#e0f2f1;color:#00695c}
.sig-tag{font-family:monospace;font-size:12px;font-weight:600;color:#212121;flex-shrink:0;min-width:120px}
.sig-fn{font-size:12px;color:#616161;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.sig-range{font-size:11px;color:#1565c0;flex-shrink:0;white-space:nowrap}
.sig-cur-mark{font-size:10px;background:#2e7d32;color:#fff;padding:1px 5px;border-radius:8px;flex-shrink:0}

/* ── Doc cards ───────────────────────────── */
.doc-card{background:#fff;border:1px solid #e8e8e8;border-radius:12px;margin-bottom:12px;overflow:visible;box-shadow:0 1px 4px rgba(0,0,0,.06)}
.doc-hdr{padding:10px 14px;border-bottom:1px solid #f5f5f5}
.doc-hdr .title{font-size:13px;font-weight:600;color:#1a1a1a;word-break:break-all}
.doc-hdr .meta{font-size:11px;color:#9e9e9e;margin-top:3px}
.wiring-hdr{display:flex;align-items:center;gap:10px}
.wiring-badge{display:inline-flex;align-items:center;justify-content:center;min-width:42px;padding:3px 8px;border-radius:4px;color:#fff;font-size:12px;font-weight:800;letter-spacing:.3px;flex-shrink:0}
.wiring-badge.dcs{background:#1565c0}
.wiring-badge.sis{background:#c62828}
.wiring-badge.ccs{background:#00695c}
.wiring-badge.gds{background:#ad1457}
.wiring-doc .doc-hdr .title{font-size:14px;color:#0d47a1}
.doc-imgs{padding:8px;display:flex;flex-direction:column;gap:8px;overflow:visible}
.gds-img-wrap{position:relative;display:block;line-height:0}
.gds-img-wrap img{width:100%;height:auto;display:block}
.gds-bbox{position:absolute;border:3px solid #dc1e1e;border-radius:3px;pointer-events:none;box-shadow:0 0 0 1px rgba(220,30,30,.3)}
.doc-img{width:100%;height:auto;border-radius:6px;cursor:zoom-in;display:block;background:#f5f5f5;min-height:40px;transition:opacity .2s}
.doc-img[data-loaded]{background:none}
.doc-overlay{position:relative;display:block;width:100%;overflow:hidden;border-radius:6px;background:#eee;cursor:zoom-in;line-height:0}
.doc-overlay img{width:100%;height:auto;display:block}
.doc-box{position:absolute;border:3px solid #e53935;border-radius:4px;pointer-events:none;box-shadow:0 0 0 1px rgba(229,57,53,.28)}

/* ── 位置图 v2：整页图 + CSS 红圈覆盖层 ─── */
.loc-viewer{position:relative;display:block;width:100%;overflow:hidden;border-radius:6px;background:#eee;cursor:zoom-in;touch-action:pinch-zoom}
.loc-full-img{width:100%;height:auto;display:block}
/* 红圈标记：left/top 百分比对应归一化坐标
   尺寸用图片宽度百分比 → 随图片缩放而缩放，和图纸上的序号圈大小一致 */
.loc-marker{position:absolute;width:2.2%;transform:translate(-50%,-50%);pointer-events:none}
.marker-ring{width:100%;aspect-ratio:1;border:1.2px solid #e53935;border-radius:50%}
.marker-label{position:absolute;top:100%;left:50%;transform:translateX(-50%);margin-top:1px;font-size:6px;font-weight:700;color:#e53935;white-space:nowrap;background:transparent;font-family:monospace;letter-spacing:.1px}
/* 余热发电 IN40：红圈与红字更醒目 */
.loc-marker.loc-marker-emph{width:3.4%}
.loc-marker.loc-marker-emph .marker-ring{border-width:2.4px}
.loc-marker.loc-marker-emph .marker-label{margin-top:2px;font-size:10px;font-weight:900;letter-spacing:.2px;text-shadow:0 0 1px rgba(255,255,255,.95),0 0 2px rgba(255,255,255,.95)}

/* ── Full-screen image viewer ────────────── */
.viewer{position:fixed;inset:0;background:#111;z-index:300;display:none;flex-direction:column;height:100dvh}
.viewer.open{display:flex}
.viewer-bar{padding:8px calc(12px + var(--safe-right)) 8px calc(12px + var(--safe-left));background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:space-between;flex-shrink:0}
.viewer-bar .icon-btn{font-size:24px}
.viewer-hint{font-size:12px;color:rgba(255,255,255,.5)}
.viewer-body{flex:1;overflow:auto;display:flex;align-items:flex-start;justify-content:center;overscroll-behavior:contain;padding:4px 4px calc(8px + var(--safe-bottom));-webkit-overflow-scrolling:touch}
/* v2：全屏时用 viewer-inner 包裹 img+红圈，统一缩放 */
.viewer-inner{position:relative;display:inline-block;width:100%;transform-origin:top left}
.viewer-inner img{width:100%;display:block;user-select:none}
/* v1 fallback：简单大图缩放 */
.viewer-img{max-width:100%;touch-action:pinch-zoom;cursor:zoom-in;user-select:none;display:block;transition:width .2s}
.viewer-img.zoomed{max-width:none;width:220%;cursor:zoom-out}
</style>
</head>
<body>

<div class="app-bar">
  <img src="data:image/png;base64,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" style="height:36px;margin-right:10px;vertical-align:middle;border-radius:4px;" alt="logo"><button class="menu-btn" id="menuBtn" onclick="toggleSidebar()" title="目录">☰</button><span class="app-title">新都化工合成氨仪表查询系统</span><span style="flex:1"></span><span class="admin-indicator" id="adminIndicator" style="display:none">管理员</span><button class="admin-btn" id="adminBtn" onclick="adminClick()" title="管理员">⚙</button>
</div>

<div class="main-wrap">
<aside class="sidebar" id="sidebar">
  <div class="sidebar-tabs">
    <button class="sb-tab active" id="sbTabTag" onclick="switchSbTab('tag')">位号目录</button>
    <button class="sb-tab" id="sbTabManual" onclick="switchSbTab('manual')">说明书</button>
  </div>
  <div id="sbTagBody">
    <div style="padding:6px 14px;background:#fff;border-bottom:1px solid #f0f0f0;min-height:32px">
      <button class="ad-btn" id="sbNewTagBtn" onclick="showCreate()" style="display:none">+ 新建位号</button>
    </div>
    <div class="station-filter">
      <select id="stationFilter" onchange="setStationFilter(this.value)" aria-label="装置号筛选">
        <option value="">全部装置</option>
      </select>
    </div>
    <div class="sidebar-body" id="sidebarBody"><div class="status-box"><div class="spinner"></div></div></div>
  </div>
  <div id="sbManualBody" style="display:none">
    <div class="sidebar-body" id="manualSidebarBody"><div class="status-box"><div class="spinner"></div></div></div>
  </div>
</aside>
<div class="sidebar-mask" id="sidebarMask" onclick="toggleSidebar()"></div>
<div class="content-wrap">

<div class="search-section">
  <div class="search-wrap">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
    <input class="search-input" id="q" type="search" placeholder="输入位号搜索，如 04HV-01004"
      autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">
    <button class="clear-btn" id="clearBtn" onclick="clearQ()">✕</button>
  </div>
</div>

<div id="results">
  <div class="status-box"><span class="status-icon">🔎</span><p>输入位号开始搜索</p></div>
</div>

</div><!-- /content-wrap -->
</div><!-- /main-wrap -->

<div class="modal" id="loginModal">
  <div class="modal-box">
    <h3>管理员登录</h3>
    <input type="password" id="loginToken" placeholder="管理员令牌" style="width:100%;padding:10px;border:1px solid #ccc;border-radius:6px;margin:10px 0;box-sizing:border-box">
    <div class="modal-err" id="loginErr"></div>
    <div class="modal-actions">
      <button class="btn-cancel" onclick="closeModal('loginModal')">取消</button>
      <button class="btn-primary" onclick="doLogin()">登录</button>
    </div>
  </div>
</div>

<div class="modal" id="mergeModal">
  <div class="modal-box">
    <h3>合并位号</h3>
    <p>将位号 <b id="mergeFrom"></b> 合并到：</p>
    <input type="text" id="mergeTo" placeholder="目标位号，如 04PT-03006" style="width:100%;padding:10px;border:1px solid #ccc;border-radius:6px;margin:10px 0;box-sizing:border-box">
    <div class="modal-err" id="mergeErr"></div>
    <div class="modal-actions">
      <button class="btn-cancel" onclick="closeModal('mergeModal')">取消</button>
      <button class="btn-primary" onclick="doMerge()">合并</button>
    </div>
  </div>
</div>

<div class="modal" id="addRefModal">
  <div class="modal-box">
    <h3>新增资料（栏目）</h3>
    <p style="font-size:13px;color:#666;margin-bottom:8px">位号：<b id="addRefTag"></b></p>
    <label>资料类型</label>
    <select id="addRefType" style="width:100%;padding:8px;border:1px solid #ccc;border-radius:6px">
      <option value="location">位置图</option>
      <option value="datasheet">数据表</option>
      <option value="flowcalc">计算书</option>
      <option value="vendor">厂商资料</option>
      <option value="gds">气体报警</option>
      <option value="jbxx">基本信息</option>
    </select>
    <label>doc_id（资料标识，可随意）</label>
    <input type="text" id="addRefDocId" placeholder="如 JBXX-04TE-09999" style="width:100%;padding:8px;border:1px solid #ccc;border-radius:6px">
    <label>页码（选填，逗号分隔，如 1,2,3）</label>
    <input type="text" id="addRefPages" style="width:100%;padding:8px;border:1px solid #ccc;border-radius:6px">
    <label>上传图片（可多选/多次）</label>
    <input type="file" id="addRefFiles" multiple accept="image/*" style="width:100%;padding:6px 0">
    <div class="modal-err" id="addRefErr"></div>
    <div class="modal-actions">
      <button class="btn-cancel" onclick="closeModal('addRefModal')">取消</button>
      <button class="btn-primary" onclick="doAddRef()">保存</button>
    </div>
  </div>
</div>

<div class="modal" id="replaceImgModal">
  <div class="modal-box">
    <h3>替换图片</h3>
    <p style="font-size:12px;color:#666;word-break:break-all">路径：<span id="replaceImgPath"></span></p>
    <input type="file" id="replaceImgFile" accept="image/*" style="width:100%;padding:6px 0;margin-top:8px">
    <div class="modal-err" id="replaceImgErr"></div>
    <div class="modal-actions">
      <button class="btn-cancel" onclick="closeModal('replaceImgModal')">取消</button>
      <button class="btn-primary" onclick="doReplaceImg()">上传替换</button>
    </div>
  </div>
</div>

<div class="modal" id="createModal">
  <div class="modal-box">
    <h3>新建位号</h3>
    <input type="text" id="createTag" placeholder="位号，如 04PT-09999" style="width:100%;padding:10px;border:1px solid #ccc;border-radius:6px;margin:10px 0;box-sizing:border-box">
    <div class="modal-err" id="createErr"></div>
    <div class="modal-actions">
      <button class="btn-cancel" onclick="closeModal('createModal')">取消</button>
      <button class="btn-primary" onclick="doCreate()">创建</button>
    </div>
  </div>
</div>

<div class="detail-panel" id="panel">
  <div class="detail-topbar">
    <button class="icon-btn" onclick="closeDetail()" title="返回" style="font-size:22px;">&#8592;</button>
    <div class="detail-tag-info">
      <span class="detail-tag-txt" id="panelTag"></span>
      <span class="detail-tag-sub" id="panelTagSub"></span>
    </div>
    <button class="icon-btn" id="editBtn" onclick="toggleEdit()" title="编辑" style="display:none">✎</button>
    <button class="icon-btn" onclick="closeDetail()" title="关闭">✕</button>
  </div>
  <div class="edit-bar" id="editBar" style="display:none;padding:10px 14px;background:#fff8e1;border-bottom:1px solid #ffe082;font-size:13px">
    <div style="margin-bottom:8px;color:#e65100"><b>编辑模式 v4</b> — 替换图片 / 删除 / 新增栏目</div>
    <div id="editRefs"></div>
  </div>
  <div class="tabs-row" id="tabsRow"></div>
  <div class="detail-content" id="panelBody">
    <div class="status-box"><div class="spinner"></div><p>加载中…</p></div>
  </div>
</div>

<div class="viewer" id="viewer">
  <div class="viewer-bar">
    <button class="icon-btn" onclick="closeViewer()">✕</button>
    <span class="viewer-hint">双指缩放 / 双击复位</span>
  </div>
  <div class="viewer-body" id="viewerBody">
    <!-- v2：整页图 + 红圈，由 JS 控制缩放 -->
    <div class="viewer-inner" id="viewerInner" style="display:none">
      <img id="viewerInnerImg" src="" alt="">
    </div>
    <!-- v1：简单裁剪图 fallback -->
    <img class="viewer-img" id="viewerImg" src="" alt="" style="display:none" onclick="toggleZoom(this)">
  </div>
</div>

<script>
(function(){
'use strict';

var T=null, detail=null, tabs=[], tab=0, panelTagName='', _searchDeviceFilter='', _searchDeviceCounts=[], _searchSeq=0;

/* helpers */
function $$(id){return document.getElementById(id)}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function spin(){return '<div class="status-box"><div class="spinner"></div><p>加载中…</p></div>'}
function empty(){return '<div class="status-box"><span class="status-icon">📭</span><p>暂无数据</p></div>'}
function isMobileLayout(){return window.innerWidth<=900}
function syncBodyLock(){
  var locked=($$('sidebar')&&$$('sidebar').classList.contains('open'))
    || ($$('panel')&&$$('panel').classList.contains('show'))
    || ($$('viewer')&&$$('viewer').classList.contains('open'));
  document.body.classList.toggle('ui-lock', !!locked && isMobileLayout());
}
function closeSidebarUI(){
  $$('sidebar').classList.remove('open');
  $$('sidebarMask').classList.remove('show');
  syncBodyLock();
}
function closeDetailUI(){
  $$('panel').classList.remove('show');
  syncBodyLock();
}

/* ── Search ──────────────────────────────── */
$$('q').addEventListener('input',function(e){
  var q=e.target.value.trim();
  _searchDeviceFilter='';
  $$('clearBtn').style.display=q?'block':'none';
  clearTimeout(T);
  if(q.length<2){$$('results').innerHTML='<div class="status-box"><span class="status-icon">🔎</span><p>输入至少2个字符</p></div>';return}
  $$('results').innerHTML=spin();
  T=setTimeout(function(){doSearch(q)},300);
});
$$('q').addEventListener('focus',function(){
  if(isMobileLayout() && $$('sidebar').classList.contains('open'))closeSidebarUI();
});

function clearQ(){
  $$('q').value='';
  _searchDeviceFilter='';
  _searchDeviceCounts=[];
  $$('clearBtn').style.display='none';
  $$('results').innerHTML='<div class="status-box"><span class="status-icon">🔎</span><p>输入位号开始搜索</p></div>';
  $$('q').focus();
}
window.clearQ=clearQ;

function fetchSearchJson(url, retried){
  return fetch(url+(retried?(url.indexOf('?')>=0?'&':'?')+'_ts='+Date.now():''), { cache:'no-store' })
    .then(function(r){
      if(!r.ok)throw new Error('search http '+r.status);
      return r.json();
    })
    .catch(function(e){
      if(!retried){
        console.warn('search retry after failure', e);
        return fetchSearchJson(url, true);
      }
      throw e;
    });
}

function doSearch(q){
  var seq=++_searchSeq;
  var url='/api/search?q='+encodeURIComponent(q);
  if(_searchDeviceFilter)url+='&device='+encodeURIComponent(_searchDeviceFilter);
  fetchSearchJson(url, false)
    .then(function(d){
      if(seq!==_searchSeq)return;
      _searchDeviceCounts=d.device_counts||{};
      try{
        renderList(d.results||[],d.total_desc_count||0);
      }catch(e){
        console.error('search render failed', e, d);
        try{
          renderListSafeFallback(d && d.results);
        }catch(e2){
          console.error('search fallback render failed', e2, d);
          renderListMinimal(d && d.results);
        }
      }
    })
    .catch(function(e){
      if(seq!==_searchSeq)return;
      console.error('search failed', e);
      $$('results').innerHTML='<div class="status-box" style="color:#c62828"><span class="status-icon">⚠️</span><p>搜索失败，请重试</p><p style="font-size:12px;color:#777">'+esc(e&&e.message?e.message:e)+'</p></div>';
    });
}

function badge(has,cls,lbl){return has?'<span class="badge '+cls+'">'+lbl+'</span>':''}

function badgeClassForLabel(lbl){
  if(lbl==='基本') return 'b-jbxx';
  if(lbl==='位置') return 'b-loc';
  if(lbl==='数据表') return 'b-ds';
  if(lbl==='监控') return 'b-mon';
  if(lbl==='DCS程序') return 'b-dcs';
  if(lbl==='计算书') return 'b-fc';
  if(lbl==='厂商') return 'b-vd';
  if(lbl==='气体报警') return 'b-gds';
  if(/^(DCS|SIS|CCS|GDS)接线图$/.test(String(lbl||''))) return 'b-ref';
  return 'b-ref';
}

function renderResultBadges(r){
  var labels=Array.isArray(r&&r.tab_labels)?r.tab_labels.slice():[];
  var seen=new Set();
  var html=badge(r.desc_match,'b-desc','描述匹配');
  for(var i=0;i<labels.length;i++){
    var lbl=labels[i]==null?'':String(labels[i]).trim();
    if(!lbl||seen.has(lbl))continue;
    seen.add(lbl);
    html+='<span class="badge '+badgeClassForLabel(lbl)+'">'+esc(lbl)+'</span>';
  }
  return html;
}

function renderListSafeFallback(list){
  list=Array.isArray(list)?list:[];
  var html='<div class="results-count">共 '+list.length+' 条结果</div>';
  if(!list.length){
    $$('results').innerHTML=html+'<div class="status-box"><span class="status-icon">🔎</span><p>未找到匹配位号</p></div>';
    return;
  }
  for(var i=0;i<list.length;i++){
    var r=list[i]||{};
    var tag=String(r.display_tag||r.tag||'').trim();
    if(!tag)continue;
    html+='<div class="result-item" data-tag="'+esc(String(r.tag||tag))+'">'
      +'<div class="result-main">'
      +'<span class="tag-text">'+esc(tag)+'</span>'
      +fmtMetaLine(r.meta)
      +'<span class="badges">'+renderResultBadges(r)+'</span>'
      +'</div></div>';
  }
  $$('results').innerHTML=html;
}

function renderListMinimal(list){
  list=Array.isArray(list)?list:[];
  var html='<div class="results-count">共 '+list.length+' 条结果</div>';
  if(!list.length){
    $$('results').innerHTML=html+'<div class="status-box"><span class="status-icon">🔎</span><p>未找到匹配位号</p></div>';
    return;
  }
  for(var i=0;i<list.length;i++){
    var r=list[i]||{};
    var rawTag=String(r.tag||r.display_tag||'').trim();
    var tag=String(r.display_tag||rawTag).trim();
    if(!rawTag&&!tag)continue;
    html+='<div class="result-item" data-tag="'+esc(rawTag||tag)+'"><div class="result-main"><span class="tag-text">'+esc(tag)+'</span>'+fmtFloorBadge(r)+'</div></div>';
  }
  $$('results').innerHTML=html;
}

/** 将 tag_meta 对象格式化为搜索列表小字行 */
function fmtMetaLine(meta){
  if(!meta)return '';
  var parts=[];
  if(meta.desc)parts.push(esc(meta.desc));
  var range='';
  if(meta.lo!=null&&meta.hi!=null){
    range=esc(String(meta.lo))+'~'+esc(String(meta.hi))+(meta.unit?' '+esc(meta.unit):'');
  }else if(meta.unit){
    range=esc(meta.unit);
  }
  if(range)parts.push('<span class="tag-meta-range">'+range+'</span>');
  return parts.length?'<div class="tag-meta-line">'+parts.join(' · ')+'</div>':'';
}

function fmtFloorBadge(item){
  var floor=item&&item.location_floor;
  return floor?'<span class="tag-floor">'+esc(floor)+'</span>':'';
}

function renderSearchDeviceFilter(){
  var counts=_searchDeviceCounts||{};
  var dirKeys=Array.isArray(_tagGroupKeys)?_tagGroupKeys:[];
  var known={};
  var keys=[];
  for(var i=0;i<dirKeys.length;i++){
    var dk=dirKeys[i];
    if(counts[dk]){
      keys.push(dk);
      known[dk]=1;
    }
  }
  Object.keys(counts).sort(function(a,b){return a.localeCompare(b)}).forEach(function(k){
    if(!known[k])keys.push(k);
  });
  if(keys.length<2)return '';
  var html='<span class="result-filter-wrap"><span class="result-filter-label">装置</span>'
    +'<select class="result-device-filter" onchange="setSearchDeviceFilter(this.value)" aria-label="搜索结果装置筛选">'
    +'<option value="">全部</option>';
  for(var i=0;i<keys.length;i++){
    var k=keys[i];
    html+='<option value="'+esc(k)+'"'+(_searchDeviceFilter===k?' selected':'')+'>'
      +esc(stationLabel(k))+' · '+counts[k]+'</option>';
  }
  html+='</select></span>';
  return html;
}
window.setSearchDeviceFilter=function(v){
  _searchDeviceFilter=v||'';
  var q=$$('q').value.trim();
  if(q.length>=2){
    $$('results').innerHTML=spin();
    doSearch(q);
  }
};

function renderList(list,totalDescCount){
  list=Array.isArray(list)?list.filter(function(r){return r&&typeof r==='object'}):[];
  var filterHtml=renderSearchDeviceFilter();
  if(!list.length){
    $$('results').innerHTML=(filterHtml?'<div class="results-count results-toolbar"><span>未找到匹配位号</span>'+filterHtml+'</div>':'')
      +'<div class="status-box"><span class="status-icon">🤷</span><p>未找到匹配位号</p></div>';
    return;
  }
  var isAdm=isAdmin();
  var displayedDesc=list.filter(function(r){return r.desc_match}).length;
  var extraDesc=(totalDescCount||0)-displayedDesc;
  var countText='共 '+list.length+' 条结果';
  if(extraDesc>0)countText+='，另有 <strong>'+extraDesc+'</strong> 条描述匹配未显示，请细化关键词';
  var html='<div class="results-count results-toolbar"><span>'+countText
    +(isAdm?' <button class="ad-btn" style="margin-left:10px" onclick="showCreate()">+ 新建位号</button>':'')
    +'</span>'+filterHtml+'</div>';
  for(var i=0;i<list.length;i++){
    var r=list[i]||{};
    var rawTag=String(r.tag||'').trim();
    if(!rawTag)continue;
    html+='<div class="result-item" data-tag="'+esc(rawTag)+'">'
      +'<div class="result-main">'
        +'<span class="tag-text">'+esc(String(r.display_tag||rawTag))+'</span>'
        +fmtFloorBadge(r)
        +fmtMetaLine(r.meta)
        +'<span class="badges">'+renderResultBadges(r)+'</span>'
      +'</div>'
      +(isAdm?'<span class="admin-actions"><button class="ad-btn" style="background:#1565c0;color:#fff;border-color:#1565c0" onclick="event.stopPropagation();openAndEdit(&quot;'+esc(rawTag)+'&quot;)">✎ 编辑</button><button class="ad-btn" onclick="event.stopPropagation();showMerge(&quot;'+esc(rawTag)+'&quot;)">合并</button><button class="ad-btn danger" onclick="event.stopPropagation();doDelete(&quot;'+esc(rawTag)+'&quot;)">删除</button></span>':'')
      +'</div>';
  }
  $$('results').innerHTML=html;
}

/* ── Detail panel ────────────────────────── */
/** 用 meta 数据更新标题栏副行 */
function updateTopbarMeta(meta, info){
  var sub=$$('panelTagSub');
  if(!sub)return;
  info=info||{};
  if(!meta&&!info.location_floor){sub.textContent='';sub.classList.remove('show');return}
  var parts=[];
  if(meta&&meta.desc)parts.push(meta.desc);
  if(meta&&meta.lo!=null&&meta.hi!=null){
    parts.push(meta.lo+'~'+meta.hi+(meta.unit?' '+meta.unit:''));
  }else if(meta&&meta.unit){
    parts.push(meta.unit);
  }
  if(info.location_floor)parts.push('位置图楼层 '+info.location_floor);
  if(parts.length){sub.textContent=parts.join('  ');sub.classList.add('show');}
  else{sub.textContent='';sub.classList.remove('show');}
}

window.openDetail=function(tag){
  panelTagName=tag;
  $$('panelTag').textContent=tag;
  updateTopbarMeta(null);
  $$('tabsRow').innerHTML='';
  $$('panelBody').innerHTML=spin();
  $$('editBar').style.display='none';
  $$('editBtn').style.display=(typeof isAdmin==='function'&&isAdmin())?'inline-block':'none';
  // 推入历史记录，使手机浏览器"返回"手势关闭面板而非退出页面
  history.pushState({panel:tag},'');
  requestAnimationFrame(function(){
    $$('panel').classList.add('show');
    if(isMobileLayout())closeSidebarUI();
    syncBodyLock();
  });
  fetch('/api/instrument/'+encodeURIComponent(tag))
    .then(function(r){return r.json()})
    .then(function(d){detail=d;updateTopbarMeta(d.meta,d);buildTabs()})
    .catch(function(){$$('panelBody').innerHTML='<div class="status-box" style="color:#c62828"><span class="status-icon">⚠️</span><p>加载失败</p></div>'});
};

function isWiringSubType(subType){
  return /^(DCS|SIS|CCS|GDS)接线图$/.test(String(subType||''));
}
function wiringSystem(subType){
  var m=String(subType||'').match(/^(DCS|SIS|CCS|GDS)/);
  return m?m[1]:'';
}
function getWiringRefTabs(d){
  return (d.reference_tabs||[]).filter(function(rt){return isWiringSubType(rt.sub_type)});
}

function buildTabs(){
  tabs=[];
  if(detail.has_jbxx||detail.meta||getWiringRefTabs(detail).length) tabs.push({key:'jbxx', label:'基本信息'});
  if(detail.has_location)   tabs.push({key:'location',   label:'位置图'});
  if(detail.has_gds)        tabs.push({key:'gds',        label:'气体报警分布图'});
  if(detail.has_datasheet)  tabs.push({key:'datasheet',  label:'数据表'});
  if(detail.has_monitoring) tabs.push({key:'monitoring', label:'监控数据表'});
  if(detail.has_dcs)        tabs.push({key:'dcs',        label:'DCS底层程序'});
  // 参考文档：每个 sub_type 单独一个 tab
  (detail.reference_tabs||[]).forEach(function(rt){
    if(isWiringSubType(rt.sub_type))return;
    tabs.push({key:'ref:'+rt.sub_type, label:rt.sub_type, ref_docs:rt.docs});
  });
  if(detail.has_flowcalc)   tabs.push({key:'flowcalc',   label:'计算书'});
  if(detail.has_vendor)     tabs.push({key:'vendor',     label:'厂商资料'});
  // GDS/SIS 已整合进基本信息Tab，无需单独Tab
  tab=0;
  $$('tabsRow').innerHTML=tabs.map(function(t,i){
    return '<div class="tab-item'+(i===0?' active':'')+'" onclick="selTab('+i+')">'+t.label+'</div>';
  }).join('');
  renderTab(0);
}

window.selTab=function(i){
  tab=i;
  document.querySelectorAll('.tab-item').forEach(function(el,idx){el.classList.toggle('active',idx===i)});
  renderTab(i);
};

var IMG_VER='20260513wiring2';
function bust(url){return url+(url.indexOf('?')<0?'?v=':'&v=')+IMG_VER}
function imgTag(url){
  var safeUrl=esc(bust(url));
  return '<img class="doc-img" src="'+safeUrl+'" loading="lazy" data-viewer="'+safeUrl+'" onload="this.dataset.loaded=1">';
}

function renderWiringCards(d){
  var groups=getWiringRefTabs(d);
  if(!groups.length)return '';
  var html='';
  groups.forEach(function(rt){
    var sys=wiringSystem(rt.sub_type);
    var cls=sys.toLowerCase();
    (rt.docs||[]).forEach(function(doc){
      var imgs=(doc.page_urls||[]).map(imgTag).join('');
      if(!imgs&&doc.pages&&doc.pages.length){
        imgs='<div style="padding:16px;color:#666;font-size:13px;background:#f5f5f5;border-radius:6px;text-align:center">'
          +'暂无预览图，请查看原始文档第 '+doc.pages.join('、')+' 页'
          +'</div>';
      }
      html+='<div class="doc-card wiring-doc">'
        +'<div class="doc-hdr wiring-hdr"><span class="wiring-badge '+esc(cls)+'">'+esc(sys||rt.sub_type)+'</span>'
        +'<div><div class="title">'+esc(rt.sub_type)+' — '+esc(doc.source_pdf||doc.doc_id)+'</div>'
        +'<div class="meta">第 '+(doc.pages||[]).join('、')+' 页</div></div></div>'
        +'<div class="doc-imgs">'+imgs+'</div></div>';
    });
  });
  return html;
}

function boxesForPage(doc, page){
  var raw=(doc&&doc.bboxes&&(doc.bboxes[String(page)]||doc.bboxes[page]))||[];
  if(!Array.isArray(raw))return [];
  var out=[];
  for(var i=0;i<raw.length;i++){
    var it=raw[i];
    if(Array.isArray(it)&&it.length>=4){
      if(it[2]>1||it[3]>1)continue;
      out.push({x1:+it[0],y1:+it[1],x2:+it[2],y2:+it[3],kind:'row'});
    }else if(it&&typeof it==='object'){
      var x1=+it.x1,y1=+it.y1,x2=+it.x2,y2=+it.y2;
      if(isNaN(x1)||isNaN(y1)||isNaN(x2)||isNaN(y2))continue;
      out.push({x1:x1,y1:y1,x2:x2,y2:y2,kind:it.kind||'row',label:it.label||''});
    }
  }
  return out;
}

function _boxPad(b,px,py){
  // 向外扩大 bbox：px/py 为归一化单位的单边 padding（各边独立扩，避免超出 0-1 范围）
  return {x1:Math.max(0,b.x1-px),y1:Math.max(0,b.y1-py),
          x2:Math.min(1,b.x2+px),y2:Math.min(1,b.y2+py),kind:b.kind,label:b.label||''};
}
function docOverlayTag(url, boxes){
  var safeUrl=esc(bust(url));
  var payload=encodeURIComponent(JSON.stringify(boxes||[]));
  var overlays='';
  for(var i=0;i<(boxes||[]).length;i++){
    var b=_boxPad(boxes[i],0.005,0.006);
    overlays+='<div class="doc-box" style="left:'+(b.x1*100)+'%;top:'+(b.y1*100)+'%;width:'+((b.x2-b.x1)*100)+'%;height:'+((b.y2-b.y1)*100)+'%"></div>';
  }
  return '<div class="doc-overlay" data-doc-url="'+safeUrl+'" data-doc-boxes="'+payload+'">'
    +'<img class="doc-full-img" src="'+safeUrl+'" loading="lazy" alt="">'
    +overlays
    +'</div>';
}

function renderDocImages(doc){
  var urls=doc.page_urls||[];
  var pages=doc.pages||[];
  if(urls.length){
    var html='';
    for(var i=0;i<urls.length;i++){
      var page=pages[i]||pages[0]||(i+1);
      var boxes=boxesForPage(doc,page);
      html+=boxes.length?docOverlayTag(urls[i],boxes):imgTag(urls[i]);
    }
    if(doc&&doc.file_url){
      html+='<div style="padding:12px 0 4px;text-align:center">'
        +'<a class="ad-btn" style="display:inline-block;text-decoration:none" href="'+esc(doc.file_url)+'" target="_blank" rel="noopener">打开原文件</a>'
        +'</div>';
    }
    return html;
  }
  if(doc&&doc.file_url){
    var fileUrl=esc(doc.file_url);
    var ext=String(doc.ext||doc.file_url||'').toLowerCase();
    if(/\\.pdf(?:$|\\?)/.test(ext)){
      return '<iframe src="'+fileUrl+'" style="width:100%;height:calc(100dvh - 190px);min-height:420px;border:0;background:#fff;border-radius:6px"></iframe>';
    }
    return '<div style="padding:16px;color:#666;font-size:13px;background:#f5f5f5;border-radius:6px;text-align:center">'
      +'<p>'+esc(doc.source_pdf||doc.doc_id||'原文件')+'</p>'
      +'<p style="margin-top:12px"><a class="ad-btn" style="display:inline-block;text-decoration:none" href="'+fileUrl+'" target="_blank" rel="noopener">打开原文件</a></p>'
      +'</div>';
  }
  return '';
}

/**
 * 构建 v2 位置图卡片（整页图 + CSS 红圈覆盖层）
 * doc.x / doc.y 为归一化坐标（0-1），doc.image_url 为整页图地址
 */
function locViewerTag(doc){
  var url=esc(bust(doc.image_url));
  var x=doc.x, y=doc.y;
  var label=esc(doc.drawing_label||doc.drawing_dir||'');
  var markerClass=((doc.drawing_dir||'').indexOf('290000_21216-290000-IN40')===0)?' loc-marker-emph':'';
  // data-loc-* 供点击全屏时读取坐标
  return '<div class="loc-viewer" data-loc-url="'+url+'" data-loc-x="'+x+'" data-loc-y="'+y+'" data-loc-marker-class="'+markerClass.trim()+'">'
    +'<img class="loc-full-img" src="'+url+'" loading="lazy" onload="this.dataset.loaded=1" alt="'+label+'">'
    +'<div class="loc-marker'+markerClass+'" style="left:'+(x*100)+'%;top:'+(y*100)+'%">'
    +'<div class="marker-ring"></div>'
    +'<span class="marker-label">'+esc(panelTagName)+'</span>'
    +'</div></div>';
}

// 报警名称（与 build_tag_meta.py 中 AI_ALARM_COLS 顺序一致）
var ALARM_NAMES=['高三限','高高限','高限','低限','低低限','低三限'];

/** 渲染基本信息元数据卡片 HTML */
function renderMetaCard(meta){
  if(!meta)return '';
  var io=esc((meta.io||'').toLowerCase());
  var ioText=esc(meta.io||'');
  var ioBadge='<span class="meta-io-badge '+io+'">'+ioText+'</span>';
  var rows='';

  // ── 基本参数 ──────────────────────────────────
  if(meta.location_floor)rows+='<tr><td>位置图楼层</td><td><span class="tag-floor" style="margin-left:0">'+esc(meta.location_floor)+'</span></td></tr>';
  if(meta.desc)rows+='<tr><td>描述</td><td>'+esc(meta.desc)+'</td></tr>';
  if(meta.unit)rows+='<tr><td>量纲</td><td>'+esc(meta.unit)+'</td></tr>';
  if(meta.lo!=null&&meta.hi!=null){
    rows+='<tr><td>量程范围</td><td><span class="meta-range">'+esc(String(meta.lo))+' ~ '+esc(String(meta.hi))+'</span>'+(meta.unit?' '+esc(meta.unit):'')+'</td></tr>';
  }
  if(meta.decimals!=null)rows+='<tr><td>小数位数</td><td>'+esc(String(meta.decimals))+'</td></tr>';

  // ── 开关量状态（DI/DO）───────────────────────
  if(meta.on)rows+='<tr><td>ON 状态</td><td>'+esc(meta.on)+'</td></tr>';
  if(meta.off)rows+='<tr><td>OFF 状态</td><td>'+esc(meta.off)+'</td></tr>';

  // ── 硬件信息 ──────────────────────────────────
  if(meta.io)rows+='<tr><td>IO类型</td><td>'+ioBadge+'</td></tr>';
  if(meta.sigtype)rows+='<tr><td>信号类型</td><td>'+esc(meta.sigtype)+'</td></tr>';
  if(meta.sqroot)rows+='<tr><td>线性开方</td><td>'+esc(meta.sqroot)+'</td></tr>';
  if(meta.direction)rows+='<tr><td>正/反输出</td><td>'+esc(meta.direction)+'</td></tr>';
  if(meta.module)rows+='<tr><td>模块型号</td><td>'+esc(meta.module)+'</td></tr>';
  if(meta.station)rows+='<tr><td>控制站</td><td>'+esc(meta.station)+'</td></tr>';
  if(meta.addr)rows+='<tr><td>机柜地址</td><td>'+esc(meta.addr)+'</td></tr>';
  if(meta.tagtype)rows+='<tr><td>位号类型</td><td>'+esc(meta.tagtype)+'</td></tr>';
  if(meta.src)rows+='<tr><td>来源装置</td><td>'+esc(meta.src)+'</td></tr>';
  if(meta.param_source_tag)rows+='<tr><td>参数来源</td><td><span class="meta-source">点表/数据表同组位号 '+esc(meta.param_source_tag)+'</span></td></tr>';

  // ── 报警设定值（AI 专有）──────────────────────
  if(meta.alarms&&meta.alarms.length){
    var alarmRows='';
    for(var ai=0;ai<meta.alarms.length;ai++){
      var triple=meta.alarms[ai];
      var en=triple[0], lv=triple[1], val=triple[2];
      if(val==null)continue;
      var name=ALARM_NAMES[ai]||('报警'+ai);
      var enTag=en
        ?'<span class="alarm-en">启用</span>'
        :'<span class="alarm-dis">禁止</span>';
      var lvTag=lv?'<span class="alarm-lv">'+esc(lv)+'</span>':'';
      var unit=meta.unit?' '+esc(meta.unit):'';
      alarmRows+='<tr><td>'+esc(name)+'</td><td>'
        +enTag+lvTag+' <span class="meta-range">'+esc(String(val))+'</span>'+unit
        +'</td></tr>';
    }
    if(alarmRows){
      rows+='<tr><td colspan="2" class="alarm-hdr">报警设定值</td></tr>'+alarmRows;
    }
  }

  if(!rows)return '';
  return '<div class="meta-card">'
    +'<div class="meta-card-hdr">点表信息</div>'
    +'<table class="meta-table"><tbody>'+rows+'</tbody></table>'
    +'</div>';
}

/** 渲染同仪表关联信号卡片 */
function renderSignalGroup(d){
  var sigs=d.group_signals;
  if(!sigs||sigs.length<2)return '';
  var curTag=d.tag;
  var gk=d.group_key||'';
  var baseDesc=d.group_base_desc||'';
  var baseUnit=d.group_base_unit||'';

  var html='<div class="sig-card">'
    +'<div class="sig-card-hdr">关联信号'
    +'<span class="sig-card-gk">'+esc(gk)+'</span>'
    +'</div>';

  if(baseDesc){
    html+='<div class="sig-base"><span class="sig-desc">'+esc(baseDesc)+'</span>'
      +(baseUnit?'<span class="sig-unit">'+esc(baseUnit)+'</span>':'')
      +'</div>';
  }

  html+='<div class="sig-list">';
  for(var i=0;i<sigs.length;i++){
    var s=sigs[i];
    var isCur=(s.tag===curTag);
    // sig_type: 'DCS-AI', 'SIS-DI', 'DCS', 'GDS-AI' 等
    var st=(s.sig_type||s.io||'DCS').toUpperCase();
    var cls='sb-'+st.replace(/[^A-Z0-9]/g,'-');  // 'DCS-AI' → 'sb-DCS-AI'
    var rangeStr='';
    if(s.lo!=null&&s.hi!=null){
      rangeStr=esc(String(s.lo))+'~'+esc(String(s.hi))+(s.unit?' '+esc(s.unit):'');
    }
    html+='<div class="sig-row'+(isCur?' current':'')+'" onclick="openDetail(&quot;'+esc(s.tag)+'&quot;)">'
      +'<span class="sig-badge '+cls+'">'+esc(st)+'</span>'
      +'<span class="sig-tag">'+esc(s.tag)+'</span>'
      +'<span class="sig-fn">'+esc(s.func_cn||'')+'</span>'
      +(rangeStr?'<span class="sig-range">'+rangeStr+'</span>':'')
      +(isCur?'<span class="sig-cur-mark">当前</span>':'')
      +'</div>';
  }
  html+='</div></div>';
  return html;
}

function renderTab(i){
  var t=tabs[i], d=detail, html='';
  if(t.key==='location'){
    var docs=d.location_docs||[];
    if(!docs.length){$$('panelBody').innerHTML=empty();return}
    for(var j=0;j<docs.length;j++){
      var doc=docs[j];
      var isV2=(doc.x!=null && doc.y!=null);
      var floor=doc.location_floor?'<span class="tag-floor" style="margin-left:0">'+esc(doc.location_floor)+'</span>':'';
      html+='<div class="doc-card">'
        +'<div class="doc-hdr"><div class="title">'+esc(doc.drawing_label||doc.drawing_dir||'')+(floor?' '+floor:'')+'</div>'
        +(doc.page!=null&&!isV2?'<div class="meta">第 '+doc.page+' 页</div>':'')
        +'</div><div class="doc-imgs">'
        +(isV2 ? locViewerTag(doc) : imgTag(doc.image_url))
        +'</div></div>';
    }
  } else if(t.key==='gds'){
    var docs=d.gds_docs||[];
    if(!docs.length){$$('panelBody').innerHTML=empty();return}
    for(var j=0;j<docs.length;j++){
      var doc=docs[j];
      html+='<div class="doc-card">'
        +'<div class="doc-hdr"><div class="title">气体报警分布图 — '+esc(doc.drawing_label||doc.doc_id)+'</div></div>'
        +'<div class="doc-imgs">'+imgTag(doc.image_url)+'</div></div>';
    }
  } else if(t.key==='jbxx'){
    // 基本信息 Tab：关联信号卡 → 元数据卡 → GDS卡 → SIS卡 → 文档截图
    html+=renderSignalGroup(d);
    html+=renderMetaCard(d.meta);
    // GDS 气体报警信息卡
    var gds=d.meta&&d.meta.gds;
    if(gds&&Object.keys(gds).length){
      html+='<div class="meta-card"><div class="meta-card-hdr">GDS 气体报警信息</div><table class="meta-table">';
      if(gds.desc)html+='<tr><td>描述</td><td>'+esc(gds.desc)+'</td></tr>';
      if(gds.unit)html+='<tr><td>单位</td><td>'+esc(gds.unit)+'</td></tr>';
      if(gds.range_hi!=null||gds.range_lo!=null)html+='<tr><td>量程</td><td class="meta-range">'+(gds.range_lo!=null?gds.range_lo:0)+' ~ '+(gds.range_hi!=null?gds.range_hi:100)+' '+esc(gds.unit||'')+'</td></tr>';
      if(gds.hihi!=null)html+='<tr><td>高高报警</td><td style="color:#c62828;font-weight:600">'+gds.hihi+' '+esc(gds.unit||'')+'</td></tr>';
      if(gds.hi!=null)html+='<tr><td>高报警</td><td style="color:#e65100;font-weight:600">'+gds.hi+' '+esc(gds.unit||'')+'</td></tr>';
      if(gds.lo!=null)html+='<tr><td>低报警</td><td style="color:#1565c0;font-weight:600">'+gds.lo+' '+esc(gds.unit||'')+'</td></tr>';
      if(gds.lolo!=null)html+='<tr><td>低低报警</td><td style="color:#1565c0;font-weight:600">'+gds.lolo+' '+esc(gds.unit||'')+'</td></tr>';
      if(gds.station)html+='<tr><td>GDS站号</td><td>'+esc(gds.station)+'</td></tr>';
      html+='</table></div>';
    }
    // SIS 安全联锁信息卡
    var sis=d.meta&&d.meta.sis;
    if(sis&&Object.keys(sis).length){
      html+='<div class="meta-card"><div class="meta-card-hdr">SIS 安全联锁信息</div><table class="meta-table">';
      if(sis.desc)html+='<tr><td>描述</td><td>'+esc(sis.desc)+'</td></tr>';
      if(sis.unit)html+='<tr><td>单位</td><td>'+esc(sis.unit)+'</td></tr>';
      if(sis.sp_hihi!=null)html+='<tr><td>联锁高高设定</td><td style="color:#c62828;font-weight:600">'+sis.sp_hihi+' '+esc(sis.unit||'')+'</td></tr>';
      if(sis.sp_hi!=null)html+='<tr><td>联锁高设定</td><td style="color:#e65100;font-weight:600">'+sis.sp_hi+' '+esc(sis.unit||'')+'</td></tr>';
      if(sis.sp_lo!=null)html+='<tr><td>联锁低设定</td><td style="color:#1565c0;font-weight:600">'+sis.sp_lo+' '+esc(sis.unit||'')+'</td></tr>';
      if(sis.sp_lolo!=null)html+='<tr><td>联锁低低设定</td><td style="color:#1565c0;font-weight:600">'+sis.sp_lolo+' '+esc(sis.unit||'')+'</td></tr>';
      if(sis.station)html+='<tr><td>SIS站号</td><td>'+esc(sis.station)+'</td></tr>';
      html+='</table></div>';
    }
    var wiringTabs=getWiringRefTabs(d);
    html+=renderWiringCards(d);
    // 文档截图（jbxx_docs）
    // 约束：当位号已生成新的 DCS/SIS/CCS/GDS 接线图时，隐藏旧 jbxx 接线截图，
    // 避免同一位号在“基本信息”下同时出现新旧两套接线图。
    var docs=wiringTabs.length?[]:(d.jbxx_docs||[]);
    for(var j=0;j<docs.length;j++){
      var doc=docs[j];
      var imgs=renderDocImages(doc);
      if(!imgs&&doc.pages&&doc.pages.length){
        imgs='<div style="padding:16px;color:#666;font-size:13px;background:#f5f5f5;border-radius:6px;text-align:center">'
          +'📄 暂无预览图，请查阅原始PDF 第 '+doc.pages.join('、')+' 页'
          +'</div>';
      }
      html+='<div class="doc-card">'
        +'<div class="doc-hdr"><div class="title">'+esc(doc.source_pdf||doc.doc_id)+'</div>'
        +(doc.pages&&doc.pages.length?'<div class="meta">第 '+doc.pages.join('、')+' 页</div>':'')+'</div>'
        +'<div class="doc-imgs">'+imgs+'</div></div>';
    }
    if(!html.trim()){$$('panelBody').innerHTML=empty();return}
  } else if(t.key==='dcs'){
    // DCS底层程序 Tab：按文档分组显示页面图片
    var docs=d.dcs_docs||[];
    if(!docs.length){$$('panelBody').innerHTML=empty();return}
    for(var j=0;j<docs.length;j++){
      var doc=docs[j];
      var imgs=renderDocImages(doc);
      if(!imgs&&doc.pages&&doc.pages.length){
        imgs='<div style="padding:16px;color:#666;font-size:13px;background:#f5f5f5;border-radius:6px;text-align:center">'
          +'📄 暂无预览图，请查阅原始PDF 第 '+doc.pages.join('、')+' 页'
          +'</div>';
      }
      html+='<div class="doc-card">'
        +'<div class="doc-hdr"><div class="title">DCS底层程序 — '+esc(doc.doc_name||doc.doc_id)+'</div>'
        +'<div class="meta">第 '+(doc.pages||[]).join('、')+' 页</div></div>'
        +'<div class="doc-imgs">'+imgs+'</div></div>';
    }
    if(!html.trim()){$$('panelBody').innerHTML=empty();return}
  } else if(t.key==='gds_point'){
    var g=detail.meta&&detail.meta.gds||{};
    html+='<div class="meta-card"><div class="meta-card-hdr">GDS 气体报警点表</div><table class="meta-table">';
    if(g.desc)html+='<tr><td>描述</td><td>'+esc(g.desc)+'</td></tr>';
    if(g.unit)html+='<tr><td>单位</td><td>'+esc(g.unit)+'</td></tr>';
    if(g.range_hi!=null||g.range_lo!=null)html+='<tr><td>量程</td><td class="meta-range">'+(g.range_lo||0)+' ~ '+(g.range_hi||100)+' '+esc(g.unit||'')+'</td></tr>';
    if(g.hihi!=null)html+='<tr><td>高高报警</td><td style="color:#c62828;font-weight:600">'+g.hihi+' '+esc(g.unit||'')+'</td></tr>';
    if(g.hi!=null)html+='<tr><td>高报警</td><td style="color:#e65100;font-weight:600">'+g.hi+' '+esc(g.unit||'')+'</td></tr>';
    if(g.lo!=null)html+='<tr><td>低报警</td><td style="color:#1565c0;font-weight:600">'+g.lo+' '+esc(g.unit||'')+'</td></tr>';
    if(g.lolo!=null)html+='<tr><td>低低报警</td><td style="color:#1565c0;font-weight:600">'+g.lolo+' '+esc(g.unit||'')+'</td></tr>';
    if(g.station)html+='<tr><td>站号</td><td>'+esc(g.station)+'</td></tr>';
    html+='</table></div>';
    if(!Object.keys(g).length){$$('panelBody').innerHTML=empty();return}
  } else if(t.key==='sis'){
    var s=detail.meta&&detail.meta.sis||{};
    html+='<div class="meta-card"><div class="meta-card-hdr">SIS 安全联锁点表</div><table class="meta-table">';
    if(s.desc)html+='<tr><td>描述</td><td>'+esc(s.desc)+'</td></tr>';
    if(s.unit)html+='<tr><td>单位</td><td>'+esc(s.unit)+'</td></tr>';
    if(s.sp_hihi!=null)html+='<tr><td>联锁高高设定</td><td style="color:#c62828;font-weight:600">'+s.sp_hihi+' '+esc(s.unit||'')+'</td></tr>';
    if(s.sp_hi!=null)html+='<tr><td>联锁高设定</td><td style="color:#e65100;font-weight:600">'+s.sp_hi+' '+esc(s.unit||'')+'</td></tr>';
    if(s.sp_lo!=null)html+='<tr><td>联锁低设定</td><td style="color:#1565c0;font-weight:600">'+s.sp_lo+' '+esc(s.unit||'')+'</td></tr>';
    if(s.sp_lolo!=null)html+='<tr><td>联锁低低设定</td><td style="color:#1565c0;font-weight:600">'+s.sp_lolo+' '+esc(s.unit||'')+'</td></tr>';
    if(s.al_hihi!=null)html+='<tr><td>报警高高</td><td style="color:#c62828">'+s.al_hihi+' '+esc(s.unit||'')+'</td></tr>';
    if(s.al_hi!=null)html+='<tr><td>报警高</td><td style="color:#e65100">'+s.al_hi+' '+esc(s.unit||'')+'</td></tr>';
    if(s.al_lo!=null)html+='<tr><td>报警低</td><td style="color:#1565c0">'+s.al_lo+' '+esc(s.unit||'')+'</td></tr>';
    if(s.al_lolo!=null)html+='<tr><td>报警低低</td><td style="color:#1565c0">'+s.al_lolo+' '+esc(s.unit||'')+'</td></tr>';
    if(s.station)html+='<tr><td>SIS站号</td><td>'+esc(s.station)+'</td></tr>';
    html+='</table></div>';
    if(!Object.keys(s).length){$$('panelBody').innerHTML=empty();return}
  } else {
    // 参考文档 sub_type tab 或其他通用 tab
    var docs = t.ref_docs || (d[t.key+'_docs']) || [];
    if(!docs.length){$$('panelBody').innerHTML=empty();return}
    for(var j=0;j<docs.length;j++){
      var doc=docs[j];
      var imgs=renderDocImages(doc);
      // 若无图片但有页码，显示提示
      if(!imgs&&doc.pages&&doc.pages.length){
        imgs='<div style="padding:16px;color:#666;font-size:13px;background:#f5f5f5;border-radius:6px;text-align:center">'
          +'📄 暂无预览图，请查阅原始PDF 第 '+doc.pages.join('、')+' 页'
          +'</div>';
      }
      html+='<div class="doc-card">'
        +'<div class="doc-hdr"><div class="title">'+esc(doc.source_pdf||doc.doc_id)+'</div>'
        +'<div class="meta">第 '+(doc.pages||[]).join('、')+' 页</div></div>'
        +'<div class="doc-imgs">'+imgs+'</div></div>';
    }
  }
  $$('panelBody').innerHTML='<div class="detail-inner">'+html+'</div>';
}

window.closeDetail=function(){
  // 若当前 history state 是面板状态，用 history.back() 触发 popstate 统一关闭
  if(history.state&&history.state.panel){history.back();}
  else{closeDetailUI();}
};

/* 从搜索结果直接进入编辑模式 */
window.openAndEdit=function(tag){
  openDetail(tag);
  // 等详情面板加载完再展开编辑栏（detail fetch 完成后 buildTabs 会设置好状态）
  setTimeout(function(){
    var btn=$$('editBtn');
    if(btn&&btn.style.display!=='none'){
      // editBar 未展开时点击
      var bar=$$('editBar');
      if(bar&&bar.style.display==='none') toggleEdit();
    }else{
      // 多等一点，fetch 还没回来
      setTimeout(function(){
        var bar=$$('editBar');if(bar&&bar.style.display==='none')toggleEdit();
      },1200);
    }
  },600);
};

/* ── Image viewer ────────────────────────── */
var _vScale=1, _vLastScale=1, _vStartDist=0;

function _vClearOverlays(){
  var vi=$$('viewerInner');
  vi.querySelectorAll('.loc-marker,.doc-box').forEach(function(m){m.remove()});
}

function _vSetMarker(x,y,tag,markerClass){
  var vi=$$('viewerInner');
  _vClearOverlays();
  if(x==null||y==null)return;
  var m=document.createElement('div');
  m.className='loc-marker'+(markerClass?(' '+markerClass):'');
  m.style.left=(x*100)+'%';
  m.style.top=(y*100)+'%';
  m.innerHTML='<div class="marker-ring"></div><span class="marker-label">'+esc(tag)+'</span>';
  vi.appendChild(m);
}

function _vSetBoxes(boxes){
  var vi=$$('viewerInner');
  _vClearOverlays();
  (boxes||[]).forEach(function(b){
    var p=_boxPad(b,0.005,0.006);
    var el=document.createElement('div');
    el.className='doc-box';
    el.style.left=(p.x1*100)+'%';
    el.style.top=(p.y1*100)+'%';
    el.style.width=((p.x2-p.x1)*100)+'%';
    el.style.height=((p.y2-p.y1)*100)+'%';
    vi.appendChild(el);
  });
}

function _vApplyZoom(s){
  _vScale=Math.max(1,Math.min(8,s));
  var vi=$$('viewerInner');
  vi.style.transform='scale('+_vScale+')';
  // 红圈随图片一起缩放（和图纸上的序号圈保持一致比例）
}

/* 打开全屏（v2：传 url+x+y；v1：只传 url）*/
window.openViewer=function(url,x,y,markerClass,boxes){
  var vi=$$('viewerInner'), img1=$$('viewerImg');
  _vScale=1;
  vi.style.transform='';
  if((x!=null&&y!=null) || (boxes&&boxes.length)){
    // v2 模式
    $$('viewerInnerImg').src=url;
    if(x!=null&&y!=null)_vSetMarker(x,y,panelTagName,markerClass);
    else _vSetBoxes(boxes||[]);
    vi.style.display='inline-block';
    img1.style.display='none';
  } else {
    // v1 fallback
    img1.src=url;
    img1.classList.remove('zoomed');
    img1.style.display='block';
    vi.style.display='none';
    _vClearOverlays();
  }
  // 推入历史记录，使手机"返回"手势关闭查看器而非退出面板
  history.pushState({viewer:true},'');
  $$('viewer').classList.add('open');
  syncBodyLock();
};
function _closeViewerUI(){
  $$('viewer').classList.remove('open');
  setTimeout(function(){$$('viewerInnerImg').src='';$$('viewerImg').src='';},300);
  syncBodyLock();
}
window.closeViewer=function(){
  if(history.state&&history.state.viewer){history.back();}
  else{_closeViewerUI();}
};
window.toggleZoom=function(img){
  img.classList.toggle('zoomed');
};

/* 全屏查看器缩放（只对 v2 的 viewer-inner 生效）*/
(function(){
  var viewer=$$('viewer');
  // 鼠标滚轮（桌面调试）
  viewer.addEventListener('wheel',function(e){
    if($$('viewerInner').style.display==='none')return;
    e.preventDefault();
    _vApplyZoom(_vScale*(e.deltaY>0?0.85:1.18));
  },{passive:false});
  // 双击切换 1x / 2.5x
  $$('viewerInner').addEventListener('dblclick',function(){
    _vApplyZoom(_vScale>1.2?1:2.5);
  });
  // 移动端捏合
  $$('viewerInner').addEventListener('touchstart',function(e){
    if(e.touches.length===2){
      _vStartDist=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);
      _vLastScale=_vScale;
      e.preventDefault();
    }
  },{passive:false});
  $$('viewerInner').addEventListener('touchmove',function(e){
    if(e.touches.length===2){
      var d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);
      _vApplyZoom(_vLastScale*d/_vStartDist);
      e.preventDefault();
    }
  },{passive:false});
})();

/* ── 事件委托（避免 onclick 属性中双引号冲突）── */
// 结果列表：点击位号进入详情
$$('results').addEventListener('click',function(e){
  var item=e.target.closest('.result-item');
  if(item&&item.dataset.tag)openDetail(item.dataset.tag);
});
// 详情面板：点击图片或 loc-viewer 打开查看器
$$('panelBody').addEventListener('click',function(e){
  // v2 位置图：点击整个 loc-viewer 区域
  var lv=e.target.closest('.loc-viewer');
  if(lv){
    var x=parseFloat(lv.dataset.locX);
    var y=parseFloat(lv.dataset.locY);
    openViewer(lv.dataset.locUrl, isNaN(x)?null:x, isNaN(y)?null:y, lv.dataset.locMarkerClass||'');
    return;
  }
  // v1 / 其他图片
  var ov=e.target.closest('.doc-overlay');
  if(ov){
    var boxes=[];
    try{boxes=JSON.parse(decodeURIComponent(ov.dataset.docBoxes||'%5B%5D'));}catch(_e){}
    openViewer(ov.dataset.docUrl,null,null,'',boxes);
    return;
  }
  var img=e.target.closest('img[data-viewer]');
  if(img)openViewer(img.dataset.viewer,null,null);
});

/* ── Keyboard shortcuts ──────────────────── */
document.addEventListener('keydown',function(e){
  if(e.key==='Escape'){
    if($$('viewer').classList.contains('open'))closeViewer();
    else if($$('panel').classList.contains('show'))closeDetail();
  }
});

/* 下拉关闭已移除：详情面板仅通过顶栏 ✕ 按钮或 Escape 键关闭 */

/* ── Sidebar + Admin ───────────────────────── */
var ADMIN_KEY='ncAdminTok';
function getTok(){try{return localStorage.getItem(ADMIN_KEY)||''}catch(e){return ''}}
function setTok(t){try{t?localStorage.setItem(ADMIN_KEY,t):localStorage.removeItem(ADMIN_KEY)}catch(e){}}
function isAdmin(){return !!getTok()}
function updateAdminUI(){
  var on=isAdmin();
  $$('adminIndicator').style.display=on?'inline-block':'none';
  $$('adminBtn').textContent=on?'⎋':'⚙';
  $$('adminBtn').title=on?'登出':'管理员登录';
  var sbBtn=$$('sbNewTagBtn');if(sbBtn)sbBtn.style.display=on?'inline-block':'none';
}
window.adminClick=function(){
  if(isAdmin()){
    if(confirm('退出管理员？')){setTok('');updateAdminUI();var q=$$('q').value.trim();if(q)doSearch(q)}
  }else{
    $$('loginToken').value='';$$('loginErr').textContent='';
    $$('loginModal').classList.add('show');setTimeout(function(){$$('loginToken').focus()},50);
  }
};
window.closeModal=function(id){$$(id).classList.remove('show')};
window.doLogin=function(){
  var t=$$('loginToken').value.trim();if(!t){$$('loginErr').textContent='请输入令牌';return}
  fetch('/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:t})})
    .then(function(r){if(!r.ok)throw 0;return r.json()})
    .then(function(d){setTok(d.token||t);updateAdminUI();closeModal('loginModal');var q=$$('q').value.trim();if(q)doSearch(q)})
    .catch(function(){$$('loginErr').textContent='令牌错误'});
};
window.showMerge=function(tag){
  $$('mergeFrom').textContent=tag;$$('mergeTo').value='';$$('mergeErr').textContent='';
  $$('mergeModal').classList.add('show');setTimeout(function(){$$('mergeTo').focus()},50);
};
window.doMerge=function(){
  var from=$$('mergeFrom').textContent,to=$$('mergeTo').value.trim();
  if(!to){$$('mergeErr').textContent='请输入目标位号';return}
  fetch('/api/admin/tag/merge',{method:'POST',headers:{'Authorization':'Bearer '+getTok(),'Content-Type':'application/json'},body:JSON.stringify({from:from,into:to})})
    .then(function(r){if(!r.ok)return r.text().then(function(t){throw t});return r.json()})
    .then(function(){closeModal('mergeModal');loadSidebar();var q=$$('q').value.trim();if(q)doSearch(q)})
    .catch(function(e){$$('mergeErr').textContent='合并失败：'+(e||'')});
};
window.doDelete=function(tag){
  if(!confirm('删除位号 '+tag+' ？此操作不可恢复。'))return;
  fetch('/api/admin/tag/delete',{method:'POST',headers:{'Authorization':'Bearer '+getTok(),'Content-Type':'application/json'},body:JSON.stringify({tag:tag})})
    .then(function(r){if(!r.ok)throw 0;return r.json()})
    .then(function(){loadSidebar();var q=$$('q').value.trim();if(q)doSearch(q)})
    .catch(function(){alert('删除失败')});
};
window.showCreate=function(){
  $$('createTag').value='';$$('createErr').textContent='';
  $$('createModal').classList.add('show');setTimeout(function(){$$('createTag').focus()},50);
};
window.doCreate=function(){
  var tag=$$('createTag').value.trim();
  if(!tag){$$('createErr').textContent='请输入位号';return}
  fetch('/api/admin/tag/create',{method:'POST',headers:{'Authorization':'Bearer '+getTok(),'Content-Type':'application/json'},body:JSON.stringify({tag:tag})})
    .then(function(r){if(!r.ok)return r.text().then(function(t){throw t});return r.json()})
    .then(function(){closeModal('createModal');loadSidebar();$$('q').value=tag;doSearch(tag)})
    .catch(function(e){$$('createErr').textContent='创建失败：'+(e||'')});
};

window.toggleSidebar=function(){
  $$('sidebar').classList.toggle('open');
  $$('sidebarMask').classList.toggle('show');
  syncBodyLock();
};

/* 6 位装置号 → 中文名（按 2 位前缀兜底；精细名覆盖在 STATION6 中） */
var STATION2={
  '01':'煤场','03':'气化','04':'变换','07':'低温甲醇洗','10':'液氮洗',
  '11':'合成','12':'氨冷冻','13':'尿素','14':'造粒','15':'包装',
  '16':'硫回收','17':'硫酸','18':'脱硫','19':'CO2','20':'空分',
  '21':'公用工程','22':'循环水','23':'锅炉','24':'污水','40':'液体储运'
};
/* 6 位装置号精确名称 */
var STATION6={
  '010000':'空分仪表图',
  '030000':'煤气化装置仪表图',
  '030100':'煤浆制备与输送仪表图',
  '030200':'气化仪表图',
  '030300':'渣水处理仪表图',
  '040100':'一氧化碳变换仪表图',
  '040200':'酸性气体脱除仪表图',
  '040300':'气体精制仪表图',
  '040500':'氨合成仪表图',
  '040800':'除氧给水仪表图',
  '040900':'硫回收仪表图',
  '090200':'尿素主装置仪表图',
  '200000':'原水加压及消防仪表图',
  '210000':'循环冷却水站仪表图',
  '290000':'余热发电仪表图',
  '370000':'全厂外管仪表图',
  '400100':'球罐区仪表图',
  '400200':'常压氨罐区仪表图',
  '400300':'甲醇罐区仪表图',
  '400400':'硫酸罐区仪表图',
  '400800':'汽车装卸栈台仪表图',
  '480100':'原燃料煤贮运仪表图',
  '801000':'厂外取水泵房仪表图'
};
function stationLabel(k){
  if(k==='其他')return '其他';
  if(STATION6[k])return STATION6[k]+' '+k;
  // 2位前缀兜底：如 "04" → "变换（其他）"
  if(/^\d{2}$/.test(k)){
    var p=k;
    return (STATION2[p]||'装置')+' '+k+'（其他）';
  }
  var p=k.substring(0,2);
  return (STATION2[p]||'装置')+' '+k;
}

var _tagGroupsObj=null,_tagGroupKeys=[],_stationFilter='';
function renderStationFilter(keys,groupsObj){
  var sel=$$('stationFilter');
  if(!sel)return;
  var html='<option value="">全部装置</option>';
  for(var i=0;i<keys.length;i++){
    var k=keys[i],tags=groupsObj[k]||[];
    html+='<option value="'+esc(k)+'">'+esc(stationLabel(k))+' · '+tags.length+'</option>';
  }
  sel.innerHTML=html;
  sel.value=_stationFilter;
}
window.setStationFilter=function(v){
  _stationFilter=v||'';
  renderSidebarGroups();
};
function renderSidebarGroups(){
  var groupsObj=_tagGroupsObj||{};
  var keys=_stationFilter?_tagGroupKeys.filter(function(k){return k===_stationFilter}):_tagGroupKeys;
  if(!keys.length){$$('sidebarBody').innerHTML='<div class="status-box"><p>暂无</p></div>';return}
  var html='';
  for(var i=0;i<keys.length;i++){
    var k=keys[i],tags=groupsObj[k]||[];
    html+='<div class="station-group" data-idx="'+i+'">'
      +'<div class="station-hdr" onclick="toggleStation('+i+')"><span class="caret">▶</span><span>'+esc(stationLabel(k))+'</span><span class="count">'+tags.length+'</span></div>'
      +'<div class="station-tags" style="display:none">';
    for(var j=0;j<tags.length;j++){
      var t=tags[j];
      html+='<div class="station-tag" onclick="pickSidebarTag(&quot;'+esc(t)+'&quot;)">'+esc(t)+'</div>';
    }
    html+='</div></div>';
  }
  $$('sidebarBody').innerHTML=html;
}
function loadSidebar(){
  fetch('/api/tag-list').then(function(r){return r.json()}).then(function(d){
    var groupsObj=d.groups||{};
    var keys=Object.keys(groupsObj).sort(function(a,b){
      if(a==='其他')return 1;if(b==='其他')return -1;return a.localeCompare(b);
    });
    _tagGroupsObj=groupsObj;_tagGroupKeys=keys;
    if(_stationFilter && !groupsObj[_stationFilter])_stationFilter='';
    renderStationFilter(keys,groupsObj);
    renderSidebarGroups();
  }).catch(function(){$$('sidebarBody').innerHTML='<div class="status-box" style="color:#c62828"><p>加载失败</p></div>'});
}

/* ── Edit mode in detail panel ─────────────── */
var REF_TYPE_LABEL={location:'位置图',datasheet:'数据表',flowcalc:'计算书',vendor:'厂商资料',gds:'气体报警',jbxx:'基本信息',monitoring:'监控数据表',reference:'参考文档'};
window.toggleEdit=function(){
  var bar=$$('editBar');
  if(bar.style.display!=='none'){bar.style.display='none';return}
  bar.style.display='block';
  bar.querySelector('#editRefs').innerHTML='<div class="spinner" style="width:20px;height:20px;margin:4px 0"></div>';
  fetch('/api/admin/tag/info?tag='+encodeURIComponent(panelTagName),{headers:{'Authorization':'Bearer '+getTok()}})
    .then(function(r){if(!r.ok)throw 0;return r.json()})
    .then(function(d){renderEditRefs(d.refs||[])})
    .catch(function(){bar.querySelector('#editRefs').innerHTML='<span style="color:#c62828">加载失败</span>'});
};
function renderEditRefs(refs){
  var box=$$('editRefs');
  var foot='<div style="margin-top:10px;padding-top:8px;border-top:1px solid #ffe082">'
    +'<button class="ad-btn" style="font-size:13px;padding:6px 14px" data-action="add-ref">＋ 新增栏目</button>'
    +'</div>';
  if(!refs.length){box.innerHTML='<p style="color:#666;margin:4px 0">暂无资料</p>'+foot;box.dataset.refs='[]';return}
  var html='';
  for(var i=0;i<refs.length;i++){
    var r=refs[i],lbl=REF_TYPE_LABEL[r.type]||r.type;
    var desc=r.doc_id||r.drawing_dir||r.source_pdf||r.dir||'';
    if(r.page)desc+=' · 第'+r.page+'页';
    var imgs=refImagePaths(r);
    var imgBtns='';
    for(var k=0;k<imgs.length;k++){
      imgBtns+='<button class="ad-btn" style="font-size:13px;padding:5px 12px" data-action="replace-img" data-url="'+esc(imgs[k])+'">替换图'+(imgs.length>1?(k+1):'')+'</button>';
    }
    html+='<div style="padding:8px 0;border-bottom:1px dashed #ffe082">'
      +'<div style="font-weight:600;color:#1565c0;font-size:13px;margin-bottom:5px">'+esc(lbl)+'</div>'
      +'<div style="font-size:12px;color:#555;margin-bottom:6px;word-break:break-all">'+esc(desc)+'</div>'
      +'<div style="display:flex;gap:8px;flex-wrap:wrap">'
        +(imgBtns||'')
        +'<button class="ad-btn danger" style="font-size:13px;padding:5px 12px" data-action="remove-ref" data-idx="'+i+'">删除此栏目</button>'
      +'</div>'
      +'</div>';
  }
  box.innerHTML=html+foot;
  box.dataset.refs=JSON.stringify(refs);
}
/* 从 ref + detail 中推断图片路径（用于"替换图"按钮） */
function refImagePaths(r){
  if(!detail)return [];
  var arr=[];
  function push(u){if(u&&arr.indexOf(u)<0)arr.push(u)}
  if(r.type==='location'&&detail.location_docs){
    for(var i=0;i<detail.location_docs.length;i++){var d=detail.location_docs[i];if(d.image_url)push(d.image_url)}
  } else if(r.type==='gds'&&detail.gds_docs){
    for(var i=0;i<detail.gds_docs.length;i++){var d=detail.gds_docs[i];if(d.doc_id===r.doc_id&&d.image_url)push(d.image_url)}
  } else {
    var key=r.type+'_docs';
    var list=detail[key]||[];
    for(var i=0;i<list.length;i++){
      var d=list[i];
      if(d.doc_id!==r.doc_id)continue;
      (d.page_urls||[]).forEach(push);
    }
  }
  return arr;
}

/* 事件委托：editRefs 内所有按钮统一在这里处理，避免 inline onclick 转义问题 */
$$('editRefs').addEventListener('click',function(e){
  var btn=e.target.closest('button[data-action]');
  if(!btn)return;
  var action=btn.dataset.action;
  if(action==='add-ref'){showAddRef();}
  else if(action==='replace-img'){
    var url=btn.dataset.url;
    $$('replaceImgPath').textContent=url;
    $$('replaceImgFile').value='';$$('replaceImgErr').textContent='';
    $$('replaceImgModal').classList.add('show');
  }
  else if(action==='remove-ref'){
    var idx=parseInt(btn.dataset.idx,10);
    var box=$$('editRefs');
    var refs=JSON.parse(box.dataset.refs||'[]');
    if(idx<0||idx>=refs.length)return;
    // 把按钮文字改为确认，第二次点才删除
    if(btn.dataset.confirm!=='1'){
      btn.dataset.confirm='1';
      btn.textContent='确认删除？';
      btn.style.background='#d32f2f';btn.style.color='#fff';btn.style.borderColor='#d32f2f';
      setTimeout(function(){if(btn.dataset.confirm==='1'){btn.dataset.confirm='';btn.textContent='删除此栏目';btn.style.cssText='font-size:13px;padding:5px 12px';}},3000);
      return;
    }
    refs.splice(idx,1);
    fetch('/api/admin/tag/update',{method:'POST',headers:{'Authorization':'Bearer '+getTok(),'Content-Type':'application/json'},body:JSON.stringify({tag:panelTagName,refs:refs})})
      .then(function(r){if(!r.ok)throw 0;return r.json()})
      .then(function(){renderEditRefs(refs);openDetail(panelTagName);})
      .catch(function(){btn.textContent='删除失败';});
  }
});

window.showReplaceImg=function(pathUrl){
  $$('replaceImgPath').textContent=pathUrl;
  $$('replaceImgFile').value='';$$('replaceImgErr').textContent='';
  $$('replaceImgModal').classList.add('show');
};
window.doReplaceImg=function(){
  var f=$$('replaceImgFile').files[0];
  if(!f){$$('replaceImgErr').textContent='请选择文件';return}
  var pathUrl=$$('replaceImgPath').textContent;
  var rdr=new FileReader();
  rdr.onload=function(){
    fetch('/api/admin/image/upload?path='+encodeURIComponent(pathUrl),{
      method:'POST',
      headers:{'Authorization':'Bearer '+getTok(),'Content-Type':f.type||'image/jpeg'},
      body:rdr.result
    }).then(function(r){if(!r.ok)return r.text().then(function(t){throw t});return r.json()})
      .then(function(){closeModal('replaceImgModal');alert('替换成功');openDetail(panelTagName)})
      .catch(function(e){$$('replaceImgErr').textContent='失败：'+(e||'')});
  };
  rdr.readAsArrayBuffer(f);
};

window.showAddRef=function(){
  $$('addRefTag').textContent=panelTagName;
  $$('addRefType').value='jbxx';
  $$('addRefDocId').value='';$$('addRefPages').value='';$$('addRefFiles').value='';
  $$('addRefErr').textContent='';
  $$('addRefModal').classList.add('show');
};
window.doAddRef=function(){
  var type=$$('addRefType').value;
  var doc_id=$$('addRefDocId').value.trim();
  if(!doc_id){$$('addRefErr').textContent='请输入 doc_id';return}
  var pages=$$('addRefPages').value.trim()
    .split(/[,，\s]+/).filter(Boolean).map(function(x){return parseInt(x,10)}).filter(function(x){return x>0});
  var files=$$('addRefFiles').files;
  var tok=getTok();
  $$('addRefErr').textContent='上传中…';
  // 先创建 doc（简单：drawing_dir = doc_id；页面图放到 /files/<doc_id>/pageNN.jpg）
  var doc={drawing_dir:doc_id,source_pdf:doc_id,rendered_pages:pages.length?pages:(files.length?Array.from({length:files.length},function(_,i){return i+1}):[])};
  var chain=fetch('/api/admin/doc/create',{method:'POST',headers:{'Authorization':'Bearer '+tok,'Content-Type':'application/json'},body:JSON.stringify({doc_id:doc_id,doc:doc})})
    .then(function(r){if(!r.ok)return r.text().then(function(t){throw t});return r.json()});
  // 逐个上传图片
  for(var i=0;i<files.length;i++){
    (function(f,idx){
      chain=chain.then(function(){
        return new Promise(function(resolve,reject){
          var rdr=new FileReader();
          rdr.onload=function(){
            var pg=String(idx+1).padStart(2,'0');
            fetch('/api/admin/image/upload?path=/files/'+encodeURIComponent(doc_id)+'/page'+pg+'.jpg',{
              method:'POST',headers:{'Authorization':'Bearer '+tok,'Content-Type':f.type||'image/jpeg'},body:rdr.result
            }).then(function(r){if(!r.ok)return r.text().then(function(t){reject(t)});resolve()}).catch(reject);
          };
          rdr.readAsArrayBuffer(f);
        });
      });
    })(files[i],i);
  }
  // 最后添加 ref
  chain.then(function(){
    var ref={type:type,doc_id:doc_id};
    if(pages.length)ref.pages=pages;else if(files.length)ref.pages=Array.from({length:files.length},function(_,i){return i+1});
    return fetch('/api/admin/tag/add-ref',{method:'POST',headers:{'Authorization':'Bearer '+tok,'Content-Type':'application/json'},body:JSON.stringify({tag:panelTagName,ref:ref})})
      .then(function(r){if(!r.ok)return r.text().then(function(t){throw t});return r.json()});
  }).then(function(){
    closeModal('addRefModal');openDetail(panelTagName);toggleEdit();
  }).catch(function(e){$$('addRefErr').textContent='失败：'+(e||'')});
};
window.removeRef=function(idx){
  var box=$$('editRefs');
  var refs=JSON.parse(box.dataset.refs||'[]');
  if(idx<0||idx>=refs.length)return;
  if(!confirm('删除此资料？此操作不可恢复。'))return;
  refs.splice(idx,1);
  fetch('/api/admin/tag/update',{method:'POST',headers:{'Authorization':'Bearer '+getTok(),'Content-Type':'application/json'},body:JSON.stringify({tag:panelTagName,refs:refs})})
    .then(function(r){if(!r.ok)throw 0;return r.json()})
    .then(function(){renderEditRefs(refs);openDetail(panelTagName)})
    .catch(function(){alert('删除失败')});
};
/* ── Sidebar tab switching ─────────────────── */
window.switchSbTab=function(tab){
  var isTag=(tab==='tag');
  $$('sbTagBody').style.display=isTag?'':'none';
  $$('sbManualBody').style.display=isTag?'none':'';
  $$('sbTabTag').classList.toggle('active',isTag);
  $$('sbTabManual').classList.toggle('active',!isTag);
  if(!isTag)loadManuals();
};

/* ── 说明书目录 ────────────────────────────── */
var _manualsData=null,_manualItems=[];
function loadManuals(){
  if(_manualsData){renderManualSidebar(_manualsData);return}
  $$('manualSidebarBody').innerHTML=spin();
  fetch('/api/manuals')
    .then(function(r){return r.json()})
    .then(function(d){_manualsData=d.folders||{};renderManualSidebar(_manualsData)})
    .catch(function(){$$('manualSidebarBody').innerHTML='<div class="status-box" style="color:#c62828"><p>加载失败</p></div>'});
}
function renderManualSidebar(folders){
  _manualItems=[];
  var html='';
  if(folders['_root']&&folders['_root'].length)html+=renderManualFolder('综合资料',folders['_root']);
  var keys=Object.keys(folders).filter(function(k){return k!=='_root'}).sort();
  for(var i=0;i<keys.length;i++)html+=renderManualFolder(keys[i],folders[keys[i]]);
  $$('manualSidebarBody').innerHTML=html||'<div class="status-box"><p>暂无说明书</p></div>';
}
function renderManualFolder(label,items){
  var fid='mf'+_manualItems.length;
  var inner='';
  for(var j=0;j<items.length;j++){
    var idx=_manualItems.length;
    _manualItems.push(items[j]);
    inner+='<div class="station-tag" onclick="openManualItem('+idx+')">'+esc(items[j].name)+'</div>';
  }
  return '<div class="station-group">'
    +'<div class="station-hdr" onclick="toggleMf(&quot;'+fid+'&quot;)"><span class="caret" id="mfC_'+fid+'">▶</span>'
    +'<span>'+esc(label)+'</span>'
    +'<span class="count">'+items.length+'</span></div>'
    +'<div class="station-tags" id="mfT_'+fid+'" style="display:none">'+inner+'</div></div>';
}
window.toggleMf=function(fid){
  var el=$$('mfT_'+fid),caret=$$('mfC_'+fid);
  var open=el.style.display!=='none';
  el.style.display=open?'none':'block';
  if(caret)caret.textContent=open?'▶':'▼';
};
window.openManualItem=function(idx){
  var item=_manualItems[idx];
  if(!item)return;
  $$('panelTag').textContent=item.name;
  updateTopbarMeta(null);
  $$('tabsRow').innerHTML='';
  $$('editBar').style.display='none';
  $$('editBtn').style.display='none';
  history.pushState({manual:item.r2_prefix||item.file_url||item.name},'');
  requestAnimationFrame(function(){$$('panel').classList.add('show');syncBodyLock()});
  var previewUrls=(item.page_urls||[]).slice();
  if(!previewUrls.length && item.r2_prefix && item.pages){
    var prefExt=item.ext||'.jpg';
    for(var i=1;i<=(item.pages||1);i++){
      var pgExt=(item.pages>1)?'.jpg':prefExt;
      previewUrls.push('/files/'+item.r2_prefix+'/page'+String(i).padStart(2,'0')+pgExt);
    }
  }
  if(previewUrls.length){
    var openBtn=item.file_url?('<p style="margin:12px 0 0"><a class="ad-btn" style="display:inline-block;text-decoration:none" href="'+esc(item.file_url)+'" target="_blank" rel="noopener">打开原文件</a></p>'):'';
    var html=previewUrls.map(imgTag).join('');
    $$('panelBody').innerHTML='<div class="doc-card"><div class="doc-hdr"><div class="title">'+esc(item.name)+'</div><div class="meta">预览</div></div><div class="doc-imgs">'+(html||empty())+'</div>'+openBtn+'</div>';
    if(window.innerWidth<=900)closeSidebarUI();
    return;
  }
  if(item.file_url){
    var fileUrl=item.file_url;
    var ext=String(item.ext||'').toLowerCase();
    var body='';
    if(/\\.(jpg|jpeg|png|webp)$/i.test(ext)){
      body=imgTag(fileUrl);
    }else if(ext==='.pdf'){
      body='<iframe src="'+esc(fileUrl)+'" style="width:100%;height:calc(100dvh - 150px);min-height:420px;border:0;background:#fff"></iframe>';
    }else{
      body='<div class="status-box"><p>'+esc(item.name)+'</p><p style="margin-top:12px"><a class="ad-btn" style="display:inline-block;text-decoration:none" href="'+esc(fileUrl)+'" target="_blank" rel="noopener">打开原文件</a></p></div>';
    }
    $$('panelBody').innerHTML='<div class="doc-card"><div class="doc-hdr"><div class="title">'+esc(item.name)+'</div><div class="meta">原文件</div></div><div class="doc-imgs">'+body+'</div></div>';
    if(window.innerWidth<=900)closeSidebarUI();
    return;
  }
  $$('panelBody').innerHTML='<div class="doc-card"><div class="doc-imgs">'+empty()+'</div></div>';
  if(window.innerWidth<=900)closeSidebarUI();
};

window.toggleStation=function(i){
  var g=document.querySelector('.station-group[data-idx="'+i+'"]');if(!g)return;
  var tags=g.querySelector('.station-tags'),caret=g.querySelector('.caret');
  var open=tags.style.display!=='none';
  tags.style.display=open?'none':'block';
  if(caret)caret.textContent=open?'▶':'▼';
};
window.pickSidebarTag=function(tag){
  $$('q').value=tag;doSearch(tag);
  if(window.innerWidth<=900){closeSidebarUI()}
};

// init
updateAdminUI();
loadSidebar();

// Enter key for modals
$$('loginToken').addEventListener('keydown',function(e){if(e.key==='Enter')doLogin()});
$$('mergeTo').addEventListener('keydown',function(e){if(e.key==='Enter')doMerge()});
$$('createTag').addEventListener('keydown',function(e){if(e.key==='Enter')doCreate()});

// ── 拦截浏览器返回手势 / 返回按钮 ──────────────────────────
// 按优先级：查看器 → 详情面板（均用 history.pushState 压栈）
window.addEventListener('popstate',function(){
  if($$('viewer').classList.contains('open')){
    _closeViewerUI();
  } else if($$('panel').classList.contains('show')){
    closeDetailUI();
  }
});
window.addEventListener('resize',syncBodyLock);

})();
</script>
</body>
</html>`;
