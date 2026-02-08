import { initScrollAnimations } from './scroll.js';
import {
  initNavbarAnimations,
  initHeroAnimations,
  initCTAButtonParticles,
  initTimelineObserver,
  animateSkillRings,
  initSkillBubbles,
} from './animations.js';
import { initParticlesBackground, initParticleNameCanvas } from './particles.js';
import { initSkillFloatingIcons } from './skills.js';
import { initTaglineWords, initTimelineLineStyle, initProjectToggles } from './dom.js';
import { initContactForm } from './form.js';

document.addEventListener('DOMContentLoaded', () => {
  initTaglineWords();
  initTimelineLineStyle();

  initParticlesBackground();

  initNavbarAnimations();
  initHeroAnimations();
  initCTAButtonParticles();

  initScrollAnimations();
  initTimelineObserver();

  animateSkillRings();
  initSkillBubbles();
  initSkillFloatingIcons();

  initParticleNameCanvas();
  initContactForm();
  initProjectToggles();
});
