import { useI18n } from "../context/I18nContext.jsx";

const PROJECTS = [
  { img: "/assets/3d_2.jpeg",  name: "Dareen Tower",           loc: "Dafna",        feature: true },
  { img: "/assets/3d_5.jpeg",  name: "Qanat Quartier",         loc: "Pearl Qatar" },
  { img: "/assets/3d_4.jpeg",  name: "Barwa Village",          loc: "Wakra" },
  { img: "/assets/3d_7.jpeg",  name: "75 Villas",              loc: "Ain Khalid" },
  { img: "/assets/3d_10.jpeg", name: "Twin Tower",             loc: "Abdul Aziz" },
  { img: "/assets/3d_8.jpeg",  name: "Business Park & Hotel",  loc: "Najma" },
  { img: "/assets/3d_11.jpeg", name: "Madina Centrale",        loc: "Pearl Qatar" },
  { img: "/assets/3d_6.jpeg",  name: "Residential Bldg 12 & 14", loc: "Pearl Qatar" },
  { img: "/assets/3d_9.jpeg",  name: "Hamad Bin Hanbal School", loc: "Najma" },
  { img: "/assets/3d_3.jpeg",  name: "Lusail Project",         loc: "Lusail" },
];

export default function ProjectsMasonry({ onOpen }) {
  const { t } = useI18n();
  return (
    <section className="projects" id="projects">
      <div className="container">
        <div className="section-header">
          <span className="overline">{t("projects.overline")}</span>
          <h2>{t("projects.title")}</h2>
          <p className="section-lede">{t("projects.lede")}</p>
        </div>
        <div className="masonry-grid">
          {PROJECTS.map((p) => (
            <div
              className={"project-card" + (p.feature ? " feature-card" : "")}
              key={p.img}
              onClick={() => onOpen && onOpen(p.img, p.name)}
            >
              <div className="project-img-wrapper">
                <img src={p.img} alt={`${p.name} - ${p.loc}`} loading="lazy" />
              </div>
              <div className="project-caption">
                <h4>{p.name}</h4>
                <p>{p.loc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
