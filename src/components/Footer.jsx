import { Link } from "react-router-dom";
import { useI18n } from "../context/I18nContext.jsx";
import { EMAIL, PHONE_TEL, WHATSAPP_URL } from "../lib/constants.js";

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
          <div className="footer-slogan">
            <span className="slogan-line">{t("footer.slogan")}</span>
            <span className="slogan-tag">{t("footer.tag")}</span>
          </div>
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
