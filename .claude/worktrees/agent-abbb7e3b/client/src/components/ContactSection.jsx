import { useState } from "react";
import { useI18n } from "../context/I18nContext.jsx";
import { EMAIL, PHONE_TEL, WHATSAPP_URL, MAP_EMBED, MAP_LINK } from "../lib/constants.js";

// Web3Forms: free, host-independent form-to-email relay. Free access-key at
// https://web3forms.com. The key is public - it only unlocks delivery to the
// pre-registered email address, so shipping it in the client is safe.
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY || "";
const WEB3FORMS_URL = "https://api.web3forms.com/submit";

export default function ContactSection() {
  const { t } = useI18n();
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [mapConsented, setMapConsented] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;

    if (!WEB3FORMS_KEY) {
      // Missing configuration - surface a real error rather than silently
      // pretending it worked.
      console.warn("[contact-form] VITE_WEB3FORMS_KEY is not set - form disabled.");
      setStatus("error");
      return;
    }

    setStatus("sending");

    const fd = new FormData(form);
    const payload = {
      access_key: WEB3FORMS_KEY,
      subject: `New enquiry from ${fd.get("name") || "website visitor"}`,
      from_name: fd.get("name") || "Website enquiry",
      reply_to:  fd.get("email") || "",
      name:      fd.get("name") || "",
      company:   fd.get("company") || "",
      email:     fd.get("email") || "",
      phone:     fd.get("phone") || "",
      service:   fd.get("service") || "",
      message:   fd.get("message") || "",
      // Web3Forms honeypot fields
      botcheck: fd.get("bot-field") || "",
    };

    try {
      const resp = await fetch(WEB3FORMS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept:         "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok || data.success === false) {
        console.warn("[contact-form] Web3Forms error:", resp.status, data);
        setStatus("error");
        return;
      }
      setStatus("success");
      form.reset();
    } catch (err) {
      console.warn("[contact-form] network error:", err);
      setStatus("error");
    }
  };

  return (
    <section className="contact section-alt" id="contact">
      <div className="container">
        <div className="section-header center">
          <span className="overline">{t("contact.overline")}</span>
          <h2>{t("contact.title")}</h2>
          <p className="section-lede">{t("contact.lede")}</p>
          <a href="#contact-form" className="btn btn-solid btn-gold btn-large contact-cta">{t("contact.book")}</a>
        </div>

        <div className="contact-grid">
          <div className="contact-form-wrap">
            <h3>{t("contact.formTitle")}</h3>
            <form id="contact-form" name="contact" method="POST" onSubmit={onSubmit}>
              <input type="hidden" name="form-name" value="contact" />
              <p hidden style={{ position: "absolute", left: "-9999px" }}>
                <label>Leave this field empty:{" "}
                  <input name="bot-field" tabIndex={-1} autoComplete="off" />
                </label>
              </p>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="c-name">{t("contact.form.name")}</label>
                  <input type="text" id="c-name" name="name" placeholder={t("contact.form.namePh")} required />
                </div>
                <div className="form-group">
                  <label htmlFor="c-company">{t("contact.form.company")}</label>
                  <input type="text" id="c-company" name="company" placeholder={t("contact.form.companyPh")} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="c-email">{t("contact.form.email")}</label>
                  <input type="email" id="c-email" name="email" placeholder={t("contact.form.emailPh")} required />
                </div>
                <div className="form-group">
                  <label htmlFor="c-phone">{t("contact.form.phone")}</label>
                  <input type="tel" id="c-phone" name="phone" placeholder={t("contact.form.phonePh")} required />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="c-service">{t("contact.form.service")}</label>
                <select id="c-service" name="service" required defaultValue="">
                  <option value="" disabled>{t("contact.form.servicePh")}</option>
                  <option value="manpower">{t("contact.form.serviceManpower")}</option>
                  <option value="equipment">{t("contact.form.serviceEquipment")}</option>
                  <option value="civil">{t("contact.form.serviceCivil")}</option>
                  <option value="mep">{t("contact.form.serviceMep")}</option>
                  <option value="cleaning">{t("contact.form.serviceCleaning")}</option>
                  <option value="business">{t("contact.form.serviceBusiness")}</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="c-message">{t("contact.form.message")}</label>
                <textarea id="c-message" name="message" placeholder={t("contact.form.messagePh")} rows={5} required></textarea>
              </div>
              <div className="form-consent">
                <input type="checkbox" id="c-consent" name="consent" required />
                <label htmlFor="c-consent">{t("contact.form.consent")}</label>
              </div>
              <button type="submit" className="btn btn-solid btn-gold btn-block" disabled={status === "sending"}>
                {status === "sending" ? t("contact.form.sending") : t("contact.form.submit")}
              </button>
              {status === "success" && (
                <p className="form-success active" role="status">{t("contact.form.success")}</p>
              )}
              {status === "error" && (
                <p className="form-error" role="alert">{t("contact.form.error")}</p>
              )}
            </form>
          </div>

          <div className="contact-details">
            <div className="info-block">
              <h4>{t("contact.info.office")}</h4>
              <p>Salwa Road, Building-155, Zone 43<br/>Doha, State of Qatar</p>
              <p>P.O. Box 13115, Doha, Qatar</p>
            </div>
            <div className="info-block">
              <h4>{t("contact.info.phone")}</h4>
              <p><a href={PHONE_TEL}>+974 6655 7728</a> <span style={{ color: "var(--accent)", fontSize: 11, letterSpacing: 1 }}>(WhatsApp)</span></p>
              <p><a href="tel:+97444354422">+974 4435 4422</a></p>
              <p><a href="tel:+97444351112">+974 4435 1112</a></p>
              <p>Fax: +974 4431 1474</p>
            </div>
            <div className="info-block">
              <h4>{t("contact.info.email")}</h4>
              <p><a href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
              <p><a href="https://www.nasseralaligroup.com" target="_blank" rel="noopener noreferrer">www.nasseralaligroup.com</a></p>
            </div>
            <div className="contact-quick">
              <a href={PHONE_TEL} className="btn btn-solid btn-gold">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z"/></svg>
                {t("contact.callNow")}
              </a>
              <a href={WHATSAPP_URL} className="btn btn-solid btn-green" target="_blank" rel="noopener noreferrer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.5 0 1.47 1.07 2.89 1.22 3.09.15.2 2.11 3.22 5.11 4.51.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35zM12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.38 5.06L2 22l5.11-1.34C8.55 21.53 10.22 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"/></svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="contact-map">
          {mapConsented ? (
            <>
              <iframe
                src={MAP_EMBED}
                title={t("contact.map.title")}
                width="100%"
                height="420"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a className="map-link" href={MAP_LINK} target="_blank" rel="noopener noreferrer">
                {t("contact.map.open")}
              </a>
            </>
          ) : (
            <div className="consent-gate-placeholder">
              <div>
                {t("contact.map.consent")}<br/>
                <button type="button" className="btn btn-solid btn-gold" onClick={() => setMapConsented(true)}>
                  {t("contact.map.manage")}
                </button><br/>
                <a
                  className="map-link"
                  style={{ position: "static", marginTop: 10, display: "inline-block" }}
                  href={MAP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("contact.map.open")}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
