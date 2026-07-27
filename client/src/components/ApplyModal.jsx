import { useEffect, useRef, useState } from "react";
import { useI18n } from "../context/I18nContext.jsx";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CV_MAX_BYTES = 5 * 1024 * 1024;

export default function ApplyModal({ job, onClose }) {
  const { t, lang } = useI18n();
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [serverMsg, setServerMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [cvFile, setCvFile] = useState(null);
  const cvInputRef = useRef(null);

  useEffect(() => {
    if (!job) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [job, onClose]);

  if (!job) return null;

  const jobTitle = job.general ? "" : (job.resolvedTitle || "");
  const isAr = lang === "ar";

  const onCvPick = (e) => {
    const file = e.target.files?.[0] || null;
    if (!file) { setCvFile(null); return; }

    const looksLikePdf = file.type === "application/pdf" && /\.pdf$/i.test(file.name);
    if (!looksLikePdf) {
      setFieldErrors((p) => ({ ...p, cv: isAr ? "يجب أن يكون الملف بصيغة PDF." : "File must be a PDF." }));
      e.target.value = "";
      setCvFile(null);
      return;
    }
    if (file.size > CV_MAX_BYTES) {
      setFieldErrors((p) => ({ ...p, cv: isAr ? "يجب ألا يتجاوز حجم الملف 5 ميجابايت." : "File must be under 5 MB." }));
      e.target.value = "";
      setCvFile(null);
      return;
    }
    setFieldErrors((p) => { const n = { ...p }; delete n.cv; return n; });
    setCvFile(file);
  };

  const clearCv = () => {
    setCvFile(null);
    if (cvInputRef.current) cvInputRef.current.value = "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    const name    = String(fd.get("name")    || "").trim();
    const email   = String(fd.get("email")   || "").trim();
    const phone   = String(fd.get("phone")   || "").trim();
    const message = String(fd.get("message") || "").trim();

    const errors = {};
    if (!name)    errors.name = isAr ? "الاسم مطلوب." : "Name is required.";
    if (!email)   errors.email = isAr ? "البريد الإلكتروني مطلوب." : "Email is required.";
    else if (!EMAIL_RE.test(email)) errors.email = isAr ? "أدخل بريدًا إلكترونيًا صالحًا." : "Enter a valid email address.";
    if (!phone)   errors.phone = isAr ? "رقم الهاتف مطلوب." : "Phone number is required.";
    if (!message) errors.message = isAr ? "يرجى إخبارنا قليلاً عن نفسك." : "Please tell us a little about yourself.";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setStatus("sending");
    setServerMsg("");

    // FormData already carries the cv file (if any) straight from the form
    // via its `name="cv"` input — just append the extra fields the server
    // needs alongside it.
    fd.set("jobId", job.id || "");
    fd.set("jobTitle", jobTitle);

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        body: fd,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setStatus("success");
      setServerMsg(data.message || "");
      form.reset();
      setCvFile(null);
    } catch (err) {
      setStatus("error");
      setServerMsg(err.message);
    }
  };

  return (
    <div
      className="apply-modal-backdrop"
      onClick={(e) => { if (e.currentTarget === e.target) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={t("careers.applyTitle")}
    >
      <div className="apply-modal">
        <button className="apply-modal-close" aria-label="Close" onClick={onClose}>×</button>

        <span className="overline">{t("careers.applyOverline")}</span>
        <h3>{jobTitle ? `${t("careers.applyTitle")}: ${jobTitle}` : t("careers.applyGeneralTitle")}</h3>

        {status === "success" ? (
          <p className="form-success active" role="status">{serverMsg || t("careers.applySuccess")}</p>
        ) : (
          <form onSubmit={onSubmit} noValidate>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="apply-name">{t("contact.form.name")}</label>
                <input type="text" id="apply-name" name="name" aria-invalid={!!fieldErrors.name} />
                {fieldErrors.name && <span className="field-error" role="alert">{fieldErrors.name}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="apply-email">{t("contact.form.email")}</label>
                <input type="email" id="apply-email" name="email" aria-invalid={!!fieldErrors.email} />
                {fieldErrors.email && <span className="field-error" role="alert">{fieldErrors.email}</span>}
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="apply-phone">{t("contact.form.phone")}</label>
              <input type="tel" id="apply-phone" name="phone" aria-invalid={!!fieldErrors.phone} />
              {fieldErrors.phone && <span className="field-error" role="alert">{fieldErrors.phone}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="apply-message">{t("careers.applyMessageLabel")}</label>
              <textarea id="apply-message" name="message" rows={4} placeholder={t("careers.applyMessagePh")} aria-invalid={!!fieldErrors.message} />
              {fieldErrors.message && <span className="field-error" role="alert">{fieldErrors.message}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="apply-cv">{t("careers.applyCvLabel")}</label>
              {/* The real file input must stay mounted even once a file is picked —
                  removing it from the DOM (as a cvFile ? summary : input ternary
                  used to do) also throws away its FileList, so FormData(form) on
                  submit silently had no "cv" field even though the UI showed a
                  file was selected. Hide it visually instead of unmounting it. */}
              <input
                ref={cvInputRef}
                type="file"
                id="apply-cv"
                name="cv"
                accept="application/pdf,.pdf"
                onChange={onCvPick}
                aria-invalid={!!fieldErrors.cv}
                className={cvFile ? "apply-cv-input-hidden" : undefined}
              />
              {cvFile && (
                <div className="apply-cv-picked">
                  <span className="apply-cv-filename">{cvFile.name} ({Math.round(cvFile.size / 1024)} KB)</span>
                  <button type="button" className="apply-cv-remove" onClick={clearCv} aria-label={t("careers.applyCvRemove")}>×</button>
                </div>
              )}
              <p className="apply-cv-hint">{t("careers.applyCvHint")}</p>
              {fieldErrors.cv && <span className="field-error" role="alert">{fieldErrors.cv}</span>}
            </div>
            <button type="submit" className="btn btn-solid btn-gold btn-block" disabled={status === "sending"}>
              {status === "sending" ? t("careers.applySending") : t("careers.applySubmit")}
            </button>
            {status === "error" && <p className="form-error" role="alert">{serverMsg || t("contact.form.error")}</p>}
          </form>
        )}
      </div>
    </div>
  );
}
