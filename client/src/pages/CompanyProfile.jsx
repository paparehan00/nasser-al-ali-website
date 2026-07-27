import { useDocumentTitle } from "../hooks/useDocumentTitle.js";
import { useI18n } from "../context/I18nContext.jsx";
import { ROUTE_TITLES } from "../lib/constants.js";
import ChairmanSection from "../components/ChairmanSection.jsx";

export default function CompanyProfile() {
  useDocumentTitle(ROUTE_TITLES["/company-profile"]);
  const { t } = useI18n();

  return (
    <div className="route-page">
      <section className="company-profile-intro" id="company-profile">
        <div className="container">
          <div className="section-header center">
            <span className="overline">{t("companyProfile.overline")}</span>
            <h2>{t("companyProfile.title")}</h2>
            <p className="section-lede">{t("companyProfile.body")}</p>
          </div>
          <div className="company-profile-cta">
            <a
              href="/assets/nasser-al-ali-enterprises-company-profile.pdf"
              className="btn btn-solid btn-gold btn-large"
              target="_blank"
              rel="noopener noreferrer"
              download
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: "inline-block", verticalAlign: "middle", marginRight: 6 }}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
              </svg>
              {t("about.download")}
            </a>
          </div>
        </div>
      </section>

      <ChairmanSection />
    </div>
  );
}
