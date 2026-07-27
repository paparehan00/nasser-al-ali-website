import { Link } from "react-router-dom";
import { Users, Truck, Building2, Zap, Sparkles, Briefcase } from "lucide-react";
import { useI18n } from "../context/I18nContext.jsx";
import { useContent, pickLang } from "../hooks/useContent.js";
import { SERVICE_SLUGS_BY_ID } from "../lib/serviceDetails.js";

// Icon glyphs are per-service-id UI, not editable content — kept inline
// and looked up by the item's data.id.
const ICONS = {
  manpower: <Users size={22} strokeWidth={2} aria-hidden="true" />,
  equipment: <Truck size={22} strokeWidth={2} aria-hidden="true" />,
  civil: <Building2 size={22} strokeWidth={2} aria-hidden="true" />,
  mep: <Zap size={22} strokeWidth={2} aria-hidden="true" />,
  cleaning: <Sparkles size={22} strokeWidth={2} aria-hidden="true" />,
  business: <Briefcase size={22} strokeWidth={2} aria-hidden="true" />,
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
            const slug = SERVICE_SLUGS_BY_ID[d.id];
            const card = (
              <>
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
              </>
            );
            return slug ? (
              <Link className="service-card service-card-link" to={`/services/${slug}`} key={s.id}>
                {card}
              </Link>
            ) : (
              <div className="service-card" key={s.id}>{card}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
