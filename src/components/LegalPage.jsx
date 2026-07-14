import { Link } from "react-router-dom";

/**
 * Shared shell for /privacy, /terms, /cookies routes.
 * The site header + footer are provided by <Layout />; this just renders
 * the styled legal hero + body container.
 */
export default function LegalPage({ crumb, title, updated, children }) {
  return (
    <div className="legal-page-body">
      <section className="legal-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link> · {crumb}
          </div>
          <h1>{title}</h1>
          {updated && <div className="updated">Last updated: {updated}</div>}
        </div>
      </section>
      <section className="legal-body">
        <div className="container">{children}</div>
      </section>
    </div>
  );
}
