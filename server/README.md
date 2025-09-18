Moderation & Confusables
=======================

This server supports optional remote moderation and local confusable scrubbing.

Environment variables
- `MODERATION_URL` — URL of a moderation endpoint that accepts POST `{ text }` and returns a JSON result. If the API returns `{ flagged: true }` (or similar), the username will be rejected.
- `MODERATION_KEY` — optional API key sent as `Authorization: Bearer <KEY>`.
- `MODERATION_FAIL_CLOSED` — if set to `'0'`, the server will allow registrations when the moderation API errors; any other value (or unset) will cause the server to block registrations when the moderation API fails (fail-closed).

Logging
- Moderation decisions and errors are appended to `server/moderation.log` for auditing.

Notes
- The server also performs local profanity checks (using `bad-words`) and local confusable scrubbing. The remote moderation check is optional but recommended for production.
