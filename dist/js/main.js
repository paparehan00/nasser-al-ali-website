/* ==========================================================================
   Nasser Al Ali Enterprises — main.js
   Fail-open animations, snappy hero, parallax, magnetic buttons, count-ups.
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const hasGSAP = typeof window.gsap !== 'undefined';
  const hasST = typeof window.ScrollTrigger !== 'undefined';
  const hasLenis = typeof window.Lenis !== 'undefined';
  const isMobile = window.innerWidth <= 768;
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------------------------------------------------------------------------
  // Lenis Smooth Scroll
  // ---------------------------------------------------------------------------
  let lenis = null;
  try {
    if (hasLenis && !isReducedMotion) {
      lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        smoothTouch: false,
        touchMultiplier: 2,
      });
      const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  } catch (e) {
    console.warn("Lenis init failed:", e);
  }

  // ---------------------------------------------------------------------------
  // GSAP + ScrollTrigger + Lenis wiring
  // ---------------------------------------------------------------------------
  try {
    if (hasGSAP && hasST) {
      gsap.registerPlugin(ScrollTrigger);
      if (lenis) {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => { lenis.raf(time * 1000); });
        gsap.ticker.lagSmoothing(0);
      }
    }
  } catch (e) {
    console.warn("GSAP init failed:", e);
  }

  // ---------------------------------------------------------------------------
  // Preloader / reveal — quick branded splash, decoupled from all heavy loads.
  // ---------------------------------------------------------------------------
  let hasRevealed = false;

  const revealSite = () => {
    if (hasRevealed) return;
    hasRevealed = true;
    const preloader = document.querySelector('.preloader');
    if (!preloader) { initEverything(); return; }

    if (hasGSAP) {
      try {
        gsap.to(preloader, {
          yPercent: -100,
          duration: 0.6,
          ease: "power3.inOut",
          onComplete: () => { preloader.style.display = "none"; initEverything(); }
        });
        return;
      } catch (_) { /* fall through */ }
    }
    preloader.style.display = "none";
    initEverything();
  };

  // Hard backup — 3s max on the preloader no matter what.
  // (Scrub/video code call revealSite() sooner when their assets are ready.)
  const HERO_HARD_TIMEOUT_MS = 3000;
  setTimeout(() => {
    if (!hasRevealed) {
      // Fail-open: hide loader, show poster, keep scrub attempt going in background
      const p = document.querySelector('.preloader');
      if (p) p.style.display = 'none';
      showPosterOnly && showPosterOnly();
      initEverything();
      hasRevealed = true;
    }
  }, HERO_HARD_TIMEOUT_MS);

  // Real progress reporter (shared by scrub decoder + video buffer).
  const progressBar = document.getElementById("progress-bar");
  const progressText = document.getElementById("progress-text");
  const reportProgress = (done, total) => {
    if (!total) return;
    const pct = Math.min(100, Math.floor((done / total) * 100));
    if (progressBar) progressBar.style.width = pct + "%";
    if (progressText) progressText.innerText = pct + "%";
  };

  // ---------------------------------------------------------------------------
  // Hero — capability detection + two modes:
  //   A) SCRUB mode: desktop, good network, no reduced-motion.
  //      120 WebP frames, pre-decoded, drawn on canvas via a single rAF loop
  //      driven by scroll progress.
  //   B) VIDEO mode: mobile, slow network, save-data, reduced-motion.
  //      Muted autoplay looping video (webm→mp4→poster).
  // ---------------------------------------------------------------------------
  const HERO_FRAME_COUNT_MAX = 200; // upper safety bound; auto-detected from 404s
  const HERO_FRAME_PATH = (i) => `assets/hero-frames/frame-${String(i).padStart(3, "0")}.webp`;

  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const saveData = !!(conn && conn.saveData);
  const slowNet = !!(conn && /^(slow-2g|2g|3g)$/.test(conn.effectiveType || ""));
  const useVideoFallback = isMobile || saveData || slowNet || isReducedMotion;

  const heroCanvas = document.getElementById("hero-canvas");
  const heroVideo = document.getElementById("hero-video");
  const heroFallback = document.getElementById("hero-fallback");

  const showPosterOnly = () => {
    if (heroCanvas) heroCanvas.classList.remove("is-active");
    if (heroVideo) heroVideo.classList.remove("is-active");
    // .hero-fallback is always visible as base layer (z-index 0)
  };

  // ---- Shared scrub-mode state --------------------------------------------
  let heroMode = null;           // 'scrub' | 'video' | 'poster'
  const heroFrames = [];         // heroFrames[i] = decoded HTMLImageElement (0-indexed)
  let heroDecodedContig = 0;     // highest CONTIGUOUS decoded index + 1
  let heroTotal = 0;             // detected frame count
  let heroCurrentDrawn = -1;
  let heroTargetIndex = 0;
  let heroCtx = null;
  let heroCoverParams = { x: 0, y: 0, w: 0, h: 0 };
  let heroRafRunning = false;

  const computeCover = (iw, ih) => {
    if (!iw || !ih || !heroCanvas) return;
    const cw = heroCanvas.width;
    const ch = heroCanvas.height;
    const scale = Math.max(cw / iw, ch / ih);
    const w = iw * scale;
    const h = ih * scale;
    heroCoverParams = { x: (cw - w) / 2, y: (ch - h) / 2, w, h };
  };

  const sizeHeroCanvas = () => {
    if (!heroCanvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    heroCanvas.width = Math.round(w * dpr);
    heroCanvas.height = Math.round(h * dpr);
    heroCanvas.style.width = w + "px";
    heroCanvas.style.height = h + "px";
    const ref = heroFrames[0];
    if (ref) computeCover(ref.naturalWidth || ref.width, ref.naturalHeight || ref.height);
    heroCurrentDrawn = -1; // force redraw at new size
  };

  const drawHeroFrame = (idx) => {
    if (!heroCtx) return;
    const img = heroFrames[idx];
    if (!img) return;
    heroCtx.drawImage(img, heroCoverParams.x, heroCoverParams.y, heroCoverParams.w, heroCoverParams.h);
    heroCurrentDrawn = idx;
  };

  // Single rAF loop — only re-draws when target changes and is decoded.
  const heroRafLoop = () => {
    if (!heroRafRunning) return;
    const maxIdx = Math.max(0, heroDecodedContig - 1);
    const clamped = Math.min(heroTargetIndex | 0, maxIdx);
    if (clamped !== heroCurrentDrawn) drawHeroFrame(clamped);
    requestAnimationFrame(heroRafLoop);
  };

  // Auto-detect the frame count by binary-probing 404s (fast; first probe hits 120)
  const detectHeroFrameCount = () =>
    new Promise((resolve) => {
      const probe = (n) => new Promise((r) => {
        const im = new Image();
        im.onload = () => r(true);
        im.onerror = () => r(false);
        im.src = HERO_FRAME_PATH(n) + "?probe=1";
      });
      (async () => {
        if (!(await probe(1))) return resolve(0);
        let lo = 1;
        let hi = HERO_FRAME_COUNT_MAX;
        if (await probe(120)) {
          if (!(await probe(121))) return resolve(120);
          lo = 121;
        } else {
          hi = 119;
        }
        while (lo < hi) {
          const mid = ((lo + hi + 1) / 2) | 0;
          if (await probe(mid)) lo = mid;
          else hi = mid - 1;
        }
        resolve(lo);
      })();
    });

  // Pre-decode one frame via img.decode() so drawImage is instant
  const decodeFrame = (i) => new Promise((resolve) => {
    const img = new Image();
    img.decoding = "async";
    const done = (ok) => {
      if (ok) heroFrames[i - 1] = img;
      resolve(ok);
    };
    img.onload = () => {
      if (img.decode) img.decode().then(() => done(true)).catch(() => done(!!img.complete));
      else done(true);
    };
    img.onerror = () => done(false);
    img.src = HERO_FRAME_PATH(i);
  });

  const updateDecodedCount = () => {
    while (heroFrames[heroDecodedContig]) heroDecodedContig++;
  };

  // Kick off the video buffering. Resolves when the video is ready to play.
  const preloadHeroVideo = () => new Promise((resolve) => {
    if (!heroVideo) return resolve(false);
    if (!heroVideo.querySelector("source")) {
      const webm = document.createElement("source");
      webm.src = "assets/hero-1080.webm"; webm.type = "video/webm";
      const mp4 = document.createElement("source");
      mp4.src = "assets/hero-1080.mp4"; mp4.type = "video/mp4";
      heroVideo.appendChild(webm); heroVideo.appendChild(mp4);
    }
    heroVideo.preload = "auto";
    heroVideo.muted = true;
    heroVideo.playsInline = true;
    const onReady = () => { cleanup(); resolve(true); };
    const onErr = () => { cleanup(); resolve(false); };
    const cleanup = () => {
      heroVideo.removeEventListener("canplay", onReady);
      heroVideo.removeEventListener("loadeddata", onReady);
      heroVideo.removeEventListener("error", onErr);
    };
    heroVideo.addEventListener("canplay", onReady, { once: true });
    heroVideo.addEventListener("loadeddata", onReady, { once: true });
    heroVideo.addEventListener("error", onErr, { once: true });
    try { heroVideo.load(); } catch (_) { onErr(); }
  });

  // Kick off frame decoding. Resolves when the first ~20 frames are ready.
  const preloadHeroFrames = () => new Promise(async (resolve) => {
    heroTotal = await detectHeroFrameCount();
    if (!heroTotal) return resolve(false);

    const REVEAL_AT = Math.min(20, heroTotal);
    const CONCURRENCY = 8;
    let dispatched = 0;
    let nextToStart = 1;
    let resolved = false;

    const trySpawn = () => {
      while (nextToStart <= heroTotal && (nextToStart - dispatched) < CONCURRENCY) {
        const idx = nextToStart++;
        decodeFrame(idx).then((ok) => {
          dispatched++;
          if (ok) updateDecodedCount();
          reportProgress(dispatched, heroTotal);
          if (!resolved && heroDecodedContig >= REVEAL_AT) {
            resolved = true;
            resolve(true);
          }
          if (nextToStart <= heroTotal) trySpawn();
        });
      }
    };
    trySpawn();
  });

  // Bootstrap: choose mode, start preload, resolve when ready to reveal
  const heroPreloadPromise = (async () => {
    if (!heroCanvas && !heroVideo) { heroMode = "poster"; return; }
    if (useVideoFallback) {
      heroMode = "video";
      const ok = await preloadHeroVideo();
      if (!ok) heroMode = "poster";
    } else {
      heroMode = "scrub";
      const ok = await preloadHeroFrames();
      if (!ok) heroMode = "poster";
    }
  })();

  // Trigger revealSite() as soon as hero is ready (bounded by the 3s hard timeout)
  heroPreloadPromise.then(() => {
    if (!hasRevealed) revealSite();
  });

  // ---- Post-reveal: activate the chosen mode ------------------------------
  const initHeroScroll = () => {
    if (heroMode === "video") {
      if (!heroVideo) { showPosterOnly(); return; }
      heroVideo.classList.add("is-active");
      const tryPlay = () => {
        const p = heroVideo.play();
        if (p && typeof p.catch === "function") {
          p.catch(() => {
            const kick = () => { heroVideo.play().catch(() => {}); };
            document.addEventListener("click", kick, { once: true });
            document.addEventListener("touchstart", kick, { once: true });
          });
        }
      };
      tryPlay();
      return;
    }

    if (heroMode === "scrub" && heroCanvas && heroTotal > 0 && heroDecodedContig > 0) {
      heroCanvas.classList.add("is-active");
      heroCtx = heroCanvas.getContext("2d", { alpha: false });
      sizeHeroCanvas();
      window.addEventListener("resize", sizeHeroCanvas, { passive: true });
      const ref = heroFrames[0];
      if (ref) {
        computeCover(ref.naturalWidth, ref.naturalHeight);
        drawHeroFrame(0);
      }
      // Start the single rAF draw loop
      heroRafRunning = true;
      requestAnimationFrame(heroRafLoop);

      // Attach ScrollTrigger — updates heroTargetIndex only, never draws
      if (hasGSAP && hasST) {
        try {
          gsap.to({ v: 0 }, {
            v: 1,
            ease: "none",
            scrollTrigger: {
              trigger: ".hero",
              start: "top top",
              end: "+=150vh",
              scrub: 0.3,
              onUpdate: (self) => {
                const maxIdx = Math.max(0, heroDecodedContig - 1);
                heroTargetIndex = Math.round(self.progress * maxIdx);
              },
            },
          });
        } catch (e) {
          console.warn("Hero scrub ScrollTrigger error:", e);
        }
      }
      return;
    }

    // Poster mode
    showPosterOnly();
  };

  const initHeroOverlayFade = () => {
    if (isReducedMotion || !hasGSAP || !hasST) return;
    try {
      gsap.to(".hero-overlay", {
        opacity: 0,
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "+=120vh",
          scrub: true,
        },
      });
    } catch (_) {}
  };

  // ---------------------------------------------------------------------------
  // Scroll-triggered fade-rise — fail-open by design:
  //   1. CSS keeps .fade-rise at opacity:1 (visible baseline).
  //   2. GSAP sets opacity:0 ONLY when ScrollTrigger successfully creates.
  //   3. onEnter callback animates back to visible.
  //   4. Safety net: any .fade-rise stuck at opacity 0 after 4s → forced visible.
  // ---------------------------------------------------------------------------
  const initFadeRise = () => {
    if (!hasGSAP || !hasST) return; // Elements stay visible via CSS

    const allTargets = [];

    try {
      document.querySelectorAll('section').forEach(section => {
        const targets = Array.from(section.querySelectorAll('.fade-rise'));
        if (!targets.length) return;

        // Hide manually — only after both GSAP + ScrollTrigger confirmed
        gsap.set(targets, { opacity: 0, y: 24 });
        targets.forEach(t => allTargets.push(t));

        ScrollTrigger.create({
          trigger: section,
          start: "top 85%",
          once: true,
          onEnter: () => {
            gsap.to(targets, {
              opacity: 1,
              y: 0,
              duration: 0.9,
              stagger: 0.08,
              ease: "power3.out",
              overwrite: "auto"
            });
          }
        });
      });
    } catch (e) {
      console.warn("Fade-rise error:", e);
      // Force everything visible on any error
      allTargets.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
    }

    // Safety net: after 4s, anything still hidden gets forced visible
    setTimeout(() => {
      allTargets.forEach(el => {
        const cs = window.getComputedStyle(el);
        if (parseFloat(cs.opacity) < 0.5) {
          gsap.to(el, { opacity: 1, y: 0, duration: 0.4, overwrite: "auto" });
        }
      });
    }, 4000);
  };

  // ---------------------------------------------------------------------------
  // Count-up on stat numbers
  // ---------------------------------------------------------------------------
  const initCounters = () => {
    const stats = document.querySelectorAll('.stat-number');
    if (!stats.length) return;

    const animate = (el, target) => {
      if (!hasGSAP) { el.innerHTML = target.toLocaleString(); return; }
      try {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 2.2,
          ease: "power2.out",
          onUpdate: () => { el.innerHTML = Math.round(obj.val).toLocaleString(); }
        });
      } catch (_) {
        el.innerHTML = target.toLocaleString();
      }
    };

    if (hasST) {
      ScrollTrigger.create({
        trigger: ".stat-bar",
        start: "top 85%",
        once: true,
        onEnter: () => { stats.forEach(s => animate(s, parseInt(s.getAttribute('data-target'), 10))); }
      });
    } else {
      // Fail-open: IntersectionObserver fallback
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            stats.forEach(s => animate(s, parseInt(s.getAttribute('data-target'), 10)));
            obs.disconnect();
          }
        });
      }, { threshold: 0.3 });
      const bar = document.querySelector('.stat-bar');
      if (bar) obs.observe(bar);
    }
  };

  // ---------------------------------------------------------------------------
  // Parallax on [data-parallax] — subtle Y translate on scroll
  // ---------------------------------------------------------------------------
  const initParallax = () => {
    if (!hasGSAP || !hasST || isReducedMotion) return;
    try {
      document.querySelectorAll('[data-parallax]').forEach(el => {
        const speed = parseFloat(el.getAttribute('data-parallax')) || 0.05;
        const distance = 80 * speed * 10; // px
        gsap.fromTo(el, { y: distance }, {
          y: -distance,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 1
          }
        });
      });
    } catch (e) {
      console.warn("Parallax error:", e);
    }
  };

  // ---------------------------------------------------------------------------
  // Magnetic buttons — small translate toward cursor
  // ---------------------------------------------------------------------------
  const initMagnetic = () => {
    if (isReducedMotion) return;
    document.querySelectorAll('.magnetic').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.18}px, ${y * 0.28}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  };

  // ---------------------------------------------------------------------------
  // Master initializer, called after preloader hides
  // ---------------------------------------------------------------------------
  const initEverything = () => {
    initHeroScroll();          // Chooses scrub (canvas) or video mode
    initHeroOverlayFade();     // Fades hero text over ~120vh regardless of mode
    initFadeRise();
    initCounters();
    initParallax();
    initMagnetic();
    // Poke ScrollTrigger once layout is settled
    if (hasST) {
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }
  };

  // ---------------------------------------------------------------------------
  // Sticky nav
  // ---------------------------------------------------------------------------
  const header = document.getElementById("site-header");
  const onScroll = () => {
    if (!header) return;
    if (window.scrollY > 50) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (mobileMenuToggle && mainNav) {
    mobileMenuToggle.addEventListener('click', () => {
      mainNav.classList.toggle('active');
    });
  }

  // Smooth-scroll for any in-page anchor
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      if (mainNav) mainNav.classList.remove('active');
      if (lenis) {
        lenis.scrollTo(target, { offset: -80 });
      } else {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---------------------------------------------------------------------------
  // Civil Gallery Carousel — infinite marquee
  // ---------------------------------------------------------------------------
  const galleryTrack = document.getElementById("gallery-track");
  const civilImages = [
    'civil_1.jpg', 'civil_2.jpg', 'civil_3.jpg', 'civil_4.jpg',
    'civil_5.jpg', 'civil_6.jpg', 'civil_7.jpg', 'civil_8.jpg',
    'civil_9.jpg', 'civil_10.jpg', 'civil_11.jpg', 'civil_13.jpg',
    'civil_14.jpg', 'civil_15.jpg'
  ];

  if (galleryTrack) {
    civilImages.forEach(img => {
      const item = document.createElement("div");
      item.className = "carousel-item";
      item.innerHTML = `<img src="assets/${img}" alt="Civil Work" loading="lazy">`;
      galleryTrack.appendChild(item);
    });
    // Duplicate for seamless loop
    galleryTrack.innerHTML += galleryTrack.innerHTML;

    if (hasGSAP && !isReducedMotion) {
      try {
        const totalWidth = galleryTrack.scrollWidth / 2;
        const tween = gsap.to(galleryTrack, {
          x: -totalWidth,
          duration: 45,
          ease: "none",
          repeat: -1,
          modifiers: {
            x: (x) => `${parseFloat(x) % totalWidth}px`
          }
        });
        galleryTrack.addEventListener('mouseenter', () => tween.timeScale(0.2));
        galleryTrack.addEventListener('mouseleave', () => tween.timeScale(1));
      } catch (e) {
        console.warn("Gallery carousel error:", e);
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Lightbox
  // ---------------------------------------------------------------------------
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');

  document.addEventListener('click', (e) => {
    const item = e.target.closest('.carousel-item, .project-img-wrapper');
    if (item && lightbox && lightboxImg) {
      const img = item.querySelector('img');
      if (img) {
        lightboxImg.src = img.src;
        lightbox.classList.add('active');
        if (lenis) lenis.stop();
      }
    }
  });

  if (lightboxClose && lightbox) {
    lightboxClose.addEventListener('click', () => {
      lightbox.classList.remove('active');
      if (lenis) lenis.start();
    });
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('active');
        if (lenis) lenis.start();
      }
    });
  }
});
