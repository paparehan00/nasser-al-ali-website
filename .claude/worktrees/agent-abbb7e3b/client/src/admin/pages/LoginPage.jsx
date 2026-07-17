import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import { ApiError } from "../api.js";

export default function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const from = loc.state?.from || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      const u = await login(email.trim().toLowerCase(), password);
      nav(u.mustChangePassword ? "/admin/change-password" : from, { replace: true });
    } catch (e2) {
      setErr(e2 instanceof ApiError ? e2.message : "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="naa-admin-auth">
      <form className="naa-admin-card naa-admin-auth-card" onSubmit={submit}>
        <div className="naa-admin-brand">
          <img src="/assets/logo.png" alt="Nasser Al Ali Enterprises" />
        </div>
        <h1>Admin sign in</h1>
        <p className="naa-admin-sub">Manage the website content</p>

        {err && <div className="naa-admin-alert">{err}</div>}

        <label className="naa-admin-field">
          <span>Email</span>
          <input
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
        </label>

        <label className="naa-admin-field">
          <span>Password</span>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={1}
          />
        </label>

        <button type="submit" className="naa-admin-btn naa-admin-btn-primary" disabled={busy}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <div className="naa-admin-authfoot">© Nasser Al Ali Enterprises · admin</div>
    </div>
  );
}
