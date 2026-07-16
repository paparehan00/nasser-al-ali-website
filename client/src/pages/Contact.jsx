import { useDocumentTitle } from "../hooks/useDocumentTitle.js";
import { ROUTE_TITLES } from "../lib/constants.js";
import ContactSection from "../components/ContactSection.jsx";

export default function Contact() {
  useDocumentTitle(ROUTE_TITLES["/contact"]);
  return <div className="route-page"><ContactSection /></div>;
}
