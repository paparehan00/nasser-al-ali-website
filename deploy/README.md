# Deploy the site

The deployable artefact is the **`dist/`** folder produced by:

```bash
npm install
npm run build
```

Everything below serves that folder. The React app is a single-page app (SPA), so **any request that doesn't match a real file must be rewritten to `index.html`** - otherwise deep-links like `/about` or `/certifications` return 404.

Pick the config that matches your host and copy it into place. Nothing else is needed.

---

## Apache / cPanel shared hosting

Use **`deploy/.htaccess`**.

1. Build the site (`npm run build`).
2. Upload the **contents of `dist/`** (not the folder itself) into your `public_html/` - or whichever DocumentRoot your host uses.
3. Upload **`deploy/.htaccess`** into the same folder, alongside `index.html`.

That's it. Apache's `mod_rewrite` handles the SPA fallback; the file also sets long-cache headers on hashed assets and short-cache on `index.html`.

**Verify:** hit `https://your-domain/certifications` directly in the browser - it should load the Certifications page, not a 404.

---

## Nginx (VPS, self-hosted)

Use **`deploy/nginx.conf`**.

1. Build (`npm run build`) and upload `dist/` to your server, e.g. `/var/www/nasser-al-ali/dist`.
2. Copy the snippet in `deploy/nginx.conf` **inside** your existing `server { ... }` block. Adjust the `root` path to where you uploaded `dist/`.
3. Test + reload:
   ```bash
   sudo nginx -t && sudo systemctl reload nginx
   ```

**Verify:** same deep-link test as above.

---

## Vercel

Use **`deploy/vercel.json`**.

1. Copy `deploy/vercel.json` to the **repo root** (must be at root, not inside `deploy/`).
2. Connect the repo to Vercel and deploy.

Vercel auto-detects Vite; the `rewrites` block adds the SPA fallback, and the `headers` block sets the same cache policy as the other configs.

---

## Environment variables (all hosts)

The build reads these at build time - set them in your host's dashboard before triggering a build:

| Variable | What it's for | Where to get it |
| --- | --- | --- |
| `VITE_WEB3FORMS_KEY` | Contact form → your email | free key from https://web3forms.com |
| `VITE_CHAT_API_URL`  | AI chat endpoint URL   | URL of the Cloudflare Worker you deploy (see `workers/README-CHATBOT.md`) |

Both are prefixed `VITE_` so Vite exposes them to the client. They're safe on the client because they're either public keys (Web3Forms) or a public endpoint URL (the Worker holds the actual secret).

---

## Notes

- The `dist/` folder is regenerated on every `npm run build` - never edit files inside it by hand.
- Hashed asset filenames mean you can cache `/assets/*` forever without stale-content issues, but `index.html` must always be revalidated (all three configs above do this).
- Nothing here depends on a specific host beyond serving static files + rewriting SPA routes. Cloudflare Pages, Render Static, GitHub Pages (with a small quirk), AWS S3+CloudFront, or any plain nginx/apache box all work the same way.
