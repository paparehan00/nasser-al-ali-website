import { useDocumentTitle } from "../hooks/useDocumentTitle.js";
import { ROUTE_TITLES } from "../lib/constants.js";
import CareersSection from "../components/CareersSection.jsx";

export default function Careers() {
  useDocumentTitle(ROUTE_TITLES["/careers"]);
  return (
    <div className="route-page">
      <CareersSection />
    </div>
  );
}
