import { useI18n } from "../context/I18nContext.jsx";
import { PHONE, PHONE_TEL, WHATSAPP_URL } from "../lib/constants.js";

/**
 * WhatsApp: circular, WhatsApp green (#25D366), white glyph only, no text.
 * Call:     borderless / no box - phone icon + tappable phone number text.
 * Both are fixed-position over the site content.
 */
export default function FloatingButtons() {
  const { t } = useI18n();
  return (
    <div className="floating-cta" aria-hidden={false}>
      <a
        href={PHONE_TEL}
        className="floating-call"
        aria-label={t("cta.callAria")}
      >
        <svg
          className="floating-call-icon"
          width="18"
          height="18"
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
        <span className="floating-call-text">{PHONE}</span>
      </a>

      <a
        href={WHATSAPP_URL}
        className="floating-whatsapp"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("cta.whatsappAria")}
      >
        {/* Official WhatsApp glyph in white */}
        <svg
          width="28"
          height="28"
          viewBox="0 0 32 32"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.116-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.606 3.41 4.554 4.34.616.287 2.035.774 2.722.774.815 0 2.15-.5 2.478-1.318.13-.33.13-.616.076-.918-.05-.129-.343-.286-.744-.485zM16.44 3.15C9.14 3.15 3.2 9.09 3.2 16.39c0 2.606.775 5.15 2.163 7.284L3.14 30.02l6.46-2.163c2.05 1.203 4.4 1.834 6.79 1.834 7.3 0 13.24-5.94 13.24-13.24 0-7.3-5.94-13.3-13.19-13.3zm0 24.28c-2.28 0-4.5-.6-6.44-1.75l-.46-.28-4.79 1.60 1.61-4.71-.31-.47c-1.30-1.98-1.98-4.31-1.98-6.72 0-6.88 5.4-12.28 12.28-12.28s12.28 5.4 12.28 12.28c0 6.88-5.4 12.28-12.28 12.28z" />
        </svg>
      </a>
    </div>
  );
}
