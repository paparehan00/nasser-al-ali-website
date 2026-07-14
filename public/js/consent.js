/* ==========================================================================
   Nasser Al Ali - Cookie Consent Banner & Gating
   Self-contained vanilla JS. Runs everywhere consent.js is included.
   Exposes window.NAAConsent for other scripts to check categories.
   ========================================================================== */
(function () {
  "use strict";

  const STORAGE_KEY = "naa-consent-v1";
  const VERSION = 1;

  // Category definitions
  const CATEGORIES = {
    essential:  { label: "Strictly necessary", locked: true,  default: true,  desc: "Required for the site and chat assistant to work. Cannot be disabled." },
    functional: { label: "Functional",         locked: false, default: false, desc: "Remembers your preferences (e.g. language)." },
    analytics:  { label: "Analytics",          locked: false, default: false, desc: "Anonymised traffic measurement (Google Analytics)." },
    embeds:     { label: "Third-party embeds", locked: false, default: false, desc: "Google Maps office pin and Calendly appointment booking." },
  };

  // ---------------------------------------------------------------------------
  // Storage
  // ---------------------------------------------------------------------------
  const readConsent = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || parsed.version !== VERSION) return null;
      return parsed;
    } catch (_) { return null; }
  };

  const writeConsent = (choices) => {
    const payload = {
      version: VERSION,
      timestamp: new Date().toISOString(),
      choices: { essential: true, ...choices },
    };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(payload)); }
    catch (_) {}
    return payload;
  };

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------
  const listeners = [];
  const emit = (payload) => listeners.forEach((fn) => { try { fn(payload); } catch (_) {} });

  const api = {
    get: () => readConsent(),
    has: (category) => {
      const c = readConsent();
      if (!c) return category === "essential";
      return !!c.choices[category];
    },
    accept: (categories) => {
      const choices = {};
      Object.keys(CATEGORIES).forEach((k) => { choices[k] = !!categories[k] || k === "essential"; });
      const payload = writeConsent(choices);
      hideBanner();
      emit(payload);
    },
    acceptAll: () => api.accept(Object.fromEntries(Object.keys(CATEGORIES).map((k) => [k, true]))),
    rejectAll: () => api.accept({ essential: true }),
    reopen: () => showBanner(readConsent()),
    onChange: (fn) => { listeners.push(fn); return () => { const i = listeners.indexOf(fn); if (i > -1) listeners.splice(i, 1); }; },
  };
  window.NAAConsent = api;

  // ---------------------------------------------------------------------------
  // DOM
  // ---------------------------------------------------------------------------
  let bannerEl = null;
  const currentChoices = () => {
    const c = readConsent();
    if (c && c.choices) return { ...c.choices };
    const out = {};
    Object.keys(CATEGORIES).forEach((k) => { out[k] = CATEGORIES[k].default; });
    return out;
  };

  const escapeHtml = (s) => String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

  const build = (initial) => {
    const wrap = document.createElement("div");
    wrap.className = "naa-consent";
    wrap.setAttribute("role", "dialog");
    wrap.setAttribute("aria-modal", "false");
    wrap.setAttribute("aria-labelledby", "naa-consent-title");
    wrap.setAttribute("aria-describedby", "naa-consent-desc");
    wrap.tabIndex = -1;
    wrap.innerHTML = `
      <div class="naa-consent-inner">
        <div class="naa-consent-main">
          <div class="naa-consent-title" id="naa-consent-title">Your privacy</div>
          <div class="naa-consent-desc" id="naa-consent-desc">
            We use strictly necessary storage to run the site and its AI chat assistant.
            With your consent we may also load analytics and third-party embeds
            (Google Maps, Calendly). Read our
            <a href="privacy.html">Privacy Policy</a> and
            <a href="cookies.html">Cookie Policy</a>.
          </div>
          <div class="naa-consent-actions">
            <button type="button" class="btn btn-outline btn-white" data-action="reject">Reject non-essential</button>
            <button type="button" class="btn btn-outline btn-gold" data-action="prefs">Preferences</button>
            <button type="button" class="btn btn-solid btn-gold" data-action="accept-all">Accept all</button>
          </div>
        </div>
        <div class="naa-consent-prefs" hidden>
          <div class="naa-consent-prefs-list">
            ${Object.entries(CATEGORIES).map(([key, def]) => `
              <label class="naa-consent-row${def.locked ? ' is-locked' : ''}">
                <input type="checkbox"
                       data-cat="${key}"
                       ${initial[key] ? "checked" : ""}
                       ${def.locked ? "disabled" : ""}>
                <span class="naa-consent-row-body">
                  <span class="naa-consent-row-title">${escapeHtml(def.label)}${def.locked ? ' <em>(always on)</em>' : ''}</span>
                  <span class="naa-consent-row-desc">${escapeHtml(def.desc)}</span>
                </span>
              </label>
            `).join("")}
          </div>
          <div class="naa-consent-prefs-actions">
            <button type="button" class="btn btn-outline btn-white" data-action="prefs-close">Back</button>
            <button type="button" class="btn btn-solid btn-gold" data-action="save">Save preferences</button>
          </div>
        </div>
      </div>
    `;
    return wrap;
  };

  const showBanner = (existing) => {
    const initial = existing && existing.choices ? { ...existing.choices } : {};
    Object.keys(CATEGORIES).forEach((k) => {
      if (initial[k] === undefined) initial[k] = CATEGORIES[k].default;
    });

    if (bannerEl) bannerEl.remove();
    bannerEl = build(initial);
    document.body.appendChild(bannerEl);
    requestAnimationFrame(() => bannerEl.classList.add("is-open"));

    const q = (sel) => bannerEl.querySelector(sel);
    const main = q(".naa-consent-main");
    const prefs = q(".naa-consent-prefs");
    const togglePrefs = (show) => {
      main.hidden = !!show;
      prefs.hidden = !show;
      if (show) prefs.querySelector("input:not([disabled])")?.focus();
    };

    bannerEl.addEventListener("click", (e) => {
      const t = e.target.closest("[data-action]");
      if (!t) return;
      const act = t.getAttribute("data-action");
      if (act === "accept-all") api.acceptAll();
      else if (act === "reject") api.rejectAll();
      else if (act === "prefs") togglePrefs(true);
      else if (act === "prefs-close") togglePrefs(false);
      else if (act === "save") {
        const choices = { essential: true };
        prefs.querySelectorAll("input[data-cat]").forEach((cb) => {
          choices[cb.getAttribute("data-cat")] = cb.checked;
        });
        api.accept(choices);
      }
    });

    // Keyboard: Escape closes back to main from prefs
    bannerEl.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !prefs.hidden) togglePrefs(false);
    });
  };

  const hideBanner = () => {
    if (!bannerEl) return;
    bannerEl.classList.remove("is-open");
    setTimeout(() => { bannerEl && bannerEl.remove(); bannerEl = null; }, 260);
  };

  // ---------------------------------------------------------------------------
  // "Reopen" triggers - any element with [data-consent-reopen]
  // ---------------------------------------------------------------------------
  const wireReopen = () => {
    document.addEventListener("click", (e) => {
      const t = e.target.closest("[data-consent-reopen]");
      if (t) { e.preventDefault(); api.reopen(); }
    });
    // Custom event (used by cookies.html)
    window.addEventListener("naa-consent-reopen", () => api.reopen());
  };

  // ---------------------------------------------------------------------------
  // Auto-show on first visit
  // ---------------------------------------------------------------------------
  const boot = () => {
    wireReopen();
    const existing = readConsent();
    if (!existing) {
      // Small delay so the banner enters after paint
      setTimeout(() => showBanner(null), 400);
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
