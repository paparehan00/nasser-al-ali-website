import { useI18n } from "../context/I18nContext.jsx";
import { useContent, pickLang } from "../hooks/useContent.js";

const PLACEHOLDER = (
  <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <circle cx="20" cy="15" r="6"/>
    <path d="M8 34c1-6 6-10 12-10s11 4 12 10"/>
  </svg>
);

const MANAGERS = [
  { roleKey: "leadership.gm" },
  { roleKey: "leadership.hr" },
  { roleKey: "leadership.admin" },
  { roleKey: "leadership.ops" },
];

export default function LeadershipSection() {
  const { t, lang } = useI18n();
  const { data: chairmanData } = useContent("chairman");
  const chairmanExtra = chairmanData?.section?.extra || {};
  const chairName = pickLang(chairmanExtra.name, lang);
  const chairRole = pickLang(chairmanExtra.role, lang);
  const chairPhoto = chairmanExtra.imagePath || "/assets/chairman.png";

  return (
    <section className="leadership" id="leadership">
      <div className="container">
        <div className="section-header center">
          <span className="overline">{t("leadership.overline")}</span>
          <h2>{t("leadership.title")}</h2>
          <p className="section-lede">{t("leadership.lede")}</p>
        </div>

        <div className="org-chart">
          <div className="org-top">
            <div className="leader-card leader-chair">
              <div className="leader-photo">
                <img src={chairPhoto} alt={`${chairName} - ${chairRole}`} loading="lazy" />
              </div>
              <div className="leader-body">
                <span className="leader-role">{t("leadership.chairman")}</span>
                <h4 className="leader-name">{chairName}</h4>
              </div>
            </div>
          </div>

          <div className="org-connector" aria-hidden="true">
            <svg viewBox="0 0 800 60" preserveAspectRatio="none">
              <path d="M400 0 L400 30 L100 30 L100 60 M400 30 L300 30 L300 60 M400 30 L500 30 L500 60 M400 30 L700 30 L700 60" fill="none" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </div>

          <div className="org-row">
            {MANAGERS.map((m) => (
              <div className="leader-card" key={m.roleKey}>
                <div className="leader-photo placeholder-photo">{PLACEHOLDER}</div>
                <div className="leader-body">
                  <span className="leader-role">{t(m.roleKey)}</span>
                  <h4 className="leader-name">{t("leadership.tbd")}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
