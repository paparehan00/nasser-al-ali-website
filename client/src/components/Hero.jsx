import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../context/I18nContext.jsx";
import { useContent, pickLang } from "../hooks/useContent.js";

/**
 * Hero - video mode for mobile / reduced-motion / slow-network,
 * plus a poster fallback that shows instantly on all devices.
 * Text is data-driven (via /api/content/hero). Video/poster paths come
 * from the section's `extra.video` blob but fall back to the known
 * asset paths so the first paint never blocks on the content fetch.
 */

const VIDEO_FALLBACK = {
  webm:   "/assets/hero-1080.webm",
  mp4:    "/assets/hero-1080.mp4",
  poster: "/assets/hero-poster.jpg",
};

export default function Hero() {
  const { lang } = useI18n();
  const { data } = useContent("hero");
  const section = data?.section;
  const extra = section?.extra || {};
  const video = { ...VIDEO_FALLBACK, ...(extra.video || {}) };

  const videoRef = useRef(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.playsInline = true;
    v.controls = false;
    v.removeAttribute("controls");
    const tryPlay = () => v.play().catch(() => {
      const kick = () => v.play().catch(() => {});
      document.addEventListener("click", kick, { once: true });
      document.addEventListener("touchstart", kick, { once: true });
    });
    v.load();
    v.addEventListener("canplay", tryPlay, { once: true });
    return () => v.removeEventListener("canplay", tryPlay);
  }, [video.webm, video.mp4]);

  return (
    <section className="hero" id="hero">
      <div className="hero-sticky">
        <div
          className="hero-fallback"
          id="hero-fallback"
          style={{ backgroundImage: `url("${video.poster}")` }}
        />
        <video
          ref={videoRef}
          className="hero-video is-active"
          id="hero-video"
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          aria-hidden="true"
          tabIndex={-1}
        >
          <source src={video.webm} type="video/webm" />
          <source src={video.mp4} type="video/mp4" />
        </video>

        <div className="hero-overlay">
          <div className="container hero-container">
            <div className="hero-content">
              <span className="overline hero-overline">{pickLang(section?.overline, lang)}</span>
              <h1 className="hero-title">{pickLang(section?.title, lang)}</h1>
              <p className="hero-subtitle">{pickLang(section?.lede, lang)}</p>
              <div className="hero-buttons">
                <Link to="/contact" className="btn btn-solid btn-gold btn-large">
                  {pickLang(extra.btnProposal, lang)}
                </Link>
                <Link to="/projects" className="btn btn-outline btn-white btn-large">
                  {pickLang(extra.btnProjects, lang)}
                </Link>
              </div>
            </div>
          </div>
          <div className="scroll-indicator">
            <div className="mouse">
              <div className="wheel" />
            </div>
            <span>{pickLang(extra.scroll, lang)}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
