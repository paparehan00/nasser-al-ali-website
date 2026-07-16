import { useDocumentTitle } from "../hooks/useDocumentTitle.js";
import { ROUTE_TITLES } from "../lib/constants.js";
import ReviewsSection from "../components/ReviewsSection.jsx";

export default function Reviews() {
  useDocumentTitle(ROUTE_TITLES["/reviews"]);
  return <div className="route-page"><ReviewsSection /></div>;
}
