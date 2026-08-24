import { useDocumentTitle } from "../hooks/useDocumentTitle.js";
import { ROUTE_TITLES } from "../lib/constants.js";
import AboutSection from "../components/AboutSection.jsx";
import ChairmanSection from "../components/ChairmanSection.jsx";
import LeadershipSection from "../components/LeadershipSection.jsx";
import NumbersSection from "../components/NumbersSection.jsx";

export default function About() {
  useDocumentTitle(ROUTE_TITLES["/about"]);
  return (
    <div className="route-page">
      <AboutSection />
      <ChairmanSection />
      <LeadershipSection />
      <NumbersSection />
    </div>
  );
}
