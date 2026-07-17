import { useEffect, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { useI18n } from "../context/I18nContext.jsx";
import { PHONE_TEL, WHATSAPP_URL } from "../lib/constants.js";

const NAV = [
  { to: "/services",       key: "nav.services" },
  { to: "/projects",       key: "nav.projects" },
  { to: "/about",          key: "nav.about" },
  { to: "/certifications", key: "nav.certifications" },
  { to: "/awards",         key: "nav.awards" },
  { to: "/reviews",        key: "nav.reviews" },
  { to: "/contact",        key: "nav.contact" },
];

export default function Header() {
  const { t, lang, setLang } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Add .scrolled class after 50px
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className={`site-header${scrolled ? " scrolled" : ""}`} id="site-header">
      <div className="container header-container">
        <div className="logo-area">
          <Link to="/" className="logo-link">
            <img src="/assets/logo.png" alt="Nasser Al Ali Enterprises" className="logo-img" />
            <span className="logo-text">Nasser Al Ali Enterprises</span>
          </Link>
        </div>

        <nav className={`main-nav${menuOpen ? " active" : ""}`}>
          <ul>
            {NAV.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) => "nav-link" + (isActive ? " is-active" : "")}
                >
                  {t(item.key)}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          {/* Language toggle (site-wide EN/AR) */}
          <div className="naa-lang-toggle" role="group" aria-label={t("toggle.aria")}>
            <button
              type="button"
              className={"naa-lang-toggle-btn" + (lang === "en" ? " active" : "")}
              onClick={() => setLang("en")}
              aria-pressed={lang === "en"}
            >
              EN
            </button>
            <button
              type="button"
              className={"naa-lang-toggle-btn" + (lang === "ar" ? " active" : "")}
              onClick={() => setLang("ar")}
              aria-pressed={lang === "ar"}
            >
              ع
            </button>
          </div>

          <button
            className="mobile-menu-toggle"
            aria-label="Toggle Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </header>
  );
}
