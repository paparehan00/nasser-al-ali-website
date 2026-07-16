import { useState } from "react";
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";
import { ROUTE_TITLES } from "../lib/constants.js";
import ProjectsMasonry from "../components/ProjectsMasonry.jsx";
import CivilGallery from "../components/CivilGallery.jsx";
import Lightbox from "../components/Lightbox.jsx";

export default function Projects() {
  useDocumentTitle(ROUTE_TITLES["/projects"]);
  const [lb, setLb] = useState({ src: "", alt: "" });
  return (
    <div className="route-page">
      <ProjectsMasonry onOpen={(s, a) => setLb({ src: s, alt: a })} />
      <CivilGallery    onOpen={(s, a) => setLb({ src: s, alt: a })} />
      <Lightbox src={lb.src} alt={lb.alt} onClose={() => setLb({ src: "", alt: "" })} />
    </div>
  );
}
