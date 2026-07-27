import { useState } from "react";
import { Link } from "react-router-dom";
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";
import { useI18n } from "../context/I18nContext.jsx";
import { ROUTE_TITLES } from "../lib/constants.js";
import Hero from "../components/Hero.jsx";
import StatBar from "../components/StatBar.jsx";
import ClientLogos from "../components/ClientLogos.jsx";
import ServicesGrid from "../components/ServicesGrid.jsx";
import ProjectsMasonry from "../components/ProjectsMasonry.jsx";
import AboutSection from "../components/AboutSection.jsx";
import NumbersSection from "../components/NumbersSection.jsx";
import MissionVisionSection from "../components/MissionVisionSection.jsx";
import ContactSection from "../components/ContactSection.jsx";
import Lightbox from "../components/Lightbox.jsx";

// The home page is an overview only — Fleet, Civil Gallery, Chairman,
// Leadership, Certifications, and Awards each have their own dedicated page
// (reachable from the mega menu) and are intentionally not repeated here.
// Numbers (the workforce/donut charts) is the one exception, by request —
// it's visible scrolling through Home itself, not just its own page.
export default function Home() {
  useDocumentTitle(ROUTE_TITLES["/"]);
  const { t } = useI18n();
  const [lb, setLb] = useState({ src: "", alt: "" });
  const open = (src, alt) => setLb({ src, alt });
  const close = () => setLb({ src: "", alt: "" });

  return (
    <>
      <Hero />
      <StatBar />
      <ClientLogos />

      <ServicesGrid />
      <div className="home-viewall">
        <Link to="/services" className="home-viewall-link">{t("megamenu.link.allServices")} →</Link>
      </div>

      <ProjectsMasonry onOpen={open} />
      <div className="home-viewall">
        <Link to="/projects" className="home-viewall-link">{t("home.viewAllProjects")} →</Link>
      </div>

      <AboutSection />
      <div className="home-viewall">
        <Link to="/about" className="home-viewall-link">{t("home.learnMoreAbout")} →</Link>
      </div>

      <NumbersSection />
      <MissionVisionSection />
      <ContactSection />
      <Lightbox src={lb.src} alt={lb.alt} onClose={close} />
    </>
  );
}
