# Instrument Query System

新都化工合成氨仪表查询系统的脱敏开源版本。项目用于把工业仪表位号、位置图、数据表、DCS/监控资料、回路接线图、流量计算书、厂家资料和说明书整合到一个可搜索、可按位号查看的 Web 查询系统。

> This public repository contains application code and synthetic sample data only. Production drawings, manifests, credentials, Cloudflare tokens, API keys, and customer data are intentionally excluded.

## What It Does

- Search instruments by tag number or description.
- Open an instrument detail view with grouped document tabs.
- Show position-map previews with marker coordinates and floor labels.
- Merge related flow tags such as `F / FE / FT / FI` for user-facing lookup.
- Keep local gauges such as `PG / TG / LG` separate from remote transmitter loops.
- Preview manuals and rendered document pages through Cloudflare R2-backed file URLs.
- Sync generated metadata to Cloudflare KV for fast Worker-side lookup.

## Architecture

```text
Browser / mobile browser
        |
Cloudflare Worker (src/index.js)
        |
        +-- Cloudflare KV: manifest, tag_meta, tag_list, search_index
        |
        +-- Cloudflare R2: rendered document images and manual previews
        |
Static SPA UI (src/webapp.js)
```

The production system is manifest-driven. A generated `manifest` maps each instrument tag to document references. The Worker reads this metadata from KV and returns normalized API responses for search, instrument detail, manuals, and file previews.

## Repository Layout

- `src/index.js`
  - Cloudflare Worker entrypoint and API routes.
- `src/webapp.js`
  - Single-page frontend app returned by the Worker.
- `src/pressure_gauge_vendor_map.js`
  - Static helper mapping for pressure-gauge vendor documents.
- `sample-data/`
  - Synthetic sample manifest, metadata, search index, and placeholder rendered images.
- `docs/`
  - Project notes, architecture snapshots, and workflow context.
- `tasks/`
  - Current task status and deferred work notes.
- `deploy/`
  - Deployment notes and runbook scaffolding.
- `*.py`
  - Data import, document rendering, manifest update, and production sync utilities.

## Data Model

The main KV values are:

- `manifest`
  - Main document map. Contains `tags`, `docs`, `manuals`, and embedded `tag_meta` snapshot.
- `tag_meta`
  - Instrument descriptions, ranges, units, signal metadata, and grouping keys.
- `tag_list`
  - Lightweight tag groups for sidebar/device filtering.
- `search_index`
  - Precomputed search metadata used to avoid Worker cold-start scans.

Supported document reference types include:

- `datasheet`
- `location`
- `flowcalc`
- `vendor`
- `monitoring`
- `dcs`
- `reference`
- `jbxx`
- `gds`

## Sample Data

Synthetic sample files are in `sample-data/`. They are intentionally small and do not contain production content.

The sample set covers:

- one flow instrument with datasheet, location, flow calculation, vendor, monitoring, DCS, reference, and loop-wiring examples;
- one GDS instrument example;
- one local pressure-gauge example with no inherited remote location;
- one manual preview example.

## Local Development

Install Wrangler if needed:

```powershell
npm install -g wrangler
```

Create a local Wrangler config from the example:

```powershell
Copy-Item wrangler.example.toml wrangler.toml
```

Then replace placeholder Cloudflare IDs and resource names in `wrangler.toml`.

Run the Worker locally:

```powershell
wrangler dev
```

## Production Sync Workflow

Production deployments use generated JSON files and Cloudflare resources. Real production paths and credentials are not part of this repository.

Typical sync flow:

```powershell
python .\sync_production_kv.py --upload
wrangler deploy
```

Before using the sync script in a real environment, review and update:

- manifest file paths;
- KV namespace ID;
- Cloudflare account/authentication;
- R2 bucket name;
- sensitive environment variables.

## Security Notes

- Do not commit `.env`, `.r2_credentials`, Wrangler local state, real manifests, upload logs, rendered production pages, or customer drawings.
- Use environment variables or Wrangler secrets for credentials.
- Rotate any credential that has ever been copied into a script or local log.
- Treat production manifest data as sensitive unless explicitly approved for release.

## Current Public Scope

This repository is suitable for:

- code review of the Worker/frontend implementation;
- understanding the manifest-driven document query architecture;
- developing against synthetic sample data;
- sharing the project design without exposing operational data.

It is not a complete production data export.
