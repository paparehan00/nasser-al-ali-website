import { useState } from "react";
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";
import { ROUTE_TITLES } from "../lib/constants.js";
import CertificationsGrid from "../components/CertificationsGrid.jsx";
import AwardsGallery from "../components/AwardsGallery.jsx";
import Lightbox from "../components/Lightbox.jsx";

export default function CertificationsAwards() {
  useDocumentTitle(ROUTE_TITLES["/certifications-awards"]);
  const [lb, setLb] = useState({ src: "", alt: "" });
  const open = (src, alt) => setLb({ src, alt });
  const close = () => setLb({ src: "", alt: "" });

  return (
    <div className="route-page">
      <CertificationsGrid onOpen={open} />
      <AwardsGallery onOpen={open} />
      <Lightbox src={lb.src} alt={lb.alt} onClose={close} />
    </div>
  );
}
