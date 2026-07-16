# NAA server

Node/Express + SQLite backend for the Nasser Al Ali Enterprises site + admin CMS.

## Setup (first time)

```bash
cd server
cp .env.example .env         # then edit: set JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
npm install
npm run db:migrate
npm run db:seed              # creates the admin user; force-change-password on first login
npm run dev                  # http://localhost:4000
```

Generate a strong JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

## Scripts

| script            | what it does                                        |
| ----------------- | --------------------------------------------------- |
| `npm run dev`     | starts API with `--watch` on `PORT` (default 4000)  |
| `npm start`       | production start                                    |
| `npm run db:migrate` | applies `src/db/schema.sql` (idempotent)         |
| `npm run db:seed`    | seeds the admin from ADMIN_EMAIL / ADMIN_PASSWORD |
| `npm run db:reset`   | deletes the SQLite file (dev use only)            |

## API (Phase 1)

All state-changing routes require the `x-csrf-token` header matching the `naa_csrf` cookie.

| method | path                       | notes                                          |
| ------ | -------------------------- | ---------------------------------------------- |
| GET    | `/api/health`              | liveness                                       |
| GET    | `/api/auth/csrf`           | sets `naa_csrf` cookie, returns token          |
| POST   | `/api/auth/login`          | body: `{email, password}` → sets session cookie |
| POST   | `/api/auth/logout`         | clears session cookie                          |
| GET    | `/api/auth/me`             | current user; 401 if not authed                |
| POST   | `/api/auth/change-password`| body: `{currentPassword, newPassword}`         |

Auth model:
- Passwords hashed with **bcrypt** (12 rounds).
- Session = **JWT (HS256)** issued into `naa_session` cookie: httpOnly, Secure in prod, SameSite=strict, 12h TTL.
- **CSRF** = double-submit token (`naa_csrf` cookie + `x-csrf-token` header, timing-safe compared).
- **Rate limit + lockout**: 10 attempts / 15min per IP+email (express-rate-limit) and 5 failed logins locks the account for 15 min.
- All auth events append to `audit_log`.

## Environment variables

See `.env.example`. Required in prod: `JWT_SECRET`, `CLIENT_ORIGIN`. Never commit `.env`.
