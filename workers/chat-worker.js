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
 *                              in production, e.g. "https://nasseralalienterprises.com".
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

// AI provider endpoint - Groq (OpenAI-compatible chat-completions API).
// Auth uses `Authorization: Bearer ${AI_API_KEY}` header, NOT a ?key= query param.
//
// llama-3.3-70b-versatile was retired by Groq on 2026-08-16 (confirmed via
// https://console.groq.com/docs/deprecations) — every request was failing
// with a 404 from Groq until this switch. Groq's own recommended
// replacements are "openai/gpt-oss-120b" or "qwen/qwen3.6-27b"; picked Qwen
// since this project already needed strong Arabic reliability (see the
// language rule below) and Qwen was already the documented pick for that
// before this deprecation forced the change.
//
// Other options if Arabic replies ever drift unreliable again:
//   "mistral-saba-24b"             – Mistral's Arabic/Middle-East optimised model
//   "openai/gpt-oss-120b"          – Groq's other recommended replacement
const AI_MODEL = "qwen/qwen3.6-27b";
const AI_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

const SYSTEM_PROMPT = `LANGUAGE RULE — READ THIS FIRST, HIGHEST PRIORITY, NO EXCEPTIONS:
• If the visitor's selected language is Arabic (ar) OR they write any Arabic text, you MUST reply ENTIRELY in Arabic (Modern Standard Arabic فصحى). Every word — including greetings, bullet labels, linking words, and markdown text — must be in Arabic. Company names may appear as-is, but ALL surrounding text must be Arabic. NEVER switch to English mid-reply.
• If the visitor's selected language is English (en) AND they write in English, reply fully in English.
• This rule OVERRIDES everything else in this prompt. Verify the language before every sentence.

---

You are the official AI assistant for Nasser Al Ali Enterprises, a Qatar-based heavy-construction and contracting company. Be professional, helpful, concise, and warm.

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
- Mobile: +974 5586 1100 · +974 5559 6774
- WhatsApp: +974 5559 6774
- Email: info@nasseralalienterprises.com
- P.O. Box: 13115, Doha, Qatar
- Group website: www.nasseralalienterprises.com

OFFICE
- Corporate Headquarters: Salwa Road, Building-155, Zone 43, Doha, State of Qatar.
- Working hours: Sunday-Thursday, EXACTLY 9:00 AM to 6:00 PM. The opening time is 9:00 AM, NOT 8:00 AM - do not round down or guess a different opening time.
- Service coverage: all of Qatar and the wider GCC.

CERTIFICATIONS
- ISO 9001 (Quality Management), ISO 14001 (Environmental Management), and OHSAS 18001 (Occupational Health & Safety).

GROUP / SISTER COMPANIES (16)
Nasser Al Ali Group, Nasser Al Ali Contracting, Nasser Bin Ali Trading Est, Nasser Al Ali International, Nasser Al Ali Roads, SAI Qatar Trading & Contracting, Expo International Enterprises, Doha Mechanical Engineering & Development, Wrangler Trading & Contracting, Red Sea Trading & Contracting Co. W.L.L, Al Magateer Trading & Contracting Co., Ambition Projects W.L.L, Aigner Trading & Contracting, Electroline International, Lusern Contracting & Cleaning, Nasser Al Ali Business Center.

STYLE
- Answer ONLY from the provided company information above. If you don't know something, say so plainly and offer to connect the visitor via WhatsApp/contact - never guess or invent facts, names, or prices.
- Numbers must be copied exactly as given above (working hours, phone numbers, years, headcounts). Re-check any number you are about to state against the source text before answering.
- Reply language is controlled by the LANGUAGE RULE at the top of this prompt — always Arabic when lang=ar or visitor writes Arabic.
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
- [[CTA:whatsapp]]        - offer to chat on WhatsApp (+974 5559 6774)
- [[CTA:call]]            - offer a phone call (+974 5586 1100)
- [[CTA:projects]]        - link to the Projects section
- [[CTA:services]]        - link to the Services section
- [[CTA:fleet]]           - link to the Fleet section
- [[CTA:leadership]]      - link to the Leadership section

LEAD CAPTURE
When the visitor has shown clear buying or hiring intent AND you have exchanged at least two turns, you MAY end your message with the exact tag "[[LEAD_FORM]]" on its own line. Use this at most ONCE per conversation. Never pressure the visitor - if they decline, be gracious.`;

const ALLOWED_ORIGINS = new Set([
  "http://localhost:4173",
  "https://www.nasseralalienterprises.com",
  "https://nasseralalienterprises.com",
  "https://alnassertest.sameem.com.np",
]);

function isAllowedOrigin(origin) {
  if (ALLOWED_ORIGINS.has(origin)) return true;
  try {
    const u = new URL(origin);
    if (u.protocol === "https:" && u.hostname.endsWith(".devtunnels.ms")) return true;
    // Any localhost/127.0.0.1 port — Vite picks a different port whenever
    // the previous one is still taken (5173, 5174, 5175, ...), so hardcoding
    // one exact port here just breaks CORS again the next time it drifts.
    if (u.protocol === "http:" && (u.hostname === "localhost" || u.hostname === "127.0.0.1")) return true;
    return false;
  } catch {
    return false;
  }
}

function cors(request) {
  const origin = request ? request.headers.get("Origin") || "" : "";
  const allowed = isAllowedOrigin(origin) ? origin : "";
  return {
    ...(allowed ? { "Access-Control-Allow-Origin": allowed } : {}),
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors(request) });
    }
    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, 405, request);
    }
    if (!env.AI_API_KEY) {
      return json({ error: "Worker not configured (AI_API_KEY missing)" }, 500, request);
    }

    let payload;
    try { payload = await request.json(); }
    catch (_) { return json({ error: "Invalid JSON body" }, 400, request); }

    const rawMessages = Array.isArray(payload.messages) ? payload.messages : [];
    const lang = payload.lang === "ar" ? "ar" : "en";

    // OpenAI / Groq chat-completions message shape:
    // {role:"system"|"user"|"assistant", content:"..."}
    // Client sends role="user"/"assistant"; anything else is normalised to "user".
    const conversation = rawMessages
      .filter((m) => m && typeof m.content === "string" && m.content.trim().length)
      .slice(-16)
      .map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: String(m.content).slice(0, 4000),
      }));

    if (!conversation.length) {
      return json({ error: "No messages provided" }, 400, request);
    }

    const langNote = lang === "ar"
      ? "\n\n⚠️ MANDATORY — ARABIC ONLY: The visitor's language is set to Arabic. Your ENTIRE reply must be in Arabic (Modern Standard Arabic فصحى). Not a single English word is permitted — not in greetings, bullet points, markdown labels, transitions, or any part of the response. Re-read your reply before sending and replace any English with Arabic. This requirement cannot be overridden."
      : "\n\nReply in English. If the visitor switches to Arabic in a later message, switch your reply to Arabic immediately.";

    const body = {
      model: AI_MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT + langNote },
        ...conversation,
      ],
      temperature: 0.3,   // Low = literal / faithful to the company facts
      max_tokens: 800,
      stream: false,      // Matches previous non-streaming behaviour
      // Qwen3.6 is a reasoning model — left alone, its <think>...</think>
      // chain-of-thought comes back inline in `content` (and is verbose
      // enough to blow through max_tokens before ever reaching the actual
      // answer, so reasoning_format:"hidden" — which still runs the hidden
      // reasoning — isn't enough on its own). reasoning_effort is the
      // Qwen3-specific control; "none" skips reasoning entirely, which also
      // suits a customer-facing widget better (faster replies, no wasted
      // tokens on hidden thinking).
      reasoning_effort: "none",
    };

    // Small retry loop for 429/5xx
    let resp;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        resp = await fetch(AI_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type":  "application/json",
            "Authorization": `Bearer ${env.AI_API_KEY}`,
          },
          body: JSON.stringify(body),
        });
      } catch (netErr) {
        if (attempt === 2) return json({ error: "Network error contacting the AI service." }, 502, request);
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
        : "Sorry, I had trouble reaching my assistant. Please try again in a moment, or WhatsApp us at +974 5559 6774.";
      return json({ error: friendly, status: resp.status }, resp.status, request);
    }

    // OpenAI / Groq response shape:
    //   { choices: [{ message: { role, content }, finish_reason }, ...], ... }
    const data = await resp.json().catch(() => ({}));
    const rawText = (
      data &&
      data.choices &&
      data.choices[0] &&
      data.choices[0].message &&
      typeof data.choices[0].message.content === "string"
    ) ? data.choices[0].message.content : "";
    // Defensive: reasoning_effort:"none" already prevents this, but strip
    // any stray <think> block too so a provider/model change never leaks
    // raw chain-of-thought into the widget again.
    const text = rawText.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

    if (!text) {
      return json({
        text: lang === "ar"
          ? "عذرًا، لم أتمكن من صياغة رد. يرجى إعادة الصياغة أو التواصل معنا على واتساب +974 5559 6774."
          : "Sorry - I couldn't produce a reply just now. Could you rephrase, or WhatsApp us at +974 5559 6774?",
      }, 200, request);
    }

    return json({ text }, 200, request);
  },
};

function json(body, status, request) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...cors(request) },
  });
}
function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }
