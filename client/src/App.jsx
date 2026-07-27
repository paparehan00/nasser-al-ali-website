import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";

import Home from "./pages/Home.jsx";
import Services from "./pages/Services.jsx";
import ServiceDetail from "./pages/ServiceDetail.jsx";
import Projects from "./pages/Projects.jsx";
import About from "./pages/About.jsx";
import CompanyProfile from "./pages/CompanyProfile.jsx";
import MissionVision from "./pages/MissionVision.jsx";
import CertificationsAwards from "./pages/CertificationsAwards.jsx";
import SisterConcerns from "./pages/SisterConcerns.jsx";
import Gallery from "./pages/Gallery.jsx";
import Careers from "./pages/Careers.jsx";
import Promotions from "./pages/Promotions.jsx";
import Contact from "./pages/Contact.jsx";
import Privacy from "./pages/Privacy.jsx";
import Terms from "./pages/Terms.jsx";
import Cookies from "./pages/Cookies.jsx";
import NotFound from "./pages/NotFound.jsx";

import AdminApp from "./admin/AdminApp.jsx";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Admin SPA - rendered outside the public Layout so it has no chatbot,
            no floating buttons, no site header/footer. It has its own auth,
            routing, and layout. */}
        <Route path="/admin/*" element={<AdminApp />} />

        <Route element={<Layout />}>
          <Route path="/"               element={<Home />} />
          <Route path="/services"       element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/projects"       element={<Projects />} />
          <Route path="/about"          element={<About />} />
          <Route path="/company-profile" element={<CompanyProfile />} />
          <Route path="/mission-vision" element={<MissionVision />} />
          <Route path="/certifications-awards" element={<CertificationsAwards />} />
          {/* Certifications and Awards & CSR were merged into one page — old
              links/bookmarks still land on the right content. */}
          <Route path="/certifications" element={<Navigate to="/certifications-awards#certifications" replace />} />
          <Route path="/awards"         element={<Navigate to="/certifications-awards#awards" replace />} />
          <Route path="/sister-concerns" element={<SisterConcerns />} />
          <Route path="/gallery"        element={<Gallery />} />
          <Route path="/careers"        element={<Careers />} />
          <Route path="/promotions"     element={<Promotions />} />
          <Route path="/contact"        element={<Contact />} />
          <Route path="/privacy"        element={<Privacy />} />
          <Route path="/terms"          element={<Terms />} />
          <Route path="/cookies"        element={<Cookies />} />
          <Route path="*"               element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}
