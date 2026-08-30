import crypto from "node:crypto";
import fs from "node:fs";

// helmet()'s default policy is `default-src 'self'` with no connect-src of its
// own. That is fine for the API but breaks the built client in two places that
// never surface in dev, because in dev Vite serves the client and this server
// only ever answers /api and /uploads:
//
//   1. the inline <script> in index.html that hands the chat widget its worker
//      URL is blocked by `script-src 'self'` (no nonce, no hash), so
//      window.NAA_CHAT_API_URL is never assigned;
//   2. the widget's fetch() to *.workers.dev is blocked by the default-src
//      fallback for connect-src.
//
// Both would fail silently: the page renders, the chat bubble just never
// answers. Rather than open script-src up to 'unsafe-inline', hash whatever
// inline blocks Vite actually emitted into dist/index.html and pin those.

// Hashes every inline <script> in the built index.html. Read once at boot, so
// there is no per-request cost and no nonce to thread through res.sendFile().
export function inlineScriptHashes(indexHtmlPath) {
  let html;
  try {
    html = fs.readFileSync(indexHtmlPath, "utf8");
  } catch {
    return [];
  }
  const hashes = [];
  // Inline only: skip any <script> carrying a src attribute.
  const re = /<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const body = m[1];
    if (!body.trim()) continue;
    // The hash covers the exact bytes between the tags, whitespace included.
    hashes.push(`'sha256-${crypto.createHash("sha256").update(body, "utf8").digest("base64")}'`);
  }
  return hashes;
}

export function buildCsp({ chatApiUrl, scriptHashes, isProd }) {
  // Only the origin matters to connect-src; the worker URL may carry a path.
  let chatOrigin = null;
  if (chatApiUrl && !chatApiUrl.startsWith("%")) {
    try {
      chatOrigin = new URL(chatApiUrl).origin;
    } catch {
      console.warn(`CSP: VITE_CHAT_API_URL is not a valid URL (${chatApiUrl}) - chat fetch will be blocked.`);
    }
  }

  return {
    useDefaults: false,
    directives: {
      defaultSrc: ["'self'"],
      baseUri: ["'self'"],
      objectSrc: ["'none'"],
      frameAncestors: ["'self'"],
      formAction: ["'self'"],

      // model-viewer compiles its glTF pipeline to wasm and spins up blob
      // workers. Both run same-origin library code, not third-party script.
      scriptSrc: ["'self'", "'wasm-unsafe-eval'", ...scriptHashes],
      scriptSrcAttr: ["'none'"],
      workerSrc: ["'self'", "blob:"],

      // 'unsafe-inline' is unavoidable here: React and framer-motion write
      // style attributes straight onto elements. Style injection is not a
      // script-execution path, and script-src stays locked down.
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],

      imgSrc: ["'self'", "data:", "blob:"],
      mediaSrc: ["'self'"],
      connectSrc: chatOrigin ? ["'self'", chatOrigin] : ["'self'"],

      // Consent-gated Google Maps embed on the contact page.
      frameSrc: ["https://www.google.com", "https://maps.google.com"],

      // Omitted in dev: it would rewrite http://localhost requests to https.
      ...(isProd ? { upgradeInsecureRequests: [] } : {}),
    },
  };
}
