import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import { useToast } from "../ToastContext.jsx";
import { ApiError } from "../api.js";

export default function ChangePasswordPage({ forced = false }) {
  const { changePassword, user, logout } = useAuth();
  const toast = useToast();
  const nav = useNavigate();

  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (next !== confirm) return setErr("New passwords don't match.");
    if (next.length < 10) return setErr("New password must be at least 10 characters.");
    setBusy(true);
    try {
      await changePassword(current, next);
      toast.success("Password updated.");
      nav("/admin", { replace: true });
    } catch (e2) {
      setErr(e2 instanceof ApiError ? e2.message : "Could not change password.");
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
        <h1>{forced ? "Set a new password" : "Change password"}</h1>
        <p className="naa-admin-sub">
          {forced
            ? `Welcome ${user?.email}. Please set your own password before continuing.`
            : "Change the password used to sign in to the admin panel."}
        </p>

        {err && <div className="naa-admin-alert">{err}</div>}

        <label className="naa-admin-field">
          <span>Current password</span>
          <input type="password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} required />
        </label>
        <label className="naa-admin-field">
          <span>New password (min 10 chars, letter + digit)</span>
          <input type="password" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} required minLength={10} />
        </label>
        <label className="naa-admin-field">
          <span>Confirm new password</span>
          <input type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength={10} />
        </label>

        <button type="submit" className="naa-admin-btn naa-admin-btn-primary" disabled={busy}>
          {busy ? "Saving…" : "Update password"}
        </button>
        {!forced && (
          <button type="button" className="naa-admin-btn naa-admin-btn-ghost" onClick={() => nav(-1)} disabled={busy}>
            Cancel
          </button>
        )}
        {forced && (
          <button type="button" className="naa-admin-btn naa-admin-btn-ghost" onClick={logout} disabled={busy}>
            Sign out instead
          </button>
        )}
      </form>
    </div>
  );
}
