import { useI18n } from "../context/I18nContext.jsx";
import { useContent, pickLang } from "../hooks/useContent.js";
import HorizontalCarousel from "./HorizontalCarousel.jsx";

export default function ClientLogos() {
  const { lang } = useI18n();
  const { data } = useContent("clients");
  const section = data?.section;
  const items   = data?.items || [];

  return (
    <section className="trusted-by section-alt" id="clients">
      <div className="container">
        <div className="section-header center">
          <span className="overline">{pickLang(section?.overline, lang)}</span>
          <h2>{pickLang(section?.title, lang)}</h2>
          <p className="section-lede">{pickLang(section?.lede, lang)}</p>
        </div>
      </div>

      {/* Full-width carousel — no container constraint so it bleeds edge-to-edge */}
      {items.length > 0 && (
        <HorizontalCarousel
          items={items}
          slideWidth={170}
          gap={24}
          autoSpeed={50}
          label="Trusted partners logo carousel"
          className="clients-carousel"
          renderItem={(l) => (
            <div className="logo-item">
              <img
                src={l.imagePath}
                alt={l.data?.name || ""}
                loading="lazy"
                draggable={false}
              />
            </div>
          )}
        />
      )}
    </section>
  );
}
