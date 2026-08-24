import { useEffect, useRef, useState } from "react";
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";
import { useI18n } from "../context/I18nContext.jsx";
import { useContent } from "../hooks/useContent.js";
import { ROUTE_TITLES } from "../lib/constants.js";
import { useInView } from "../hooks/useInView.js";

const MV_VIDEO_FALLBACK = {
  mp4: "/assets/mission-bg.mp4",
  webm: "",
  poster: "/assets/mission-bg-poster.jpg",
};

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

// Same video-background treatment as the home page's MissionVisionSection —
// reuses its CMS video config (extra.video) and the .mv-bg/.mv-video/
// .mv-overlay/.mv-container classes so both surfaces stay visually and
// behaviorally consistent (incl. the autoplay-retry-on-first-touch fix).
function MissionIntro({ children }) {
  const { data } = useContent("mission-vision");
  const cmsVideo = data?.section?.extra?.video || {};
  const video = {
    mp4: cmsVideo.mp4 || MV_VIDEO_FALLBACK.mp4,
    webm: cmsVideo.webm || MV_VIDEO_FALLBACK.webm,
    poster: cmsVideo.poster || MV_VIDEO_FALLBACK.poster,
  };
  const hasVideo = Boolean(video.webm || video.mp4);

  const [allowVideo, setAllowVideo] = useState(false);
  useEffect(() => {
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setAllowVideo(!motionMq.matches);
    update();
    motionMq.addEventListener("change", update);
    return () => motionMq.removeEventListener("change", update);
  }, []);

  const shouldMountVideo = hasVideo && allowVideo;

  const videoRef = useRef(null);
  useEffect(() => {
    if (!shouldMountVideo) return;
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.playsInline = true;

    // Some mobile browsers (notably Chrome/Android with Data Saver on)
    // refuse to fetch ANY video bytes — not just refuse to play — until
    // the user's first touch, so "canplay" can silently never fire at all
    // pre-interaction. Registering the touch/click retry unconditionally
    // (not nested inside a failed-play catch) means the first tap still
    // kicks the video off even in that case.
    const kick = () => v.play().catch(() => {});
    document.addEventListener("click", kick, { once: true });
    document.addEventListener("touchstart", kick, { once: true });

    const tryPlay = () => v.play().catch(() => {});
    v.load();
    v.addEventListener("canplay", tryPlay, { once: true });
    return () => {
      v.removeEventListener("canplay", tryPlay);
      document.removeEventListener("click", kick);
      document.removeEventListener("touchstart", kick);
    };
  }, [shouldMountVideo, video.webm, video.mp4]);

  const [ref, inView] = useInView(0.2);

  return (
    <section id="mission-vision-intro" className="mission-vision">
      <div className="mv-bg" style={{ backgroundImage: `url("${video.poster}")` }} />
      {shouldMountVideo && (
        <video
          ref={videoRef}
          className="mv-video"
          poster={video.poster}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          aria-hidden="true"
          tabIndex={-1}
        >
          {video.webm && <source src={video.webm} type="video/webm" />}
          {video.mp4 && <source src={video.mp4} type="video/mp4" />}
        </video>
      )}
      <div className="mv-overlay" />
      <div className={"container mv-container mv-page-inner" + (inView ? " is-in-view" : "")} ref={ref}>
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
      <MissionIntro>
        <div className="section-header center">
          <span className="overline mv-overline">{t("missionVisionPage.overline")}</span>
          <h1 className="mv-heading">{t("missionVisionPage.title")}</h1>
          <p className="section-lede mv-lede">{t("missionVisionPage.intro")}</p>
        </div>
      </MissionIntro>

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
