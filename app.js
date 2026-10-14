/* Vela – clickable prototype
 * Screens are 3x exports of the Figma frames (section "Kulcsképernyők_V2").
 * All coordinates below are in Figma points (393 × 852 frame space).
 */
(() => {
  const W = 393;
  const H = 852;

  /** @type {Record<string, any>} */
  const SCREENS = {
    1: {
      img: 's1.webp', h: 852,
      hot: [
        { x: 120.5, y: 730, w: 152, h: 47, to: 2, t: 'push', label: 'Continue' },
        { x: 110, y: 790, w: 173, h: 30, to: 4, t: 'fade', label: 'I already have an account' },
        { x: 318, y: 80, w: 75, h: 34, to: 3, t: 'push', label: 'Skip' },
      ],
    },
    2: {
      img: 's2.webp', h: 852,
      hot: [
        { x: 120.5, y: 730, w: 152, h: 47, to: 3, t: 'push', label: 'Continue' },
        { x: 110, y: 790, w: 173, h: 30, to: 4, t: 'fade', label: 'I already have an account' },
        { x: 318, y: 80, w: 75, h: 34, to: 3, t: 'push', label: 'Skip' },
      ],
    },
    3: {
      img: 's3.webp', h: 852,
      hot: [
        { x: 97.5, y: 730, w: 198, h: 48, to: 4, t: 'fade', label: 'Create account' },
        { x: 160, y: 790, w: 73, h: 30, to: 4, t: 'fade', label: 'Log in' },
      ],
    },
    // Home / portfolio – long, scrollable
    4: {
      img: 's4.webp', h: 2277, pinTop: 54, pinBottom: 106,
      hot: [
        // Open trades – first column rows (Bitcoin / Etherum / Solana)
        { x: 16, y: 620, w: 242, h: 68, to: 5, t: 'push', label: 'Bitcoin position' },
        { x: 16, y: 696, w: 242, h: 68, to: 5, t: 'push', label: 'Etherum position' },
        { x: 16, y: 772, w: 242, h: 68, to: 5, t: 'push', label: 'Solana position' },
        { x: 274, y: 620, w: 119, h: 68, to: 5, t: 'push', label: 'Bitcoin position' },
        // Trending – Bitcoin row
        { x: 32, y: 1619.6, w: 326, h: 62, to: 5, t: 'push', label: 'Bitcoin' },
      ],
      pinHot: [
        // Tab bar (bottom pin starts at y = 2277 - 106 = 2171; tab bar at 2171.5)
        { x: 28, y: 4.5, w: 80, h: 63, action: 'top', label: 'Home' },
      ],
    },
    // Bitcoin position detail – long, scrollable
    5: {
      img: 's5.webp', h: 1667.6, pinTop: 54, pinBottom: 104,
      hot: [
        { x: 20, y: 54, w: 44, h: 44, to: 4, t: 'pop', label: 'Back' },
        { x: 20, y: 1472.6, w: 168.5, h: 45, to: 6, t: 'up', label: 'Modify' },
        { x: 204.5, y: 1472.6, w: 168.5, h: 45, to: 4, t: 'pop', label: 'Close' },
      ],
      pinHot: [
        // bottom pin starts at 1563.6; tab bar at 1569
        { x: 34, y: 9.4, w: 80, h: 63, to: 4, t: 'pop', label: 'Home' },
      ],
    },
    // Trade ticket – Long
    6: {
      img: 's6.webp', h: 852,
      hot: [
        { x: 20, y: 56, w: 44, h: 44, to: 5, t: 'down', label: 'Close' },
        { x: 199, y: 122, w: 166, h: 36, to: 8, t: 'swap', label: 'Short' },
      ],
      slider: { to: 7, fill: ['#0c2430', '#1f5d55'] },
    },
    // Long opened
    7: {
      img: 's7.webp', h: 852,
      hot: [
        { x: 20, y: 696, w: 353, h: 45, to: 5, t: 'fade', label: 'Add your thesis' },
        { x: 20, y: 757, w: 353, h: 48, to: 4, t: 'fade', label: 'Close' },
      ],
    },
    // Trade ticket – Short
    8: {
      img: 's8.webp', h: 852,
      hot: [
        { x: 20, y: 56, w: 44, h: 44, to: 5, t: 'down', label: 'Close' },
        { x: 28, y: 122, w: 166, h: 36, to: 6, t: 'swap', label: 'Long' },
      ],
      slider: { to: 9, fill: ['#24121d', '#6a2b36'] },
    },
    // Short opened
    9: {
      img: 's9.webp', h: 852,
      hot: [
        { x: 20, y: 696, w: 353, h: 45, to: 5, t: 'fade', label: 'Add your thesis' },
        { x: 20, y: 757, w: 353, h: 48, to: 4, t: 'fade', label: 'Close' },
      ],
    },
  };

  const OPPOSITE = { push: 'pop', pop: 'push', up: 'down', down: 'up', fade: 'fade', swap: 'swap' };

  const phone = document.getElementById('phone');
  let current = null; // { id, el }
  let busy = false;

  /* ---------- Preload ---------- */
  const preload = () => Object.values(SCREENS).forEach((s) => { const i = new Image(); i.src = s.img; });

  /* ---------- Layout / scaling ---------- */
  function fit() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const mobile = vw < 600 && window.matchMedia('(pointer: coarse)').matches || vw < 480;
    document.body.classList.toggle('mobile', mobile);
    let scale;
    if (mobile) scale = Math.min(vw / W, vh / H);
    else scale = Math.min(1, (vh - 72) / (H + 24), (vw - 32) / (W + 24));
    document.documentElement.style.setProperty('--scale', String(scale));
  }

  /* ---------- Building screens ---------- */
  function hotspot(h, onActivate) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'hot';
    b.setAttribute('aria-label', h.label || 'Hotspot');
    Object.assign(b.style, { left: h.x + 'px', top: h.y + 'px', width: h.w + 'px', height: h.h + 'px' });
    b.addEventListener('click', (e) => { e.stopPropagation(); onActivate(h); });
    return b;
  }

  function build(id) {
    const s = SCREENS[id];
    const el = document.createElement('section');
    el.className = 'screen';
    el.dataset.id = id;

    const scroller = document.createElement('div');
    scroller.className = 'scroller';
    const canvas = document.createElement('div');
    canvas.className = 'canvas';
    canvas.style.height = s.h + 'px';
    canvas.style.backgroundImage = `url(${s.img})`;
    scroller.appendChild(canvas);
    el.appendChild(scroller);

    const act = (h) => {
      if (h.action === 'top') { scroller.scrollTo({ top: 0, behavior: 'smooth' }); return; }
      go(h.to, h.t);
    };
    s.hot.forEach((h) => canvas.appendChild(hotspot(h, act)));

    if (s.h > H) {
      // Pinned status bar + pinned tab bar, cropped from the same export
      if (s.pinTop) {
        const top = document.createElement('div');
        top.className = 'pin top';
        Object.assign(top.style, {
          height: s.pinTop + 'px',
          backgroundImage: `url(${s.img})`,
          backgroundSize: `${W}px ${s.h}px`,
          backgroundPosition: '0 0',
        });
        el.appendChild(top);
      }
      if (s.pinBottom) {
        const bottom = document.createElement('div');
        bottom.className = 'pin bottom';
        Object.assign(bottom.style, {
          height: s.pinBottom + 'px',
          backgroundImage: `url(${s.img})`,
          backgroundSize: `${W}px ${s.h}px`,
          backgroundPosition: `0 ${-(s.h - s.pinBottom)}px`,
        });
        (s.pinHot || []).forEach((h) => bottom.appendChild(hotspot(h, act)));
        el.appendChild(bottom);
      }
    }

    if (s.slider) buildSlider(canvas, s);
    return el;
  }

  /* ---------- Slide to confirm ---------- */
  function buildSlider(canvas, s) {
    const KX = 24, KY = 750, K = 56;
    const TRAVEL = 373 - 4 - K - KX; // track is x 20 → 373, knob inset 4
    const [c1, c2] = s.slider.fill;

    const fill = document.createElement('div');
    fill.className = 'slide-fill';
    Object.assign(fill.style, {
      left: KX + 'px', top: KY + 'px', width: K + 'px',
      background: `linear-gradient(90deg, ${c1}, ${c2})`,
    });

    const knob = document.createElement('div');
    knob.className = 'slide-knob nudge';
    knob.setAttribute('role', 'slider');
    knob.setAttribute('aria-label', 'Slide to confirm');
    knob.tabIndex = 0;
    Object.assign(knob.style, {
      left: KX + 'px', top: KY + 'px',
      backgroundImage: `url(${s.img})`,
      backgroundSize: `${W}px ${H}px`,
      backgroundPosition: `${-KX}px ${-KY}px`,
    });

    let startX = 0, dx = 0, dragging = false;
    const scale = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--scale')) || 1;
    const set = (v, anim) => {
      dx = Math.max(0, Math.min(TRAVEL, v));
      const tr = anim ? 'transform .28s cubic-bezier(.2,.8,.2,1), width .28s cubic-bezier(.2,.8,.2,1)' : 'none';
      knob.style.transition = tr;
      fill.style.transition = tr;
      knob.style.transform = `translateX(${dx}px)`;
      fill.style.width = K + dx + 'px';
    };
    const confirm = () => {
      set(TRAVEL, true);
      if (navigator.vibrate) navigator.vibrate(12);
      setTimeout(() => go(s.slider.to, 'fade'), 260);
    };

    knob.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      knob.classList.remove('nudge');
      dragging = true;
      startX = e.clientX;
      knob.setPointerCapture(e.pointerId);
      set(dx, false);
    });
    knob.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      set((e.clientX - startX) / scale(), false);
    });
    const end = (e) => {
      if (!dragging) return;
      dragging = false;
      if (dx > TRAVEL * 0.7) confirm();
      else set(0, true);
    };
    knob.addEventListener('pointerup', end);
    knob.addEventListener('pointercancel', end);
    knob.addEventListener('click', (e) => e.stopPropagation());
    knob.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') { e.preventDefault(); confirm(); }
    });

    // Tapping the track (not the knob) gives a hint nudge
    const track = document.createElement('button');
    track.type = 'button';
    track.className = 'hot';
    track.setAttribute('aria-label', 'Slide to confirm');
    Object.assign(track.style, { left: '80px', top: '746px', width: '293px', height: '64px', borderRadius: '32px' });
    track.addEventListener('click', (e) => {
      e.stopPropagation();
      knob.classList.remove('nudge');
      void knob.offsetWidth;
      knob.classList.add('nudge');
    });

    canvas.append(track, fill, knob);
  }

  /* ---------- Transitions ---------- */
  const EASE = 'cubic-bezier(.32,.72,0,1)';
  function animate(oldEl, newEl, type) {
    const d = type === 'swap' ? 180 : type === 'fade' ? 320 : 420;
    const frames = {
      push: [
        [{ transform: 'translateX(100%)' }, { transform: 'translateX(0)' }],
        [{ transform: 'translateX(0)', filter: 'brightness(1)' }, { transform: 'translateX(-30%)', filter: 'brightness(.6)' }],
        true,
      ],
      pop: [
        [{ transform: 'translateX(-30%)', filter: 'brightness(.6)' }, { transform: 'translateX(0)', filter: 'brightness(1)' }],
        [{ transform: 'translateX(0)' }, { transform: 'translateX(100%)' }],
        false,
      ],
      up: [
        [{ transform: 'translateY(100%)' }, { transform: 'translateY(0)' }],
        [{ transform: 'scale(1)', filter: 'brightness(1)' }, { transform: 'scale(.94)', filter: 'brightness(.5)' }],
        true,
      ],
      down: [
        [{ transform: 'scale(.94)', filter: 'brightness(.5)' }, { transform: 'scale(1)', filter: 'brightness(1)' }],
        [{ transform: 'translateY(0)' }, { transform: 'translateY(100%)' }],
        false,
      ],
      fade: [
        [{ opacity: 0, transform: 'scale(1.02)' }, { opacity: 1, transform: 'scale(1)' }],
        [{ opacity: 1 }, { opacity: 0 }],
        true,
      ],
      swap: [
        [{ opacity: 0 }, { opacity: 1 }],
        [{ opacity: 1 }, { opacity: 1 }],
        true,
      ],
    }[type] || [[{ opacity: 0 }, { opacity: 1 }], [{ opacity: 1 }, { opacity: 0 }], true];

    const [inF, outF, newOnTop] = frames;
    if (newOnTop) phone.appendChild(newEl);
    else phone.insertBefore(newEl, oldEl);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      oldEl.remove();
      return Promise.resolve();
    }
    const opts = { duration: d, easing: EASE, fill: 'both' };
    const a = newEl.animate(inF, opts);
    const b = oldEl.animate(outF, opts);
    return Promise.all([a.finished, b.finished]).then(() => {
      oldEl.remove();
      a.cancel();
    });
  }

  /* ---------- Navigation ---------- */
  const stack = [];
  function render(id, type) {
    id = String(id);
    if (!SCREENS[id]) id = '1';
    const el = build(id);
    if (!current) {
      phone.appendChild(el);
      current = { id, el };
      return Promise.resolve();
    }
    busy = true;
    const old = current.el;
    current = { id, el };
    return animate(old, el, type).finally(() => { busy = false; });
  }

  function go(id, type = 'push') {
    if (busy || !current || String(id) === current.id) return;
    stack.push({ id: current.id, t: type });
    history.pushState({ id: String(id), t: type }, '', '#/' + id);
    render(id, type);
  }

  window.addEventListener('popstate', (e) => {
    const target = (e.state && e.state.id) || idFromHash();
    const last = stack.pop();
    const t = last && last.id === target ? OPPOSITE[last.t] || 'pop' : 'fade';
    if (current && target === current.id) return;
    busy = false;
    render(target, t);
  });

  function idFromHash() {
    const m = location.hash.match(/#\/(\d+)/);
    return m ? m[1] : '1';
  }

  /* ---------- Hotspot reveal (like Figma) ---------- */
  let revealTimer;
  phone.addEventListener('click', () => {
    phone.classList.add('reveal');
    clearTimeout(revealTimer);
    revealTimer = setTimeout(() => phone.classList.remove('reveal'), 700);
  });

  document.getElementById('restart').addEventListener('click', () => {
    stack.length = 0;
    history.replaceState({ id: '1' }, '', '#/1');
    render(1, 'fade');
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'r' || e.key === 'R') document.getElementById('restart').click();
    if (e.key === 'Escape' || e.key === 'Backspace') history.back();
  });

  /* ---------- Boot ---------- */
  fit();
  window.addEventListener('resize', fit);
  const first = idFromHash();
  history.replaceState({ id: first }, '', '#/' + first);
  render(first);
  preload();
})();
