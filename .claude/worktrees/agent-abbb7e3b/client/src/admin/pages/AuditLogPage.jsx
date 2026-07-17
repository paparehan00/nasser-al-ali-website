import { useCallback, useEffect, useState } from "react";
import { ApiError } from "../api.js";
import { useToast } from "../ToastContext.jsx";

const PAGE_SIZE = 100;

// Local wrapper (not adding to admin api surface — this is view-only)
function fetchAudit(offset) {
  return fetch(`/api/admin/audit?limit=${PAGE_SIZE}&offset=${offset}`, {
    credentials: "same-origin",
  }).then(async (r) => {
    if (!r.ok) {
      const t = await r.text().catch(() => "");
      let msg = `HTTP ${r.status}`;
      try { msg = JSON.parse(t).error || msg; } catch { /* ignore */ }
      throw new ApiError(msg, r.status, null);
    }
    return r.json();
  });
}

function tsFmt(unix) {
  if (!unix) return "";
  const d = new Date(unix * 1000);
  return d.toLocaleString(undefined, {
    year: "numeric", month: "short", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
}

const ACTION_KIND = {
  "login.ok":              "ok",
  "password.change.ok":    "ok",
  "section.update":        "ok",
  "item.create":           "ok",
  "item.update":           "ok",
  "items.reorder":         "ok",
  "item.delete":           "warn",
  "upload.ok":             "ok",
  "login.fail":            "err",
  "login.fail.unknown":    "err",
  "password.change.fail":  "err",
  "upload.reject.type":    "err",
  "upload.reject.oversize":"err",
  "upload.reject.decode":  "err",
};

export default function AuditLogPage() {
  const toast = useToast();
  const [entries, setEntries] = useState([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const load = useCallback((off) => {
    setLoading(true);
    fetchAudit(off)
      .then((res) => { setEntries(res.entries); setTotal(res.total); setOffset(off); })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, [toast]);

  useEffect(() => { load(0); }, [load]);

  const filtered = filter
    ? entries.filter((e) =>
        e.action.includes(filter) ||
        (e.target || "").includes(filter) ||
        (e.user || "").includes(filter))
    : entries;

  const page = Math.floor(offset / PAGE_SIZE) + 1;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <header className="naa-admin-pagehead">
        <h1>Audit log</h1>
        <p>Every login attempt, password change, upload, and content edit is recorded here.</p>
      </header>

      <div className="naa-admin-card">
        <div className="naa-admin-row-between" style={{ marginBottom: 12 }}>
          <input
            type="search"
            className="naa-admin-audit-filter"
            placeholder="Filter this page by action, target, or user…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <div className="naa-admin-audit-pager">
            <button
              type="button"
              className="naa-admin-btn naa-admin-btn-ghost"
              onClick={() => load(Math.max(0, offset - PAGE_SIZE))}
              disabled={loading || offset === 0}
            >← Newer</button>
            <span className="naa-admin-audit-pageinfo">Page {page} / {pages} · {total} total</span>
            <button
              type="button"
              className="naa-admin-btn naa-admin-btn-ghost"
              onClick={() => load(offset + PAGE_SIZE)}
              disabled={loading || offset + PAGE_SIZE >= total}
            >Older →</button>
          </div>
        </div>

        {loading ? (
          <div className="naa-admin-loading">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="naa-admin-empty">No entries match.</div>
        ) : (
          <table className="naa-admin-audit-table">
            <thead>
              <tr>
                <th>When</th>
                <th>Action</th>
                <th>Target</th>
                <th>User</th>
                <th>IP</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.id}>
                  <td className="naa-admin-audit-ts">{tsFmt(e.ts)}</td>
                  <td>
                    <span className={`naa-admin-audit-badge naa-admin-audit-${ACTION_KIND[e.action] || "n"}`}>
                      {e.action}
                    </span>
                  </td>
                  <td className="naa-admin-audit-target"><code>{e.target || "—"}</code></td>
                  <td>{e.user || "—"}</td>
                  <td className="naa-admin-audit-ip">{e.ip || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
