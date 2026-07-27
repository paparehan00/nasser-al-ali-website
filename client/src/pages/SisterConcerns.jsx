import { useDocumentTitle } from "../hooks/useDocumentTitle.js";
import { ROUTE_TITLES } from "../lib/constants.js";
import SisterConcernsSection from "../components/SisterConcernsSection.jsx";

export default function SisterConcerns() {
  useDocumentTitle(ROUTE_TITLES["/sister-concerns"]);
  return (
    <div className="route-page">
      <SisterConcernsSection />
    </div>
  );
}
