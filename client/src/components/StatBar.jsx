import { useEffect, useRef, useState } from "react";
import { useI18n } from "../context/I18nContext.jsx";
import { useContent, pickLang } from "../hooks/useContent.js";

function useCountUp(target, active, duration = 2000) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration]);
  return value;
}

export default function StatBar() {
  const { lang } = useI18n();
  const { data } = useContent("stats");
  const [active, setActive] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) { setActive(true); return; }
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { setActive(true); obs.disconnect(); } });
    }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const items = data?.items || [];

  return (
    <section className="stat-bar" id="stats" ref={ref}>
      <div className="container stat-container">
        {items.map((s, i) => (
          <StatCell
            key={s.id ?? i}
            target={s.data.target}
            plus={s.data.plus}
            label={pickLang(s.data.label, lang)}
            active={active}
            withDivider={i < items.length - 1}
          />
        ))}
      </div>
    </section>
  );
}

function StatCell({ target, plus, label, active, withDivider }) {
  const value = useCountUp(target, active);
  return (
    <>
      <div className="stat-item">
        <span className="stat-number">{value.toLocaleString()}</span>
        {plus && <span className="stat-plus">+</span>}
        <span className="stat-label">{label}</span>
      </div>
      {withDivider && <div className="stat-divider" />}
    </>
  );
}
