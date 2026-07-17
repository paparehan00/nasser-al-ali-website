import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

const ToastContext = createContext(null);

let nextId = 1;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const dismiss = useCallback((id) => {
    setToasts((cur) => cur.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) { clearTimeout(timer); timers.current.delete(id); }
  }, []);

  const push = useCallback((kind, message, ttlMs = 4200) => {
    const id = nextId++;
    setToasts((cur) => [...cur, { id, kind, message }]);
    if (ttlMs > 0) {
      const t = setTimeout(() => dismiss(id), ttlMs);
      timers.current.set(id, t);
    }
    return id;
  }, [dismiss]);

  const api = useMemo(() => ({
    success: (msg) => push("success", msg),
    error:   (msg) => push("error", msg, 7000),
    info:    (msg) => push("info", msg),
    dismiss,
  }), [push, dismiss]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="naa-toast-stack" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`naa-toast naa-toast-${t.kind}`}>
            <span className="naa-toast-msg">{t.message}</span>
            <button type="button" className="naa-toast-x" onClick={() => dismiss(t.id)} aria-label="Dismiss">×</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
