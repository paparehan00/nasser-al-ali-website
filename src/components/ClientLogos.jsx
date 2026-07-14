import { useI18n } from "../context/I18nContext.jsx";

const LOGOS = [
  { src: "/assets/alhabtoor.png", alt: "Al Habtoor" },
  { src: "/assets/hyundai.png",   alt: "Hyundai" },
  { src: "/assets/j-n-p.png",     alt: "J&P" },
  { src: "/assets/arabtec.png",   alt: "Arabtec" },
  { src: "/assets/midmac.png",    alt: "Midmac" },
  { src: "/assets/six-construct.png", alt: "Six Construct" },
  { src: "/assets/shapoorji.png", alt: "Shapoorji" },
  { src: "/assets/china-harbor.png", alt: "China Harbor" },
  { src: "/assets/simplex.png",   alt: "Simplex" },
  { src: "/assets/redco.png",     alt: "Redco" },
  { src: "/assets/sino.png",      alt: "Sino" },
  { src: "/assets/gulfar.png",    alt: "Gulfar" },
  { src: "/assets/adcc.png",      alt: "ADCC" },
  { src: "/assets/hbk.png",       alt: "HBK" },
  { src: "/assets/ramco.png",     alt: "Ramco" },
  { src: "/assets/hkh.png",       alt: "HKH" },
  { src: "/assets/aljabor.png",   alt: "Al Jabor" },
  { src: "/assets/qbc.png",       alt: "QBC" },
  { src: "/assets/powerline.png", alt: "Powerline" },
  { src: "/assets/ict.png",       alt: "ICT" },
  { src: "/assets/noors.png",     alt: "Noors" },
  { src: "/assets/yuksel.png",    alt: "Yuksel" },
  { src: "/assets/kg.png",        alt: "KG" },
  { src: "/assets/talal.png",     alt: "Talal" },
  { src: "/assets/classical-palace.png", alt: "Classical Palace" },
  { src: "/assets/eta.png",       alt: "ETA" },
  { src: "/assets/marbu.png",     alt: "Marbu" },
  { src: "/assets/shannon.png",   alt: "Shannon" },
  { src: "/assets/arabian-specialised-materials.png", alt: "Arabian Specialised Materials" },
  { src: "/assets/builders-advanced.png", alt: "Builders Advanced" },
  { src: "/assets/dogus-onur-jv.png", alt: "Dogus-Onur JV" },
  { src: "/assets/elegancia.png", alt: "Elegancia" },
  { src: "/assets/gulf-asia-contracting.png", alt: "Gulf Asia Contracting" },
  { src: "/assets/gulf-contracting-company.png", alt: "Gulf Contracting Company" },
  { src: "/assets/iris-construction.png", alt: "Iris Construction" },
  { src: "/assets/midmac-tav-jv.png", alt: "Midmac-TAV JV" },
  { src: "/assets/teyseer.png",   alt: "Teyseer" },
  { src: "/assets/ucc-infraroad-limak-jv.png", alt: "UCC InfraRoad Limak JV" },
  { src: "/assets/china-eleventh-chemical.png", alt: "China Eleventh Chemical" },
  { src: "/assets/inco-industrial-duqm.png", alt: "INCO Industrial Duqm" },
  { src: "/assets/vito-engineering.png", alt: "Vito Engineering" },
  { src: "/assets/bahadir-construction.png", alt: "Bahadir Construction" },
  { src: "/assets/qatar-maid-service.png", alt: "Qatar Maid Service" },
];

export default function ClientLogos() {
  const { t } = useI18n();
  return (
    <section className="trusted-by section-alt" id="clients">
      <div className="container">
        <div className="section-header center">
          <span className="overline">{t("clients.overline")}</span>
          <h2>{t("clients.title")}</h2>
          <p className="section-lede">{t("clients.lede")}</p>
        </div>
        <div className="logos-grid">
          {LOGOS.map((l) => (
            <div className="logo-item" key={l.src}>
              <img src={l.src} alt={l.alt} loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
