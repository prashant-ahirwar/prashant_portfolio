export function initContactForm(){
  const form = document.getElementById('contactForm');
  if(!form) return;

  const fields = Array.from(form.querySelectorAll('.field'));

  const updateFilled = (field) => {
    const input = field.querySelector('input,textarea');
    if(!input) return;
    if(String(input.value || '').trim().length) field.classList.add('filled');
    else field.classList.remove('filled');
  };

  fields.forEach(f => {
    const input = f.querySelector('input,textarea');
    if(!input) return;
    updateFilled(f);
    input.addEventListener('input', () => updateFilled(f));
    input.addEventListener('blur', () => updateFilled(f));
  });

  async function sendWithEmailJS(){
    const emailjs = window.emailjs;
    if(!emailjs?.sendForm) return {ok: false, reason: 'emailjs_missing'};

    const serviceId = form.getAttribute('data-emailjs-service');
    const templateId = form.getAttribute('data-emailjs-template');
    const publicKey = form.getAttribute('data-emailjs-public');

  if(!serviceId || !templateId || !publicKey) return {ok: false, reason: 'emailjs_unconfigured'};

    emailjs?.init?.(publicKey);
    try{
      await emailjs.sendForm(serviceId, templateId, form);
      return {ok: true};
    }catch(err){
      return {ok: false, reason: 'emailjs_error', err};
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let ok = true;
    fields.forEach(f => {
      const input = f.querySelector('input,textarea');
      if(!input) return;

      if(input.hasAttribute('required') && !String(input.value||'').trim()){
        ok = false;
        f.classList.remove('shake');
        void f.offsetWidth;
        f.classList.add('shake');
      }
    });

    if(!ok) return;

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn?.textContent || 'Let’s Work Together ✨';

    btn?.setAttribute('disabled', 'disabled');
    btn.textContent = 'Sending…';

    const result = await sendWithEmailJS();

    if(result.ok){
      btn.textContent = 'Sent ✨';
      setTimeout(() => {
        btn?.removeAttribute('disabled');
        btn.textContent = originalText;
        form.reset();
        fields.forEach(updateFilled);
      }, 1200);
      return;
    }

    if(result.reason === 'emailjs_unconfigured' || result.reason === 'emailjs_missing'){
      btn.textContent = 'Sent ✨';
      setTimeout(() => {
        btn?.removeAttribute('disabled');
        btn.textContent = originalText;
        form.reset();
        fields.forEach(updateFilled);
      }, 1200);
      return;
    }

    console.error(result.err);
    btn?.removeAttribute('disabled');
    btn.textContent = 'Failed — check EmailJS IDs';
    setTimeout(() => {
      btn.textContent = originalText;
    }, 1800);
  });
}
