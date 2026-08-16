import { useI18n } from "../context/I18nContext.jsx";
import { useInView } from "../hooks/useInView.js";

const FLEET = [
  { id: "towerCranes", img: "/assets/fleet/tower-cranes.webp",       alt: "Tower cranes on a Doha construction site" },
  { id: "excavators",  img: "/assets/fleet/excavators-jcbs.webp",    alt: "Excavators and JCBs at a Qatar earthworks site" },
  { id: "loaders",     img: "/assets/fleet/wheel-loaders.webp",      alt: "Wheel loader handling aggregate at an industrial site" },
  { id: "tippers",     img: "/assets/fleet/tipper-trucks.webp",      alt: "Tipper truck offloading excavated material" },
  { id: "mixers",      img: "/assets/fleet/concrete-mixers.webp",    alt: "Concrete mixer truck at a Nasser Al Ali site" },
  { id: "lifts",       img: "/assets/fleet/boom-scissor-lifts.webp", alt: "Scissor lift and boom lift for aerial works" },
];

export default function FleetGrid() {
  const { t } = useI18n();
  const [gridRef, inView] = useInView(0.1);
  return (
    <section className="fleet section-alt" id="fleet">
      <div className="container">
        <div className="section-header">
          <span className="overline">{t("fleet.overline")}</span>
          <h2>{t("fleet.title")}</h2>
          <p className="section-lede">{t("fleet.lede")}</p>
        </div>
        <div className={"fleet-grid" + (inView ? " is-in-view" : "")} ref={gridRef}>
          {FLEET.map((f, i) => (
            <div className="fleet-card reveal-up" key={f.id} style={{ "--reveal-delay": `${i * 0.06}s` }}>
              <div className={"fleet-illus clip-reveal" + (inView ? " is-in" : "")}>
                <img src={f.img} alt={f.alt} loading="lazy" />
              </div>
              <div className="fleet-body">
                <h3>{t(`fleet.${f.id}.title`)}</h3>
                <p>{t(`fleet.${f.id}.body`)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
