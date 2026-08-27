import { Link } from "react-router-dom";
import { useI18n } from "../context/I18nContext.jsx";
import { useInView } from "../hooks/useInView.js";
import { tiltHandlers } from "../lib/tiltEffect.js";
import { highlightPhrases } from "../lib/highlightText.jsx";

const HIGHLIGHT_PHRASES = {
  en: ["2005", "5,000+ workforce"],
  ar: ["2005", "5,000 عامل"],
};

export default function AboutSection() {
  const { t, lang } = useI18n();
  const [ref, inView] = useInView(0.2);
  return (
    <section className="about" id="about">
      <div className="container about-container" ref={ref}>
        <div className={"about-content fade-rise" + (inView ? " is-in" : "")}>
          <span className="overline">{t("about.overline")}</span>
          <h2>{t("about.title")}</h2>
          <p>{highlightPhrases(t("about.body"), HIGHLIGHT_PHRASES[lang])}</p>
          <div className="about-actions">
            <Link to="/contact" className="btn btn-solid btn-gold btn-large about-btn">{t("about.speak")}</Link>
            <a href="/assets/nasser-al-ali-enterprises-company-profile.pdf" className="btn btn-outline btn-gold btn-large about-btn" target="_blank" rel="noopener noreferrer" download>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: "inline-block", verticalAlign: "middle", marginRight: 6 }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
              {t("about.download")}
            </a>
          </div>
        </div>
        <div className={"about-image tilt-frame clip-reveal" + (inView ? " is-in" : "")} {...tiltHandlers}>
          <img
            className="about-image-kenburns"
            src="/assets/about-theme-1.jpg"
            alt="Nasser Al Ali Enterprises site teams and engineers at work across Qatar"
            loading="eager"
           decoding="sync" />
        </div>
      </div>
    </section>
  );
}
