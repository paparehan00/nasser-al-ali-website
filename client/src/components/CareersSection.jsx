import { useState } from "react";
import { useI18n } from "../context/I18nContext.jsx";
import { useContent, pickLang } from "../hooks/useContent.js";
import { useInView } from "../hooks/useInView.js";
import ApplyModal from "./ApplyModal.jsx";

const BRIEFCASE_ICON = (
  <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="7" y="14" width="26" height="18" rx="2" />
    <path d="M15 14v-3a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v3" />
    <path d="M7 22h26" />
  </svg>
);

export default function CareersSection() {
  const { t, lang } = useI18n();
  const { data } = useContent("careers");
  const section = data?.section;
  const jobs = data?.items || [];
  const [applyTarget, setApplyTarget] = useState(null);
  const [gridRef, gridInView] = useInView(0.15);

  return (
    <section className="careers" id="careers">
      <div className="container">
        <div className="section-header center">
          <span className="overline">{pickLang(section?.overline, lang)}</span>
          <h2>{pickLang(section?.title, lang)}</h2>
          <p className="section-lede">{pickLang(section?.lede, lang)}</p>
        </div>

        {jobs.length > 0 ? (
          <div className={"careers-grid" + (gridInView ? " is-in-view" : "")} ref={gridRef}>
            {jobs.map((job, i) => {
              const d = job.data || {};
              const title       = pickLang(d.title, lang);
              const department  = pickLang(d.department, lang);
              const location    = pickLang(d.location, lang);
              const type        = pickLang(d.type, lang);
              const description = pickLang(d.description, lang);
              const requirements = pickLang(d.requirements, lang).split("\n").map((r) => r.trim()).filter(Boolean);
              return (
                <div className="job-card reveal-up" key={job.id} style={{ "--reveal-delay": `${Math.min(i, 6) * 70}ms` }}>
                  <div className="job-card-head">
                    <div className="job-icon">{BRIEFCASE_ICON}</div>
                    {type && <span className="job-type-badge">{type}</span>}
                  </div>
                  <h3 className="job-title">{title}</h3>
                  <div className="job-meta">
                    {department && <span>{department}</span>}
                    {department && location && <span className="job-meta-sep">·</span>}
                    {location && <span>{location}</span>}
                  </div>
                  {description && <p className="job-desc">{description}</p>}
                  {requirements.length > 0 && (
                    <ul className="job-requirements">
                      {requirements.map((r, ri) => <li key={ri}>{r}</li>)}
                    </ul>
                  )}
                  <button type="button" className="btn btn-outline btn-gold job-apply-btn" onClick={() => setApplyTarget({ ...job, resolvedTitle: title })}>
                    {t("careers.applyNow")}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="careers-empty">
            <div className="careers-empty-icon">{BRIEFCASE_ICON}</div>
            <h3>{t("careers.noOpenings")}</h3>
            <p>{t("careers.noOpeningsBody")}</p>
            <button type="button" className="btn btn-solid btn-gold" onClick={() => setApplyTarget({ general: true })}>
              {t("careers.sendGeneral")}
            </button>
          </div>
        )}
      </div>

      <ApplyModal job={applyTarget} onClose={() => setApplyTarget(null)} />
    </section>
  );
}
