import { useEffect } from "react";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext.jsx";
import { ToastProvider } from "./ToastContext.jsx";
import AdminLayout from "./components/AdminLayout.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ChangePasswordPage from "./pages/ChangePasswordPage.jsx";
import DashboardHome from "./pages/DashboardHome.jsx";
import SectionEditor from "./pages/SectionEditor.jsx";
import AuditLogPage from "./pages/AuditLogPage.jsx";
import "./admin.css";

export default function AdminApp() {
  // Add a body class so we can hide the public chatbot/consent/etc from admin.
  useEffect(() => {
    document.body.classList.add("naa-admin-active");
    return () => document.body.classList.remove("naa-admin-active");
  }, []);

  return (
    <AuthProvider>
      <ToastProvider>
        <AdminRoutes />
      </ToastProvider>
    </AuthProvider>
  );
}

function AdminRoutes() {
  const { status, user } = useAuth();

  if (status === "loading") {
    return <div className="naa-admin-boot"><div className="naa-admin-boot-spinner" />Loading admin…</div>;
  }

  if (status === "error") {
    return <div className="naa-admin-boot naa-admin-boot-err">Could not reach the server. Refresh the page or try again shortly.</div>;
  }

  return (
    <Routes>
      <Route path="login" element={status === "authenticated" ? <Navigate to="/admin" replace /> : <LoginPage />} />
      <Route
        path="change-password"
        element={
          status !== "authenticated"
            ? <Navigate to="/admin/login" replace />
            : <ChangePasswordPage forced={!!user?.mustChangePassword} />
        }
      />

      <Route element={<RequireAuth />}>
        <Route element={<AdminLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="sections/:key" element={<SectionEditor />} />
          <Route path="audit" element={<AuditLogPage />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}

function RequireAuth() {
  const { status, user } = useAuth();
  const loc = useLocation();
  if (status !== "authenticated") {
    return <Navigate to="/admin/login" state={{ from: loc.pathname }} replace />;
  }
  if (user?.mustChangePassword) {
    return <Navigate to="/admin/change-password" replace />;
  }
  return <Outlet />;
}
