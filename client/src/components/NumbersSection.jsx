import { useEffect, useRef, useState } from "react";
import { useI18n } from "../context/I18nContext.jsx";
import { useContent, pickLang } from "../hooks/useContent.js";

const CIRC = 439.82;

// ── Intersection helper ──────────────────────────────────────────────────────
function useInView(threshold = 0.35) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!("IntersectionObserver" in window)) { setInView(true); return; }
    const obs = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// ── Count-up animation (proper custom hook) ──────────────────────────────────
function useCountUp(target, inView, duration = 1600) {
  const [count, setCount] = useState(0);
  const rafRef = useRef(null);
  useEffect(() => {
    if (!inView || !target) return;
    const start = performance.now();
    const step = (ts) => {
      const t = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.floor(eased * target));
      if (t < 1) rafRef.current = requestAnimationFrame(step);
      else setCount(target);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [inView, target, duration]);
  return count;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function NumbersSection() {
  const { lang } = useI18n();

  const { data }        = useContent("numbers");
  const { data: cData } = useContent("clients");

  const [barRef,   barInView]   = useInView(0.35);
  const [donutRef, donutInView] = useInView(0.35);
  const [kpiRef,   kpiInView]   = useInView(0.25);

  const section = data?.section;
  const extra   = section?.extra || {};
  const bars    = extra.bars  || [];
  const donut   = extra.donut || [];
  const kpis    = extra.kpis  || [];

  // Live client count from DB; fall back to seed value in admin data
  const liveClientCount = cData?.items?.length || kpis[0]?.value || 43;

  const kpiTargets = kpis.map((k, i) => (i === 0 ? liveClientCount : k.value ?? 0));

  // Three separate hook calls — hooks must never be inside a loop/conditional
  const c0 = useCountUp(kpiTargets[0] ?? 0, kpiInView);
  const c1 = useCountUp(kpiTargets[1] ?? 0, kpiInView);
  const c2 = useCountUp(kpiTargets[2] ?? 0, kpiInView);
  const animated = [c0, c1, c2];

  // Precompute donut segment offsets
  let cursor = 0;
  const donutSegs = donut.map((seg) => {
    const dash   = (seg.pct / 100) * CIRC;
    const offset = -cursor;
    cursor += dash;
    return { ...seg, dash, offset };
  });

  return (
    <section className="numbers section-alt" id="numbers">
      <div className="container">
        <div className="section-header center">
          <span className="overline">{pickLang(section?.overline, lang)}</span>
          <h2>{pickLang(section?.title, lang)}</h2>
          <p className="section-lede">{pickLang(section?.lede, lang)}</p>
        </div>

        <div className="numbers-grid">
          {/* ── Bar chart ──────────────────────────────────────────────── */}
          <div className="chart-card" ref={barRef}>
            <div className="chart-head">
              <div className="chart-kicker">{pickLang(extra.workforceKicker, lang)}</div>
              <h3>{pickLang(extra.workforceTitle, lang)}</h3>
            </div>
            <div className="chart-body">
              <svg className={"bar-chart" + (barInView ? " is-visible" : "")} viewBox="0 0 500 260" role="img" aria-label="Workforce growth bar chart">
                <g stroke="rgba(255,255,255,0.06)" strokeWidth="1">
                  <line x1="40" y1="30"  x2="490" y2="30"/>
                  <line x1="40" y1="80"  x2="490" y2="80"/>
                  <line x1="40" y1="130" x2="490" y2="130"/>
                  <line x1="40" y1="180" x2="490" y2="180"/>
                  <line x1="40" y1="230" x2="490" y2="230"/>
                </g>
                <g fill="#B8C4D6" fontFamily="Inter,sans-serif" fontSize="10" textAnchor="end">
                  <text x="34" y="34">5000</text>
                  <text x="34" y="84">3750</text>
                  <text x="34" y="134">2500</text>
                  <text x="34" y="184">1250</text>
                  <text x="34" y="234">0</text>
                </g>
                <g className="bars">
                  {bars.map((b, i) => (
                    <rect key={i} className="bar" x={70 + i * 80} y={230 - b.px} width="50" height={b.px} rx="3" />
                  ))}
                </g>
                <g fill="#B8C4D6" fontFamily="Inter,sans-serif" fontSize="10" textAnchor="middle">
                  {bars.map((b, i) => (
                    <text key={i} x={95 + i * 80} y="250">{b.year}</text>
                  ))}
                </g>
                <g fill="#C9A24B" fontFamily="Montserrat,sans-serif" fontSize="10" fontWeight="700" textAnchor="middle" className="bar-values">
                  {bars.map((b, i) => (
                    <text key={i} className="bar-value" x={95 + i * 80} y={230 - b.px - 8}>{b.labelText}</text>
                  ))}
                </g>
              </svg>
              <div className="chart-note">{pickLang(extra.workforceNote, lang)}</div>
            </div>
          </div>

          {/* ── Donut ──────────────────────────────────────────────────── */}
          <div className="chart-card" ref={donutRef}>
            <div className="chart-head">
              <div className="chart-kicker">{pickLang(extra.mixKicker, lang)}</div>
              <h3>{pickLang(extra.mixTitle, lang)}</h3>
            </div>
            <div className="chart-body donut-body">
              <svg className={"donut-chart" + (donutInView ? " is-visible" : "")} viewBox="0 0 200 200" role="img" aria-label="Workforce composition donut chart">
                <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="28"/>
                {donutSegs.map((s, i) => (
                  <circle
                    key={i}
                    className={`donut-seg donut-seg-${i + 1}`}
                    cx="100" cy="100" r="70"
                    fill="none" stroke={s.color} strokeWidth="28"
                    strokeDasharray={donutInView ? `${s.dash} ${CIRC}` : `0 ${CIRC}`}
                    strokeDashoffset={s.offset}
                    transform="rotate(-90 100 100)"
                  />
                ))}
                <g className="donut-center">
                  <text x="100" y="94" textAnchor="middle" fill="#fff" fontFamily="Montserrat,sans-serif" fontSize="28" fontWeight="800">5K+</text>
                  <text x="100" y="114" textAnchor="middle" fill="#B8C4D6" fontFamily="Inter,sans-serif" fontSize="10" letterSpacing="2">{pickLang(extra.donutLabel, lang)}</text>
                </g>
              </svg>
              <ul className="donut-legend">
                {donutSegs.map((s) => (
                  <li key={s.key}>
                    <span className="dot" style={{ background: s.color }}></span>
                    {pickLang(s.label, lang)} · <strong>{s.pct}%</strong>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── KPI trio — real div so IntersectionObserver fires ─────── */}
          <div className="kpi-trio" ref={kpiRef}>
            {kpis.map((k, i) => (
              <div className="kpi-card" key={i}>
                <div className="kpi-value">
                  {animated[i] ?? kpiTargets[i] ?? 0}
                  <span className="kpi-plus">+</span>
                </div>
                <div className="kpi-label">{pickLang(k.label, lang)}</div>
                <div className="kpi-detail">{pickLang(k.detail, lang)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
