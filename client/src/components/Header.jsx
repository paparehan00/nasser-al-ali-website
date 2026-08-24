import { useEffect, useRef, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { Phone, Mail, ChevronDown } from "lucide-react";
import { useI18n } from "../context/I18nContext.jsx";
import {
  PHONE, PHONE_TEL,
  EMAIL,
} from "../lib/constants.js";
import { SOCIALS } from "./SocialSidebar.jsx";

// Multi-column mega menus — each top-level item that needs one lists its
// panel as `columns`; items with no `columns` render as a plain nav link.
//
// Each destination appears exactly once, under whichever top-level item is
// its actual home page — no cross-listing the same link under multiple
// menus. Certifications & Awards/Reviews/Contact are already one click away
// as their own top-level items (see SIMPLE_NAV below), so they're not
// repeated inside other menus' sub-panels.
const MEGA_MENU = [
  {
    to: "/services",
    key: "nav.services",
    columns: [
      {
        headingKey: "megamenu.services.core",
        links: [
          { to: "/services/manpower-support",             key: "megamenu.link.manpower" },
          { to: "/services/equipment-support",             key: "megamenu.link.equipment" },
          { to: "/services/civil-contracting",             key: "megamenu.link.civilSvc" },
          { to: "/services/mep-contracting",                key: "megamenu.link.mep" },
          { to: "/services/professional-cleaning",         key: "megamenu.link.cleaning" },
          { to: "/services/business-center-real-estate",   key: "megamenu.link.business" },
        ],
      },
      {
        headingKey: "megamenu.services.explore",
        links: [
          { to: "/services#services", key: "megamenu.link.services" },
          { to: "/services#fleet",    key: "megamenu.link.fleet" },
        ],
      },
    ],
  },
  {
    to: "/projects",
    key: "nav.projects",
    columns: [
      {
        headingKey: "megamenu.projects.work",
        links: [
          { to: "/projects#projects", key: "megamenu.link.featuredProjects" },
          { to: "/projects#gallery",  key: "megamenu.link.civilGallery" },
          // Gallery folded in here rather than kept as its own top-level
          // item — its three tabs (Clients / Projects / Awards) just remix
          // content that already lives on this page, Home, and Awards & CSR,
          // so it doesn't earn equal top-level billing next to Services,
          // Projects, and About.
          { to: "/gallery",            key: "megamenu.link.fullGallery" },
        ],
      },
    ],
  },
  {
    to: "/about",
    key: "nav.about",
    columns: [
      {
        headingKey: "megamenu.about.company",
        links: [
          { to: "/about#about",       key: "megamenu.link.overview" },
          { to: "/company-profile",   key: "megamenu.link.companyProfile" },
          { to: "/about#leadership",  key: "megamenu.link.leadership" },
        ],
      },
      {
        headingKey: "megamenu.about.more",
        links: [
          { to: "/about#numbers",     key: "megamenu.link.numbers" },
          { to: "/sister-concerns",   key: "nav.sisterConcerns" },
          { to: "/mission-vision",    key: "megamenu.link.missionVision" },
        ],
      },
    ],
  },
];

// Home has no mega panel — its content is the same set of sections already
// reachable from the menus above, so a duplicate "Home" panel would just
// repeat them. It renders as a plain link, same as the trailing items.
const LEADING_NAV = [
  { to: "/", key: "nav.home" },
];

// Remaining top-level items with no mega panel — plain internal links.
const SIMPLE_NAV = [
  { to: "/certifications-awards", key: "nav.certificationsAwards" },
  { to: "/careers",          key: "nav.careers" },
  { to: "/promotions",       key: "nav.promotions" },
  { to: "/contact",          key: "nav.contact" },
];

// Shared close delay for hover-intent — long enough to cross the visual gap
// between a nav item and its panel without the panel closing mid-move, short
// enough that it doesn't feel sticky.
const MEGA_CLOSE_DELAY = 400;

// True only for devices with a real hovering pointer (mouse/trackpad).
// Touch browsers synthesize mouseenter/mouseleave around a tap (to support
// legacy hover-only sites), so without this guard, tapping the chevron to
// open a mega panel on mobile also fires a synthetic mouseleave shortly
// after — which schedules the panel to auto-close ~250ms later, right out
// from under the user who explicitly tapped it open. Hover-intent should
// only ever engage for pointers that can actually hover.
const supportsHover = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(hover: hover) and (pointer: fine)").matches;

export default function Header() {
  const { t, lang, setLang } = useI18n();
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [openMega,  setOpenMega]  = useState(null); // `to` of the open mega item, or null
  const location = useLocation();
  const navRef   = useRef(null);
  // Pending "close after delay" timer — a single ref is enough since only
  // one mega item can be open at a time.
  const closeTimerRef = useRef(null);

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  // Open immediately (mouse enter, or explicit click/tap) — always cancels
  // any pending close so re-entering a panel through the visual gap between
  // the trigger and the panel doesn't get raced by a stale timeout.
  const openMegaNow = (to) => {
    clearCloseTimer();
    setOpenMega(to);
  };

  // Close immediately — used for explicit actions (clicking a link,
  // clicking outside, navigating away).
  const closeMegaNow = () => {
    clearCloseTimer();
    setOpenMega(null);
  };

  // Schedule a close after a short delay (mouse leave) instead of closing
  // synchronously. This is what actually fixes "menu closes before I can
  // click a link": moving the pointer from the trigger down into the panel
  // crosses a small gap where neither box is hovered, which fires a
  // mouseleave — but the delay gives the pointer time to land back inside
  // the panel (which cancels this via openMegaNow) before the close fires.
  const scheduleClose = (to) => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setOpenMega((v) => (v === to ? null : v));
      closeTimerRef.current = null;
    }, MEGA_CLOSE_DELAY);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    closeMegaNow();
  }, [location.pathname]);

  useEffect(() => {
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        closeMegaNow();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      clearCloseTimer();
    };
  }, []);

  return (
    <header className={`site-header${scrolled ? " scrolled" : ""}`} id="site-header">

      {/* ── Top utility bar — collapses away on scroll; nav below stays fixed ── */}
      <div className="top-bar" aria-label="Contact information">
        <div className="container top-bar-inner">

          {/* Left: mobile number + email */}
          <div className="top-bar-contact">
            {/* Mobile number */}
            <a
              href={PHONE_TEL}
              className="top-bar-link"
              aria-label={`Call ${PHONE}`}
            >
              <Phone size={13} strokeWidth={2} aria-hidden="true" />
              <span className="top-bar-text">{PHONE}</span>
            </a>

            <span className="top-bar-sep" aria-hidden="true">·</span>

            {/* Email */}
            <a
              href={`mailto:${EMAIL}`}
              className="top-bar-link"
              aria-label="Send us an email"
            >
              <Mail size={13} strokeWidth={2} aria-hidden="true" />
              <span className="top-bar-text">{EMAIL}</span>
            </a>
          </div>

          {/* Right: social icons — desktop only, footer has them on mobile */}
          <div className="top-bar-socials top-bar-desktop-only" aria-label="Follow us">
            {SOCIALS.map(({ href, label, icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="top-bar-social-btn"
                aria-label={label}
              >
                {icon}
              </a>
            ))}
          </div>

        </div>
      </div>
      {/* ── End top utility bar ─────────────────────────────────────────── */}

      <div className="container header-container">
        <div className="logo-area">
          <Link
            to="/"
            className="logo-link"
            onClick={(e) => {
              // Navigating to the same route ("/" -> "/") is a no-op for the
              // router, so ScrollToTop's route-change effect never fires —
              // without this, clicking the logo while already scrolled down
              // on Home does nothing. Handle that case explicitly.
              if (location.pathname === "/") {
                e.preventDefault();
                const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                window.scrollTo({ top: 0, left: 0, behavior: prefersReduced ? "instant" : "smooth" });
              }
              setMenuOpen(false);
              closeMegaNow();
            }}
          >
            <span className="logo-glow-wrap">
              <img src="/assets/logo.png" alt="Nasser Al Ali Enterprises" className="logo-img" />
            </span>
            <span className="logo-text">Nasser Al Ali Enterprises</span>
          </Link>
        </div>

        <nav className={`main-nav${menuOpen ? " active" : ""}`} ref={navRef} data-lenis-prevent>
          <ul>
            {LEADING_NAV.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end
                  className={({ isActive }) => "nav-link" + (isActive ? " is-active" : "")}
                >
                  {t(item.key)}
                </NavLink>
              </li>
            ))}

            {MEGA_MENU.map((item) => {
              const isOpen = openMega === item.to;
              const isActive = location.pathname === item.to || location.pathname.startsWith(item.to + "/");
              return (
                <li
                  key={item.to}
                  className={`has-mega${isOpen ? " mega-open" : ""}${isActive ? " mega-active" : ""}`}
                  onMouseEnter={() => supportsHover() && openMegaNow(item.to)}
                  onMouseLeave={() => supportsHover() && scheduleClose(item.to)}
                >
                  <div className="nav-link-row">
                    <NavLink
                      to={item.to}
                      className={({ isActive: a }) => "nav-link" + (a ? " is-active" : "")}
                      onClick={closeMegaNow}
                    >
                      {t(item.key)}
                    </NavLink>
                    <button
                      type="button"
                      className="dropdown-btn"
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                      aria-label={`Toggle ${t(item.key)} menu`}
                      onClick={() => (isOpen ? closeMegaNow() : openMegaNow(item.to))}
                    >
                      <ChevronDown
                        className={`dropdown-chevron${isOpen ? " open" : ""}`}
                        size={14}
                        strokeWidth={2.4}
                        aria-hidden="true"
                      />
                    </button>
                  </div>

                  <div
                    className="mega-panel"
                    role="menu"
                    onMouseEnter={() => supportsHover() && openMegaNow(item.to)}
                    onMouseLeave={() => supportsHover() && scheduleClose(item.to)}
                  >
                    <div className="mega-columns">
                      {item.columns.map((col) => (
                        <div className="mega-col" key={col.headingKey}>
                          <span className="mega-col-heading">{t(col.headingKey)}</span>
                          <ul>
                            {col.links.map((link) => (
                              <li key={link.key + link.to} role="none">
                                <Link
                                  to={link.to}
                                  className="mega-link"
                                  role="menuitem"
                                  onClick={() => { closeMegaNow(); setMenuOpen(false); }}
                                >
                                  {t(link.key)}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </li>
              );
            })}

            {SIMPLE_NAV.map((item) => (
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
          {/* Mobile-only: email + phone icons (top-bar is hidden on mobile) */}
          <a
            href={`mailto:${EMAIL}`}
            className="nav-contact-icon"
            aria-label="Send us an email"
          >
            <Mail size={15} strokeWidth={2} aria-hidden="true" />
          </a>
          <a
            href={PHONE_TEL}
            className="nav-contact-icon"
            aria-label={`Call ${PHONE}`}
          >
            <Phone size={15} strokeWidth={2} aria-hidden="true" />
          </a>

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
            className={`mobile-menu-toggle${menuOpen ? " active" : ""}`}
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
