# SmartGoal — Cloudflare deployment notes

## Canonical files in this branch

Use the root-level deployment files below. The files formerly stored in this directory are an earlier draft and must not be deployed alongside the current implementation.

- `worker/index.js` — current Cloudflare Worker API.
- `worker/migrations/0001_initial.sql` — current D1 migration.
- `wrangler.toml` — Worker deployment configuration.
- `functions/api/[[path]].js` — same-origin Cloudflare Pages API proxy.
- `script.js` — frontend authentication and data-sync integration.

## Existing Cloudflare resources (audited 2026-11-03)

- Existing Worker: `smart-goal` (keep unchanged until the replacement is tested).
- D1 database: `smartgoal-db`, ID `08d5a6c1-0cd9-4cd8-8544-953a2a32b85b`.
- The D1 database had zero tables at audit time.
- No Pages project or R2 bucket existed at audit time.

The root `wrangler.toml` targets a separate Worker named `smartgoal-api` and binds the audited D1 database using binding `DB`. Do not replace the existing `smart-goal` Worker during initial testing.

## Pages configuration

Connect the repository to Cloudflare Pages. Use the repository root as the output directory and no build command for the current static frontend. Keep `main` as the production branch; use `smartgoal/cloudflare-upgrade` as a preview branch until the changes pass validation.

Set the Pages environment variable:

- `API_ORIGIN` = `https://smartgoal-api.<your-workers-subdomain>.workers.dev`

Set the Worker variable `ALLOWED_ORIGINS` to the exact Pages hostname(s), not a wildcard. Update the placeholder Pages hostname in `wrangler.toml` after Cloudflare assigns the actual project URL.

## Current implementation limits

- Account registration, login, logout, session lookup, and per-user JSON data persistence are implemented in the new API foundation.
- Passwords are hashed with PBKDF2-HMAC-SHA-256 and random salts. Only session token hashes are stored in D1. Session cookies are HttpOnly, Secure and SameSite=Lax; the Pages proxy keeps the browser-facing API same-origin.
- Login and registration have basic rate limiting and strict Origin allowlisting.
- Self-registration under age 13 is blocked until a guardian-consent workflow exists. Age bands are stored for 13–15, 16–17 and adult accounts.
- Email verification, password reset, guardian consent, account deletion, full audit logging, granular relational CRUD, community moderation and AI provider integration are not complete.
- R2 is not required for the initial auth/data test; add it only when file/avatar uploads are implemented.
- Review privacy, child-safety and Uzbekistan legal requirements with qualified counsel before public launch.

Do not describe the platform as production-ready until deployment, migration, end-to-end auth, data persistence, security and UI tests have all passed.
