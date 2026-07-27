import { Outlet } from "react-router-dom";
import AnnouncementBar from "./AnnouncementBar.jsx";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import FloatingButtons from "./FloatingButtons.jsx";

export default function Layout() {
  return (
    <>
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
