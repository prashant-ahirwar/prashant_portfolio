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

  function seed(){
    measure();

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
      obj.vx = (Math.random() - 0.5) * 2.6;
      obj.vy = (Math.random() - 0.5) * 2.6;
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

  function tick(){
    const pad = 6;
    const maxX = Math.max(0, rect.width - iconSize - pad);
    const maxY = Math.max(0, rect.height - iconSize - pad);

    items.forEach((obj) => {
      obj.x += obj.vx;
      obj.y += obj.vy;

      let bounced = false;

      if(obj.x <= pad || obj.x >= maxX){
        obj.vx *= -1;
        obj.x = clamp(obj.x, pad, maxX);
        bounced = true;
      }

      if(obj.y <= pad || obj.y >= maxY){
        obj.vy *= -1;
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

      obj.vx *= 0.996;
      obj.vy *= 0.996;
    });

    apply();
    rafId = requestAnimationFrame(tick);
  }

  function onMove(e){
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const radius = 120;

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
        obj.vx += nx * strength * 0.9;
        obj.vy += ny * strength * 0.9;
      }
    });
  }

  function onResize(){
    measure();
    const pad = 6;
    const maxX = Math.max(0, rect.width - iconSize - pad);
    const maxY = Math.max(0, rect.height - iconSize - pad);
    items.forEach((obj) => {
      obj.x = clamp(obj.x, pad, maxX);
      obj.y = clamp(obj.y, pad, maxY);
    });
  }

  seed();
  apply();

  container.addEventListener('mousemove', onMove);
  window.addEventListener('resize', onResize);

  cancelAnimationFrame(rafId);
  tick();
}
