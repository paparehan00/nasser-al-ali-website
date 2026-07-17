const BASE = "http://localhost:4000";
let cookieHeader = "";
let csrf = "";

function rememberCookies(resp) {
  const set = resp.headers.get("set-cookie");
  if (!set) return;
  for (const pair of set.split(/,(?=\s*[^;=]+=)/)) {
    const m = pair.match(/^\s*([^=;]+)=([^;]+)/);
    if (!m) continue;
    const name = m[1].trim(), value = m[2];
    cookieHeader = cookieHeader
      .split(";")
      .filter(Boolean)
      .map((c) => c.trim())
      .filter((c) => !c.startsWith(name + "="))
      .concat([name + "=" + value])
      .join("; ");
    if (name === "naa_csrf") csrf = value;
  }
}

async function req(method, path, body) {
  const headers = { "Content-Type": "application/json" };
  if (cookieHeader) headers["Cookie"] = cookieHeader;
  if (method !== "GET" && csrf) headers["x-csrf-token"] = csrf;
  const resp = await fetch(BASE + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  rememberCookies(resp);
  const text = await resp.text();
  let data = null; try { data = text ? JSON.parse(text) : null; } catch {}
  return { status: resp.status, body: data === null ? text : data };
}

function log(name, obj) { console.log("  " + name + ": " + JSON.stringify(obj)); }

async function main() {
  console.log("== Public content endpoint ==");
  const pub = await req("GET", "/api/content/certifications");
  log("certifications", { status: pub.status, title: pub.body?.section?.title?.en, items: pub.body?.items?.length });

  console.log("\n== Auth ==");
  await req("GET", "/api/auth/csrf");
  const login = await req("POST", "/api/auth/login", { email: "admin@nasseralaligroup.com", password: "ChangeMe-Temp-2026" });
  log("login", { status: login.status, mustChange: login.body?.user?.mustChangePassword });
  await req("POST", "/api/auth/change-password", { currentPassword: "ChangeMe-Temp-2026", newPassword: "AdminPass-2026-A" });

  console.log("\n== Validation gates ==");

  const xss = await req("POST", "/api/admin/sections/clients/items", { imagePath: "javascript:alert(1)", data: { name: "XSS" } });
  log("javascript: URL rejected", { status: xss.status, err: xss.body?.error });

  const trav = await req("POST", "/api/admin/sections/clients/items", { imagePath: "/uploads/../etc/passwd", data: {} });
  log("path-traversal rejected", { status: trav.status, err: trav.body?.error });

  const httpUrl = await req("POST", "/api/admin/sections/clients/items", { imagePath: "https://evil.com/x.png", data: {} });
  log("absolute http:// rejected", { status: httpUrl.status, err: httpUrl.body?.error });

  const wrongShape = await req("PATCH", "/api/admin/sections/certifications", { overline: "not-an-object", title: {}, lede: {}, extra: {} });
  log("non-object bilingual rejected", { status: wrongShape.status, err: wrongShape.body?.error });

  const arrayExtra = await req("PATCH", "/api/admin/sections/certifications", { overline: {}, title: {}, lede: {}, extra: [1, 2, 3] });
  log("array-as-extra rejected", { status: arrayExtra.status, err: arrayExtra.body?.error });

  const legitPath = await req("POST", "/api/admin/sections/clients/items", { imagePath: "/uploads/clients/legit.webp", data: { name: "OK" } });
  log("valid /uploads/ path accepted", { status: legitPath.status, id: legitPath.body?.item?.id });
  if (legitPath.body?.item?.id) {
    await req("DELETE", "/api/admin/items/" + legitPath.body.item.id);
  }

  console.log("\n== Audit endpoint ==");
  const audit = await req("GET", "/api/admin/audit?limit=5");
  log("audit", { status: audit.status, total: audit.body?.total, sample: audit.body?.entries?.slice(0, 3).map(e => e.action) });

  console.log("\nDONE");
}

main().catch((e) => { console.error("FAIL:", e); process.exit(1); });
