import { useEffect, useState } from "react";
import { useI18n } from "../context/I18nContext.jsx";
import { EMAIL, PHONE, PHONE_TEL, PHONE_2, PHONE_2_TEL, WHATSAPP_URL, MAP_EMBED, MAP_LINK } from "../lib/constants.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[\d\s+()\-.]{7,25}$/;

function validateFields(fd, lang) {
  const errors = {};
  const isAr = lang === "ar";
  const currentYear = new Date().getFullYear();

  const name          = (fd.get("name")          || "").trim();
  const email         = (fd.get("email")         || "").trim();
  const phone         = (fd.get("phone")         || "").trim();
  const service       = (fd.get("service")       || "").trim();
  const message       = (fd.get("message")       || "").trim();
  const preferredDate = (fd.get("preferredDate") || "").trim();

  if (!name)
    errors.name = isAr ? "الاسم مطلوب." : "Name is required.";

  if (!email)
    errors.email = isAr ? "البريد الإلكتروني مطلوب." : "Email is required.";
  else if (!EMAIL_RE.test(email))
    errors.email = isAr ? "أدخل بريدًا إلكترونيًا صالحًا." : "Enter a valid email address.";

  if (!phone)
    errors.phone = isAr ? "رقم الهاتف مطلوب." : "Phone number is required.";
  else if (!PHONE_RE.test(phone))
    errors.phone = isAr ? "أدخل رقم هاتف صالحًا (أرقام وعلامات +/-)." : "Enter a valid phone number (digits, +, -, spaces).";

  if (!service)
    errors.service = isAr ? "يرجى اختيار خدمة." : "Please select a service.";

  if (!message)
    errors.message = isAr ? "يرجى وصف كيف يمكننا المساعدة." : "Please describe how we can help.";

  const consent = fd.get("consent");
  if (!consent)
    errors.consent = isAr ? "يرجى قبول سياسة الخصوصية للمتابعة." : "Please accept the Privacy Policy to continue.";

  if (preferredDate) {
    const d = new Date(preferredDate);
    const now = new Date();
    // 4-digit-year check on the raw string before Date parsing can normalise it
    const yearMatch = preferredDate.match(/^(\d{4})-/);
    if (!yearMatch || isNaN(d.getTime())) {
      errors.preferredDate = isAr ? "أدخل تاريخًا ووقتًا صالحين." : "Enter a valid date and time.";
    } else {
      const year = parseInt(yearMatch[1], 10);
      if (year < currentYear || year > currentYear + 2) {
        errors.preferredDate = isAr
          ? `السنة يجب أن تكون بين ${currentYear} و${currentYear + 2}.`
          : `Year must be between ${currentYear} and ${currentYear + 2}.`;
      } else if (d <= now) {
        errors.preferredDate = isAr
          ? "يجب أن يكون التاريخ في المستقبل."
          : "Preferred date must be in the future.";
      }
    }
  }

  return errors;
}

// Local datetime string for the min attribute (avoids UTC offset shifting date back)
function localNow() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

export default function ContactSection() {
  const { t, lang } = useI18n();
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  // Read the real, site-wide consent choice — not a fresh local flag — so the
  // map doesn't ask again if the user already accepted embeds via the main
  // cookie banner, and stays in sync if they change it from Cookies page too.
  const [mapConsented, setMapConsented] = useState(
    () => typeof window !== "undefined" && !!window.NAAConsent?.has("embeds")
  );
  const [serverMsg, setServerMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (typeof window === "undefined" || !window.NAAConsent) return;
    return window.NAAConsent.onChange((payload) => setMapConsented(!!payload?.choices?.embeds));
  }, []);

  const openConsentPrefs = () => {
    if (typeof window !== "undefined" && window.NAAConsent) window.NAAConsent.reopen();
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    // Client-side validation — show inline errors and abort
    const errors = validateFields(fd, lang);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      // Focus the first invalid field so keyboard users land in the right place
      const firstKey = Object.keys(errors)[0];
      const el = form.elements[firstKey];
      if (el) el.focus();
      return;
    }

    setFieldErrors({});
    setStatus("sending");
    setServerMsg("");

    const payload = {
      "bot-field":   fd.get("bot-field") || "",
      name:          fd.get("name") || "",
      company:       fd.get("company") || "",
      email:         fd.get("email") || "",
      phone:         fd.get("phone") || "",
      service:       fd.get("service") || "",
      preferredDate: fd.get("preferredDate") || "",
      message:       fd.get("message") || "",
    };

    try {
      const resp = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        setServerMsg(data.error || t("contact.form.error"));
        setStatus("error");
        return;
      }
      setStatus("success");
      setServerMsg(data.message || t("contact.form.success"));
      form.reset();
    } catch {
      setStatus("error");
      setServerMsg(t("contact.form.error"));
    }
  };

  return (
    <section className="contact section-alt" id="contact">
      <div className="container">
        <div className="section-header center">
          {/* No overline here — "Get in Touch" as the heading alone already
              says it; a "GET IN TOUCH" eyebrow above it just repeated the
              same two words back at the reader. */}
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
                  <input
                    type="text" id="c-name" name="name"
                    placeholder={t("contact.form.namePh")}
                    aria-invalid={!!fieldErrors.name}
                    aria-describedby={fieldErrors.name ? "err-name" : undefined}
                    onChange={() => fieldErrors.name && setFieldErrors(p => ({ ...p, name: "" }))}
                  />
                  {fieldErrors.name && <span id="err-name" className="field-error" role="alert">{fieldErrors.name}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="c-company">{t("contact.form.company")}</label>
                  <input type="text" id="c-company" name="company" placeholder={t("contact.form.companyPh")} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="c-email">{t("contact.form.email")}</label>
                  <input
                    type="email" id="c-email" name="email"
                    placeholder={t("contact.form.emailPh")}
                    aria-invalid={!!fieldErrors.email}
                    aria-describedby={fieldErrors.email ? "err-email" : undefined}
                    onChange={() => fieldErrors.email && setFieldErrors(p => ({ ...p, email: "" }))}
                  />
                  {fieldErrors.email && <span id="err-email" className="field-error" role="alert">{fieldErrors.email}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="c-phone">{t("contact.form.phone")}</label>
                  <input
                    type="tel" id="c-phone" name="phone"
                    placeholder={t("contact.form.phonePh")}
                    aria-invalid={!!fieldErrors.phone}
                    aria-describedby={fieldErrors.phone ? "err-phone" : undefined}
                    onChange={() => fieldErrors.phone && setFieldErrors(p => ({ ...p, phone: "" }))}
                  />
                  {fieldErrors.phone && <span id="err-phone" className="field-error" role="alert">{fieldErrors.phone}</span>}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="c-service">{t("contact.form.service")}</label>
                  <select
                    id="c-service" name="service" defaultValue=""
                    aria-invalid={!!fieldErrors.service}
                    aria-describedby={fieldErrors.service ? "err-service" : undefined}
                    onChange={() => fieldErrors.service && setFieldErrors(p => ({ ...p, service: "" }))}
                  >
                    <option value="" disabled>{t("contact.form.servicePh")}</option>
                    <option value="manpower">{t("contact.form.serviceManpower")}</option>
                    <option value="equipment">{t("contact.form.serviceEquipment")}</option>
                    <option value="civil">{t("contact.form.serviceCivil")}</option>
                    <option value="mep">{t("contact.form.serviceMep")}</option>
                    <option value="cleaning">{t("contact.form.serviceCleaning")}</option>
                    <option value="business">{t("contact.form.serviceBusiness")}</option>
                  </select>
                  {fieldErrors.service && <span id="err-service" className="field-error" role="alert">{fieldErrors.service}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="c-date">{t("contact.form.preferredDate")}</label>
                  <input
                    type="datetime-local" id="c-date" name="preferredDate"
                    min={localNow()}
                    aria-invalid={!!fieldErrors.preferredDate}
                    aria-describedby={fieldErrors.preferredDate ? "err-date" : undefined}
                    onChange={() => fieldErrors.preferredDate && setFieldErrors(p => ({ ...p, preferredDate: "" }))}
                    onClick={(e) => e.target.showPicker?.()}
                  />
                  {fieldErrors.preferredDate && <span id="err-date" className="field-error" role="alert">{fieldErrors.preferredDate}</span>}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="c-message">{t("contact.form.message")}</label>
                <textarea
                  id="c-message" name="message"
                  placeholder={t("contact.form.messagePh")} rows={5}
                  aria-invalid={!!fieldErrors.message}
                  aria-describedby={fieldErrors.message ? "err-message" : undefined}
                  onChange={() => fieldErrors.message && setFieldErrors(p => ({ ...p, message: "" }))}
                />
                {fieldErrors.message && <span id="err-message" className="field-error" role="alert">{fieldErrors.message}</span>}
              </div>
              <div className="form-consent">
                <input
                  type="checkbox" id="c-consent" name="consent"
                  aria-invalid={!!fieldErrors.consent}
                  aria-describedby={fieldErrors.consent ? "err-consent" : undefined}
                  onChange={() => fieldErrors.consent && setFieldErrors(p => ({ ...p, consent: "" }))}
                />
                <label htmlFor="c-consent">{t("contact.form.consent")}</label>
                {fieldErrors.consent && <span id="err-consent" className="field-error" role="alert" style={{ display: "block", marginTop: "4px" }}>{fieldErrors.consent}</span>}
              </div>
              <button type="submit" className="btn btn-solid btn-gold btn-block" disabled={status === "sending"}>
                {status === "sending" ? t("contact.form.sending") : t("contact.form.submit")}
              </button>
              {status === "success" && (
                <p className="form-success active" role="status">{serverMsg || t("contact.form.success")}</p>
              )}
              {status === "error" && (
                <p className="form-error" role="alert">{serverMsg || t("contact.form.error")}</p>
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
              <p><a href={PHONE_TEL}>{PHONE}</a></p>
              <p><a href={PHONE_2_TEL}>{PHONE_2}</a> <span style={{ color: "var(--accent)", fontSize: 11, letterSpacing: 1 }}>(WhatsApp)</span></p>
            </div>
            <div className="info-block">
              <h4>{t("contact.info.email")}</h4>
              <p><a href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
              <p><a href="https://www.nasseralalienterprises.com" target="_blank" rel="noopener noreferrer">www.nasseralalienterprises.com</a></p>
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
              <svg className="consent-gate-icon" width="32" height="32" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20.5 10c0 6-8.5 12-8.5 12S3.5 16 3.5 10a8.5 8.5 0 0 1 17 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <p className="consent-gate-text">{t("contact.map.consent")}</p>
              <div className="consent-gate-actions">
                <button type="button" className="btn btn-solid btn-gold" onClick={openConsentPrefs}>
                  {t("contact.map.manage")}
                </button>
                <a className="btn btn-outline btn-gold" href={MAP_LINK} target="_blank" rel="noopener noreferrer">
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
