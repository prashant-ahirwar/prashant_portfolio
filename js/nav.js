export function initMobileNav(){
  const header = document.querySelector('.navbar');
  const toggle = document.querySelector('.nav-toggle');
  const mobileNav = document.getElementById('mobileNav');
  const backdrop = header?.querySelector('.nav-backdrop');
  const closeBtn = header?.querySelector('.mobile-nav-close');

  if(!header || !toggle || !mobileNav || !backdrop || !closeBtn) return;

  function setOpen(open){
    header.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('no-scroll', open);
    backdrop.hidden = !open;
    mobileNav.hidden = !open;
  }

  setOpen(false);

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    setOpen(open);
  });

  backdrop.addEventListener('click', () => setOpen(false));

  closeBtn.addEventListener('click', () => setOpen(false));

  mobileNav.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => setOpen(false));
  });

  window.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') setOpen(false);
  });
}
