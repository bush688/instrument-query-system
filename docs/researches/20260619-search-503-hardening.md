# Search 503 Hardening Report

Date: 2026-06-19

## Problem

Users reported repeated search failures in the browser and mobile browser:

- Search results intermittently show `搜索失败，请重试`.
- The frontend error detail is usually `search http 503`.
- Refreshing the page may not recover immediately.
- Closing and reopening the browser often recovers search for a while, then the issue appears again.

## Root Cause

The public query path used `getSearchIndex()` for both `/api/search` and `/api/instrument/{tag}`.

When the precomputed KV value `search_index` was unavailable, invalid, or not accepted for the current version, `getSearchIndex()` fell back to rebuilding a full runtime index during the user request. That fallback walks large structures such as:

- `tag_list`
- `manifest.tags`
- `tag_meta`
- location-reference groups for loop fallback

This work is too expensive for Cloudflare Worker request execution and can exceed runtime limits. In that state the platform returns HTTP 503. Because the browser kept issuing new search requests, especially on mobile or weak networks, the failure could repeat until the Worker instance or browser session changed.

A second hot path was found during online probe testing: search-list floor fallback called `inferLoopLocationInfo()` for multiple result rows. The old implementation scanned every tag in `manifest.tags` for each row in order to find same-tail loop members. Short-number searches such as `02207`, `02025`, `05006`, and `09010` can amplify this into repeated full-manifest scans.

## Fix Implemented

### Worker-side

File: `src/index.js`

- Added `buildLightweightSearchIndex(manifest)`.
- Changed `getSearchIndex(env, manifest, tagMeta, options)` so public query routes pass `{ allowRuntimeFallback: false }`.
- If `search_index` KV load fails and an in-memory search index exists, the Worker now serves the stale cached index instead of rebuilding.
- If no cached index exists, the Worker uses a lightweight tag-only index.
- Description search no longer loads the large `tag_meta` object when the search index is already in degraded lightweight mode.
- `/api/instrument/{tag}` also uses the non-runtime-fallback path, so detail pages cannot trigger full index rebuilds.
- Added a cached loop-tail index keyed by `prefix::tail`, so floor fallback no longer scans every tag for every result row.
- Manifest/version/admin updates clear the loop-tail index cache together with manifest/search caches.

### Frontend-side

File: `src/webapp.js`

- Added `AbortController` handling so a new search cancels the previous in-flight search request.
- Replaced immediate one-shot retry with short backoff retries.
- Abort errors are ignored instead of shown as search failures.

## Prevention Rule

Do not rebuild the full search index in any user-facing Worker request.

Allowed in request path:

- Use in-memory `search_index` cache.
- Load precomputed `search_index` from KV.
- Serve stale in-memory `search_index` if KV temporarily fails.
- Use lightweight tag-only fallback if no precomputed index is available.

Not allowed in request path:

- Full runtime scan of `tag_meta`.
- Full runtime scan of every tag to rebuild `desc_entries`.
- Full runtime rebuild of loop-level `group_single_location_refs`.
- Per-result full scans of `manifest.tags` for same-tail floor fallback.

If the search index must be rebuilt, do it offline in the data generation/sync workflow, upload it to KV, then deploy or update `version`.

## Verification

Local checks:

- `node --check src/index.js`
- `node --check src/webapp.js`

Recommended production checks after deploy:

- `/api/search?q=02207` returns HTTP 200.
- `/api/search?q=02025` returns HTTP 200.
- `/api/search?q=富甲醇` returns HTTP 200. If `search_index` is unavailable, it may degrade but must not return 503.
- `/api/instrument/04FE-02025` returns HTTP 200.
