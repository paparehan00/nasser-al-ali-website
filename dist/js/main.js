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

  // Splash timer — reveal after 700ms.
  setTimeout(revealSite, 700);

  // Hard backup — force preloader gone at 1.8s even if the animation is buggy.
  setTimeout(() => {
    const p = document.querySelector('.preloader');
    if (p && p.style.display !== 'none') {
      p.style.display = 'none';
      if (!hasRevealed) { initEverything(); hasRevealed = true; }
    }
  }, 1800);

  // Cosmetic progress bar — fill it up to 100% during the splash window.
  const progressBar = document.getElementById("progress-bar");
  const progressText = document.getElementById("progress-text");
  if (progressBar || progressText) {
    const splashStart = performance.now();
    const tick = () => {
      const t = Math.min(1, (performance.now() - splashStart) / 700);
      const pct = Math.floor(t * 100);
      if (progressBar) progressBar.style.width = `${pct}%`;
      if (progressText) progressText.innerText = `${pct}%`;
      if (t < 1 && !hasRevealed) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  // ---------------------------------------------------------------------------
  // Hero video — autoplay, muted, loop. Guarantee playback (mobile browsers).
  // ---------------------------------------------------------------------------
  const heroVideo = document.getElementById("hero-video");
  if (heroVideo) {
    heroVideo.muted = true;
    heroVideo.playsInline = true;
    const tryPlay = () => {
      const p = heroVideo.play();
      if (p && typeof p.catch === 'function') {
        p.catch(() => {
          // Autoplay blocked — leave poster showing. Play on first user interaction.
          const kick = () => { heroVideo.play().catch(() => {}); document.removeEventListener('click', kick); document.removeEventListener('touchstart', kick); };
          document.addEventListener('click', kick, { once: true });
          document.addEventListener('touchstart', kick, { once: true });
        });
      }
    };
    if (heroVideo.readyState >= 2) tryPlay();
    else heroVideo.addEventListener('loadeddata', tryPlay, { once: true });
    // Fallback kick after 500ms in case loadeddata never fires
    setTimeout(tryPlay, 500);
  }

  // ---------------------------------------------------------------------------
  // Hero scroll — overlay fades out over ~1 screen-height of scroll
  // ---------------------------------------------------------------------------
  const initHeroScroll = () => {
    if (isReducedMotion || !hasGSAP || !hasST) return;
    try {
      gsap.to('.hero-overlay', {
        opacity: 0,
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "+=80vh",
          scrub: true
        }
      });
      // Subtle video zoom-out on scroll for depth
      gsap.to('.hero-video', {
        scale: 1.08,
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "+=100vh",
          scrub: true
        }
      });
    } catch (e) {
      console.warn("Hero scroll error:", e);
    }
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
    initHeroScroll();
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
