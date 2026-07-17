import { useDocumentTitle } from "../hooks/useDocumentTitle.js";
import { ROUTE_TITLES } from "../lib/constants.js";
import ServicesGrid from "../components/ServicesGrid.jsx";
import FleetGrid from "../components/FleetGrid.jsx";

export default function Services() {
  useDocumentTitle(ROUTE_TITLES["/services"]);
  return (
    <div className="route-page">
      <ServicesGrid />
      <FleetGrid />
    </div>
  );
}
