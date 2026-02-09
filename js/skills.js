import { $$, clamp } from './utils.js';

export function initSkillFloatingIcons(){
  const container = document.querySelector('.skill-float-container');
  if(!container) return;

  const icons = $$('.skill-float-container .skill-icon');
  if(!icons.length) return;

  const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

  let rect;
  let iconSize;
  let rafId;
  let ro;
  let running = false;
  let lastT = 0;
  let startedOnce = false;

  const items = icons.map((icon) => ({
    el: icon,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    rot: 0,
    breatheStarted: false,
  }));

  function measure(){
    rect = container.getBoundingClientRect();
    const sample = icons[0];
    iconSize = sample ? (sample.getBoundingClientRect().width || 60) : 60;
  }

  function hasUsableRect(){
    return rect && rect.width > 40 && rect.height > 40;
  }

  function seed(){
    measure();

    if(!hasUsableRect()) return;

    const pad = 8;
    const maxX = Math.max(0, rect.width - iconSize - pad);
    const maxY = Math.max(0, rect.height - iconSize - pad);

    items.forEach((obj, idx) => {
      let tries = 0;
      let x = 0;
      let y = 0;

      while(tries < 30){
        x = pad + Math.random() * maxX;
        y = pad + Math.random() * maxY;
        const ok = items.slice(0, idx).every(o => {
          const dx = (o.x - x);
          const dy = (o.y - y);
          return (dx*dx + dy*dy) > (iconSize*iconSize*0.65);
        });
        if(ok) break;
        tries++;
      }

      obj.x = x;
      obj.y = y;
  obj.vx = (Math.random() - 0.5) * 2.2;
  obj.vy = (Math.random() - 0.5) * 2.2;
      obj.rot = (Math.random() - 0.5) * 10;

      if(!prefersReducedMotion && window.anime && !obj.breatheStarted){
        obj.breatheStarted = true;
        anime({
          targets: obj.el,
          scale: [1, 1.05],
          duration: 1500 + Math.random() * 550,
          direction: 'alternate',
          loop: true,
          easing: 'easeInOutSine'
        });
      }
    });
  }

  function apply(){
    items.forEach((obj) => {
      obj.el.style.transform = `translate(${obj.x}px, ${obj.y}px) rotate(${obj.rot}deg)`;
    });
  }

  function step(t){
    if(!running) return;

    if(!hasUsableRect()){
      measure();
      rafId = requestAnimationFrame(step);
      return;
    }

    const dt = clamp((t - (lastT || t)) / 16.6667, 0.5, 1.75);
    lastT = t;

    const pad = 6;
    const maxX = Math.max(0, rect.width - iconSize - pad);
    const maxY = Math.max(0, rect.height - iconSize - pad);

    // Soft separation (prevents clumping / "stuck" feel)
    const minDist = iconSize * 0.85;
    const minDist2 = minDist * minDist;
    for(let i = 0; i < items.length; i++){
      for(let j = i + 1; j < items.length; j++){
        const a = items[i];
        const b = items[j];
        const dx = (a.x - b.x);
        const dy = (a.y - b.y);
        const d2 = dx*dx + dy*dy;
        if(d2 > 0.0001 && d2 < minDist2){
          const d = Math.sqrt(d2);
          const push = (1 - d / minDist) * 0.18;
          const nx = dx / d;
          const ny = dy / d;
          a.vx += nx * push;
          a.vy += ny * push;
          b.vx -= nx * push;
          b.vy -= ny * push;
        }
      }
    }

    items.forEach((obj) => {
      obj.x += obj.vx * dt;
      obj.y += obj.vy * dt;

      let bounced = false;

      if(obj.x <= pad || obj.x >= maxX){
        obj.vx *= -0.96;
        obj.x = clamp(obj.x, pad, maxX);
        bounced = true;
      }

      if(obj.y <= pad || obj.y >= maxY){
        obj.vy *= -0.96;
        obj.y = clamp(obj.y, pad, maxY);
        bounced = true;
      }

      obj.rot = (obj.rot * 0.98) + (obj.vx + obj.vy) * 0.12;

      if(bounced && window.anime && !prefersReducedMotion){
        anime({
          targets: obj.el,
          scale: [1.18, 1],
          duration: 260,
          easing: 'easeOutExpo'
        });
      }

      // Air drag
      const drag = prefersReducedMotion ? 0.985 : 0.992;
      obj.vx *= drag;
      obj.vy *= drag;
    });

    apply();
    rafId = requestAnimationFrame(step);
  }

  function onMoveClient(clientX, clientY){
    if(!hasUsableRect()) return;
    const mx = clientX - rect.left;
    const my = clientY - rect.top;
    const radius = Math.max(110, Math.min(190, rect.width * 0.30));

    items.forEach((obj) => {
      const cx = obj.x + iconSize * 0.5;
      const cy = obj.y + iconSize * 0.5;
      const dx = cx - mx;
      const dy = cy - my;
      const dist = Math.hypot(dx, dy);

      if(dist < radius && dist > 0.001){
        const strength = (1 - dist / radius);
        const nx = dx / dist;
        const ny = dy / dist;
        const power = prefersReducedMotion ? 0.65 : 1.35;
        // Stronger scatter, especially when you're right on top of an icon.
        const closeBoost = clamp((iconSize * 0.9) / dist, 0.9, 2.0);
        obj.vx += nx * strength * power * closeBoost;
        obj.vy += ny * strength * power * closeBoost;
      }
    });
  }

  function onPointerMove(e){
    onMoveClient(e.clientX, e.clientY);
  }

  function onPointerEnter(){
    // Refresh bounds right when the user interacts (fixes cases where rect changed since init).
    onResize();
  }

  function onTouchMove(e){
    const t = e.touches && e.touches[0];
    if(!t) return;
    onMoveClient(t.clientX, t.clientY);
  }

  function onResize(){
    measure();
    if(!hasUsableRect()) return;
    const pad = 6;
    const maxX = Math.max(0, rect.width - iconSize - pad);
    const maxY = Math.max(0, rect.height - iconSize - pad);
    items.forEach((obj) => {
      obj.x = clamp(obj.x, pad, maxX);
      obj.y = clamp(obj.y, pad, maxY);
    });
  }

  function start(){
    if(running) return;
    measure();

    // If the container is laying out later (scroll animation / fonts), wait for a usable size.
    if(!hasUsableRect()){
      requestAnimationFrame(start);
      return;
    }

    seed();
    apply();
    running = true;
    startedOnce = true;
    lastT = 0;
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(step);
  }

  function stop(){
    running = false;
    cancelAnimationFrame(rafId);
  }

  function onVisibility(){
    if(document.hidden) stop();
    else start();
  }

  function whenIconsReady(){
    const loads = icons.map((img) => {
      if(img.complete && img.naturalWidth > 0) return Promise.resolve();
      return new Promise((resolve) => {
        const done = () => resolve();
        img.addEventListener('load', done, { once: true });
        img.addEventListener('error', done, { once: true });
      });
    });

    // If images are cached this resolves immediately; otherwise wait, with a short timeout fallback.
    return Promise.race([
      Promise.all(loads),
      new Promise((resolve) => setTimeout(resolve, 900)),
    ]);
  }

  // Prefer pointer events (covers mouse + touch) and keep a touch fallback.
  container.addEventListener('pointerenter', onPointerEnter, { passive: true });
  container.addEventListener('pointermove', onPointerMove, { passive: true });
  container.addEventListener('touchmove', onTouchMove, { passive: true });
  window.addEventListener('resize', onResize);
  window.addEventListener('orientationchange', onResize);
  document.addEventListener('visibilitychange', onVisibility);

  if('ResizeObserver' in window){
    ro = new ResizeObserver(() => {
      onResize();
      // On some mobile layout passes, width/height can become 0 briefly.
      if(!hasUsableRect()) return;
      if(!running) start();
    });
    ro.observe(container);
  }

  whenIconsReady().then(() => {
    // Occasionally the container animates into view; retry a couple times.
    start();
    if(!startedOnce){
      setTimeout(start, 250);
      setTimeout(start, 700);
    }
  });
}
