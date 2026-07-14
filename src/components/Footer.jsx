import { Link } from "react-router-dom";
import { useI18n } from "../context/I18nContext.jsx";
import { EMAIL, PHONE, PHONE_TEL, WHATSAPP_URL } from "../lib/constants.js";

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="site-footer">
      <div className="footer-bottom">
        <div className="container footer-bottom-flex">
          <div className="footer-logo">
            <img src="/assets/logo.png" alt="Nasser Al Ali Logo" />
            <span>Nasser Al Ali Enterprises</span>
          </div>
          <ul className="footer-links">
            <li><Link to="/services">{t("nav.services")}</Link></li>
            <li><Link to="/projects">{t("nav.projects")}</Link></li>
            <li><Link to="/about">{t("nav.about")}</Link></li>
            <li><Link to="/certifications">{t("nav.certifications")}</Link></li>
            <li><Link to="/awards">{t("nav.awards")}</Link></li>
            <li><Link to="/contact">{t("nav.contact")}</Link></li>
          </ul>
          <div className="footer-social">
            <a href={PHONE_TEL} className="btn-text">{t("cta.callAria").split(" ")[0]}</a>
            <span className="divider">·</span>
            <a href={WHATSAPP_URL} className="btn-text green-text" target="_blank" rel="noopener noreferrer">WhatsApp</a>
            <span className="divider">·</span>
            <a href={`mailto:${EMAIL}`} className="btn-text">Email</a>
          </div>
        </div>
        <div className="container footer-legal">
          <ul className="footer-legal-links">
            <li><Link to="/privacy">{t("footer.privacy")}</Link></li>
            <li><Link to="/terms">{t("footer.terms")}</Link></li>
            <li><Link to="/cookies">{t("footer.cookies")}</Link></li>
          </ul>
        </div>
        <div className="container copyright">
          <p>{t("footer.rights")}</p>
        </div>
      </div>
    </footer>
  );
}
