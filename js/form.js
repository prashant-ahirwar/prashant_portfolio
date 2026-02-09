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

  async function sendViaBackend(){
    const endpoint = form.getAttribute('data-backend-url') || 'http://localhost:5000/send-email';

    const payload = {
      name: (form.elements?.namedItem?.('name')?.value || '').trim(),
      email: (form.elements?.namedItem?.('email')?.value || '').trim(),
      message: (form.elements?.namedItem?.('message')?.value || '').trim(),
    };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    let data;
    try{
      data = await res.json();
    }catch{
      data = null;
    }

    if(res.ok && data?.success) return {ok: true};

    const errMsg = data?.error || `http_${res.status}`;
    return {ok: false, reason: 'backend_error', err: errMsg};
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

    const result = await sendViaBackend();

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

    console.error(result.err);
    btn?.removeAttribute('disabled');
    btn.textContent = 'Failed — try again';
    setTimeout(() => {
      btn.textContent = originalText;
    }, 1800);
  });
}
