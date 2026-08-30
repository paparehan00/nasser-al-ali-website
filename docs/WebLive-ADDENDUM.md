# Website Go-Live Guide — Addendum & Corrections

**Read this alongside `WebLive.pdf`. Where the two disagree, this document wins.**

Prepared August 2026. Covers four corrections to the printed guide, the hosting
and cost decision, and the ongoing running of the site.

---

## Part 1 — Corrections to WebLive.pdf

### Correction 1 — Step 7 is now mostly automatic (pages 12 and 3)

The printed guide says `server/uploads` is deliberately kept out of GitHub, and
walks you through uploading roughly 70 image files by hand through Railway's
interactive file browser.

**That is not accurate.** `server/uploads` is committed to the repository. Only
the database (`server/data/*.db`) is kept out.

The server now copies those images onto the volume by itself on first boot, so
**Step 7, item 5 (the `railway volume browse` file-by-file upload) can be
skipped entirely.** The copy never overwrites a file already on the volume, so
images uploaded later through /admin are always safe.

What still has to be done by hand in Step 7:

| Step 7 item | Status |
| --- | --- |
| 1 to 3 (install CLI, log in, link project) | Still required |
| 4 (upload `server/data/app.db`) | **Still required.** The database is genuinely not in GitHub. |
| 5 (upload the images) | **No longer needed.** Handled automatically on boot. |
| 6 to 8 (check variables, redeploy, verify) | Still required |

If you ever do need to place the images manually, this one command replaces the
whole interactive browser session:

```bash
railway run cp -r server/uploads/. /data/uploads/
```

### Correction 2 — Checkpoint the database before you zip or upload it

SQLite runs in WAL mode, which means recent changes can be sitting in a
side-file (`app.db-wal`) rather than in `app.db` itself. Step 7 tells you to
upload `app.db` alone. If a `-wal` file is present next to it, **doing that
silently loses whatever is in the side-file** — potentially the most recent
content edits.

Before zipping the project or uploading the database, stop the local server
(Ctrl + C) and run:

```bash
node -e "const D=require('better-sqlite3');const d=new D('server/data/app.db');d.pragma('wal_checkpoint(TRUNCATE)');d.close()"
```

Then confirm that `server/data/` contains **only** `app.db`, with no `app.db-wal`
or `app.db-shm` beside it. This has already been done for the copy you were
given; you only need it if the site is run locally again before handover.

### Correction 3 — Set VITE_CHAT_API_URL before the first build, not after

The printed Step 9 leaves `VITE_CHAT_API_URL` blank until the chat worker is
deployed, then sets it and rebuilds. That works, but it means the site is live
with a dead chat bubble in between, and the value is baked in at build time so a
plain restart will not pick it up — only a full redeploy will.

If the worker address is already known (it is:
`https://naa-chat.nasser-al-ali.workers.dev`), set the variable in Step 5 with
everything else and skip the second rebuild.

### Correction 4 — The security policy needed fixing, and has been

The server sends a Content-Security-Policy header, which tells the browser what
the page is allowed to load. The previous default policy blocked three things
that only appear in production, never when testing locally:

1. the small script that hands the chat widget its address, so the chat bubble
   loaded but could never answer;
2. the chat widget's connection to the Cloudflare Worker;
3. the Google Maps embed on the Contact page.

All three failed **silently** — no error message, the page just looked fine with
pieces quietly missing. This is fixed in `server/src/middleware/csp.js`. It is
mentioned here only so that nobody reintroduces the problem by "simplifying"
that file later.

---

## Part 2 — Hosting, security and cost

### The recommendation

**Railway (Hobby plan) with Cloudflare in front of it. Roughly 75 US dollars per year.**

| Item | Provider | Cost per year |
| --- | --- | --- |
| Hosting, always on, with 1 GB permanent storage | Railway Hobby | $60 |
| CDN, SSL certificate, firewall, DDoS protection, DNS | Cloudflare Free | $0 |
| AI chat helper | Cloudflare Workers Free | $0 |
| Chat AI model | Groq free tier | $0 |
| Outgoing email | Brevo free tier (300/day) | $0 |
| Uptime monitoring | UptimeRobot free | $0 |
| Code storage | GitHub Free (private) | $0 |
| Off-site backups | Cloudflare R2 free tier (10 GB) | $0 |
| Domain renewal | existing registrar | $12 to $25 |
| **Total** | | **about $72 to $85** |

### Why not free hosting

This site is not a set of static pages. It runs a live server process and writes
to a real disk (the database, and every photo uploaded through /admin). That
combination rules out the free tiers people usually suggest:

| Option | Why not |
| --- | --- |
| Vercel, Netlify, Cloudflare Pages | No writable disk. The database and photo uploads cannot work at all. |
| Render free tier | Sleeps after 15 minutes idle, and has no permanent disk. Visitors wait up to a minute; uploads are wiped on every update. |
| Koyeb free tier | Sleeps after 1 hour idle. Closed to new signups since February 2026. |
| Fly.io free tier | Discontinued for new accounts in October 2024. |
| Oracle Cloud Always Free | Genuinely free and always on, but Oracle reclaims instances that sit idle, there is no support to call, and you become responsible for operating system updates, web server config and SSL renewals yourself. Not appropriate for a company's public site. |

### Cloudflare is not optional

Put Cloudflare in front of Railway. It is free, and it does three jobs at once:

1. **Controls the bill.** The site carries large video and PDF files. Served
   straight from Railway these are charged per gigabyte; cached at Cloudflare
   they are free. This is what keeps the monthly cost inside Railway's included
   allowance.
2. **Speeds up the site for visitors in Qatar.** Railway has no Middle East
   region — the server will sit in Amsterdam. Cloudflare serves the cached
   images and video from a nearby location instead.
3. **Adds security.** Free managed firewall rules, unlimited DDoS protection and
   a free SSL certificate.

**Important setting:** in Cloudflare, set SSL/TLS mode to **Full (strict)**.
Leaving it on "Flexible" causes an endless redirect loop.

### Deployment settings worth getting right

- Railway region: **Europe West (Amsterdam)** — closest available to Qatar.
- Volume mount path: `/data`, with `DB_PATH=/data/app.db` and `UPLOAD_ROOT=/data/uploads`.
- Restrict the Railway service so it only accepts traffic from Cloudflare's IP
  ranges. Otherwise someone can bypass the CDN and run up the bandwidth bill.
- Set a usage alert in Railway at about $15/month as an early warning.

---

## Part 3 — Backups (the part that actually matters)

### The problem

`npm run server:backup` keeps the 30 most recent copies of the database — but it
writes them to `/data/backups`, which is **the same disk as the live database**.
If that disk is lost, the database and every backup of it are lost together.
Railway does not automatically back up Hobby volumes.

### The fix

The backup job now sends every fresh backup somewhere off the hosting platform.
Configure **at least one** of these two options in the Railway Variables tab.

**Option A — Cloudflare R2 (recommended, free, 10 GB)**

1. In the Cloudflare dashboard, open **R2** and create a bucket, e.g. `naa-backups`.
2. Create an **R2 API token** with Object Read & Write permission on that bucket.
   Copy the Access Key ID, the Secret Access Key, and the account endpoint URL.
3. Add these variables in Railway:

   ```
   BACKUP_S3_ENDPOINT=https://<your-account-id>.r2.cloudflarestorage.com
   BACKUP_S3_BUCKET=naa-backups
   BACKUP_S3_REGION=auto
   BACKUP_S3_ACCESS_KEY_ID=<access key id>
   BACKUP_S3_SECRET_ACCESS_KEY=<secret access key>
   BACKUP_S3_PREFIX=naa-backups
   ```

**Option B — emailed backup (simplest, no new account)**

Reuses the email settings already configured. The database is about 120 KB, far
inside any attachment limit.

```
BACKUP_EMAIL_TO=it@nasseralalienterprises.com
```

Both can be set at once, which is the safest arrangement.

If neither is set, the backup still runs but prints a loud warning explaining
that the copy is not protected.

### Running it on a schedule

Do not rely on someone remembering. Set up a Railway cron schedule running
`npm run server:backup` weekly. A monthly calendar reminder to *check that the
backups are arriving* is still worth having on top of that.

### Restoring from a backup

1. Download the backup file (from R2, or from the email attachment).
2. Rename it to `app.db`.
3. `railway volume files upload app.db /app.db`
4. Redeploy the service.

---

## Part 4 — Ongoing running

### What paying the bill does and does not cover

Paying about $85 a year keeps the server running. It does **not** by itself
protect against these, which need a person:

| Risk | What to do |
| --- | --- |
| A failed card payment suspends the site; a lapsed domain renewal can lose the domain outright | Turn on auto-renew for both. Send billing notices to a company address that survives staff changes, not a personal inbox. |
| The database disk is lost | Configure off-site backups (Part 3). This is the only failure in this setup with no other recovery path. |
| Email credentials revoked, chat AI key rotated | Nothing warns you. Send a test enquiry monthly and confirm it arrives. |
| Site goes down and nobody notices | UptimeRobot (free) checking `/api/health`, alerting **two** people. |
| A wrong edit in /admin | Backups. There is no undo in the admin panel. |

### Realistic expectations

Railway's Hobby plan carries **no uptime guarantee**. Expect roughly 99.9%
availability, a few seconds of downtime each time the site is updated, and
possibly one longer incident per year. Cloudflare's "Always Online" feature will
keep serving cached pages through part of any outage.

### Monthly five-minute check

- Submit a test enquiry on the Contact page; confirm the confirmation email arrives
- Open the chat bubble; confirm it replies
- Confirm a backup arrived in R2 or the email inbox this month
- Log in to /admin, make a trivial edit, confirm it appears on the live site
