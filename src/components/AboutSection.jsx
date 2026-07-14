import { Link } from "react-router-dom";
import { useI18n } from "../context/I18nContext.jsx";

export default function AboutSection() {
  const { t } = useI18n();
  return (
    <section className="about" id="about">
      <div className="container about-container">
        <div className="about-content">
          <span className="overline">{t("about.overline")}</span>
          <h2>{t("about.title")}</h2>
          <p>{t("about.body")}</p>
          <div className="about-actions">
            <Link to="/contact" className="btn btn-solid btn-gold btn-large about-btn">{t("about.speak")}</Link>
            <a href="/assets/company-profile.pdf" className="btn btn-outline btn-gold btn-large about-btn" target="_blank" rel="noopener noreferrer" download>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: "inline-block", verticalAlign: "middle", marginRight: 6 }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
              {t("about.download")}
            </a>
          </div>
        </div>
        <div className="about-image">
          <img src="/assets/civil_1.jpg" alt="Construction Site in Qatar" loading="lazy" />
        </div>
      </div>
    </section>
  );
}
