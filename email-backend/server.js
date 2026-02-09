const express = require('express');
const cors = require('cors');
require('dotenv').config();

const emailjs = require('@emailjs/nodejs');

const app = express();

const PORT = Number(process.env.PORT || 5000);
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || '*';

app.use(express.json({ limit: '32kb' }));

app.use(
  cors({
    origin: FRONTEND_ORIGIN === '*' ? '*' : FRONTEND_ORIGIN.split(',').map(s => s.trim()).filter(Boolean),
    methods: ['POST'],
  })
);

function isValidEmail(value) {
  if (typeof value !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

app.post('/send-email', async (req, res) => {
  try {
    const { name, email, message } = req.body || {};

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ success: false, error: 'name_required' });
    }

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ success: false, error: 'email_invalid' });
    }

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ success: false, error: 'message_required' });
    }

    const serviceId = process.env.EMAILJS_SERVICE_ID;
    const templateId = process.env.EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.EMAILJS_PUBLIC_KEY;
    const privateKey = process.env.EMAILJS_PRIVATE_KEY;

    if (!serviceId || !templateId || !publicKey || !privateKey) {
      return res.status(500).json({ success: false, error: 'server_emailjs_unconfigured' });
    }

    const templateParams = {
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    };

    await emailjs.send(serviceId, templateId, templateParams, {
      publicKey,
      privateKey,
    });

    return res.json({ success: true });
  } catch (err) {
    const status = typeof err?.status === 'number' ? err.status : 500;
    const message = typeof err?.text === 'string' ? err.text : 'email_send_failed';
    return res.status(status).json({ success: false, error: message });
  }
});

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Email backend listening on http://localhost:${PORT}`);
});
