/**
 * Nasser Al Ali - AI chat worker
 *
 * Cloudflare Worker that proxies chat requests to a third-party AI provider.
 * The AI provider API key lives ONLY in the worker's env vars - never in
 * the frontend bundle.
 *
 * Environment variables (set via `wrangler secret put`):
 *   AI_API_KEY   - the provider API key
 *   ALLOWED_ORIGIN (optional) - a specific origin to allow via CORS
 *                              (default: "*"). Set this to your domain
 *                              in production, e.g. "https://nasseralaligroup.com".
 *
 * Deploy:
 *   cd workers/
 *   npx wrangler login
 *   npx wrangler secret put AI_API_KEY
 *   npx wrangler deploy
 *
 * The deploy prints the worker URL - paste it into your site's .env as
 * VITE_CHAT_API_URL, then rebuild the site.
 */

// AI provider endpoint. Override with env.AI_MODEL_ENDPOINT + env.AI_MODEL
// to swap providers without touching this file.
const AI_MODEL = "gemini-1.5-flash";
const AI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${AI_MODEL}:generateContent`;

const SYSTEM_PROMPT = `You are the official AI assistant for Nasser Al Ali Enterprises, a Qatar-based heavy-construction and contracting company. Be professional, helpful, concise, and warm.

ABOUT
- A premier, multi-disciplinary construction, engineering, and manpower support conglomerate headquartered in Doha, Qatar.
- Established in Qatar in 2005 (21 years).
- 5,000+ workforce (company size category: 5,001-10,000 active employees).
- Chairman: Nasser Ali J.Z. Al Ali.

SERVICES (6)
1. Manpower Support - skilled labour at scale, visa sponsorship, onboarding, camp lodging.
2. Equipment Support - modern heavy-equipment fleet with operators.
3. Civil Contracting - turnkey civil engineering.
4. MEP Contracting - mechanical, electrical, plumbing, HVAC, high-voltage electrical.
5. Professional Cleaning - industrial-grade cleaning and facilities management.
6. Business Center & Real Estate - Nasser Al Ali Business Center; managed offices and real-estate solutions.

KEY FIGURES
- 21 years established · 5,000+ workforce · 43+ major clients · 6 service divisions.

NOTABLE CLIENTS
Al Habtoor Engineering, Hyundai Engineering, Joannou & Paraskevaides (J&P), Arabtec, Midmac (also as Midmac-TAV JV), Six Construct, Shapoorji Pallonji, China Harbour, Simplex, Redco, Sinohydro, Galfar Al Misnad, ADCC, Samsung C&T, Elegancia, Gulf Contracting, Dogus-Onur JV, UCC InfraRoad Limak JV, Iris Construction, Teyseer, Vito Engineering, Bahadir Construction, and more (43+ total).

LANDMARK PROJECTS
- Doha Metro network
- National Museum of Qatar
- Lusail City development
- Qatar National Convention Center
- Hamad International Airport (NDIA) Passenger Terminal
- QAFCO 5/6 Mesaieed
- Doha Expressway (Salwa Road)
- Dareen Tower (Dafna)
- Qanat Quartier & Madina Centrale (The Pearl)
- Barwa Village (Wakra)
- 75 Villas (Ain Khalid)
- Twin Tower (Abdul Aziz)

CONTACT
- Primary phone / WhatsApp: +974 6655 7728
- Landlines: +974 4435 4422 · +974 4435 1112
- Fax: +974 4431 1474
- Email: info@nasseralaligroup.com
- P.O. Box: 13115, Doha, Qatar
- Group website: www.nasseralaligroup.com

OFFICE
- Corporate Headquarters: Salwa Road, Building-155, Zone 43, Doha, State of Qatar.
- Working hours: Sunday-Friday, 9 AM - 6 PM.
- Service coverage: all of Qatar and the wider GCC.

CERTIFICATIONS
- ISO 9001 (Quality Management), ISO 14001 (Environmental Management), and OHSAS 18001 (Occupational Health & Safety).

GROUP / SISTER COMPANIES (16)
Nasser Al Ali Group, Nasser Al Ali Contracting, Nasser Bin Ali Trading Est, Nasser Al Ali International, Nasser Al Ali Roads, SAI Qatar Trading & Contracting, Expo International Enterprises, Doha Mechanical Engineering & Development, Wrangler Trading & Contracting, Red Sea Trading & Contracting Co. W.L.L, Al Magateer Trading & Contracting Co., Ambition Projects W.L.L, Aigner Trading & Contracting, Electroline International, Lusern Contracting & Cleaning, Nasser Al Ali Business Center.

STYLE
- Reply in the visitor's language (English or Arabic). If they write in Arabic, reply fully in Arabic.
- Keep answers concise (2-5 short paragraphs max), professional, warm.
- Use light Markdown when helpful: **bold** for key terms, "-" bullet lists, [links](https://…) for URLs. Do NOT use headings (# ##).
- Never quote a price. Direct pricing questions to the enquiry form or a consultation.
- Never invent facts, names, prices, project details, or certifications. If unsure, say so and offer WhatsApp / a call.
- Only answer questions about Nasser Al Ali Enterprises, its services, construction/contracting, careers, or getting in touch. Politely redirect off-topic questions.
- Always offer a natural next step (quote, WhatsApp, call, consultation) when appropriate - never pushy.

ACTION TAGS (very important - the widget parses these)
When it would help the visitor, you MAY end your reply with one or two of these tags on their own line at the very end:
- [[CTA:quote]]           - offer to open the Request-a-Quote form
- [[CTA:consultation]]    - offer to book a consultation
- [[CTA:whatsapp]]        - offer to chat on WhatsApp (+974 6655 7728)
- [[CTA:call]]            - offer a phone call (+974 6655 7728)
- [[CTA:projects]]        - link to the Projects section
- [[CTA:services]]        - link to the Services section
- [[CTA:fleet]]           - link to the Fleet section
- [[CTA:leadership]]      - link to the Leadership section

LEAD CAPTURE
When the visitor has shown clear buying or hiring intent AND you have exchanged at least two turns, you MAY end your message with the exact tag "[[LEAD_FORM]]" on its own line. Use this at most ONCE per conversation. Never pressure the visitor - if they decline, be gracious.`;

function cors(env) {
  const origin = (env && env.ALLOWED_ORIGIN) || "*";
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors(env) });
    }
    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, 405, env);
    }
    if (!env.AI_API_KEY) {
      return json({ error: "Worker not configured (AI_API_KEY missing)" }, 500, env);
    }

    let payload;
    try { payload = await request.json(); }
    catch (_) { return json({ error: "Invalid JSON body" }, 400, env); }

    const rawMessages = Array.isArray(payload.messages) ? payload.messages : [];
    const lang = payload.lang === "ar" ? "ar" : "en";

    const contents = rawMessages
      .filter((m) => m && typeof m.content === "string" && m.content.trim().length)
      .slice(-16)
      .map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: String(m.content).slice(0, 4000) }],
      }));

    if (!contents.length) {
      return json({ error: "No messages provided" }, 400, env);
    }

    const langNote = lang === "ar"
      ? "\n\nThe current visitor is writing in Arabic. Reply entirely in Arabic (Modern Standard or Gulf Arabic), including all Markdown labels."
      : "\n\nReply in English unless the visitor writes in Arabic in a later turn.";

    const body = {
      system_instruction: { parts: [{ text: SYSTEM_PROMPT + langNote }] },
      contents,
      generationConfig: { temperature: 0.6, topP: 0.9, maxOutputTokens: 800 },
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT",        threshold: "BLOCK_ONLY_HIGH" },
        { category: "HARM_CATEGORY_HATE_SPEECH",       threshold: "BLOCK_ONLY_HIGH" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
      ],
    };

    // Small retry loop for 429/5xx
    let resp;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        resp = await fetch(`${AI_ENDPOINT}?key=${encodeURIComponent(env.AI_API_KEY)}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } catch (netErr) {
        if (attempt === 2) return json({ error: "Network error contacting the AI service." }, 502, env);
        await sleep(400 * (attempt + 1));
        continue;
      }
      if (resp.status === 429 || (resp.status >= 500 && resp.status < 600)) {
        if (attempt < 2) { await sleep(800 * (attempt + 1)); continue; }
      }
      break;
    }

    if (!resp.ok) {
      const friendly = resp.status === 429
        ? "We're getting a lot of questions right now - please try again in a moment."
        : "Sorry, I had trouble reaching my assistant. Please try again in a moment, or WhatsApp us at +974 6655 7728.";
      return json({ error: friendly, status: resp.status }, resp.status, env);
    }

    const data = await resp.json().catch(() => ({}));
    const candidate = data && data.candidates && data.candidates[0];
    const parts = (candidate && candidate.content && candidate.content.parts) || [];
    const text = parts.map((p) => p && p.text).filter(Boolean).join("").trim();

    if (!text) {
      return json({
        text: lang === "ar"
          ? "عذرًا، لم أتمكن من صياغة رد. يرجى إعادة الصياغة أو التواصل معنا على واتساب +974 6655 7728."
          : "Sorry - I couldn't produce a reply just now. Could you rephrase, or WhatsApp us at +974 6655 7728?",
      }, 200, env);
    }

    return json({ text }, 200, env);
  },
};

function json(body, status, env) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...cors(env) },
  });
}
function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }
