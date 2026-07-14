# Nasser Al Ali Enterprises — Website + AI Chat Widget

Static marketing site + a bilingual (EN / AR) AI chat assistant powered by Google Gemini via a Netlify serverless function.

## Repo layout

```
NAA/
├── netlify.toml              # Netlify build + functions config
├── netlify/
│   └── functions/
│       └── chat.js           # Serverless proxy → Gemini (holds the SYSTEM prompt)
├── dist/                     # Published site
│   ├── index.html
│   ├── css/style.css
│   ├── js/
│   │   ├── main.js           # Site animations, hero video, gallery, etc.
│   │   └── chat.js           # Chat widget (vanilla JS, self-contained)
│   └── assets/…              # Logos, images, videos
└── README.md                 # This file
```

## Deploy on Netlify

1. Push this repo to GitHub / GitLab / Bitbucket and connect it to Netlify.
2. `netlify.toml` at the root already declares:
   - `publish = "dist"`
   - `functions = "netlify/functions"`
   - `/api/chat` → `/.netlify/functions/chat` rewrite
3. Set the API key **as a Netlify environment variable** (never commit it):
   - **Site settings → Environment variables → Add a variable**
   - Key: `GEMINI_API_KEY`
   - Value: your Gemini API key from <https://aistudio.google.com/apikey>
4. Trigger a deploy. On the first build Netlify will:
   - Publish `dist/` as the site.
   - Bundle `netlify/functions/chat.js` (esbuild).
   - Detect the hidden `chatbot-lead` form and the visible `contact` form in `index.html` and register **Forms** endpoints for both.
5. **Wire up email delivery for contact + chatbot leads** (one-time):
   - Contact-form and chatbot-lead submissions are handled by the
     `netlify/functions/contact-submit.js` serverless function. It calls the
     **Resend** API to email `info@nasseralaligroup.com`.
   - Sign up at <https://resend.com> (free tier: 100 emails/day, 3,000/month).
   - Under **Site settings → Environment variables** add:
     - `RESEND_API_KEY` — the API key from Resend's dashboard.
     - `RESEND_FROM` (optional) — a verified sender address, e.g.
       `"Nasser Al Ali Website <noreply@nasseralaligroup.com>"`.
       If unset, the function uses Resend's `onboarding@resend.dev` sandbox sender
       (works immediately without domain verification).
   - Every submission is also written to Netlify function logs
     (**Site → Functions → contact-submit**) as a backup, whether or not the
     Resend send succeeds — nothing is ever lost.
   - The visitor only ever sees a "Thank you" message; the email routing is
     invisible to them.

That's it — visit the site, click the gold chat bubble bottom-right, and ask away.

## Local dev

```bash
npm install -g netlify-cli
netlify dev
```

`netlify dev` will serve `dist/` and expose the function at `/api/chat` with your env vars loaded from `.env` (or the linked Netlify site).

Without `netlify dev`, you can serve `dist/` with any static server; the chat button will render but calls to `/api/chat` will fail (function isn't running).

## How the chat works

- **Frontend** (`dist/js/chat.js`): floating navy/gold widget. Keeps the conversation in `sessionStorage`, renders Markdown, streams a typing indicator, offers CTA buttons parsed from `[[CTA:...]]` tags in bot replies, and shows a lead-capture form when Gemini emits `[[LEAD_FORM]]`.
- **Backend** (`netlify/functions/chat.js`): receives `{ messages, lang }`, calls Gemini's `generateContent` endpoint with the embedded `SYSTEM_PROMPT` (all NAA facts), handles 429 / 5xx with retries, returns `{ text }`.
- **The Gemini API key never leaves the server.** It is read from `process.env.GEMINI_API_KEY` inside the function.
- **Language**: automatic Arabic detection flips the widget to RTL and asks Gemini to reply in Arabic. Users can also toggle manually with the EN / ع pill in the header.
- **Lead form**: when Gemini decides the visitor has buying/hiring intent, it appends `[[LEAD_FORM]]` and the widget renders a mini contact form that POSTs to the hidden Netlify Form `chatbot-lead`. Submissions appear in **Netlify → Forms**.

## Editing the knowledge base / voice

All company facts and the assistant's behaviour live in the `SYSTEM_PROMPT` constant at the top of `netlify/functions/chat.js`. Change it there and redeploy — no frontend changes required.

## Model

Currently `gemini-2.0-flash` (free tier). To switch, edit `MODEL` at the top of `netlify/functions/chat.js`.

## Security notes

- No API key is ever shipped to the browser.
- The function performs light input shaping: trims message array to the last 16 turns and clamps individual messages to 4000 chars.
- Safety settings passed to Gemini use `BLOCK_ONLY_HIGH` thresholds so normal business questions aren't filtered.
- The `chatbot-lead` Netlify Form uses a `bot-field` honeypot to silently drop bot submissions.
