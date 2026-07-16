import { Link } from "react-router-dom";
import { useI18n } from "../context/I18nContext.jsx";

/**
 * Shared shell for /privacy, /terms, /cookies routes.
 * Renders bilingually - individual pages pass EN + AR content and this
 * component picks the right block based on current language.
 */
export default function LegalPage({ crumb, title, children }) {
  const { t } = useI18n();
  return (
    <div className="legal-page-body">
      <section className="legal-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">{t("footer.home")}</Link> · {crumb}
          </div>
          <h1>{title}</h1>
          <div className="updated">{t("legal.freshness")}</div>
        </div>
      </section>
      <section className="legal-body">
        <div className="container">{children}</div>
      </section>
    </div>
  );
}
