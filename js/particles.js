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
    font: '700 128px "Space Grotesk", system-ui, sans-serif',
    dotSize: 2.2,
    gap: 6,
    scatterRadius: 70,
    returnEase: 0.08,
    repelEase: 0.22,
  };

  let points = [];
  let mouse = {x: -9999, y: -9999, moving: false, t: 0};

  function resize(){
    const rect = canvas.getBoundingClientRect();
    w = Math.floor(rect.width);
    h = Math.floor(rect.height);
    canvas.width = Math.floor(w * DPR);
    canvas.height = Math.floor(h * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
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
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.hypot(dx, dy);

      if(mouse.moving && dist < config.scatterRadius){
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

  function onMove(e){
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.moving = true;
    mouse.t = performance.now();
  }

  function tickMouse(){
    if(mouse.moving && performance.now() - mouse.t > 120){
      mouse.moving = false;
      mouse.x = -9999;
      mouse.y = -9999;
    }
    requestAnimationFrame(tickMouse);
  }

  window.addEventListener('resize', resize);
  canvas.addEventListener('mousemove', onMove, {passive:true});
  canvas.addEventListener('mouseleave', () => { mouse.moving = false; mouse.x = -9999; mouse.y = -9999; });

  resize();
  tickMouse();
  draw();
}
