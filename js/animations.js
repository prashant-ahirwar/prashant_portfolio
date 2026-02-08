import { $, $$, inViewportOnce } from './utils.js';

export function initNavbarAnimations(){
  const capsule = $('.navbar .capsule');
  if(!capsule || !window.anime) return;
  anime({
    targets: capsule,
    translateY: [-18, 0],
    opacity: [0, 1],
    duration: 900,
    easing: 'easeOutExpo'
  });
}

export function initHeroAnimations(){
  if(!window.anime) return;

  const letters = $$('.name-letter');
  letters.forEach(l => {
    l.dataset.rx = String((Math.random() * 240) - 120);
    l.dataset.ry = String((-220 - Math.random() * 220));
  });

  anime({
    targets: '.name-letter',
    translateX: (el) => [Number(el.dataset.rx) || 0, 0],
    translateY: (el) => [Number(el.dataset.ry) || -240, 0],
    rotate: () => [anime.random(-18, 18), 0],
    opacity: [0, 1],
    delay: anime.stagger(90),
    easing: 'spring(1, 80, 10, 0)',
  });

  anime({
    targets: '.tagline .word',
    translateX: [-32, 0],
    opacity: [0, 1],
    delay: anime.stagger(80, {start: 600}),
    duration: 900,
    easing: 'easeOutBack'
  });

  anime({
    targets: '.hero-blob',
    translateX: () => anime.random(-40, 40),
    translateY: () => anime.random(-30, 30),
    scale: () => anime.random(92, 112) / 100,
    direction: 'alternate',
    easing: 'easeInOutSine',
    duration: () => anime.random(5000, 9000),
    loop: true
  });
}

export function animateOnScroll(el){
  if(!window.anime) return;

  if(el.classList.contains('project-card')) animateProjectCard(el);
  if(el.classList.contains('timeline')) animateTimeline();
  if(el.classList.contains('ring-progress')) animateSkillRings();
}

export function initTimelineObserver(){
  const tl = $('.timeline');
  if(!tl) return;
  inViewportOnce(tl, () => animateTimeline());
}

export function animateTimeline(){
  if(!window.anime) return;
  const line = $('.timeline-line');
  const dots = $$('.timeline-dot');
  const content = $$('.timeline-content');
  if(!line) return;

  anime({
    targets: line,
    update: (anim) => {
      line.style.setProperty('--p', String(anim.progress));
      line.style.setProperty('background', 'rgba(248,250,252,.12)');
      line.style.setProperty('overflow', 'hidden');
      line.style.setProperty('position', 'absolute');
    },
    duration: 1
  });

  anime({
    targets: '.timeline-line::after'
  });

  line.style.setProperty('--lineH', '0%');
  line.querySelector?.(':scope');
  anime({
    targets: line,
    duration: 1100,
    easing: 'easeOutExpo',
    update: (a) => {
      line.style.setProperty('--lineH', `${a.progress}%`);
      line.style.setProperty('--lineHNum', String(a.progress));
      line.style.setProperty('mask-image', 'none');
      line.style.setProperty('webkitMaskImage', 'none');
      line.style.setProperty('contain', 'paint');
      line.style.setProperty('isolation', 'isolate');
      line.style.setProperty('background', 'rgba(248,250,252,.12)');
    }
  });

  anime({
    targets: dots,
    scale: [0.6, 1],
    opacity: [0, 1],
    delay: anime.stagger(180),
    easing: 'easeOutBack',
    duration: 600
  });

  anime({
    targets: content,
    translateX: [18, 0],
    opacity: [0, 1],
    delay: anime.stagger(180, {start: 150}),
    easing: 'easeOutExpo',
    duration: 700
  });
}

export function animateSkillRings(){
  if(!window.anime) return;
  const rings = $$('.ring-progress');
  rings.forEach(r => {
    if(r.dataset.animated === '1') return;
    r.dataset.animated = '1';

    const percent = Number(r.dataset.percent || '0');
    const radius = 23;
    const circumference = 2 * Math.PI * radius;

    r.setAttribute('stroke-dasharray', String(circumference));
    r.setAttribute('stroke-dashoffset', String(circumference));

    anime({
      targets: r,
      strokeDashoffset: [circumference, circumference * (1 - percent/100)],
      duration: 1200,
      easing: 'easeOutCubic'
    });
  });
}

export function initSkillBubbles(){
  if(!window.anime) return;
  anime({
    targets: '.skill-bubble',
    translateY: () => [anime.random(6, 12), 0],
    direction: 'alternate',
    loop: true,
    easing: 'easeInOutSine',
    duration: () => anime.random(1800, 2600),
    delay: anime.stagger(60)
  });

  const bubbles = $$('.skill-bubble');
  window.addEventListener('mousemove', (e) => {
    const mx = e.clientX, my = e.clientY;
    bubbles.forEach(b => {
      const rect = b.getBoundingClientRect();
      const cx = rect.left + rect.width/2;
      const cy = rect.top + rect.height/2;
      const dx = mx - cx;
      const dy = my - cy;
      const dist = Math.hypot(dx, dy);
      if(dist < 140){
        b.style.transform = `translate(${-(dx/18)}px, ${-(dy/18)}px)`;
      }else{
        b.style.transform = '';
      }
    });
  }, {passive:true});
}



export function animateProjectCard(card){
  if(!window.anime) return;
  if(card.dataset.animated === '1') return;
  card.dataset.animated = '1';

  anime({
    targets: card,
    translateY: [26, 0],
    rotate: [-1.6, 0],
    opacity: [0, 1],
    easing: 'easeOutBack',
    duration: 800
  });
}

export function initCTAButtonParticles(){
  const btn = $('#viewWorkBtn');
  if(!btn || !window.anime) return;

  btn.addEventListener('click', () => {
    if(btn.dataset.bursting === '1') return;
    btn.dataset.bursting = '1';

    const rect = btn.getBoundingClientRect();
    const count = 26;

    const layer = document.createElement('div');
    layer.className = 'btn-particles';
    layer.style.position = 'fixed';
    layer.style.left = `${rect.left}px`;
    layer.style.top = `${rect.top}px`;
    layer.style.width = `${rect.width}px`;
    layer.style.height = `${rect.height}px`;
    layer.style.zIndex = '200';

    document.body.appendChild(layer);

    const dots = [];
    for(let i=0;i<count;i++){
      const d = document.createElement('span');
      d.style.position = 'absolute';
      d.style.left = `${rect.width/2}px`;
      d.style.top = `${rect.height/2}px`;
      d.style.width = '6px';
      d.style.height = '6px';
      d.style.borderRadius = '50%';
      d.style.background = i%3===0 ? 'var(--green)' : (i%3===1 ? 'var(--pink)' : 'var(--text)');
      d.style.opacity = '0.95';
      layer.appendChild(d);
      dots.push(d);
    }

    anime.timeline({
      complete: () => {
        layer.remove();
        btn.dataset.bursting = '0';
        const target = document.querySelector(btn.getAttribute('href') || '#projects');
        target?.scrollIntoView({behavior:'smooth'});
      }
    })
    .add({
      targets: btn,
      scaleX: [1, .92],
      scaleY: [1, .92],
      duration: 120,
      easing: 'easeOutQuad'
    })
    .add({
      targets: dots,
      translateX: () => anime.random(-90, 90),
      translateY: () => anime.random(-70, 70),
      scale: [1, 0],
      opacity: [1, 0],
      delay: anime.stagger(12),
      duration: 520,
      easing: 'easeOutExpo'
    }, '-=80')
    .add({
      targets: btn,
      scaleX: [.92, 1],
      scaleY: [.92, 1],
      duration: 320,
      easing: 'easeOutBack'
    }, '-=260');
  });
}
