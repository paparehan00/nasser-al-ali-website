// Thin fetch wrapper for the admin API.
// - Always sends cookies (same-origin, so the session + csrf cookies flow).
// - Grabs the CSRF token from the naa_csrf cookie and echoes it in
//   x-csrf-token on state-changing methods.
// - Throws an ApiError with .status/.body on non-2xx so callers can branch.

const CSRF_COOKIE = "naa_csrf";

function readCsrf() {
  const m = document.cookie.match(/(?:^|;\s*)naa_csrf=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : "";
}

async function ensureCsrf() {
  if (!readCsrf()) {
    await fetch("/api/auth/csrf", { credentials: "same-origin" }).catch(() => {});
  }
  return readCsrf();
}

export class ApiError extends Error {
  constructor(message, status, body) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

async function request(method, path, body) {
  const isMutation = method !== "GET" && method !== "HEAD";
  const headers = { "Content-Type": "application/json" };
  if (isMutation) {
    const tok = await ensureCsrf();
    if (tok) headers["x-csrf-token"] = tok;
  }
  const res = await fetch(path, {
    method,
    credentials: "same-origin",
    headers,
    body: body != null ? JSON.stringify(body) : undefined,
  });

  let data = null;
  const text = await res.text();
  if (text) { try { data = JSON.parse(text); } catch { data = { raw: text }; } }

  if (!res.ok) {
    const message = (data && data.error) || `HTTP ${res.status}`;
    throw new ApiError(message, res.status, data);
  }
  return data;
}

// --- Auth ---
export const authApi = {
  bootstrap: () => request("GET", "/api/auth/csrf"),
  me:        () => request("GET", "/api/auth/me"),
  login:     (email, password) => request("POST", "/api/auth/login", { email, password }),
  logout:    () => request("POST", "/api/auth/logout"),
  changePassword: (currentPassword, newPassword) =>
    request("POST", "/api/auth/change-password", { currentPassword, newPassword }),
};

// --- Admin content ---
export const adminApi = {
  listSections:   () => request("GET",    "/api/admin/sections"),
  getSection:     (k) => request("GET",    `/api/admin/sections/${k}`),
  saveSection:    (k, patch) => request("PATCH",  `/api/admin/sections/${k}`, patch),
  addItem:        (k, item) => request("POST",   `/api/admin/sections/${k}/items`, item),
  saveItem:       (id, patch) => request("PATCH",  `/api/admin/items/${id}`, patch),
  deleteItem:     (id) => request("DELETE", `/api/admin/items/${id}`),
  reorderItems:   (k, orderIds) => request("POST", `/api/admin/sections/${k}/items/reorder`, { order: orderIds }),
  translate:      (texts) => request("POST", "/api/admin/translate", { texts }),
};
