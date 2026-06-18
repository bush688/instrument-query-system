# Security Policy

This repository intentionally excludes production data, real manifests, rendered customer drawings, Cloudflare credentials, API keys, and local deployment state.

Before publishing or accepting contributions, check for:

- `.env` or local credential files;
- Wrangler state directories;
- production `manifest` / `tag_meta` / `search_index` exports;
- R2 upload lists and logs;
- rendered document images from real plants;
- hardcoded bearer tokens or API keys.

All example values in this repository are placeholders.
