export function initParticlesBackground(){
  if(!window.particlesJS?.load) return;
  window.particlesJS.load('particles-js', 'particlejs-config.json', () => {
  });
}

export function initParticleNameCanvas(){
  const canvas = document.getElementById('particle-name');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');

  const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  let w = 0, h = 0;

  const config = {
    text: 'PRASHANT',
    font: '800 128px "Space Grotesk", system-ui, sans-serif',
    dotSize: 2.2,
    gap: 6,
    scatterRadius: 70,
    returnEase: 0.08,
    repelEase: 0.22,
  };

  let points = [];
  let pointer = {x: -9999, y: -9999, moving: false, t: 0};
  let ro;

  function setPointer(clientX, clientY){
    const rect = canvas.getBoundingClientRect();
    pointer.x = clientX - rect.left;
    pointer.y = clientY - rect.top;
    pointer.moving = true;
    pointer.t = performance.now();
  }

  function clearPointer(){
    pointer.moving = false;
    pointer.x = -9999;
    pointer.y = -9999;
  }

  function fitFontSize(){
    // Find the largest font that fits within the canvas on one line.
    // Adds padding so it doesn't touch rounded borders.
    const padX = Math.max(18, Math.floor(w * 0.04));
    const maxWidth = Math.max(0, w - padX * 2);
    const maxHeight = Math.max(0, h * 0.72);

    const off = document.createElement('canvas');
    off.width = Math.max(1, w);
    off.height = Math.max(1, h);
    const o = off.getContext('2d');
    o.textAlign = 'center';
    o.textBaseline = 'middle';

    let lo = 28;
    let hi = 240;
    let best = 96;

    for(let i = 0; i < 14; i++){
      const mid = Math.floor((lo + hi) / 2);
      o.font = `800 ${mid}px "Space Grotesk", system-ui, sans-serif`;
      const m = o.measureText(config.text);
      // Approx height: use em box when available, otherwise estimate.
      const hBox = (m.actualBoundingBoxAscent && m.actualBoundingBoxDescent)
        ? (m.actualBoundingBoxAscent + m.actualBoundingBoxDescent)
        : (mid * 1.05);

      if(m.width <= maxWidth && hBox <= maxHeight){
        best = mid;
        lo = mid + 1;
      }else{
        hi = mid - 1;
      }
    }

    return clamp(best, 42, 220);
  }

  function resize(){
    const rect = canvas.getBoundingClientRect();
    w = Math.floor(rect.width);
    h = Math.floor(rect.height);
    canvas.width = Math.floor(w * DPR);
    canvas.height = Math.floor(h * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    const fontSize = Math.floor(fitFontSize());
    const isSmall = w < 420;
    config.font = `800 ${fontSize}px "Space Grotesk", system-ui, sans-serif`;
    config.gap = isSmall ? 7 : 6;
    config.dotSize = isSmall ? 2.05 : 2.4;
    config.scatterRadius = Math.floor(clamp(Math.min(w, h) * 0.22, 70, 140));

    buildPoints();
  }

  function buildPoints(){
    points = [];
    const off = document.createElement('canvas');
    off.width = w;
    off.height = h;
    const o = off.getContext('2d');

    o.clearRect(0,0,w,h);
    o.fillStyle = '#F8FAFC';
    o.font = config.font;
    o.textAlign = 'center';
    o.textBaseline = 'middle';
    o.fillText(config.text, w/2, h/2);

    const img = o.getImageData(0,0,w,h).data;

    for(let y=0; y<h; y += config.gap){
      for(let x=0; x<w; x += config.gap){
        const a = img[(y*w + x) * 4 + 3];
        if(a > 50){
          const col = (x % 3 === 0) ? '#22C55E' : (x % 3 === 1 ? '#F472B6' : '#F8FAFC');
          const px = x;
          const py = y;
          points.push({
            x: px + (Math.random()*6-3),
            y: py + (Math.random()*6-3),
            ox: px,
            oy: py,
            vx: 0,
            vy: 0,
            col,
          });
        }
      }
    }
  }

  function draw(){
    ctx.clearRect(0,0,w,h);

    const g = ctx.createRadialGradient(w/2, h/2, 20, w/2, h/2, Math.max(w,h)/1.4);
    g.addColorStop(0, 'rgba(124,58,237,.14)');
    g.addColorStop(1, 'rgba(15,23,42,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0,0,w,h);

    for(const p of points){
      const dx = p.x - pointer.x;
      const dy = p.y - pointer.y;
      const dist = Math.hypot(dx, dy);

      if(pointer.moving && dist < config.scatterRadius){
        const force = (1 - dist / config.scatterRadius);
        p.vx += (dx / (dist || 1)) * force * 6;
        p.vy += (dy / (dist || 1)) * force * 6;
      }

      p.vx += (p.ox - p.x) * config.returnEase;
      p.vy += (p.oy - p.y) * config.returnEase;

      p.vx *= 0.84;
      p.vy *= 0.84;

      p.x += p.vx;
      p.y += p.vy;

      ctx.fillStyle = p.col;
      ctx.beginPath();
      ctx.arc(p.x, p.y, config.dotSize, 0, Math.PI*2);
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  function onPointerMove(e){
    setPointer(e.clientX, e.clientY);
  }

  function onTouchMove(e){
    const t = e.touches && e.touches[0];
    if(!t) return;
    setPointer(t.clientX, t.clientY);
  }

  function tickMouse(){
    if(pointer.moving && performance.now() - pointer.t > 120){
      clearPointer();
    }
    requestAnimationFrame(tickMouse);
  }

  window.addEventListener('resize', resize);
  canvas.addEventListener('pointermove', onPointerMove, { passive: true });
  canvas.addEventListener('touchmove', onTouchMove, { passive: true });
  canvas.addEventListener('pointerleave', clearPointer, { passive: true });
  canvas.addEventListener('touchend', clearPointer, { passive: true });

  if('ResizeObserver' in window){
    ro = new ResizeObserver(() => resize());
    ro.observe(canvas);
  }

  resize();
  tickMouse();
  draw();
}
