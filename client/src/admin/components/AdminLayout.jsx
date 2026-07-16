import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import { adminApi, ApiError } from "../api.js";
import { useToast } from "../ToastContext.jsx";

const SECTION_LABELS = {
  hero:           "Hero",
  stats:          "Stats bar",
  services:       "Services",
  clients:        "Trusted partners",
  projects:       "Featured projects",
  gallery:        "Civil gallery",
  chairman:       "Chairman",
  certifications: "Certifications",
  awards:         "Awards & CSR",
  numbers:        "By the numbers",
  reviews:        "Reviews",
};

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const toast = useToast();
  const [sections, setSections] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    adminApi.listSections()
      .then((res) => { if (!cancelled) setSections(res.sections); })
      .catch((err) => {
        if (cancelled) return;
        toast.error(err instanceof ApiError ? err.message : "Failed to load sidebar");
      });
    return () => { cancelled = true; };
  }, [toast]);

  const onLogout = async () => {
    await logout();
    nav("/admin/login", { replace: true });
  };

  return (
    <div className="naa-admin-shell">
      <aside className="naa-admin-sidebar">
        <div className="naa-admin-side-brand">
          <img src="/assets/logo.png" alt="NAA" />
          <div>
            <div className="naa-admin-side-org">Nasser Al Ali</div>
            <div className="naa-admin-side-sub">Admin CMS</div>
          </div>
        </div>
        <nav className="naa-admin-nav">
          <NavLink to="/admin" end className="naa-admin-navlink">Overview</NavLink>
          <div className="naa-admin-nav-divider">Managed sections</div>
          {sections.map((s) => (
            <NavLink
              key={s.key}
              to={`/admin/sections/${s.key}`}
              className="naa-admin-navlink"
            >
              <span>{SECTION_LABELS[s.key] || s.key}</span>
              {s.itemCount > 0 && <span className="naa-admin-navcount">{s.itemCount}</span>}
            </NavLink>
          ))}
          <div className="naa-admin-nav-divider">System</div>
          <NavLink to="/admin/audit" className="naa-admin-navlink">Audit log</NavLink>
        </nav>
      </aside>

      <div className="naa-admin-main">
        <header className="naa-admin-topbar">
          <div className="naa-admin-topbar-title">Content management</div>
          <div className="naa-admin-user" onClick={() => setMenuOpen((v) => !v)}>
            <span>{user?.email}</span>
            <button type="button" className="naa-admin-user-btn" aria-haspopup="true" aria-expanded={menuOpen}>▾</button>
            {menuOpen && (
              <div className="naa-admin-menu" onClick={(e) => e.stopPropagation()}>
                <button type="button" onClick={() => { setMenuOpen(false); nav("/admin/change-password"); }}>Change password</button>
                <button type="button" onClick={() => { setMenuOpen(false); onLogout(); }}>Sign out</button>
              </div>
            )}
          </div>
        </header>

        <main className="naa-admin-content">
          <Outlet context={{ sections }} />
        </main>
      </div>
    </div>
  );
}
