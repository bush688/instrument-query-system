# Data Governance

This public repository is code-first. Production drawings, generated manifests, customer files, rendered document images, upload logs, and credentials are not part of the repository.

## Public Data Policy

- Only synthetic sample data is committed.
- Real plant drawings, spreadsheets, PDFs, manuals, OCR outputs, and rendered page images must stay outside Git.
- Production KV/R2 exports must not be committed.
- Local paths in utility scripts are examples of the production workflow and must be adjusted before reuse.

## Credential Policy

- Do not commit `.env`, `.r2_credentials`, Wrangler local state, API tokens, bearer tokens, cookies, private keys, or Cloudflare credentials.
- R2 upload scripts must read secrets from environment variables or Wrangler-managed secrets.
- Any credential that was ever pasted into a script or log should be rotated before production use.

## Manifest Policy

The production system uses generated metadata:

- `manifest`
- `tag_meta`
- `tag_list`
- `search_index`

Only synthetic versions of these files are included under `sample-data/`.

## Document Sample Policy

Each supported document category is represented by a synthetic placeholder image:

- datasheet
- location
- flow calculation
- vendor document
- monitoring table
- DCS program
- reference document
- loop wiring
- GDS
- manual preview

These samples are not derived from customer files.

## Operational Rule

Before publishing any new file, run a secret scan and a large-file scan. If a file is generated from production data, do not commit it unless it has been explicitly sanitized and approved.
