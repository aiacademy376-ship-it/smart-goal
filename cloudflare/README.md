# SmartGoal Cloudflare backend foundation

This directory is the first backend foundation for the SmartGoal upgrade.

Files:
- worker.js: Cloudflare Worker API for register, login, current user and logout.
- schema.sql: D1 schema for users, sessions, goals, tasks, habits, settings, notifications and rewards.
- wrangler.jsonc: Worker and D1 configuration template.

Dashboard deployment:
1. Create a D1 database named smartgoal-db in Cloudflare.
2. Run schema.sql in the D1 Console.
3. Copy the D1 database ID into wrangler.jsonc, replacing the placeholder.
4. Create a Worker named smartgoal-api and paste worker.js into its dashboard editor.
5. Bind the D1 database to the Worker using binding name DB.
6. Set ALLOWED_ORIGINS to the exact frontend origin; never use wildcard *.
7. Deploy and test GET /api/health.

Security:
- Passwords use PBKDF2-HMAC-SHA-256 with random per-user salts.
- Session tokens are random; only SHA-256 token hashes are stored in D1.
- Session cookies are HttpOnly, Secure and SameSite=None.
- Register and login have a basic per-IP rate limit and strict Origin checks.
- Under-13 self-registration is blocked until a reviewed guardian-consent flow exists.

Production limitations:
- Email verification, password reset, guardian consent, account deletion workflow, full audit logging and authenticated CRUD endpoints are not implemented yet.
- The existing frontend still comments out auth.js and uses local-demo authentication. Do not enable production sign-in until frontend integration and deployment are completed.
- GitHub Pages and workers.dev are cross-site. Third-party cookie restrictions can prevent cookie sessions from working consistently. Production should route /api through the same custom site origin (for example, a Pages Function proxy) before public sign-in is enabled.
- Review privacy, child-safety and local legal requirements with qualified counsel before launch.