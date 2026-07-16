import { Link } from "react-router-dom";
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";

export default function NotFound() {
  useDocumentTitle("Page not found | Nasser Al Ali Enterprises");
  return (
    <section className="legal-body" style={{ minHeight: "60vh", paddingTop: 160, textAlign: "center" }}>
      <div className="container">
        <h1 style={{ fontSize: 72, color: "var(--accent)" }}>404</h1>
        <p style={{ fontSize: 18, marginBottom: 32 }}>The page you were looking for doesn't exist.</p>
        <Link to="/" className="btn btn-solid btn-gold btn-large">Return home</Link>
      </div>
    </section>
  );
}
