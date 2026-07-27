import { useDocumentTitle } from "../hooks/useDocumentTitle.js";
import { useI18n } from "../context/I18nContext.jsx";
import { ROUTE_TITLES } from "../lib/constants.js";
import { useInView } from "../hooks/useInView.js";

function Paragraphs({ text }) {
  return text.split("\n\n").map((p, i) => <p key={i}>{p}</p>);
}

function RevealBlock({ id, className, children }) {
  const [ref, inView] = useInView(0.2);
  return (
    <section id={id} className={className}>
      <div className={"container mv-page-inner" + (inView ? " is-in-view" : "")} ref={ref}>
        <div className="reveal-up">{children}</div>
      </div>
    </section>
  );
}

export default function MissionVision() {
  useDocumentTitle(ROUTE_TITLES["/mission-vision"]);
  const { t } = useI18n();

  return (
    <div className="route-page">
      <RevealBlock id="mission-vision-intro" className="mv-page-block">
        <div className="section-header center">
          <span className="overline">{t("missionVisionPage.overline")}</span>
          <h1>{t("missionVisionPage.title")}</h1>
          <p className="section-lede">{t("missionVisionPage.intro")}</p>
        </div>
      </RevealBlock>

      <RevealBlock id="mission" className="mv-page-block section-alt">
        <h2 className="mv-page-heading">{t("missionVisionPage.missionHeading")}</h2>
        <div className="mv-page-copy">
          <Paragraphs text={t("missionVisionPage.missionBody")} />
        </div>
      </RevealBlock>

      <RevealBlock id="vision" className="mv-page-block">
        <h2 className="mv-page-heading">{t("missionVisionPage.visionHeading")}</h2>
        <div className="mv-page-copy">
          <Paragraphs text={t("missionVisionPage.visionBody")} />
        </div>
      </RevealBlock>
    </div>
  );
}
