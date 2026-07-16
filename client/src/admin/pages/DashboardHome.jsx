import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi, ApiError } from "../api.js";
import { useToast } from "../ToastContext.jsx";

export default function DashboardHome() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    let cancelled = false;
    adminApi.listSections()
      .then((res) => { if (!cancelled) setSections(res.sections); })
      .catch((err) => {
        if (cancelled) return;
        toast.error(err instanceof ApiError ? err.message : "Failed to load sections");
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [toast]);

  return (
    <div className="naa-admin-home">
      <header className="naa-admin-pagehead">
        <h1>Overview</h1>
        <p>Pick a section on the left to edit its content, or use the shortcuts below.</p>
      </header>

      {loading ? (
        <div className="naa-admin-loading">Loading sections…</div>
      ) : (
        <div className="naa-admin-cards">
          {sections.map((s) => (
            <Link className="naa-admin-card naa-admin-tile" to={`/admin/sections/${s.key}`} key={s.key}>
              <div className="naa-admin-tile-key">{s.key}</div>
              <div className="naa-admin-tile-title">{s.title.en || <em>(no title)</em>}</div>
              <div className="naa-admin-tile-meta">
                {s.itemCount} item{s.itemCount === 1 ? "" : "s"}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
