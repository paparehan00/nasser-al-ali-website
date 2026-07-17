import nodemailer from "nodemailer";
import { env } from "../config/env.js";

// Lazy singleton — created once on first send, not at import time.
let _transport = null;

function getTransport() {
  if (!_transport) {
    _transport = nodemailer.createTransport({
      host:   env.smtpHost,
      port:   env.smtpPort,
      secure: env.smtpPort === 465,
      auth: { user: env.smtpUser, pass: env.smtpPass },
    });
  }
  return _transport;
}

export async function verifyMailer() {
  if (!env.smtpUser || !env.smtpPass) {
    console.warn("Mailer: SMTP_USER/SMTP_PASS not configured — email disabled.");
    return false;
  }
  try {
    await getTransport().verify();
    console.log(`Mailer: SMTP ready (${env.smtpUser})`);
    return true;
  } catch (err) {
    console.error("Mailer: SMTP connection failed:", err.message);
    return false;
  }
}

// ─── HTML shell ──────────────────────────────────────────────────────────────

function emailShell(bodyHtml) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Nasser Al Ali Enterprises</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 16px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:6px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);">

  <!-- Header -->
  <tr>
    <td style="background:#0b1f3a;padding:28px 40px;text-align:center;">
      <p style="margin:0;color:#c9a84c;font-size:13px;letter-spacing:3px;text-transform:uppercase;font-weight:700;">NASSER AL ALI ENTERPRISES</p>
      <p style="margin:6px 0 0;color:#ffffff;font-size:11px;letter-spacing:1px;">Doha, Qatar · Est. 2005</p>
    </td>
  </tr>

  <!-- Body -->
  <tr>
    <td style="padding:36px 40px;">
      ${bodyHtml}
    </td>
  </tr>

  <!-- Footer -->
  <tr>
    <td style="background:#0b1f3a;padding:20px 40px;text-align:center;">
      <p style="margin:0;color:#8a9bb0;font-size:11px;line-height:1.7;">
        Salwa Road, Building-155, Zone 43 · Doha, Qatar · P.O. Box 13115<br/>
        <a href="tel:+97466557728" style="color:#c9a84c;text-decoration:none;">+974 6655 7728</a> ·
        <a href="mailto:info@nasseralaligroup.com" style="color:#c9a84c;text-decoration:none;">info@nasseralaligroup.com</a> ·
        <a href="https://www.nasseralaligroup.com" style="color:#c9a84c;text-decoration:none;">nasseralaligroup.com</a>
      </p>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

function detailsTable(rows) {
  const cells = rows
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:8px 12px 8px 0;color:#666;font-size:13px;white-space:nowrap;vertical-align:top;">${label}</td>
        <td style="padding:8px 0;color:#1a1a1a;font-size:13px;">${esc(value)}</td>
      </tr>`
    )
    .join("");
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;background:#f8f9fa;border-radius:4px;padding:4px 16px;margin:20px 0;">${cells}</table>`;
}

function esc(v) {
  return String(v ?? "—")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ─── Customer confirmation ───────────────────────────────────────────────────

export async function sendCustomerConfirmation(booking) {
  const { name, company, email, phone, service, preferred_date, message } = booking;

  const serviceLabels = {
    manpower: "Manpower Support",
    equipment: "Equipment Support",
    civil: "Civil Contracting",
    mep: "MEP Contracting",
    cleaning: "Professional Cleaning",
    business: "Business Center & Real Estate",
  };

  const details = detailsTable([
    ["Name", name],
    ["Company", company],
    ["Email", email],
    ["Phone", phone],
    ["Service requested", serviceLabels[service] || service],
    ...(preferred_date ? [["Preferred date / time", preferred_date]] : []),
    ...(message ? [["Message", message]] : []),
  ]);

  const body = `
    <h1 style="margin:0 0 6px;color:#0b1f3a;font-size:22px;">Thank you, ${esc(name)}!</h1>
    <p style="margin:0 0 20px;color:#c9a84c;font-size:13px;letter-spacing:1px;text-transform:uppercase;font-weight:700;">Your consultation request has been received</p>

    <p style="color:#333;font-size:15px;line-height:1.6;margin:0 0 16px;">
      We appreciate your interest in Nasser Al Ali Enterprises. One of our team members will review your request and get back to you within 1–2 business days.
    </p>

    <p style="color:#333;font-size:15px;line-height:1.6;margin:0 0 24px;">
      Here is a summary of what we received:
    </p>

    ${details}

    <p style="color:#333;font-size:15px;line-height:1.6;margin:24px 0 8px;">
      In the meantime, feel free to reach us directly:
    </p>
    <p style="color:#333;font-size:15px;line-height:1.6;margin:0 0 4px;">
      📞 <a href="tel:+97466557728" style="color:#c9a84c;">+974 6655 7728</a> (WhatsApp)
    </p>
    <p style="color:#333;font-size:15px;line-height:1.6;margin:0 0 28px;">
      📧 <a href="mailto:info@nasseralaligroup.com" style="color:#c9a84c;">info@nasseralaligroup.com</a>
    </p>

    <p style="color:#555;font-size:14px;line-height:1.6;margin:0;">
      Warm regards,<br/>
      <strong style="color:#0b1f3a;">The Nasser Al Ali Team</strong>
    </p>
  `;

  const plain = [
    `Thank you, ${name}!`,
    "",
    "We received your consultation request and will be in touch within 1–2 business days.",
    "",
    "Your booking details:",
    `  Name:    ${name}`,
    `  Company: ${company ?? "—"}`,
    `  Email:   ${email}`,
    `  Phone:   ${phone ?? "—"}`,
    `  Service: ${(serviceLabels[service] || service) ?? "—"}`,
    preferred_date ? `  Date/time: ${preferred_date}` : null,
    message ? `  Message: ${message}` : null,
    "",
    "Contact us: +974 6655 7728 | info@nasseralaligroup.com",
    "— Nasser Al Ali Enterprises",
  ]
    .filter((l) => l !== null)
    .join("\n");

  await getTransport().sendMail({
    from: `"${env.mailFromName}" <${env.smtpUser}>`,
    to: email,
    subject: "Thank you for your booking — Nasser Al Ali Enterprises",
    text: plain,
    html: emailShell(body),
  });
}

// ─── Admin notification ──────────────────────────────────────────────────────

export async function sendAdminNotification(booking) {
  const { name, company, email, phone, service, preferred_date, message, created_at } = booking;

  const ts = new Date((created_at ?? Date.now() / 1000) * 1000).toISOString().replace("T", " ").slice(0, 19) + " UTC";

  const details = detailsTable([
    ["Name", name],
    ["Company", company],
    ["Email", email],
    ["Phone", phone],
    ["Service", service],
    ...(preferred_date ? [["Preferred date / time", preferred_date]] : []),
    ...(message ? [["Message", message]] : []),
    ["Submitted", ts],
    ["IP", booking.ip],
  ]);

  const body = `
    <h1 style="margin:0 0 6px;color:#0b1f3a;font-size:20px;">New consultation booking</h1>
    <p style="margin:0 0 24px;color:#c9a84c;font-size:13px;letter-spacing:1px;text-transform:uppercase;font-weight:700;">from ${esc(name)}</p>

    ${details}

    <p style="color:#555;font-size:13px;margin:24px 0 0;">
      Reply to this email to contact the customer directly — Reply-To is set to <strong>${esc(email)}</strong>.
    </p>
  `;

  const plain = [
    `New consultation booking from ${name}`,
    "",
    `Name:     ${name}`,
    `Company:  ${company ?? "—"}`,
    `Email:    ${email}`,
    `Phone:    ${phone ?? "—"}`,
    `Service:  ${service ?? "—"}`,
    preferred_date ? `Date/time: ${preferred_date}` : null,
    message ? `Message:  ${message}` : null,
    "",
    `Submitted: ${ts}`,
    `IP: ${booking.ip ?? "—"}`,
    "",
    "Reply to this email to reach the customer.",
  ]
    .filter((l) => l !== null)
    .join("\n");

  await getTransport().sendMail({
    from: `"${env.mailFromName}" <${env.smtpUser}>`,
    to: env.notifyEmail,
    replyTo: email,
    subject: `New consultation booking — ${name}`,
    text: plain,
    html: emailShell(body),
  });
}
