import { Link } from "react-router-dom";
import { useI18n } from "../context/I18nContext.jsx";
import { useContent } from "../hooks/useContent.js";
import { useInView } from "../hooks/useInView.js";
import {
  EMAIL, PHONE, PHONE_TEL,
  PHONE_2, PHONE_2_TEL,
} from "../lib/constants.js";
import { SOCIALS } from "./SocialSidebar.jsx";

// About Us + Our Services columns reuse the same link data/labels as the
// header mega menu so the two stay in sync.
const ABOUT_LINKS = [
  { to: "/about#about",                   key: "megamenu.link.overview" },
  { to: "/company-profile",               key: "megamenu.link.companyProfile" },
  { to: "/about#leadership",              key: "megamenu.link.leadership" },
  { to: "/mission-vision",                key: "megamenu.link.missionVision" },
  { to: "/certifications-awards#certifications", key: "megamenu.link.certifications" },
  { to: "/careers",                       key: "nav.careers" },
  { to: "/promotions",                    key: "footer.promotions" },
];

const SERVICE_LINKS = [
  { to: "/services#services", key: "megamenu.link.manpower" },
  { to: "/services#services", key: "megamenu.link.equipment" },
  { to: "/services#services", key: "megamenu.link.civilSvc" },
  { to: "/services#services", key: "megamenu.link.mep" },
  { to: "/services#services", key: "megamenu.link.cleaning" },
  { to: "/services#services", key: "megamenu.link.business" },
];

export default function Footer() {
  const { t } = useI18n();
  const { data: certData } = useContent("certifications");
  const certBadges = (certData?.items || []).slice(0, 3);
  const [ctaRef, ctaInView] = useInView(0.3);
  const [gridRef, gridInView] = useInView(0.1);
  const [supportRef, supportInView] = useInView(0.3);

  return (
    <footer className="site-footer">

      {/* ── CTA marquee band ────────────────────────────────────────────── */}
      <div className="footer-cta-band">
        <div className="footer-cta-marquee" aria-hidden="true">
          <span className="footer-cta-marquee-track">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i}>{t("footer.ctaMarquee")}</span>
            ))}
          </span>
        </div>
        <div className={"container footer-cta-inner fade-rise" + (ctaInView ? " is-in" : "")} ref={ctaRef}>
          <h2 className="footer-cta-heading">{t("footer.ctaHeading")}</h2>
          <Link to="/contact" className="btn btn-solid btn-gold btn-large">
            {t("footer.ctaButton")}
          </Link>
        </div>
      </div>

      {/* ── Main footer grid ────────────────────────────────────────────── */}
      <div className="footer-main">
        <div className={"container footer-grid" + (gridInView ? " is-in-view" : "")} ref={gridRef}>

          {/* Logo + blurb + socials */}
          <div className="footer-col footer-col-brand reveal-up" style={{ "--reveal-delay": "0s" }}>
            <Link to="/" className="footer-logo">
              <span className="logo-glow-wrap footer-logo-glow-wrap">
                <img src="/assets/logo.png" alt="Nasser Al Ali Enterprises"  decoding="sync" />
              </span>
            </Link>
            <p className="footer-blurb">{t("footer.blurb")}</p>
            <div className="footer-col-socials">
              {SOCIALS.map(({ href, label, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-btn"
                  aria-label={label}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* About Us */}
          <div className="footer-col reveal-up" style={{ "--reveal-delay": "0.06s" }}>
            <h3 className="footer-col-heading">{t("footer.aboutUs")}</h3>
            <ul className="footer-col-links">
              {ABOUT_LINKS.map((l) => (
                <li key={l.key}><Link to={l.to}>{t(l.key)}</Link></li>
              ))}
            </ul>
            {certBadges.length > 0 && (
              <div className="footer-cert-badges">
                {certBadges.map((c) => (
                  <Link to="/certifications-awards#certifications" key={c.id} className="footer-cert-badge">
                    <img src={c.imagePath} alt={c.data?.title?.en || c.data?.code || "Certification"} loading="lazy"  decoding="sync" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Our Services */}
          <div className="footer-col reveal-up" style={{ "--reveal-delay": "0.12s" }}>
            <h3 className="footer-col-heading">{t("footer.ourServices")}</h3>
            <ul className="footer-col-links">
              {SERVICE_LINKS.map((l) => (
                <li key={l.key}><Link to={l.to}>{t(l.key)}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-col reveal-up" style={{ "--reveal-delay": "0.18s" }}>
            <h3 className="footer-col-heading">{t("footer.contactHeading")}</h3>
            <ul className="footer-col-links footer-contact-list">
              <li className="footer-address">
                Salwa Road, Building-155, Zone 43<br/>
                Doha, State of Qatar<br/>
                P.O. Box 13115, Doha, Qatar
              </li>
              <li className="footer-office-hours">
                <span className="footer-office-hours-label">{t("footer.officeHours")}</span>
                <span>{t("footer.officeHoursValue")}</span>
              </li>
              <li><a href={PHONE_TEL}>{PHONE}</a> · <a href={PHONE_2_TEL}>{PHONE_2}</a></li>
              <li><a href={`mailto:${EMAIL}`}>{EMAIL}</a></li>
            </ul>
          </div>

        </div>
      </div>

      {/* We Support — charity / CSR partner logos */}
      <div className="footer-support">
        <div className="container footer-support-inner">
          <span className="footer-support-label">{t("footer.weSupport")}</span>
          <div className={"footer-support-logos" + (supportInView ? " is-in-view" : "")} ref={supportRef}>
            <a
              href="https://www.qcharity.org"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Qatar Charity"
              className="reveal-up"
              style={{ "--reveal-delay": "0s" }}
            >
              <img src="/assets/qatarcharity.png" alt="Qatar Charity"  decoding="sync" />
            </a>
            <a
              href="https://www.greenpeace.org"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Greenpeace"
              className="reveal-up"
              style={{ "--reveal-delay": "0.06s" }}
            >
              <img src="/assets/greenpeace.png" alt="Greenpeace"  decoding="sync" />
            </a>
          </div>
        </div>
      </div>

      {/* Legal + copyright */}
      <div className="footer-bottom">
        <div className="container footer-legal">
          <ul className="footer-legal-links">
            <li><Link to="/privacy">{t("footer.privacy")}</Link></li>
            <li><Link to="/terms">{t("footer.terms")}</Link></li>
            <li><Link to="/cookies">{t("footer.cookies")}</Link></li>
          </ul>
        </div>
        <div className="container copyright">
          <p>{t("footer.rights")}</p>
        </div>
      </div>
    </footer>
  );
}
