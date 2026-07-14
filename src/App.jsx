import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";

import Home from "./pages/Home.jsx";
import Services from "./pages/Services.jsx";
import Projects from "./pages/Projects.jsx";
import About from "./pages/About.jsx";
import Certifications from "./pages/Certifications.jsx";
import Awards from "./pages/Awards.jsx";
import Reviews from "./pages/Reviews.jsx";
import Contact from "./pages/Contact.jsx";
import Privacy from "./pages/Privacy.jsx";
import Terms from "./pages/Terms.jsx";
import Cookies from "./pages/Cookies.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/"               element={<Home />} />
          <Route path="/services"       element={<Services />} />
          <Route path="/projects"       element={<Projects />} />
          <Route path="/about"          element={<About />} />
          <Route path="/certifications" element={<Certifications />} />
          <Route path="/awards"         element={<Awards />} />
          <Route path="/reviews"        element={<Reviews />} />
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
