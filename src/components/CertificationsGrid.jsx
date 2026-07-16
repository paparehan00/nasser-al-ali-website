import { useI18n } from "../context/I18nContext.jsx";

const CERTS = [
  { id: "iso9001",  code: "ISO 9001",    img: "/assets/certifications/iso-9001.webp",   alt: "ISO 9001 Quality Management System certificate" },
  { id: "iso14001", code: "ISO 14001",   img: "/assets/certifications/iso-14001.webp",  alt: "ISO 14001 Environmental Management System certificate" },
  { id: "ohsas",    code: "OHSAS 18001", img: "/assets/certifications/ohsas-18001.webp", alt: "OHSAS 18001 Occupational Health and Safety certificate" },
];

export default function CertificationsGrid({ onOpen }) {
  const { t } = useI18n();
  return (
    <section className="certifications" id="certifications">
      <div className="container">
        <div className="section-header center">
          <span className="overline">{t("certs.overline")}</span>
          <h2>{t("certs.title")}</h2>
          <p className="section-lede">{t("certs.lede")}</p>
        </div>
        <div className="certs-grid">
          {CERTS.map((c) => (
            <a
              className="cert-card"
              key={c.id}
              href={c.img}
              onClick={(e) => {
                e.preventDefault();
                onOpen && onOpen(c.img, `${c.code} - ${t(`certs.${c.id}.title`)}`);
              }}
            >
              <div className="cert-thumb">
                <img src={c.img} alt={c.alt} loading="lazy" />
              </div>
              <div className="cert-body">
                <div className="cert-code">{c.code}</div>
                <div className="cert-title">{t(`certs.${c.id}.title`)}</div>
                <div className="cert-issuer">{t("certs.issuer")}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
