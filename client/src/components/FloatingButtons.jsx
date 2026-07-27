import { useEffect, useState } from "react";
import { ArrowUp, Phone } from "lucide-react";
import { useI18n } from "../context/I18nContext.jsx";
import { PHONE_TEL, WHATSAPP_URL } from "../lib/constants.js";

function BackToTop() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTop = () => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, left: 0, behavior: prefersReduced ? "instant" : "smooth" });
  };

  return (
    <button
      type="button"
      className={"back-to-top" + (visible ? " is-visible" : "")}
      onClick={scrollTop}
      aria-label={t("cta.backToTopAria")}
      tabIndex={visible ? 0 : -1}
    >
      <ArrowUp size={20} strokeWidth={2.5} aria-hidden="true" />
    </button>
  );
}

export default function FloatingButtons() {
  const { t } = useI18n();
  return (
    <>
      <BackToTop />
      <div className="floating-cta">
      {/* Top of stack: WhatsApp */}
      <a
        href={WHATSAPP_URL}
        className="floating-whatsapp"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("cta.whatsappAria")}
      >
        <img src="/assets/whatsapplogo.png" alt="" aria-hidden="true" width="56" height="56" />
      </a>

      {/* Bottom of stack: Call */}
      <a
        href={PHONE_TEL}
        className="floating-call"
        aria-label={t("cta.callAria")}
      >
        <Phone size={24} strokeWidth={2} aria-hidden="true" />
      </a>
      </div>
    </>
  );
}
