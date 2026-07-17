const MODEL = "llama-3.3-70b-versatile";
const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

const SYSTEM_PROMPT = `You are a professional Arabic translator for a Qatar-based construction company website.
Rules:
1. Translate English to Modern Standard Arabic (MSA), formal corporate tone.
2. Preserve exactly as-is (do NOT translate): ISO, MEP, OHSAS, UKAS, IAF, URS, IQNet, QAFCO, NDIA, GCC, CE, API, ASME, Qatar, Doha, Lusail, Nasser Al Ali, and all proper names, acronyms, certificate codes, phone numbers, URLs, email addresses.
3. Return ONLY a valid JSON object — same keys as input, values are Arabic translations.
4. Keep translations concise. No preamble, explanation, or markdown — pure JSON only.`;

export async function translateTexts(apiKey, texts) {
  const entries = Object.entries(texts).filter(([, v]) => v && String(v).trim());
  if (!entries.length) return {};
  const toTranslate = Object.fromEntries(entries);

  const resp = await fetch(GROQ_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: JSON.stringify(toTranslate) },
      ],
      temperature: 0.1,
      max_tokens: 2000,
      response_format: { type: "json_object" },
    }),
  });

  if (!resp.ok) {
    const body = await resp.text().catch(() => "");
    throw new Error(`Groq ${resp.status}: ${body.slice(0, 200)}`);
  }

  const data = await resp.json();
  const raw = data?.choices?.[0]?.message?.content;
  if (!raw) throw new Error("Empty response from Groq");
  return JSON.parse(raw);
}
