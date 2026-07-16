# AI Chatbot - Deploy Guide

The chat widget on the site is a static file (`public/js/chat.js`) that talks to a **serverless endpoint** for the actual AI response. The AI provider's API key never touches the frontend — it lives only in the endpoint's environment.

The recommended endpoint is a **Cloudflare Worker** (100k free requests/day, one-command deploy, works from any static host).

## Deploy the worker

Prerequisites: a free Cloudflare account and the [Google AI Studio API key](https://aistudio.google.com/apikey).

```bash
# 1. Change into the worker folder
cd workers/

# 2. Log in to Cloudflare (one-time, opens a browser)
npx wrangler login

# 3. Store your AI API key as a secret (never in the code)
npx wrangler secret put AI_API_KEY
#    (paste the key when prompted, press Enter)

# 4. Deploy
npx wrangler deploy
```

The last command prints something like:

```
Published naa-chat (0.42 sec)
  https://naa-chat.<your-subdomain>.workers.dev
```

**Copy that URL.**

## Wire the site to the worker

1. In the site repo root, open **`.env`** (create it from `.env.example` if it doesn't exist).
2. Set:
   ```
   VITE_CHAT_API_URL=https://naa-chat.<your-subdomain>.workers.dev
   ```
3. Rebuild:
   ```
   npm run build
   ```
4. Redeploy the `dist/` folder to your host.

That's it. The chat widget will start using the new endpoint on the next page load.

## Lock down CORS (recommended once you have a domain)

By default the worker accepts requests from any origin. Once your production domain is live, uncomment the `ALLOWED_ORIGIN` block in `workers/wrangler.toml`, set it to your domain, and redeploy:

```toml
[vars]
ALLOWED_ORIGIN = "https://nasseralaligroup.com"
```

Then `npx wrangler deploy` again.

## What happens without the worker

The site keeps working. The chat button opens the widget, and on any user message the widget shows a friendly:

> *Assistant temporarily unavailable — WhatsApp us at +974 6655 7728.*

Same message in Arabic when the site is in Arabic mode. Users always have a working escape hatch (WhatsApp / phone) even if the AI is down.

## Editing the knowledge base

The company facts, tone rules, and CTA / lead-form tags all live in the `SYSTEM_PROMPT` constant at the top of `workers/chat-worker.js`. Edit there, then `npx wrangler deploy`. No frontend changes needed — the widget doesn't know the prompt contents.

## Costs

Cloudflare Workers: 100,000 requests/day on the free tier. Google Gemini 2.0 Flash: 15 requests/minute free tier, then pennies per 1K tokens on the paid tier. Realistic small-business traffic (~50 chats/day) stays comfortably free.
