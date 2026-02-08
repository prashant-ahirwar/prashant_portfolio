import { $$ } from './utils.js';
import { animateOnScroll } from './animations.js';

export function initScrollAnimations(){
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
        animateOnScroll(entry.target);
      }
    });
  }, {threshold: 0.18});

  $$('.animate-on-scroll').forEach(el => observer.observe(el));
}
