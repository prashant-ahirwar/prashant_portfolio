export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

export const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

export function splitTextToSpans(el, className = 'letter'){
  const text = el.textContent || '';
  el.textContent = '';
  const frag = document.createDocumentFragment();
  [...text].forEach(ch => {
    const span = document.createElement('span');
    span.className = className;
    span.textContent = ch === ' ' ? '\u00A0' : ch;
    frag.appendChild(span);
  });
  el.appendChild(frag);
}

export function inViewportOnce(el, cb){
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting){
        io.disconnect();
        cb();
      }
    });
  }, {threshold: 0.25});
  io.observe(el);
}
