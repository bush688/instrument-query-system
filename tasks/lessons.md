# Lessons Learned (Self-Improvement Loop)

> Capture correction-derived prevention rules here.
> Promote repeated patterns into durable project rules during spa day.

## Template
- Date:
- Triggered by correction:
- Mistake pattern:
- Prevention rule:
- Where to apply next time:

## 2026-06-19: Search 503 hardening
- Date: 2026-06-19
- Triggered by correction: Search often returned HTTP 503 and recovered only after waiting or reopening the browser.
- Mistake pattern: User-facing Worker requests were allowed to rebuild the full search index when precomputed KV `search_index` was unavailable or invalid; search-list floor fallback also scanned every tag for each result row.
- Prevention rule: `/api/search` and `/api/instrument/{tag}` must never rebuild full `tag_meta`/manifest search indexes during a request. Use precomputed KV `search_index`, stale in-memory cache, or lightweight tag-only fallback. Rebuild indexes only in offline sync scripts. Same-tail floor lookup must use cached indexes, not per-result full-manifest scans.
- Where to apply next time: Any change touching `src/index.js` search, `getSearchIndex`, `tag_meta`, `search_index`, or KV version/cache invalidation.
