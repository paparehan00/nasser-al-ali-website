import { useEffect, useRef, useState } from "react";
import { useI18n } from "../context/I18nContext.jsx";

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

const STATS = [
  { target: 21,   labelKey: "stats.years",     plus: false },
  { target: 5000, labelKey: "stats.workforce", plus: true  },
  { target: 43,   labelKey: "stats.clients",   plus: true  },
  { target: 6,    labelKey: "stats.divisions", plus: false },
];

export default function StatBar() {
  const { t } = useI18n();
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

  return (
    <section className="stat-bar" id="stats" ref={ref}>
      <div className="container stat-container">
        {STATS.map((s, i) => (
          <StatCell key={i} target={s.target} plus={s.plus} labelKey={s.labelKey} active={active} withDivider={i < STATS.length - 1} t={t} />
        ))}
      </div>
    </section>
  );
}

function StatCell({ target, plus, labelKey, active, withDivider, t }) {
  const value = useCountUp(target, active);
  return (
    <>
      <div className="stat-item">
        <span className="stat-number">{value.toLocaleString()}</span>
        {plus && <span className="stat-plus">+</span>}
        <span className="stat-label">{t(labelKey)}</span>
      </div>
      {withDivider && <div className="stat-divider" />}
    </>
  );
}
