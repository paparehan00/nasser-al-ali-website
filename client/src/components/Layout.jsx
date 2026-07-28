import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import AnnouncementBar from "./AnnouncementBar.jsx";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import FloatingButtons from "./FloatingButtons.jsx";
import ScrollProgress from "./ScrollProgress.jsx";
import { initLenis } from "../lib/lenis.js";
import { initSpotlight } from "../lib/spotlight.js";

export default function Layout() {
  // Public-site-only enhancements: Lenis smooth scrolling and the card
  // spotlight listener. The admin SPA renders outside this Layout and
  // keeps native scrolling.
  useEffect(() => {
    const destroyLenis = initLenis();
    const destroySpotlight = initSpotlight();
    return () => {
      destroyLenis();
      destroySpotlight();
    };
  }, []);

  return (
    <>
      <ScrollProgress />
      <AnnouncementBar />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
