import { $$ } from './utils.js';

export function initTaglineWords(){
  const tagline = document.querySelector('.tagline');
  if(!tagline) return;

  const text = tagline.textContent?.trim() || '';
  tagline.textContent = '';

  text.split(' ').forEach((w) => {
    const span = document.createElement('span');
    span.className = 'word';
    span.textContent = w;
    tagline.appendChild(span);
  });
}

export function initTimelineLineStyle(){
  const style = document.createElement('style');
  style.textContent = `.timeline-line::after{height: var(--lineH, 0%);}`;
  document.head.appendChild(style);
}

export function initProjectToggles(){
  $$('.switch').forEach(sw => {
    sw.addEventListener('click', () => sw.classList.toggle('on'));
  });
}
