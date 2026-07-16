# Nasser Al Ali Enterprises — full-stack site + admin CMS

Bilingual EN/AR public site (React + Vite) with a Node/Express + SQLite backend, an admin panel for content management, and a hardened image-upload pipeline.

## Repo layout

```
NAA/
├── package.json / railway.json              # monorepo orchestrator + Railway config
├── client/                                  # public site + admin SPA
│   ├── package.json
│   ├── index.html · vite.config.js
│   ├── public/assets/                       # static site assets (logos, hero video, seeded images)
│   ├── public/js/                           # legacy vanilla chat + consent widgets
│   └── src/
│       ├── main.jsx · App.jsx
│       ├── pages/ · components/ · context/ · hooks/ · lib/ · styles/
│       └── admin/                           # admin SPA at /admin
├── server/                                  # Node/Express + SQLite
│   ├── package.json
│   ├── data/                                # SQLite DB + backups (gitignored)
│   ├── uploads/                             # user-uploaded images (gitignored)
│   └── src/
│       ├── index.js · app.js
│       ├── config/ (env, uploadPolicies)
│       ├── db/     (schema.sql, connection, migrate, seed, seed-content, reset, backup)
│       ├── middleware/ (auth, csrf, cookies, rateLimit, errors)
│       ├── routes/ (auth, health, content, admin, uploads)
│       └── utils/  (password, jwt, audit, validate)
├── workers/                                 # Cloudflare Worker (AI chat, unchanged)
└── assets/                                  # scratch source images (gitignored)
```

## Local development (Node 20+ required)

```bash
# One-time setup
npm run install:all
cp server/.env.example server/.env      # then edit — set JWT_SECRET + admin seed
cp client/.env.example client/.env      # optional (chatbot URL, Web3Forms key)
npm run server:migrate                  # applies schema
npm run server:seed                     # creates seeded admin user
npm run server:seed:content             # loads the current site content into DB

# Everyday
npm run dev                             # client :5173  +  server :4000  (concurrent)
```

Client dev proxies `/api` and `/uploads` → `:4000`, so cookies + CSRF work same-origin. Log in at http://localhost:5173/admin.

## Environment variables

**Server** (`server/.env`):

| var | required | notes |
| --- | :-: | --- |
| `NODE_ENV` | | `development` / `production` |
| `PORT` | | default 4000 (Railway sets `$PORT`) |
| `CLIENT_ORIGIN` | ✓ | comma-separated origins allowed by CORS. Set to your deployed URL in prod. |
| `DB_PATH` | | default `./data/app.db`; **absolute path in prod** (point at persistent volume) |
| `UPLOAD_ROOT` | | default `./uploads`; **absolute path in prod** (point at persistent volume) |
| `JWT_SECRET` | ✓ | ≥ 48 random bytes. Generate: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
| `JWT_TTL_SECONDS` | | session lifetime, default 12h |
| `ADMIN_EMAIL` | ✓ (once) | used only by `npm run server:seed` |
| `ADMIN_PASSWORD` | ✓ (once) | used only by `npm run server:seed` — user is forced to change on first login |

**Client** (`client/.env`):

| var | notes |
| --- | --- |
| `VITE_WEB3FORMS_KEY` | contact form target |
| `VITE_CHAT_API_URL` | Cloudflare chat worker URL (kept as-is) |

## Managed sections

All 11 sections below render from `/api/content/:key` and are editable in the admin panel:

| key | shape | notes |
| --- | --- | --- |
| `hero` | singleton | headline/subtitle/buttons + video paths |
| `stats` | 4 items | number + bilingual label + `+` suffix flag |
| `services` | 6 items | bilingual title/body + image + icon (icon per-id, hardcoded) |
| `clients` | 43 items | logo image + name |
| `projects` | 10 items | image + name + location + `featured` flag |
| `gallery` | 15 items | civil-work photos for the marquee |
| `chairman` | singleton | photo + bilingual name/role/paragraphs |
| `certifications` | 3 items | ISO 9001/14001/45001; bilingual title + desc + cert# + valid-until |
| `awards` | 40 items | recognition photos + bilingual CSR pillars |
| `numbers` | singleton | bars + donut + KPI trio |
| `reviews` | 6 items | initials + colour + name + meta + quote; rating + count in extras |

Section-header text (overline/title/lede) sits in first-class bilingual columns; per-section extras (buttons, KPI trio, chairman paragraphs, etc.) live in a `content_sections.extra` JSON blob; each item's fields live in `content_items.data`.

## Admin panel

- Route: `/admin` (SPA — rendered outside the public site's chrome, no chatbot / consent / floating buttons leak in)
- Auth: bcrypt password hashing (12 rounds), JWT in httpOnly+Secure+SameSite=strict cookie, CSRF double-submit on all mutations, 5-strike account lockout, per-IP rate limit on login
- Force-change-password on first login
- Left sidebar: 11 sections + Audit log
- Per section: bilingual header inputs, JSON editor for extras, item list with drag-to-reorder (@dnd-kit), inline delete-with-confirm, image upload
- Toast notifications, loading states, confirmation dialogs

## Image upload pipeline (highest-risk surface — see `server/src/routes/uploads.js`)

Every uploaded image goes through:

1. **Multer memory buffer** — raw upload never touches disk
2. **SVG rejected** at fileFilter (SVGs have no reliable magic bytes)
3. **`file-type` magic-byte check** — whitelist `image/{jpeg,png,webp,gif}` only
4. **`sharp` re-encode** — auto-rotates via EXIF then strips ALL metadata; resizes to per-section caps (e.g. clients ≤400px, projects ≤1600px); adaptive quality loop down to a floor to hit the section's target size
5. **UUID filename** in per-section folder; path-traversal guard checks resolved path is inside `UPLOAD_ROOT`
6. **Rate-limited** at 40 uploads / 15 min per session

Served read-only via `express.static` with `X-Content-Type-Options: nosniff` and `Cache-Control: public, max-age=31536000, immutable`.

## Data & output safety

- **All SQL** uses prepared statements (`?` / `@named` binds) — no string concatenation anywhere
- **All admin bodies** validated: bilingual `{en, ar}` shape enforced, JSON depth/size capped, `imagePath` must start with `/uploads/` or `/assets/` (blocks `javascript:` in href attributes)
- **Every mutation** appends to `audit_log`; viewable at `/admin/audit`
- **React renders** are safe by default (JSX text auto-escaped); no `dangerouslySetInnerHTML` used
- **Nightly backup**: `npm run server:backup` uses SQLite's online-backup API (safe while writes are happening); writes to `data/backups/app-YYYYMMDD-HHMMSS.db`; keeps the newest 30. Wire to cron or Railway scheduled job.

## Deploy — Railway

This monorepo is one Node service. In production, Express serves the built React app + `/api` + `/uploads` all from the same origin (no CORS needed).

**Steps:**

1. Create a Railway project pointing at this repo.
2. Add a **persistent volume** mounted at `/data`.
3. Set env vars (Settings → Variables):
   - `NODE_ENV=production`
   - `CLIENT_ORIGIN=https://your-domain.com` (or the Railway URL)
   - `DB_PATH=/data/app.db`
   - `UPLOAD_ROOT=/data/uploads`
   - `JWT_SECRET=<generate 48+ bytes of hex>`
   - `ADMIN_EMAIL=owner@nasseralaligroup.com`
   - `ADMIN_PASSWORD=<temporary strong password>`
4. First deploy will build the client and boot the server. The schema is auto-applied on boot.
5. **Seed the admin once** by running `npm run server:seed` from the Railway shell (or add it as a one-off release command). Log in and change the password.
6. **Seed the content once** (only if you want the current hardcoded content in DB): `npm run server:seed:content`.

Railway auto-detects Nixpacks; `railway.json` at the repo root pins:
- Build: `npm run install:all && npm run build`
- Start: `npm start`
- Healthcheck: `/api/health` (returns `{ok: true}`)

Any Node 20+ host works with the same flow (Fly.io, Render, a plain VPS, etc.) — just make sure `/data` (or wherever you point `DB_PATH` / `UPLOAD_ROOT`) survives redeploys.

## About the AI chatbot

The chat widget is powered by the **Cloudflare Worker** in `workers/chat-worker.js` — a separate deploy, unchanged by this migration. The worker's `SYSTEM_PROMPT` embeds a fixed snapshot of company facts (services, clients, projects, contact info).

> **Content edits in the admin panel do NOT auto-update the chatbot.** If you add a new service or client in the CMS, the bot won't know about it until you edit `SYSTEM_PROMPT` in `workers/chat-worker.js` and redeploy the worker (`cd workers && npx wrangler deploy`).

## Scripts (root)

| script | what |
| --- | --- |
| `npm run install:all` | install root + client + server |
| `npm run dev` | client dev + server dev, concurrently |
| `npm run build` | build client → `client/dist/` |
| `npm run start` | run production server (serves API + uploads + built client) |
| `npm run server:migrate` | apply/refresh schema |
| `npm run server:seed` | seed admin user (needs `ADMIN_EMAIL` + `ADMIN_PASSWORD`) |
| `npm run server:seed:content` | (re-)seed the 11 sections with the current site content |
| `npm run server:reset` | delete the SQLite file (dev use only) |
| `npm run server:backup` | hot-backup DB with 30-file retention |
