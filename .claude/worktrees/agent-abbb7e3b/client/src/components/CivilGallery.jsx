import { useEffect, useRef } from "react";
import { useI18n } from "../context/I18nContext.jsx";
import { useContent, pickLang } from "../hooks/useContent.js";

export default function CivilGallery({ onOpen }) {
  const { lang } = useI18n();
  const { data } = useContent("gallery");
  const section = data?.section;
  const items = data?.items || [];

  const trackRef = useRef(null);
  const posRef = useRef(0);
  const rafRef = useRef(0);

  // Simple continuous auto-scroll marquee. Duplicates items so it wraps.
  // Re-runs when the item count changes so the marquee re-computes halfWidth
  // after the async fetch resolves.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || items.length === 0) return;
    let last = performance.now();
    let paused = false;
    const speed = 40; // px/sec

    const step = (now) => {
      const dt = (now - last) / 1000; last = now;
      if (!paused) {
        posRef.current += speed * dt;
        const halfWidth = track.scrollWidth / 2;
        if (halfWidth > 0 && posRef.current >= halfWidth) posRef.current -= halfWidth;
        track.style.transform = `translateX(-${posRef.current}px)`;
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);

    const onEnter = () => { paused = true; };
    const onLeave = () => { paused = false; last = performance.now(); };
    track.addEventListener("mouseenter", onEnter);
    track.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(rafRef.current);
      track.removeEventListener("mouseenter", onEnter);
      track.removeEventListener("mouseleave", onLeave);
    };
  }, [items.length]);

  const doubled = [...items, ...items];

  return (
    <section className="gallery section-alt" id="gallery">
      <div className="container">
        <div className="section-header">
          <span className="overline">{pickLang(section?.overline, lang)}</span>
          <h2>{pickLang(section?.title, lang)}</h2>
          <p className="section-lede">{pickLang(section?.lede, lang)}</p>
        </div>
      </div>
      <div className="carousel-container">
        <div className="carousel-track" ref={trackRef}>
          {doubled.map((it, i) => (
            <div
              className="carousel-item"
              key={i}
              onClick={() => onOpen && onOpen(it.imagePath, `Civil work ${(i % items.length) + 1}`)}
            >
              <img src={it.imagePath} alt={it.data?.alt || "Civil Work"} loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
