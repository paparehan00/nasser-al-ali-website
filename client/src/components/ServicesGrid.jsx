import { useI18n } from "../context/I18nContext.jsx";
import { useContent, pickLang } from "../hooks/useContent.js";

// Icon glyphs are per-service-id UI, not editable content — kept inline
// and looked up by the item's data.id.
const ICONS = {
  manpower: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  ),
  equipment: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16.01"/><line x1="16" y1="16" x2="16" y2="16.01"/></svg>
  ),
  civil: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 22H2M16 22V6l-6-4-6 4v16M16 10h6v12M6 14h4M6 10h4M6 18h4"/></svg>
  ),
  mep: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
  ),
  cleaning: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12l2-2 4 4 8-8 4 4M3 20h18"/></svg>
  ),
  business: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M9 13h.01M9 17h.01M14 9h.01M14 13h.01M14 17h.01"/></svg>
  ),
};

export default function ServicesGrid() {
  const { lang } = useI18n();
  const { data } = useContent("services");
  const section = data?.section;
  const items = data?.items || [];

  return (
    <section className="services" id="services">
      <div className="container">
        <div className="section-header">
          <span className="overline">{pickLang(section?.overline, lang)}</span>
          <h2>{pickLang(section?.title, lang)}</h2>
          <p className="section-lede">{pickLang(section?.lede, lang)}</p>
        </div>
        <div className="services-grid">
          {items.map((s) => {
            const d = s.data || {};
            return (
              <div className="service-card" key={s.id}>
                <div className="service-media">
                  <div className="service-img-wrap">
                    <img src={s.imagePath} alt={d.alt} loading="lazy" />
                  </div>
                  <div className="service-icon">{ICONS[d.id]}</div>
                </div>
                <div className="service-body">
                  <h3>{pickLang(d.title, lang)}</h3>
                  <div className="card-line" />
                  <p>{pickLang(d.body, lang)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
