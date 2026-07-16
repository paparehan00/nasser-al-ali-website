import { useI18n } from "../context/I18nContext.jsx";

const CERTS = [
  {
    id:   "iso9001",
    code: "ISO 9001:2015",
    img:  "/assets/certifications/iso-9001.webp?v=2",
    alt:  "ISO 9001:2015 Quality Management System certificate for Nasser Al Ali Enterprises",
    certNo: "109949/C/0001/UK/En",
  },
  {
    id:   "iso14001",
    code: "ISO 14001:2015",
    img:  "/assets/certifications/iso-14001.webp?v=2",
    alt:  "ISO 14001:2015 Environmental Management System certificate for Nasser Al Ali Enterprises",
    certNo: "109949/A/0001/UK/En",
  },
  {
    id:   "iso45001",
    code: "ISO 45001:2018",
    img:  "/assets/certifications/iso-45001.webp?v=2",
    alt:  "ISO 45001:2018 Occupational Health and Safety Management System certificate for Nasser Al Ali Enterprises",
    certNo: "109949/B/0001/UK/En",
  },
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
                <div className="cert-desc">{t(`certs.${c.id}.desc`)}</div>
                <div className="cert-meta">
                  <span>{t("certs.certNo")} {c.certNo}</span>
                  <span>{t("certs.validUntil")} 09 Jan 2029</span>
                </div>
                <div className="cert-issuer">{t("certs.issuer")}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
