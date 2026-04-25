# Security Audit — OWASP Top 10 (2021)

Last reviewed: 2026-04-25

This document tracks the security posture of the portfolio across every OWASP
Top 10 category. Each item lists the **defenses in place** and **residual risk**
that's been accepted or deferred.

---

## A01:2021 — Broken Access Control

**Defenses:**
- Two-tier RBAC: `authenticate` middleware verifies JWT, `authorize('admin')`
  enforces role at route level
- All admin routes (`POST/PUT/DELETE /api/projects`, `/api/users/*`,
  `/api/messages` admin actions, `/api/analytics`) gated by `authorize('admin')`
- User-only routes (`/api/users/profile`, `/api/users/saved/*`,
  `/api/messages/mine`) gated by `authenticate`
- **Mass-assignment prevention:** `updateProfile` service ignores `role` and
  `isActive` on user-driven updates; only admin endpoint (`adminUpdateUser`)
  can change those fields
- **Self-lockout protection:** an admin cannot demote themselves, deactivate
  themselves, or delete their own account
- **Last-admin protection:** server refuses to delete the final admin user
- Session is invalidated on role change or deactivation (refresh token cleared)

**Residual risk:** none material.

---

## A02:2021 — Cryptographic Failures

**Defenses:**
- Passwords hashed with **bcrypt cost 12** (~250ms per hash, GPU-resistant)
- Two separate JWT signing secrets (`JWT_SECRET`, `JWT_REFRESH_SECRET`) — leak
  of one does not compromise the other
- Refresh tokens **stored as SHA-256 hashes** in the DB, not plaintext — DB
  compromise can't be used to mint new sessions
- TLS is terminated by Render (backend) and Vercel (frontend); HSTS header set
  in production
- Secrets are environment variables, never committed to git (verified by
  inspecting GitHub repo file tree)

**Residual risk:**
- Access tokens (JWT) live in `localStorage` — readable by any JavaScript
  running in the page. Mitigation: strict CORS allow-list + helmet's CSP
  defaults. Migrating to httpOnly cookies is a planned follow-up but requires
  a CSRF strategy first.

---

## A03:2021 — Injection

**Defenses:**
- All inbound JSON validated by **Zod schemas** before reaching services
- Mongoose driver enforces schema-level types — operator-injection
  (`{$ne: null}`) is rejected because Zod insists on string/number/boolean
- No `eval`, `new Function`, or templated SQL anywhere in the codebase
- File uploads (multer) restricted by MIME prefix and 5MB size cap; storage
  is in-memory then forwarded directly to Cloudinary

**Residual risk:** none material.

---

## A04:2021 — Insecure Design

**Defenses:**
- **Strong password policy** (Zod-enforced): 8+ chars with at least one
  lowercase, uppercase, and digit
- **Rate limiting** on `/api/auth/*` (20 / 15 min) and `/api/messages`
  (10 / hour) per IP
- Generic `Invalid credentials` response on login failure — no
  account-enumeration vector
- All write endpoints require explicit confirmation in the UI (delete
  buttons trigger `window.confirm`)

**Residual risk:**
- No multi-factor auth — acceptable for a personal portfolio
- No email verification on registration — no transactional email service
  is configured
- No "forgot password" flow — same reason
- No CAPTCHA on registration — IP rate limit is the only barrier

---

## A05:2021 — Security Misconfiguration

**Defenses:**
- **`helmet`** sets sensible security headers (X-Frame-Options, X-Content-Type-
  Options, Referrer-Policy, etc.)
- **HSTS** enforced in production: `max-age=31536000; includeSubDomains`
- **`X-Powered-By`** header explicitly disabled
- **CORS** locked to a single origin (`process.env.CLIENT_ORIGIN`); no `*`
- **Body limits** capped at **100KB** for JSON / urlencoded — uploads use
  multer with its own per-file 5MB cap
- Error responses never include stack traces or internal paths in
  production — only `{ error: <message> }` shape
- `dotenv` files are gitignored; Render holds production secrets

**Residual risk:**
- MongoDB Atlas network ACL is `0.0.0.0/0`. Mitigation: strong DB password,
  least-privilege DB user. Hardening to Render's egress IPs is a planned
  follow-up.

---

## A06:2021 — Vulnerable and Outdated Components

**Status:** ✅ **0 vulnerabilities** (`npm audit`)

**Defenses:**
- `package-lock.json` committed → reproducible installs
- `bcrypt` (which pulled in `tar <7.5.10` with 3 high-severity CVEs) was
  replaced by **`bcryptjs`** — pure JS, no native deps, no transitive risk
- Dependencies pinned to caret-minor (`^x.y.z`)
- `npm audit` is run before each release

**Residual risk:** must continue running `npm audit` periodically; new CVEs
appear weekly.

---

## A07:2021 — Identification and Authentication Failures

**Defenses:**
- bcrypt + strong password rules (see A04)
- JWT access token: 15-minute lifetime
- Refresh token: 7-day lifetime, stored hashed (see A02), rotated on every
  use
- **Token revocation on password change** — `refreshToken` field cleared,
  forcing re-login on all devices
- **Token revocation on role change / deactivation** — same mechanism
- Failed logins logged with IP, email, and reason for monitoring

**Residual risk:**
- No MFA (see A04)
- Refresh-token-rotation does not detect replay (an attacker who steals
  both old and new tokens before the user logs in again could chain) —
  acceptable given short JWT lifetime and httpOnly migration is planned.

---

## A08:2021 — Software and Data Integrity Failures

**Defenses:**
- Lockfiles (`package-lock.json`) committed — reproducible builds
- No untrusted-source deserialization
- `helmet` sets default CSP that blocks unauthorized script injection
- No server-side use of `eval`, `vm`, or arbitrary script execution

**Residual risk:**
- Subresource Integrity (SRI) hashes not set on Google Fonts CSS link —
  acceptable trade-off (Google rotates the underlying URL frequently and
  SRI would break the page on every rotation)

---

## A09:2021 — Security Logging and Monitoring

**Defenses:**
- Structured logger (`logger.js`) with `info` / `warn` / `error` levels
- **Logged events:**
  - Successful logins (info, with IP)
  - Failed logins (warn, with IP and reason)
  - Successful registrations (info)
  - Password changes (info)
  - Admin user updates — role changes / deactivations (info)
  - Admin user deletes (warn)
  - Server-side errors (error, with stack trace; never returned to client)
- HTTP request logs via `morgan('combined')` on Render

**Residual risk:**
- No centralized log aggregation / alerting (e.g. Sentry, Datadog) —
  manual review via Render's Logs tab is the current practice. Sentry
  integration is a planned follow-up.

---

## A10:2021 — Server-Side Request Forgery (SSRF)

**Status:** Not applicable.

The backend makes no outbound HTTP requests to user-controlled URLs. The
only outbound connections are to:
- MongoDB Atlas (controlled URI from env)
- Cloudinary (controlled credentials from env, called via official SDK)

Project `liveUrl` and `githubUrl` are **stored** but never **fetched** by
the server.

---

## How to keep this current

1. Run `npm audit` in both `backend/` and `frontend/` before each deploy
2. Re-review this document on every major dependency upgrade or auth change
3. When adding any new endpoint, ask: *Who can call this? What can they
   pass? What does it leak on error?*

---

## Reporting a vulnerability

Email: `mostafagenydy@gmail.com` with subject `SECURITY:`. Please do not
file public GitHub issues for vulnerabilities.
