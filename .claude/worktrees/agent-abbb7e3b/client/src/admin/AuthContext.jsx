import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authApi, ApiError } from "./api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [status, setStatus] = useState("loading");
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    try {
      await authApi.bootstrap();
      const { user } = await authApi.me();
      setUser(user);
      setStatus("authenticated");
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setUser(null);
        setStatus("unauthenticated");
      } else {
        setError(err);
        setStatus("error");
      }
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const login = useCallback(async (email, password) => {
    const { user } = await authApi.login(email, password);
    setUser(user);
    setStatus("authenticated");
    return user;
  }, []);

  const logout = useCallback(async () => {
    try { await authApi.logout(); } catch { /* ignore */ }
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  const changePassword = useCallback(async (currentPassword, newPassword) => {
    await authApi.changePassword(currentPassword, newPassword);
    // clear the must-change flag locally
    setUser((u) => (u ? { ...u, mustChangePassword: false } : u));
  }, []);

  const value = useMemo(
    () => ({ status, user, error, login, logout, changePassword, refresh }),
    [status, user, error, login, logout, changePassword, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
