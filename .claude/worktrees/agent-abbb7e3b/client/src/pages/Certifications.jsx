import { useState } from "react";
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";
import { ROUTE_TITLES } from "../lib/constants.js";
import CertificationsGrid from "../components/CertificationsGrid.jsx";
import Lightbox from "../components/Lightbox.jsx";

export default function Certifications() {
  useDocumentTitle(ROUTE_TITLES["/certifications"]);
  const [lb, setLb] = useState({ src: "", alt: "" });
  return (
    <div className="route-page">
      <CertificationsGrid onOpen={(s, a) => setLb({ src: s, alt: a })} />
      <Lightbox src={lb.src} alt={lb.alt} onClose={() => setLb({ src: "", alt: "" })} />
    </div>
  );
}
