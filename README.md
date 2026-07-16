# Nasser Al Ali Enterprises - Website

React SPA (Vite + React Router) with a bilingual EN/AR interface, contact form, and AI chat assistant. **Host-agnostic** - builds to a plain `dist/` folder that any static host can serve.

## Repo layout

```
NAA/
├── package.json / vite.config.js / index.html   # Vite entry
├── public/
│   ├── assets/         # images, videos, logos (published as-is under /assets/)
│   └── js/             # legacy vanilla chat + consent widgets
├── src/
│   ├── main.jsx / App.jsx
│   ├── components/     # Header, Footer, FloatingButtons, all section components
│   ├── pages/          # Home, Services, Projects, About, Certifications,
│   │                   # Awards, Reviews, Contact, Privacy, Terms, Cookies, NotFound
│   ├── context/        # I18nContext (EN/AR)
│   ├── hooks/          # useDocumentTitle
│   ├── lib/            # constants (PHONE, EMAIL, MAP_LINK, ROUTE_TITLES)
│   └── styles/         # global.css
├── workers/            # Cloudflare Worker for the AI chat endpoint
├── deploy/             # host configs (.htaccess, nginx.conf, vercel.json) + README
├── README-CHATBOT.md   # how to deploy the chat worker
└── .env.example        # copy to .env and fill in
```

## Run locally

```bash
npm install
npm run dev            # http://localhost:5173 (hot reload)
npm run build          # produces dist/
npm run preview        # serves dist/ on http://localhost:4173
```

## Deploy

The deployable artefact is the **`dist/`** folder produced by `npm run build`. Because this is an SPA, the host must rewrite unknown paths to `/index.html`. Ready-to-use configs are in `deploy/`:

- **Apache / cPanel** → `deploy/.htaccess`
- **Nginx / VPS**    → `deploy/nginx.conf`
- **Vercel**         → `deploy/vercel.json`

Full instructions: **[`deploy/README.md`](deploy/README.md)**.

## Environment variables

Copy `.env.example` to `.env` and fill in:

| Variable | What it's for | Where to get it |
| --- | --- | --- |
| `VITE_WEB3FORMS_KEY` | Contact-form submissions to your email | Free key from https://web3forms.com |
| `VITE_CHAT_API_URL`  | URL of the deployed AI chat endpoint    | See **[`README-CHATBOT.md`](README-CHATBOT.md)** |

If either variable is missing at build time, that feature degrades gracefully - the chat button shows a "temporarily unavailable" state and the contact form surfaces a friendly error.

## Content updates

- Static content lives in `src/pages/*.jsx` and `src/components/*.jsx`.
- All EN + AR translation strings are in `src/context/I18nContext.jsx`.
- Images / videos / logos are served from `public/assets/` (referenced as `/assets/...`).
