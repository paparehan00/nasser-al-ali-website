import { useEffect, useRef, useState } from "react";
import { useI18n } from "../context/I18nContext.jsx";
import { MAP_LINK } from "../lib/constants.js";

// Bar chart data (matches legacy site)
const BARS = [
  { year: "2005", target: 50,   px: 2,   labelText: "50" },
  { year: "2010", target: 500,  px: 20,  labelText: "500" },
  { year: "2015", target: 1500, px: 60,  labelText: "1.5K" },
  { year: "2020", target: 3000, px: 120, labelText: "3K" },
  { year: "2026", target: 5000, px: 200, labelText: "5K+" },
];

const CIRC = 439.82;
const DONUT = [
  { color: "#C9A24B", pct: 65, key: "labour" },
  { color: "#D9B76A", pct: 18, key: "mep" },
  { color: "#8AA0BF", pct: 10, key: "civil" },
  { color: "#4A6486", pct:  7, key: "admin" },
];

function useInView(threshold = 0.35) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!("IntersectionObserver" in window)) { setInView(true); return; }
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } });
    }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

export default function NumbersSection() {
  const { t } = useI18n();
  const [barRef, barInView] = useInView(0.35);
  const [donutRef, donutInView] = useInView(0.35);

  // Precompute cumulative offset so segments start at the right rotation
  let cursor = 0;
  const donutSegs = DONUT.map((seg) => {
    const dash = (seg.pct / 100) * CIRC;
    const offset = -cursor;
    cursor += dash;
    return { ...seg, dash, offset };
  });

  return (
    <section className="numbers section-alt" id="numbers">
      <div className="container">
        <div className="section-header center">
          <span className="overline">{t("numbers.overline")}</span>
          <h2>{t("numbers.title")}</h2>
          <p className="section-lede">{t("numbers.lede")}</p>
        </div>

        <div className="numbers-grid">
          {/* Bar chart */}
          <div className="chart-card" ref={barRef}>
            <div className="chart-head">
              <div className="chart-kicker">{t("numbers.workforceKicker")}</div>
              <h3>{t("numbers.workforceTitle")}</h3>
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
                  {BARS.map((b, i) => (
                    <rect key={i} className="bar" x={70 + i * 80} y={230 - b.px} width="50" height={b.px} rx="3" />
                  ))}
                </g>
                <g fill="#B8C4D6" fontFamily="Inter,sans-serif" fontSize="10" textAnchor="middle">
                  {BARS.map((b, i) => (
                    <text key={i} x={95 + i * 80} y="250">{b.year}</text>
                  ))}
                </g>
                <g fill="#C9A24B" fontFamily="Montserrat,sans-serif" fontSize="10" fontWeight="700" textAnchor="middle" className="bar-values">
                  {BARS.map((b, i) => (
                    <text key={i} className="bar-value" x={95 + i * 80} y={230 - b.px - 8}>{b.labelText}</text>
                  ))}
                </g>
              </svg>
              <div className="chart-note">{t("numbers.workforceNote")}</div>
            </div>
          </div>

          {/* Donut */}
          <div className="chart-card" ref={donutRef}>
            <div className="chart-head">
              <div className="chart-kicker">{t("numbers.mixKicker")}</div>
              <h3>{t("numbers.mixTitle")}</h3>
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
                  <text x="100" y="114" textAnchor="middle" fill="#B8C4D6" fontFamily="Inter,sans-serif" fontSize="10" letterSpacing="2">EMPLOYEES</text>
                </g>
              </svg>
              <ul className="donut-legend">
                {donutSegs.map((s) => (
                  <li key={s.key}>
                    <span className="dot" style={{ background: s.color }}></span> {t(`numbers.${s.key}`)} · <strong>{s.pct}%</strong>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* KPI trio */}
          <div className="kpi-card">
            <div className="kpi-value">43<span className="kpi-plus">+</span></div>
            <div className="kpi-label">{t("numbers.kpiClients")}</div>
            <div className="kpi-detail">{t("numbers.kpiClientsDetail")}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-value">16</div>
            <div className="kpi-label">{t("numbers.kpiGroup")}</div>
            <div className="kpi-detail">{t("numbers.kpiGroupDetail")}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-value">21</div>
            <div className="kpi-label">{t("numbers.kpiYears")}</div>
            <div className="kpi-detail">{t("numbers.kpiYearsDetail")}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
