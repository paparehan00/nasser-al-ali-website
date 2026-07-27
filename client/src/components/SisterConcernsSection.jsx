import { useI18n } from "../context/I18nContext.jsx";
import { useContent, pickLang } from "../hooks/useContent.js";
import { useInView } from "../hooks/useInView.js";
import { tiltHandlers } from "../lib/tiltEffect.js";

export default function SisterConcernsSection() {
  const { t, lang } = useI18n();
  const { data } = useContent("sister-concerns");
  const [gridRef, inView] = useInView(0.1);

  const section = data?.section;
  const items = data?.items || [];

  const overline = pickLang(section?.overline, lang) || t("sisterConcerns.overline");
  const title    = pickLang(section?.title, lang)    || t("sisterConcerns.title");
  const lede     = pickLang(section?.lede, lang)      || t("sisterConcerns.lede");

  return (
    <section className="sister-concerns" id="sister-concerns">
      <div className="container">
        <div className="section-header center">
          <span className="overline">{overline}</span>
          <h2>{title}</h2>
          <p className="section-lede">{lede}</p>
        </div>

        {items.length > 0 ? (
          <div className={"sister-grid" + (inView ? " is-in-view" : "")} ref={gridRef}>
            {items.map((it, i) => {
              const d = it.data || {};
              const name = pickLang(d.name, lang);
              return (
                <div className="sister-card reveal-up" key={it.id} style={{ "--reveal-delay": `${i * 0.06}s` }}>
                  <div className="sister-logo tilt-frame" {...tiltHandlers}>
                    <img src={it.imagePath} alt={name} loading="lazy" />
                  </div>
                  <h3 className="sister-name">{name}</h3>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="sister-empty">{t("sisterConcerns.comingSoon")}</div>
        )}
      </div>
    </section>
  );
}
