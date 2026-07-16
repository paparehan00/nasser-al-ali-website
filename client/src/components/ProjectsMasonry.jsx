import { useI18n } from "../context/I18nContext.jsx";
import { useContent, pickLang } from "../hooks/useContent.js";

export default function ProjectsMasonry({ onOpen }) {
  const { lang } = useI18n();
  const { data } = useContent("projects");
  const section = data?.section;
  const items = data?.items || [];

  return (
    <section className="projects" id="projects">
      <div className="container">
        <div className="section-header">
          <span className="overline">{pickLang(section?.overline, lang)}</span>
          <h2>{pickLang(section?.title, lang)}</h2>
          <p className="section-lede">{pickLang(section?.lede, lang)}</p>
        </div>
        <div className="masonry-grid">
          {items.map((p) => {
            const d = p.data || {};
            return (
              <div
                className={"project-card" + (d.featured ? " feature-card" : "")}
                key={p.id}
                onClick={() => onOpen && onOpen(p.imagePath, d.name)}
              >
                <div className="project-img-wrapper">
                  <img src={p.imagePath} alt={`${d.name} - ${d.location}`} loading="lazy" />
                </div>
                <div className="project-caption">
                  <h4>{d.name}</h4>
                  <p>{d.location}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
