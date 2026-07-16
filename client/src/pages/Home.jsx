import { useState } from "react";
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";
import { ROUTE_TITLES } from "../lib/constants.js";
import Hero from "../components/Hero.jsx";
import StatBar from "../components/StatBar.jsx";
import ClientLogos from "../components/ClientLogos.jsx";
import ServicesGrid from "../components/ServicesGrid.jsx";
import FleetGrid from "../components/FleetGrid.jsx";
import ProjectsMasonry from "../components/ProjectsMasonry.jsx";
import CivilGallery from "../components/CivilGallery.jsx";
import AboutSection from "../components/AboutSection.jsx";
import ChairmanSection from "../components/ChairmanSection.jsx";
import LeadershipSection from "../components/LeadershipSection.jsx";
import CertificationsGrid from "../components/CertificationsGrid.jsx";
import NumbersSection from "../components/NumbersSection.jsx";
import ReviewsSection from "../components/ReviewsSection.jsx";
import AwardsGallery from "../components/AwardsGallery.jsx";
import ContactSection from "../components/ContactSection.jsx";
import Lightbox from "../components/Lightbox.jsx";

export default function Home() {
  useDocumentTitle(ROUTE_TITLES["/"]);
  const [lb, setLb] = useState({ src: "", alt: "" });
  const open = (src, alt) => setLb({ src, alt });
  const close = () => setLb({ src: "", alt: "" });

  return (
    <>
      <Hero />
      <StatBar />
      <ClientLogos />
      <ServicesGrid />
      <FleetGrid />
      <ProjectsMasonry onOpen={open} />
      <CivilGallery onOpen={open} />
      <AboutSection />
      <ChairmanSection />
      <LeadershipSection />
      <CertificationsGrid onOpen={open} />
      <NumbersSection />
      <ReviewsSection />
      <AwardsGallery onOpen={open} />
      <ContactSection />
      <Lightbox src={lb.src} alt={lb.alt} onClose={close} />
    </>
  );
}
