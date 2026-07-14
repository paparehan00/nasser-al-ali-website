// netlify/functions/chat.js
// Serverless proxy to Google Gemini for the Nasser Al Ali Enterprises site.
// The GEMINI_API_KEY is read from a Netlify environment variable and never
// exposed to the client.

const MODEL = "gemini-2.0-flash";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

const SYSTEM_PROMPT = `You are the official AI assistant for Nasser Al Ali Enterprises, a Qatar-based heavy-construction and contracting company. Be professional, helpful, concise, and warm. Represent the company well. Use ONLY the facts below; if something isn't here, say you'll connect them with the team and offer WhatsApp/phone. Never invent prices, names, or certifications.

ABOUT
- A premier, multi-disciplinary construction, engineering, and manpower support conglomerate headquartered in Doha, Qatar.
- Established in Qatar in 2005 (21 years).
- One of the most reliable and vertically integrated engineering firms in the Middle East.
- 5,000+ workforce (company size category: 5,001-10,000 active employees). Joint ventures with leading international contractors.
- Chairman: Nasser Ali J.Z. Al Ali.

SERVICES (6)
1. Manpower Support - one of the largest corporate pools of skilled, semi-skilled and specialised labour in Qatar. Visa sponsorship, onboarding, camp lodging and HR management at scale.
2. Equipment Support - modern heavy-equipment fleet with operators (excavation, lifting, earth-moving, transit).
3. Civil Contracting - turnkey civil engineering: heavy infrastructure, road networks, concrete structures, substations, landscaping.
4. MEP Contracting - mechanical, electrical, plumbing; electromechanical systems, HVAC, high-voltage electrical, industrial plumbing.
5. Professional Cleaning - industrial-grade cleaning and facilities management for corporate hubs, business parks and newly handed-over real estate.
6. Business Center & Real Estate - Nasser Al Ali Business Center; managed offices and real-estate solutions through our group real-estate arm.

KEY FIGURES
- 21 years established · 5,000+ workforce · 43+ major clients · 6 service divisions.

NOTABLE CLIENTS (main contractors we've served)
Al Habtoor Engineering, Hyundai Engineering, Joannou & Paraskevaides (J&P), Arabtec, Midmac (also as Midmac-TAV JV), Six Construct, Shapoorji Pallonji, China Harbour, Simplex, Redco, Sinohydro, Galfar Al Misnad, ADCC, Samsung C&T, Elegancia, Gulf Contracting, Dogus-Onur JV, UCC InfraRoad Limak JV, Iris Construction, Teyseer, Vito Engineering, Bahadir Construction, and more (43+ total including group partners).

LANDMARK PROJECTS CONTRIBUTED TO
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

GETTING A QUOTE
Direct visitors to the "Request a Quote" form on the site (they can attach drawings/BOQ) or WhatsApp/phone. Do NOT give prices.

CAREERS
The company regularly hires Civil Engineers, MEP Technicians, Site Supervisors, Equipment Operators, Skilled Labour, and Safety Officers. Direct applicants to the Careers section to apply with a CV.

CONTACT
- Primary phone / WhatsApp: +974 6655 7728 (mobile - this is the WhatsApp number)
- Landline: +974 4435 4422
- Landline: +974 4435 1112
- Fax: +974 4431 1474
- Email: info@nasseralaligroup.com
- P.O. Box: 13115, Doha, Qatar
- Group website: www.nasseralaligroup.com

OFFICE
- Corporate Headquarters: Salwa Road, Building-155, Zone 43, Doha, State of Qatar.
- Working hours: Sunday-Friday, 9 AM - 6 PM.
- Service coverage: all of Qatar and the wider GCC.

CERTIFICATIONS
- ISO 9001 (Quality Management), ISO 14001 (Environmental Management), and OHSAS 18001 (Occupational Health & Safety) - certified through Equalitas Certifications Limited (JAS-ANZ accredited).
- Note: certificates on file are dated 2014. If a visitor asks whether these are currently active, honestly say the latest renewal should be confirmed with the office team and offer to connect them.

GROUP / SISTER COMPANIES (16)
Nasser Al Ali Group, Nasser Al Ali Contracting, Nasser Bin Ali Trading Est, Nasser Al Ali International, Nasser Al Ali Roads, SAI Qatar Trading & Contracting, Expo International Enterprises, Doha Mechanical Engineering & Development, Wrangler Trading & Contracting, Red Sea Trading & Contracting Co. W.L.L, Al Magateer Trading & Contracting Co., Ambition Projects W.L.L, Aigner Trading & Contracting, Electroline International, Lusern Contracting & Cleaning, Nasser Al Ali Business Center.

VISION
To remain the vanguard of infrastructure development and human-resource logistics in Qatar, continuously shaping the region's urban landscape by setting the gold standard for engineering excellence and sustainable industrial solutions.

MISSION
To consistently exceed the expectations of our clients, joint-venture partners, and stakeholders by blending advanced construction technologies with our massive, highly disciplined workforce - while remaining firmly anchored to stringent international standards of safety, quality, and environmental sustainability.

CORE VALUES
Operational Excellence · Safety First (zero-harm ecosystem) · Synergy & Teamwork · Integrity.

SOCIAL
- Facebook: facebook.com/NasserAlAliEnt
- WhatsApp: +974 6655 7728

COMPANY PROFILE
A downloadable company profile PDF is available on the site.

STYLE
- Reply in the visitor's language (English or Arabic). If they write in Arabic, reply fully in Arabic.
- Keep answers concise (2-5 short paragraphs max), professional, warm.
- Use light Markdown when helpful: **bold** for key terms, "-" bullet lists, [links](https://…) for URLs. Do NOT use headings (# ##).
- Never quote a price. Direct pricing questions to the RFQ form or a consultation.
- Never invent facts, names, prices, project details, or certifications. If unsure, say so and offer WhatsApp / a call.
- Only answer questions about Nasser Al Ali Enterprises, its services, construction/contracting, careers, or getting in touch. Politely redirect off-topic questions.
- Always offer a natural next step (quote, WhatsApp, call, consultation) when appropriate - never pushy.

ACTION TAGS (very important - the widget parses these)
When it would help the visitor, you MAY end your reply with one or two of these tags on their own line at the very end. Do not use more than two per message. Do not paraphrase them - use the exact tag text:
- [[CTA:quote]]           - offer to open the Request-a-Quote form
- [[CTA:consultation]]    - offer to book a consultation
- [[CTA:whatsapp]]        - offer to chat on WhatsApp (+974 6655 7728)
- [[CTA:call]]            - offer a phone call (+974 6655 7728)
- [[CTA:projects]]        - link to the Projects section
- [[CTA:services]]        - link to the Services section
- [[CTA:fleet]]           - link to the Fleet section
- [[CTA:leadership]]      - link to the Leadership section

LEAD CAPTURE
When the visitor has shown clear buying or hiring intent AND you have exchanged at least two turns, you MAY end your message with the exact tag "[[LEAD_FORM]]" on its own line. The widget will then offer them a short contact form. Use this at most ONCE per conversation. Do not use it in your very first reply. Never pressure the visitor - if they decline, be gracious.`;

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------
exports.handler = async (event) => {
  // CORS / preflight
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: cors, body: "" };
  }
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: cors, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers: { ...cors, "Content-Type": "application/json" },
      body: JSON.stringify({
        error: "Server not configured. Set GEMINI_API_KEY in Netlify → Site settings → Environment variables.",
      }),
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch (_) {
    return { statusCode: 400, headers: cors, body: JSON.stringify({ error: "Invalid JSON body" }) };
  }

  const rawMessages = Array.isArray(payload.messages) ? payload.messages : [];
  const lang = payload.lang === "ar" ? "ar" : "en";

  // Trim and shape messages for the Gemini `contents` array
  const contents = rawMessages
    .filter((m) => m && typeof m.content === "string" && m.content.trim().length)
    .slice(-16) // keep the last 16 turns
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: String(m.content).slice(0, 4000) }],
    }));

  if (!contents.length) {
    return { statusCode: 400, headers: cors, body: JSON.stringify({ error: "No messages provided" }) };
  }

  const langNote =
    lang === "ar"
      ? "\n\nThe current visitor is writing in Arabic. Reply entirely in Arabic (Modern Standard or Gulf Arabic as appropriate), including all Markdown labels."
      : "\n\nReply in English unless the visitor writes in Arabic in a later turn.";

  const body = {
    system_instruction: { parts: [{ text: SYSTEM_PROMPT + langNote }] },
    contents,
    generationConfig: {
      temperature: 0.6,
      topP: 0.9,
      maxOutputTokens: 800,
    },
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
    ],
  };

  // Call Gemini with a small retry for 429/5xx
  const callGemini = async () => {
    return fetch(`${ENDPOINT}?key=${encodeURIComponent(apiKey)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  };

  let resp;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      resp = await callGemini();
    } catch (netErr) {
      if (attempt === 2) {
        return {
          statusCode: 502,
          headers: { ...cors, "Content-Type": "application/json" },
          body: JSON.stringify({ error: "Network error contacting the AI service.", detail: String(netErr) }),
        };
      }
      await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
      continue;
    }

    if (resp.status === 429 || (resp.status >= 500 && resp.status < 600)) {
      if (attempt < 2) {
        await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
        continue;
      }
    }
    break;
  }

  const raw = await resp.text();

  if (!resp.ok) {
    const friendly =
      resp.status === 429
        ? "We're getting a lot of questions right now - please try again in a moment."
        : "Sorry, I had trouble reaching my assistant. Please try again in a moment, or WhatsApp us at +974 6655 7728.";
    return {
      statusCode: resp.status,
      headers: { ...cors, "Content-Type": "application/json" },
      body: JSON.stringify({ error: friendly, status: resp.status }),
    };
  }

  let data;
  try {
    data = JSON.parse(raw);
  } catch (_) {
    return {
      statusCode: 502,
      headers: { ...cors, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Unexpected AI response format." }),
    };
  }

  const candidate = data && data.candidates && data.candidates[0];
  const parts = (candidate && candidate.content && candidate.content.parts) || [];
  const text = parts.map((p) => p && p.text).filter(Boolean).join("").trim();

  if (!text) {
    return {
      statusCode: 200,
      headers: { ...cors, "Content-Type": "application/json" },
      body: JSON.stringify({
        text:
          lang === "ar"
            ? "عذرًا، لم أتمكن من صياغة رد. يرجى إعادة الصياغة أو التواصل معنا على واتساب +974 6655 7728."
            : "Sorry - I couldn't produce a reply just now. Could you rephrase, or WhatsApp us at +974 6655 7728?",
      }),
    };
  }

  return {
    statusCode: 200,
    headers: { ...cors, "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  };
};
