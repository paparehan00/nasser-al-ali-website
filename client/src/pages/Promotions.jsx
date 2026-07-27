import { useDocumentTitle } from "../hooks/useDocumentTitle.js";
import { ROUTE_TITLES } from "../lib/constants.js";
import PromotionsSection from "../components/PromotionsSection.jsx";

export default function Promotions() {
  useDocumentTitle(ROUTE_TITLES["/promotions"]);
  return (
    <div className="route-page">
      <PromotionsSection />
    </div>
  );
}
