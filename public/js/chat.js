/* ==========================================================================
   Nasser Al Ali - Chat Widget
   Self-contained vanilla JS. Talks to /.netlify/functions/chat (via /api/chat)
   which proxies Google Gemini. Bilingual (EN / AR), CTA button parsing,
   lead capture via a hidden Netlify Form.
   ========================================================================== */
(() => {
  "use strict";

  // ---------------------------------------------------------------------------
  // Config & i18n
  // ---------------------------------------------------------------------------
  const API_ENDPOINT = "/api/chat"; // Netlify redirects → /.netlify/functions/chat
  const STORAGE_KEY = "naa-chat-session-v1";
  const LANG_KEY = "naa-chat-lang";
  const WA_URL = "https://wa.me/97466557728";
  const TEL_URL = "tel:+97466557728";
  const LOGO_SRC = "assets/logo.png";

  const I18N = {
    en: {
      openLabel: "Talk to our AI assistant",
      closeLabel: "Close chat",
      title: "Ask Nasser Al Ali",
      sub: "Instant answers · powered by AI",
      greet:
        "Hi 👋 I'm the Nasser Al Ali assistant. Ask me about our services, projects, careers, or getting a quote.",
      placeholder: "Type your question…",
      send: "Send",
      chips: [
        "What services do you offer?",
        "Show me your major projects",
        "How do I get a quote?",
        "Are you hiring?",
        "Where are you located?",
      ],
      typing: "Assistant is typing",
      offline:
        "I couldn't reach the assistant. Please try again, or WhatsApp us at +974 6655 7728.",
      rateLimit: "One moment - we're a bit busy. Trying again…",
      leadTitle: "Would you like our team to reach out?",
      leadBody: "Share your contact and we'll be in touch shortly.",
      leadName: "Your name",
      leadEmail: "Email",
      leadPhone: "Phone (optional)",
      leadNotes: "Anything specific?",
      leadSubmit: "Send to team",
      leadSkip: "No thanks",
      leadThanks: "Thanks - we'll be in touch shortly.",
      cta: {
        quote: "Request a Quote",
        consultation: "Book a Consultation",
        whatsapp: "Chat on WhatsApp",
        call: "Call +974 6655 7728",
        projects: "View Projects",
        services: "View Services",
        fleet: "View Fleet",
        leadership: "Meet Leadership",
        apply: "Apply for a Job",
      },
      clear: "Clear",
      poweredBy: "AI assistant",
      disclosure: "Chats are processed by AI (Google Gemini). Please don't share sensitive personal information.",
      privacyLinkText: "Privacy Policy",
    },
    ar: {
      openLabel: "تحدث مع مساعدنا الذكي",
      closeLabel: "أغلق المحادثة",
      title: "اسأل ناصر العلي",
      sub: "إجابات فورية · مدعوم بالذكاء الاصطناعي",
      greet:
        "مرحبًا 👋 أنا مساعد ناصر العلي. اسألني عن خدماتنا، مشاريعنا، الوظائف، أو طلب عرض سعر.",
      placeholder: "اكتب سؤالك…",
      send: "إرسال",
      chips: [
        "ما هي الخدمات التي تقدمونها؟",
        "أرني أبرز المشاريع",
        "كيف أحصل على عرض سعر؟",
        "هل توظفون حاليًا؟",
        "أين يقع مقركم؟",
      ],
      typing: "المساعد يكتب",
      offline: "تعذّر الوصول إلى المساعد. حاول لاحقًا أو راسلنا على واتساب +974 6655 7728.",
      rateLimit: "لحظة من فضلك - النظام مشغول قليلًا…",
      leadTitle: "هل تودّ أن يتواصل معك فريقنا؟",
      leadBody: "شارك بيانات التواصل وسنعاود الاتصال بك قريبًا.",
      leadName: "الاسم",
      leadEmail: "البريد الإلكتروني",
      leadPhone: "الهاتف (اختياري)",
      leadNotes: "ملاحظات إضافية",
      leadSubmit: "إرسال إلى الفريق",
      leadSkip: "لا، شكرًا",
      leadThanks: "شكرًا لك - سنتواصل معك قريبًا.",
      cta: {
        quote: "اطلب عرض سعر",
        consultation: "احجز استشارة",
        whatsapp: "تواصل عبر واتساب",
        call: "اتصل بنا +974 6655 7728",
        projects: "عرض المشاريع",
        services: "عرض الخدمات",
        fleet: "عرض الأسطول",
        leadership: "القيادة",
        apply: "قدّم للوظائف",
      },
      clear: "مسح",
      poweredBy: "مساعد ذكي",
      disclosure: "تُعالج المحادثات بواسطة الذكاء الاصطناعي (Google Gemini). يرجى عدم مشاركة أي معلومات شخصية حساسة.",
      privacyLinkText: "سياسة الخصوصية",
    },
  };

  // ---------------------------------------------------------------------------
  // Utilities
  // ---------------------------------------------------------------------------
  const escapeHtml = (s) =>
    String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  // Very small, safe Markdown → HTML: bold, italic, inline code, links, bullet lists, line breaks
  const renderMarkdown = (raw) => {
    let s = escapeHtml(raw);
    // Auto-link bare URLs
    s = s.replace(
      /(^|[\s(])((?:https?:\/\/|www\.)[^\s<>)]+)/g,
      (m, pre, url) => {
        const href = url.startsWith("http") ? url : "https://" + url;
        return `${pre}<a href="${href}" target="_blank" rel="noopener noreferrer">${url}</a>`;
      }
    );
    // Explicit [label](url)
    s = s.replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    );
    // Bold **x** and italic *x*
    s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
    // Inline code `x`
    s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
    // Bullet lists: consecutive lines starting with "- "
    s = s.replace(/(^|\n)((?:- [^\n]+\n?)+)/g, (m, pre, block) => {
      const items = block
        .trim()
        .split(/\n/)
        .map((line) => line.replace(/^- /, "").trim())
        .filter(Boolean)
        .map((it) => `<li>${it}</li>`)
        .join("");
      return `${pre}<ul>${items}</ul>`;
    });
    // Paragraph breaks on double newlines
    s = s
      .split(/\n{2,}/)
      .map((chunk) => (/^<(ul|ol|blockquote|pre)/.test(chunk.trim()) ? chunk : `<p>${chunk.replace(/\n/g, "<br>")}</p>`))
      .join("");
    return s;
  };

  // Parse [[CTA:tag]] and [[LEAD_FORM]] out of the reply text
  const CTA_REGEX = /\[\[CTA:([a-zA-Z_]+)\]\]/gi;
  const LEAD_REGEX = /\[\[LEAD_FORM\]\]/gi;
  const parseActions = (text) => {
    const ctas = new Set();
    let m;
    while ((m = CTA_REGEX.exec(text)) !== null) ctas.add(m[1].toLowerCase());
    const lead = LEAD_REGEX.test(text);
    const clean = text.replace(CTA_REGEX, "").replace(LEAD_REGEX, "").trim();
    return { clean, ctas: [...ctas], lead };
  };

  // Detect Arabic script - used to auto-flip language when the user types Arabic
  const containsArabic = (s) => /[؀-ۿݐ-ݿ]/.test(s);

  const fmtTime = (d = new Date()) =>
    d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const scrollBottom = (el) => {
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  };

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------
  // Initial language: prefer site-wide localStorage (from i18n.js), fall
  // back to widget's own sessionStorage choice, then default English.
  const initialLang = (() => {
    try {
      const site = localStorage.getItem("naa-lang");
      if (site === "ar" || site === "en") return site;
    } catch (_) {}
    return sessionStorage.getItem(LANG_KEY) || "en";
  })();

  const state = {
    lang: initialLang,
    messages: [], // [{role:'user'|'assistant', content, ts}]
    open: false,
    busy: false,
    leadShown: false,
  };
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed.messages)) state.messages = parsed.messages;
      if (typeof parsed.leadShown === "boolean") state.leadShown = parsed.leadShown;
    }
  } catch (_) {}

  const persist = () => {
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ messages: state.messages, leadShown: state.leadShown })
      );
    } catch (_) {}
  };

  // ---------------------------------------------------------------------------
  // DOM
  // ---------------------------------------------------------------------------
  const mount = document.createElement("div");
  mount.className = "naa-chat";
  mount.setAttribute("data-lang", state.lang);
  mount.innerHTML = `
    <button class="naa-chat-bubble" type="button" aria-expanded="false" aria-controls="naa-chat-panel">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
      <span class="naa-chat-bubble-label"></span>
      <span class="naa-chat-bubble-dot" aria-hidden="true"></span>
    </button>

    <div class="naa-chat-panel" id="naa-chat-panel" role="dialog" aria-modal="false" aria-labelledby="naa-chat-title" hidden>
      <header class="naa-chat-header">
        <div class="naa-chat-brand">
          <img src="${LOGO_SRC}" alt="" class="naa-chat-logo">
          <div class="naa-chat-brand-text">
            <div class="naa-chat-title" id="naa-chat-title"></div>
            <div class="naa-chat-sub"></div>
          </div>
        </div>
        <div class="naa-chat-controls">
          <div class="naa-chat-lang" role="tablist" aria-label="Language">
            <button type="button" data-lang="en" class="naa-lang-btn">EN</button>
            <button type="button" data-lang="ar" class="naa-lang-btn">ع</button>
          </div>
          <button type="button" class="naa-chat-close" aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
          </button>
        </div>
      </header>

      <div class="naa-chat-body" id="naa-chat-body" aria-live="polite"></div>

      <div class="naa-chat-chips" id="naa-chat-chips"></div>

      <form class="naa-chat-input" id="naa-chat-form" autocomplete="off">
        <input type="text" id="naa-chat-text" required maxlength="1000">
        <button type="submit" class="naa-chat-send" aria-label="Send">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/></svg>
        </button>
      </form>
      <div class="naa-chat-foot">
        <span class="naa-chat-powered"></span>
        <button type="button" class="naa-chat-clear" data-action="clear"></button>
      </div>
    </div>
  `;

  document.body.appendChild(mount);

  const $bubble = mount.querySelector(".naa-chat-bubble");
  const $panel = mount.querySelector(".naa-chat-panel");
  const $body = mount.querySelector("#naa-chat-body");
  const $chips = mount.querySelector("#naa-chat-chips");
  const $form = mount.querySelector("#naa-chat-form");
  const $input = mount.querySelector("#naa-chat-text");
  const $close = mount.querySelector(".naa-chat-close");
  const $langBtns = mount.querySelectorAll(".naa-lang-btn");
  const $clear = mount.querySelector(".naa-chat-clear");

  // ---------------------------------------------------------------------------
  // Rendering
  // ---------------------------------------------------------------------------
  const t = () => I18N[state.lang];

  const applyLangUI = () => {
    const dict = t();
    mount.setAttribute("data-lang", state.lang);
    $panel.setAttribute("dir", state.lang === "ar" ? "rtl" : "ltr");
    mount.querySelector(".naa-chat-title").textContent = dict.title;
    mount.querySelector(".naa-chat-sub").textContent = dict.sub;
    mount.querySelector(".naa-chat-bubble-label").textContent = dict.openLabel;
    $bubble.setAttribute("aria-label", dict.openLabel);
    $close.setAttribute("aria-label", dict.closeLabel);
    $input.setAttribute("placeholder", dict.placeholder);
    $clear.textContent = dict.clear;
    mount.querySelector(".naa-chat-powered").textContent = dict.poweredBy;
    $langBtns.forEach((b) => b.classList.toggle("active", b.dataset.lang === state.lang));
    renderChips();
  };

  const renderChips = () => {
    if (state.messages.length > 0) {
      $chips.innerHTML = "";
      $chips.style.display = "none";
      return;
    }
    $chips.style.display = "";
    $chips.innerHTML = t()
      .chips.map((c) => `<button type="button" class="naa-chat-chip">${escapeHtml(c)}</button>`)
      .join("");
    $chips.querySelectorAll(".naa-chat-chip").forEach((btn) => {
      btn.addEventListener("click", () => submitMessage(btn.textContent.trim()));
    });
  };

  const ctaButton = (kind) => {
    const dict = t().cta;
    switch (kind) {
      case "whatsapp":
        return `<a class="naa-cta naa-cta-wa" href="${WA_URL}" target="_blank" rel="noopener noreferrer">${dict.whatsapp}</a>`;
      case "call":
        return `<a class="naa-cta" href="${TEL_URL}">${dict.call}</a>`;
      case "quote":
        return `<a class="naa-cta" href="#contact" data-scroll="#contact">${dict.quote}</a>`;
      case "consultation":
        return `<a class="naa-cta" href="#contact" data-scroll="#contact">${dict.consultation}</a>`;
      case "apply":
        return `<a class="naa-cta" href="#contact" data-scroll="#contact">${dict.apply}</a>`;
      case "projects":
        return `<a class="naa-cta naa-cta-outline" href="#projects" data-scroll="#projects">${dict.projects}</a>`;
      case "services":
        return `<a class="naa-cta naa-cta-outline" href="#services" data-scroll="#services">${dict.services}</a>`;
      case "fleet":
        return `<a class="naa-cta naa-cta-outline" href="#fleet" data-scroll="#fleet">${dict.fleet}</a>`;
      case "leadership":
        return `<a class="naa-cta naa-cta-outline" href="#leadership" data-scroll="#leadership">${dict.leadership}</a>`;
      default:
        return "";
    }
  };

  const renderMessage = (msg, opts = {}) => {
    const wrap = document.createElement("div");
    wrap.className = `naa-msg naa-msg-${msg.role}`;
    if (msg.role === "assistant") {
      const parsed = parseActions(msg.content);
      const ctaHtml = parsed.ctas.length
        ? `<div class="naa-msg-ctas">${parsed.ctas.map(ctaButton).join("")}</div>`
        : "";
      wrap.innerHTML = `
        <div class="naa-msg-avatar" aria-hidden="true">
          <img src="${LOGO_SRC}" alt="">
        </div>
        <div class="naa-msg-body">
          <div class="naa-msg-bubble">${renderMarkdown(parsed.clean || " ")}</div>
          ${ctaHtml}
          <div class="naa-msg-time">${fmtTime(new Date(msg.ts || Date.now()))}</div>
        </div>
      `;
      if (parsed.lead && !state.leadShown && !opts.skipLead) {
        state.leadShown = true;
        setTimeout(() => renderLeadForm(), 400);
      }
    } else {
      wrap.innerHTML = `
        <div class="naa-msg-body">
          <div class="naa-msg-bubble">${escapeHtml(msg.content).replace(/\n/g, "<br>")}</div>
          <div class="naa-msg-time">${fmtTime(new Date(msg.ts || Date.now()))}</div>
        </div>
      `;
    }

    // Hook internal-scroll CTAs into smooth scroll
    wrap.querySelectorAll("[data-scroll]").forEach((a) => {
      a.addEventListener("click", (e) => {
        const sel = a.getAttribute("data-scroll");
        const target = document.querySelector(sel);
        if (target) {
          e.preventDefault();
          closePanel();
          if (window.lenis && typeof window.lenis.scrollTo === "function") {
            window.lenis.scrollTo(target, { offset: -80 });
          } else {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      });
    });

    $body.appendChild(wrap);
    scrollBottom($body);
  };

  const renderTyping = () => {
    const el = document.createElement("div");
    el.className = "naa-msg naa-msg-assistant naa-msg-typing";
    el.setAttribute("aria-label", t().typing);
    el.innerHTML = `
      <div class="naa-msg-avatar" aria-hidden="true"><img src="${LOGO_SRC}" alt=""></div>
      <div class="naa-msg-body">
        <div class="naa-msg-bubble naa-typing-dots"><span></span><span></span><span></span></div>
      </div>
    `;
    $body.appendChild(el);
    scrollBottom($body);
    return el;
  };

  const renderGreeting = () => {
    if (state.messages.length) return;
    renderMessage({ role: "assistant", content: t().greet, ts: Date.now() }, { skipLead: true });
  };

  const renderDisclosure = () => {
    const dict = t();
    const el = document.createElement("div");
    el.className = "naa-chat-disclosure";
    el.setAttribute("role", "note");
    el.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
      </svg>
      <span>${escapeHtml(dict.disclosure)} <a href="privacy.html" target="_blank" rel="noopener">${escapeHtml(dict.privacyLinkText)}</a>.</span>
    `;
    $body.appendChild(el);
  };

  const renderAll = () => {
    $body.innerHTML = "";
    renderDisclosure();
    if (!state.messages.length) {
      renderGreeting();
    } else {
      state.messages.forEach((m) => renderMessage(m, { skipLead: true }));
    }
    renderChips();
  };

  // ---------------------------------------------------------------------------
  // Lead capture form (submits to Netlify Form 'chatbot-lead')
  // ---------------------------------------------------------------------------
  const renderLeadForm = () => {
    const dict = t();
    const el = document.createElement("div");
    el.className = "naa-msg naa-msg-assistant naa-lead";
    el.innerHTML = `
      <div class="naa-msg-avatar" aria-hidden="true"><img src="${LOGO_SRC}" alt=""></div>
      <div class="naa-msg-body">
        <div class="naa-msg-bubble naa-lead-card">
          <div class="naa-lead-title">${escapeHtml(dict.leadTitle)}</div>
          <div class="naa-lead-body">${escapeHtml(dict.leadBody)}</div>
          <form class="naa-lead-form" novalidate>
            <input type="text" name="name" placeholder="${escapeHtml(dict.leadName)}" required>
            <input type="email" name="email" placeholder="${escapeHtml(dict.leadEmail)}" required>
            <input type="tel" name="phone" placeholder="${escapeHtml(dict.leadPhone)}">
            <textarea name="notes" rows="2" placeholder="${escapeHtml(dict.leadNotes)}"></textarea>
            <div class="naa-lead-actions">
              <button type="submit" class="naa-cta">${escapeHtml(dict.leadSubmit)}</button>
              <button type="button" class="naa-cta naa-cta-outline naa-lead-skip">${escapeHtml(dict.leadSkip)}</button>
            </div>
          </form>
          <div class="naa-lead-thanks" hidden>${escapeHtml(dict.leadThanks)}</div>
        </div>
      </div>
    `;
    $body.appendChild(el);
    scrollBottom($body);

    const form = el.querySelector("form");
    const thanks = el.querySelector(".naa-lead-thanks");
    el.querySelector(".naa-lead-skip").addEventListener("click", () => {
      el.remove();
    });
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const fd = new FormData(form);
      const body = new URLSearchParams();
      body.append("form-name", "chatbot-lead");
      body.append("name", fd.get("name") || "");
      body.append("email", fd.get("email") || "");
      body.append("phone", fd.get("phone") || "");
      body.append("notes", fd.get("notes") || "");
      body.append("intent", "chatbot-lead");
      body.append("conversation", JSON.stringify(state.messages).slice(0, 3000));
      try {
        await fetch("/.netlify/functions/contact-submit", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: body.toString(),
        });
      } catch (_) {
        /* silent - form still visually confirms */
      }
      form.hidden = true;
      thanks.hidden = false;
      persist();
    });
  };

  // ---------------------------------------------------------------------------
  // Panel open / close
  // ---------------------------------------------------------------------------
  const openPanel = () => {
    if (state.open) return;
    state.open = true;
    $panel.hidden = false;
    // next frame → transition
    requestAnimationFrame(() => mount.classList.add("naa-open"));
    $bubble.setAttribute("aria-expanded", "true");
    setTimeout(() => $input.focus(), 250);
    scrollBottom($body);
  };
  const closePanel = () => {
    state.open = false;
    mount.classList.remove("naa-open");
    $bubble.setAttribute("aria-expanded", "false");
    setTimeout(() => {
      $panel.hidden = true;
    }, 200);
  };
  $bubble.addEventListener("click", () => (state.open ? closePanel() : openPanel()));
  $close.addEventListener("click", closePanel);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && state.open) closePanel();
  });

  // ---------------------------------------------------------------------------
  // Language switching
  // ---------------------------------------------------------------------------
  $langBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      state.lang = btn.dataset.lang === "ar" ? "ar" : "en";
      sessionStorage.setItem(LANG_KEY, state.lang);
      applyLangUI();
      renderAll();
    });
  });

  $clear.addEventListener("click", () => {
    state.messages = [];
    state.leadShown = false;
    persist();
    renderAll();
  });

  // ---------------------------------------------------------------------------
  // Send message → call chat function
  // ---------------------------------------------------------------------------
  const callAssistant = async () => {
    const resp = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lang: state.lang,
        messages: state.messages.map((m) => ({ role: m.role, content: m.content })),
      }),
    });
    if (resp.status === 429) {
      throw new Error("rate-limit");
    }
    if (!resp.ok) {
      let msg = "http-" + resp.status;
      try {
        const j = await resp.json();
        if (j && j.error) msg = j.error;
      } catch (_) {}
      throw new Error(msg);
    }
    const data = await resp.json();
    return data && data.text ? data.text : "";
  };

  const submitMessage = async (raw) => {
    const text = String(raw || "").trim();
    if (!text || state.busy) return;

    // Auto-detect Arabic - switch language on first Arabic input
    if (containsArabic(text) && state.lang !== "ar") {
      state.lang = "ar";
      sessionStorage.setItem(LANG_KEY, "ar");
      applyLangUI();
    }

    state.busy = true;
    $input.value = "";
    $chips.style.display = "none";

    const userMsg = { role: "user", content: text, ts: Date.now() };
    state.messages.push(userMsg);
    renderMessage(userMsg);
    persist();

    const typingEl = renderTyping();

    let reply = "";
    let attempted = 0;
    while (attempted < 2 && !reply) {
      attempted++;
      try {
        reply = await callAssistant();
      } catch (err) {
        if (String(err && err.message) === "rate-limit" && attempted < 2) {
          await new Promise((r) => setTimeout(r, 1200));
          continue;
        }
        typingEl.remove();
        const fallback = state.lang === "ar"
          ? "عذرًا، حدث خطأ. حاول مرة أخرى أو راسلنا على واتساب."
          : t().offline;
        const msg = { role: "assistant", content: fallback + "\n\n[[CTA:whatsapp]]", ts: Date.now() };
        state.messages.push(msg);
        renderMessage(msg);
        persist();
        state.busy = false;
        return;
      }
    }

    typingEl.remove();
    const asstMsg = { role: "assistant", content: reply || "…", ts: Date.now() };
    state.messages.push(asstMsg);
    renderMessage(asstMsg);
    persist();
    state.busy = false;
  };

  $form.addEventListener("submit", (e) => {
    e.preventDefault();
    submitMessage($input.value);
  });

  // ---------------------------------------------------------------------------
  // Sync with site-wide language toggle (from i18n.js).
  // When the user flips EN/AR in the header, mirror it here too.
  // ---------------------------------------------------------------------------
  window.addEventListener("naa-lang-change", (e) => {
    const lang = (e && e.detail && e.detail.lang) || "en";
    if (lang !== state.lang && (lang === "en" || lang === "ar")) {
      state.lang = lang;
      try { sessionStorage.setItem(LANG_KEY, lang); } catch (_) {}
      applyLangUI();
      renderAll();
    }
  });

  // ---------------------------------------------------------------------------
  // Boot
  // ---------------------------------------------------------------------------
  applyLangUI();
  renderAll();

  // Small pulse on first load to draw attention (once per session)
  if (!sessionStorage.getItem("naa-chat-seen")) {
    mount.classList.add("naa-attention");
    setTimeout(() => mount.classList.remove("naa-attention"), 6000);
    sessionStorage.setItem("naa-chat-seen", "1");
  }
})();
