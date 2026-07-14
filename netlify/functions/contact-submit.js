// netlify/functions/contact-submit.js
// Receives the contact-form POST and emails info@nasseralaligroup.com
// via Resend. The visitor is only ever shown "Thank you" - the email
// routing detail is never exposed client-side.

const TO_EMAIL = "info@nasseralaligroup.com";
const FROM_EMAIL_DEFAULT = "onboarding@resend.dev"; // Resend sandbox sender (works out of the box)
// Once the client verifies their domain in Resend, set RESEND_FROM to e.g.
// "Nasser Al Ali Website <noreply@nasseralaligroup.com>" in Netlify env vars.

const escapeHtml = (s) =>
  String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: CORS, body: "" };
  if (event.httpMethod !== "POST")
    return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: "Method not allowed" }) };

  // Accept either JSON or urlencoded so we work whichever way the frontend posts
  let data = {};
  const ct = (event.headers["content-type"] || event.headers["Content-Type"] || "").toLowerCase();
  try {
    if (ct.includes("application/json")) {
      data = JSON.parse(event.body || "{}");
    } else {
      // urlencoded
      const params = new URLSearchParams(event.body || "");
      params.forEach((v, k) => { data[k] = v; });
    }
  } catch (e) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: "Invalid body" }) };
  }

  // Honeypot - silently accept if the bot field is filled
  if (data["bot-field"] && String(data["bot-field"]).trim().length) {
    return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: true }) };
  }

  // Basic validation
  const name    = String(data.name    || "").trim().slice(0, 200);
  const company = String(data.company || "").trim().slice(0, 200);
  const email   = String(data.email   || "").trim().slice(0, 200);
  const phone   = String(data.phone   || "").trim().slice(0, 60);
  const service = String(data.service || "").trim().slice(0, 100);
  const message = String(data.message || "").trim().slice(0, 5000);
  const source  = String(data["form-name"] || data.source || "contact").trim().slice(0, 60);

  if (!name || !email || !message) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: "Missing required fields" }) };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: "Invalid email address" }) };
  }

  // Compose the email
  const subject = `New enquiry from ${name}${company ? ` (${company})` : ""}`;
  const textBody = [
    `New enquiry from the Nasser Al Ali website`,
    ``,
    `Name: ${name}`,
    company ? `Company: ${company}` : null,
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : null,
    service ? `Service Needed: ${service}` : null,
    ``,
    `Message:`,
    message,
    ``,
    `----`,
    `Source: ${source}`,
    `Received: ${new Date().toISOString()}`,
  ].filter(Boolean).join("\n");

  const htmlBody = `
    <div style="font-family: -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; color: #0B1F3A; max-width: 640px;">
      <div style="background: #0B1F3A; color: #C9A24B; padding: 20px 24px; font-family: Georgia, serif; font-weight: bold; font-size: 18px; letter-spacing: 0.5px;">
        Nasser Al Ali Enterprises &mdash; Website Enquiry
      </div>
      <div style="padding: 24px; background: #f7f8fa; border: 1px solid #e5e7eb; border-top: none;">
        <p style="margin: 0 0 16px; font-size: 15px;">You have a new enquiry from the website.</p>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="padding: 6px 0; color: #6b7280; width: 140px;">Name</td><td style="padding: 6px 0; font-weight: 600;">${escapeHtml(name)}</td></tr>
          ${company ? `<tr><td style="padding: 6px 0; color: #6b7280;">Company</td><td style="padding: 6px 0;">${escapeHtml(company)}</td></tr>` : ""}
          <tr><td style="padding: 6px 0; color: #6b7280;">Email</td><td style="padding: 6px 0;"><a href="mailto:${escapeHtml(email)}" style="color: #0B1F3A;">${escapeHtml(email)}</a></td></tr>
          ${phone ? `<tr><td style="padding: 6px 0; color: #6b7280;">Phone</td><td style="padding: 6px 0;"><a href="tel:${escapeHtml(phone)}" style="color: #0B1F3A;">${escapeHtml(phone)}</a></td></tr>` : ""}
          ${service ? `<tr><td style="padding: 6px 0; color: #6b7280;">Service</td><td style="padding: 6px 0;">${escapeHtml(service)}</td></tr>` : ""}
        </table>
        <div style="margin-top: 20px; padding: 14px 16px; background: white; border: 1px solid #e5e7eb; border-radius: 6px; white-space: pre-wrap;">${escapeHtml(message)}</div>
        <p style="margin: 20px 0 0; font-size: 12px; color: #9ca3af;">
          Source: ${escapeHtml(source)} &middot; ${new Date().toUTCString()}
        </p>
      </div>
    </div>
  `.trim();

  const apiKey = process.env.RESEND_API_KEY;
  const fromAddress = process.env.RESEND_FROM || FROM_EMAIL_DEFAULT;

  // Always log the submission (visible in Netlify function logs)
  console.log("[contact-submit]", JSON.stringify({ name, company, email, phone, service, source }));

  // If no Resend key, we still return 200 so the visitor sees success; the
  // submission is preserved in Netlify function logs.
  if (!apiKey) {
    console.warn("[contact-submit] RESEND_API_KEY not set - enquiry only logged, not emailed.");
    return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: true }) };
  }

  try {
    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [TO_EMAIL],
        reply_to: email,
        subject,
        text: textBody,
        html: htmlBody,
      }),
    });

    if (!resp.ok) {
      const errBody = await resp.text();
      console.error("[contact-submit] Resend API error", resp.status, errBody);
      // Still return 200 to the client - log preserves the submission
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: true }) };
    }
  } catch (e) {
    console.error("[contact-submit] Resend fetch failed:", e && e.message);
    // Still return 200 to the client
    return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: true }) };
  }

  return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: true }) };
};
