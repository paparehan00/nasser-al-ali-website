import { useI18n } from "../context/I18nContext.jsx";
import { useContent, pickLang } from "../hooks/useContent.js";
import HorizontalCarousel from "./HorizontalCarousel.jsx";

export default function ProjectsMasonry({ onOpen }) {
  const { lang } = useI18n();
  const { data } = useContent("projects");
  const section = data?.section;
  const items   = data?.items || [];

  return (
    <section className="projects" id="projects">
      <div className="container">
        <div className="section-header">
          <span className="overline">{pickLang(section?.overline, lang)}</span>
          <h2>{pickLang(section?.title, lang)}</h2>
          <p className="section-lede">{pickLang(section?.lede, lang)}</p>
        </div>
      </div>

      {items.length > 0 && (
        <HorizontalCarousel
          items={items}
          slideWidth={360}
          gap={24}
          autoSpeed={30}
          label="Featured projects carousel"
          className="projects-carousel"
          renderItem={(p) => {
            const d = p.data || {};
            return (
              <div
                className="project-card"
                role="button"
                tabIndex={0}
                onClick={() => onOpen && onOpen(p.imagePath, d.name)}
                onKeyDown={(e) => e.key === "Enter" && onOpen && onOpen(p.imagePath, d.name)}
              >
                {d.latest && (
                  <span className="project-badge-latest" aria-label="Latest project">Latest</span>
                )}
                <div className="project-img-wrapper">
                  <img
                    src={p.imagePath}
                    alt={d.name ? `${d.name}${d.location ? ` — ${d.location}` : ""}` : "Project"}
                    loading="lazy"
                    draggable={false}
                  />
                </div>
                <div className="project-caption">
                  <h4>{d.name}</h4>
                  <p>{d.location}</p>
                </div>
              </div>
            );
          }}
        />
      )}
    </section>
  );
}
