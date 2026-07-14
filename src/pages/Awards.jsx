import { useState } from "react";
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";
import { ROUTE_TITLES } from "../lib/constants.js";
import AwardsGallery from "../components/AwardsGallery.jsx";
import Lightbox from "../components/Lightbox.jsx";

export default function Awards() {
  useDocumentTitle(ROUTE_TITLES["/awards"]);
  const [lb, setLb] = useState({ src: "", alt: "" });
  return (
    <div className="route-page">
      <AwardsGallery onOpen={(s, a) => setLb({ src: s, alt: a })} />
      <Lightbox src={lb.src} alt={lb.alt} onClose={() => setLb({ src: "", alt: "" })} />
    </div>
  );
}
