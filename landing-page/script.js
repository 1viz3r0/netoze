/**
 * NET0ZE site behavior: sticky header, mobile navigation, scroll reveals,
 * and the hero globe. The globe is a canvas-2D world map (no WebGL) that
 * rotates on its own behind the hero copy. It never intercepts input.
 */
(() => {
  'use strict';

  const header = document.querySelector('[data-header]');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const mobileNav = document.querySelector('[data-mobile-nav]');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Sticky header + mobile navigation ---------- */

  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 12);
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  menuToggle?.addEventListener('click', () => {
    const isOpen = mobileNav?.classList.toggle('is-open') ?? false;
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  mobileNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    mobileNav.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  }));

  /* Close the mobile menu when clicking or tabbing outside of it. */
  document.addEventListener('click', (event) => {
    if (!mobileNav?.classList.contains('is-open')) return;
    if (event.target instanceof Element && event.target.closest('.site-header')) return;
    mobileNav.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !mobileNav?.classList.contains('is-open')) return;
    mobileNav.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.focus();
  });

  /* ---------- Scroll reveals ---------- */

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
  } else {
    document.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'));
  }

  /* ---------- Hero globe ---------- */

  const HERO_GLOBE_DATA = './data/countries.json';

  const fallbackCountries = [
    { n: 'United States', iso: 'US', la: 39.8, lo: -98.6 },
    { n: 'Brazil', iso: 'BR', la: -10.8, lo: -52.9 },
    { n: 'United Kingdom', iso: 'GB', la: 54, lo: -2.4 },
    { n: 'Germany', iso: 'DE', la: 51.1, lo: 10.4 },
    { n: 'Nigeria', iso: 'NG', la: 9.1, lo: 8.7 },
    { n: 'South Africa', iso: 'ZA', la: -29, lo: 25.1 },
    { n: 'India', iso: 'IN', la: 22.9, lo: 79.6 },
    { n: 'China', iso: 'CN', la: 35.9, lo: 104.2 },
    { n: 'Japan', iso: 'JP', la: 36.2, lo: 138.3 },
    { n: 'Australia', iso: 'AU', la: -25.7, lo: 134.5 },
  ];

  /* Label these countries so the map stays readable while it turns. */
  const labelCountries = new Set([
    'United States', 'Canada', 'Brazil', 'Argentina', 'United Kingdom', 'France',
    'Germany', 'Russia', 'Egypt', 'Nigeria', 'South Africa', 'India', 'China',
    'Japan', 'Indonesia', 'Australia',
  ]);

  const globePalettes = {
    dark: {
      landFill: 'rgba(24, 32, 37, 0.38)',
      landHole: 'rgba(5, 5, 5, 0.55)',
      border: 'rgba(140, 231, 236, 0.52)',
      borderStrong: 'rgba(202, 255, 117, 0.75)',
      graticule: 'rgba(140, 231, 236, 0.09)',
      label: 'rgba(222, 243, 246, 0.78)',
    },
    light: {
      landFill: 'rgba(14, 111, 120, 0.10)',
      landHole: 'rgba(251, 250, 245, 0.6)',
      border: 'rgba(11, 99, 107, 0.48)',
      borderStrong: 'rgba(69, 111, 15, 0.8)',
      graticule: 'rgba(14, 111, 120, 0.11)',
      label: 'rgba(25, 27, 28, 0.72)',
    },
  };

  function createGlobe() {
    const canvas = document.querySelector('.hero-globe');
    const stage = canvas?.closest('.hero');
    if (!(canvas instanceof HTMLCanvasElement) || !(stage instanceof HTMLElement)) return;

    let context;
    try {
      context = canvas.getContext('2d');
    } catch {
      context = null;
    }
    if (!context) {
      /* No canvas support: hide it and let the CSS glow carry the hero. */
      canvas.hidden = true;
      return;
    }

    const currentTheme = () => (
      document.documentElement.dataset.theme === 'light' ? globePalettes.light : globePalettes.dark
    );
    let palette = currentTheme();
    const themeObserver = new MutationObserver(() => {
      palette = currentTheme();
      if (prefersReducedMotion) renderStaticFrame();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    let width = 0;
    let height = 0;
    let scale = 1;
    const rotationSpeed = prefersReducedMotion ? 0 : 0.0021; /* radians per frame */
    const TILT = -0.32;
    let rotationY = -0.85;
    let animationFrame = 0;
    let running = false;
    let resizeObserver = null;
    let countries = fallbackCountries;

    const resize = () => {
      const bounds = stage.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      scale = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(scale, 0, 0, scale, 0, 0);
      measureStacked();
    };

    /* Wide screens: globe sits to the right of the copy. Below 1101px:
       stacked under it — measure where the copy actually ends and drop
       the globe into the free space, so it never climbs into the text
       on short or wide heroes. */
    let stacked = null;
    const measureStacked = () => {
      const copy = stage.querySelector('.hero-copy');
      const stageTop = stage.getBoundingClientRect().top;
      const copyBottom = copy
        ? copy.getBoundingClientRect().bottom - stageTop
        : height * 0.62;
      const free = Math.max(height - copyBottom, 140);
      const radius = Math.max(90, Math.min(width * 0.34, free * 0.72));
      stacked = {
        cx: width * 0.5,
        cy: Math.min(copyBottom + radius * 0.85, height + radius * 0.2),
        radius,
      };
    };
    const layout = () => {
      const wide = window.matchMedia('(min-width: 1101px)').matches;
      return wide
        ? { cx: width * 0.68, cy: height * 0.5, radius: Math.min(width * 0.40, height * 0.62) * 0.60 }
        : (stacked ?? { cx: width * 0.5, cy: height * 0.82, radius: Math.min(width, height) * 0.33 });
    };

    const globePoint = (lat, lon) => {
      const latitude = (lat * Math.PI) / 180;
      const longitude = (lon * Math.PI) / 180;
      return {
        x: Math.cos(latitude) * Math.cos(longitude),
        y: Math.sin(latitude),
        z: -Math.cos(latitude) * Math.sin(longitude),
      };
    };

    const rotatePoint = (point) => {
      const cosY = Math.cos(rotationY);
      const sinY = Math.sin(rotationY);
      const x = point.x * cosY - point.z * sinY;
      const z = point.x * sinY + point.z * cosY;
      const cosX = Math.cos(TILT);
      const sinX = Math.sin(TILT);
      return { x, y: point.y * cosX - z * sinX, z: point.y * sinX + z * cosX };
    };

    const project = (point, cx, cy, radius) => ({
      x: cx + point.x * radius,
      y: cy - point.y * radius,
      z: point.z,
    });

    const unwrapRing = (ring) => {
      const output = [];
      ring.forEach(([lon, lat]) => {
        let current = lon;
        const previous = output.at(-1)?.[0];
        if (previous !== undefined) {
          while (current - previous > 180) current -= 360;
          while (current - previous < -180) current += 360;
        }
        output.push([current, lat]);
      });
      return output;
    };

    const drawPath = (ring, cx, cy, radius, stroke, lineWidth) => {
      const unwrapped = unwrapRing(ring);
      if (unwrapped.length < 2) return;
      context.beginPath();
      let visible = 0;
      unwrapped.forEach(([lon, lat], index) => {
        const screen = project(rotatePoint(globePoint(lat, lon)), cx, cy, radius);
        if (screen.z > -0.22) visible += 1;
        if (index === 0) context.moveTo(screen.x, screen.y);
        else context.lineTo(screen.x, screen.y);
      });
      if (visible < Math.max(2, unwrapped.length * 0.2)) return;
      context.strokeStyle = stroke;
      context.lineWidth = lineWidth;
      context.stroke();
    };

    const drawCountry = (country, cx, cy, radius) => {
      const polys = country.polys ?? [];
      const labeled = labelCountries.has(country.n);
      polys.forEach((poly) => {
        const outer = poly?.[0];
        if (!outer?.length) return;
        const unwrapped = unwrapRing(outer);
        context.beginPath();
        let visible = 0;
        unwrapped.forEach(([lon, lat], index) => {
          const screen = project(rotatePoint(globePoint(lat, lon)), cx, cy, radius);
          if (screen.z > -0.22) visible += 1;
          if (index === 0) context.moveTo(screen.x, screen.y);
          else context.lineTo(screen.x, screen.y);
        });
        if (visible < Math.max(3, unwrapped.length * 0.18)) return;
        context.closePath();
        context.fillStyle = palette.landFill;
        context.fill();
        drawPath(outer, cx, cy, radius, labeled ? palette.borderStrong : palette.border, labeled ? 1.1 : 0.7);
        poly.slice(1).forEach((hole) => drawPath(hole, cx, cy, radius, palette.landHole, 0.5));
      });
    };

    const drawCountryLabels = (cx, cy, radius) => {
      context.textAlign = 'center';
      countries.forEach((country) => {
        if (!labelCountries.has(country.n)) return;
        const point = rotatePoint(globePoint(country.la, country.lo));
        if (point.z < 0.24) return;
        const screen = project(point, cx, cy, radius);
        context.fillStyle = palette.label;
        context.font = '600 10px ui-monospace, SFMono-Regular, Menlo, monospace';
        context.fillText(country.n.toUpperCase(), screen.x, screen.y - 8);
      });
      context.textAlign = 'start';
    };

    const drawGraticule = (cx, cy, radius) => {
      context.strokeStyle = palette.graticule;
      context.lineWidth = 0.5;
      for (let latitude = -60; latitude <= 60; latitude += 30) {
        const points = [];
        for (let longitude = -180; longitude <= 180; longitude += 6) {
          points.push(project(rotatePoint(globePoint(latitude, longitude)), cx, cy, radius));
        }
        context.beginPath();
        points.forEach((point, index) => (index === 0 ? context.moveTo(point.x, point.y) : context.lineTo(point.x, point.y)));
        context.stroke();
      }
      for (let longitude = -150; longitude <= 180; longitude += 30) {
        const points = [];
        for (let latitude = -90; latitude <= 90; latitude += 5) {
          points.push(project(rotatePoint(globePoint(latitude, longitude)), cx, cy, radius));
        }
        context.beginPath();
        points.forEach((point, index) => (index === 0 ? context.moveTo(point.x, point.y) : context.lineTo(point.x, point.y)));
        context.stroke();
      }
    };

    /* A quiet sphere gradient so the map reads as a globe, not a flat
       outline. Kept intentionally subtle in both themes. */
    const drawSphere = (cx, cy, radius) => {
      const gradient = context.createRadialGradient(
        cx - radius * 0.25, cy - radius * 0.3, radius * 0.12, cx, cy, radius,
      );
      if (palette === globePalettes.dark) {
        gradient.addColorStop(0, 'rgba(32, 40, 46, 0.9)');
        gradient.addColorStop(0.62, 'rgba(14, 18, 22, 0.88)');
        gradient.addColorStop(1, 'rgba(7, 9, 11, 0.94)');
      } else {
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.92)');
        gradient.addColorStop(0.62, 'rgba(248, 246, 240, 0.92)');
        gradient.addColorStop(1, 'rgba(226, 224, 213, 0.96)');
      }
      context.beginPath();
      context.arc(cx, cy, radius, 0, Math.PI * 2);
      context.fillStyle = gradient;
      context.fill();
      context.strokeStyle = palette.border;
      context.lineWidth = 0.75;
      context.stroke();
    };

    const renderFrame = (advance) => {
      if (advance) rotationY = (rotationY + rotationSpeed) % (Math.PI * 2);
      context.clearRect(0, 0, width, height);
      const { cx, cy, radius } = layout();
      drawSphere(cx, cy, radius);
      drawGraticule(cx, cy, radius);
      countries.forEach((country) => drawCountry(country, cx, cy, radius));
      drawCountryLabels(cx, cy, radius);
    };

    const draw = () => {
      renderFrame(true);
      animationFrame = requestAnimationFrame(draw);
    };

    /* Keep GPU use sane: only animate while the hero is on screen and
       the tab is visible. */
    const start = () => {
      if (running) return;
      running = true;
      animationFrame = requestAnimationFrame(draw);
    };
    const stop = () => {
      if (!running) return;
      running = false;
      cancelAnimationFrame(animationFrame);
    };

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stop();
      else start();
    });
    if ('IntersectionObserver' in window) {
      const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => (entry.isIntersecting && !document.hidden ? start() : stop()));
      }, { threshold: 0.02 });
      heroObserver.observe(stage);
    }

    window.addEventListener('resize', resize, { passive: true });
    if ('ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(stage);
    }
    resize();

    const renderStaticFrame = () => {
      renderFrame(false);
    };

    fetch(HERO_GLOBE_DATA)
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error(String(response.status)))))
      .then((data) => {
        if (Array.isArray(data) && data.length && data[0].polys) {
          countries = data;
          if (prefersReducedMotion) renderStaticFrame();
        }
      })
      .catch(() => {
        /* The built-in fallback outline stays on screen. */
      });

    if (prefersReducedMotion) {
      /* One static frame, no animation loop. */
      renderStaticFrame();
      window.addEventListener('resize', renderStaticFrame, { passive: true });
      return;
    }

    start();
    window.addEventListener('pagehide', () => {
      stop();
      themeObserver.disconnect();
      resizeObserver?.disconnect();
    }, { once: true });
  }

  createGlobe();
})();
