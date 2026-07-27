import { useEffect, useRef, useState } from "react";
import { useI18n } from "../context/I18nContext.jsx";
import { useContent, pickLang } from "../hooks/useContent.js";
import { useInView } from "../hooks/useInView.js";

const MV_VIDEO_FALLBACK = {
  mp4: "/assets/mission-bg.mp4",
  webm: "",
  poster: "/assets/mission-bg-poster.jpg",
};

export default function MissionVisionSection() {
  const { lang } = useI18n();
  const { data } = useContent("mission-vision");
  // rootMargin starts loading the video a little before the section is
  // actually on screen, so it's not requested on initial page load (lazy)
  // but also isn't visibly still buffering the moment it scrolls into view.
  const [ref, inView] = useInView(0.15, "300px 0px 300px 0px");

  const section = data?.section;
  const extra = section?.extra || {};
  // CMS values win only when actually set — falls back to the shipped
  // mission-bg asset otherwise (an empty string saved from the admin form
  // must not silently blank out the default, unlike a plain object spread).
  const cmsVideo = extra.video || {};
  const video = {
    mp4: cmsVideo.mp4 || MV_VIDEO_FALLBACK.mp4,
    webm: cmsVideo.webm || MV_VIDEO_FALLBACK.webm,
    poster: cmsVideo.poster || MV_VIDEO_FALLBACK.poster,
  };
  const hasVideo = Boolean(video.webm || video.mp4);

  // Video plays on every viewport size, including mobile — only
  // prefers-reduced-motion skips it (accessibility: shows the static
  // poster instead for users who've asked for no motion).
  const [allowVideo, setAllowVideo] = useState(false);
  useEffect(() => {
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setAllowVideo(!motionMq.matches);
    update();
    motionMq.addEventListener("change", update);
    return () => motionMq.removeEventListener("change", update);
  }, []);

  const shouldMountVideo = hasVideo && inView && allowVideo;

  const videoRef = useRef(null);
  useEffect(() => {
    if (!shouldMountVideo) return;
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.playsInline = true;
    const tryPlay = () => v.play().catch(() => {});
    v.load();
    v.addEventListener("canplay", tryPlay, { once: true });
    return () => v.removeEventListener("canplay", tryPlay);
  }, [shouldMountVideo, video.webm, video.mp4]);

  return (
    <section className="mission-vision" id="mission-vision" ref={ref}>
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

      <div className="container mv-container">
        <div className="section-header center">
          <span className="overline mv-overline">{pickLang(section?.overline, lang)}</span>
          <h2 className="mv-heading">{pickLang(section?.title, lang)}</h2>
          <p className="section-lede mv-lede">{pickLang(section?.lede, lang)}</p>
        </div>

        <div className={"mv-grid" + (inView ? " is-in-view" : "")}>
          <div className="mv-card reveal-up" style={{ "--reveal-delay": "0s" }}>
            <span className="mv-card-num">01</span>
            <h3>{pickLang(extra.missionTitle, lang)}</h3>
            <p>{pickLang(extra.missionBody, lang)}</p>
          </div>
          <div className="mv-card reveal-up" style={{ "--reveal-delay": "0.15s" }}>
            <span className="mv-card-num">02</span>
            <h3>{pickLang(extra.visionTitle, lang)}</h3>
            <p>{pickLang(extra.visionBody, lang)}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
