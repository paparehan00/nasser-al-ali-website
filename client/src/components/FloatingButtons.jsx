import { useI18n } from "../context/I18nContext.jsx";
import { PHONE_TEL, WHATSAPP_URL } from "../lib/constants.js";

export default function FloatingButtons() {
  const { t } = useI18n();
  return (
    <div className="floating-cta">
      {/* Bottom-left: WhatsApp */}
      <a
        href={WHATSAPP_URL}
        className="floating-whatsapp"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("cta.whatsappAria")}
      >
        <img src="/assets/whatsapplogo.png" alt="" aria-hidden="true" width="56" height="56" />
      </a>

      {/* Bottom-right: Call */}
      <a
        href={PHONE_TEL}
        className="floating-call"
        aria-label={t("cta.callAria")}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z" />
        </svg>
      </a>
    </div>
  );
}
