import { createHash } from 'node:crypto';
import { applicationFields, validateApplication } from '../src/lib/productTesting.js';

const recipient = 'aarambh.community.team@gmail.com';
const maxBytes = 32768;
const retryMessage = 'We could not send your application. Your answers are still here. Please try again shortly.';

export function createProductTestingHandler({ env = process.env, fetcher = fetch, now = Date.now } = {}) {
  // Best-effort burst protection per warm function instance, bounded in time and size.
  // Vercel Firewall rate limits can provide a deployment-wide limit (see setup guide).
  const attempts = new Map();
  return async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    const respond = (status, data) => res.status(status).json(data);
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return respond(405, { message: 'Use POST to submit an application.' });
    }
    if (req.headers.origin) {
      try {
        if (new URL(req.headers.origin).host !== req.headers.host) throw new Error('Origin mismatch');
      } catch { return respond(403, { message: 'Please submit the form from the AARAMBH website.' }); }
    }
    if (!/^application\/json(?:\s*;|$)/i.test(req.headers['content-type'] || '')) return respond(415, { message: 'Send the form as JSON.' });
    if (Number(req.headers['content-length']) > maxBytes) return respond(413, { message: 'Your application is too long. Please shorten your answers.' });

    let body;
    try {
      const raw = typeof req.body === 'string' || Buffer.isBuffer(req.body) ? req.body.toString() : JSON.stringify(req.body);
      if (!raw || Buffer.byteLength(raw) > maxBytes) return respond(413, { message: 'Your application is too long or empty.' });
      body = JSON.parse(raw);
      if (!body || Array.isArray(body) || typeof body !== 'object') throw new Error('Invalid body');
    } catch { return respond(400, { message: 'We could not read this application. Please try again.' }); }

    const time = now();
    if (body.website !== '' || !Number.isFinite(body.startedAt) || body.startedAt <= 0 || time - body.startedAt < 1500) {
      return respond(400, { message: 'Please take a moment to review the form, then try again.' });
    }
    const ip = String(req.headers['x-vercel-forwarded-for'] || req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
    const ipKey = createHash('sha256').update(ip).digest('hex');
    for (const [key, entry] of attempts) if (entry.expires <= time) attempts.delete(key);
    const entry = attempts.get(ipKey) || { count: 0, expires: time + 10 * 60 * 1000 };
    if (entry.count >= 8) {
      res.setHeader('Retry-After', String(Math.ceil((entry.expires - time) / 1000)));
      return respond(429, { message: 'Too many attempts. Please wait 10 minutes before trying again. Your answers are still here.' });
    }
    if (attempts.size >= 2000 && !attempts.has(ipKey)) attempts.delete(attempts.keys().next().value);
    attempts.set(ipKey, { ...entry, count: entry.count + 1 });

    const { values, errors } = validateApplication(body.kind, body.fields);
    if (Object.keys(errors).length) return respond(422, { message: 'Please check the highlighted fields.', errors });

    const from = env.PRODUCT_TESTING_FROM?.trim();
    // Fail closed: never fall back to a personal Gmail address or Resend's test sender.
    if (!env.RESEND_API_KEY || !from || /[\r\n]/.test(from) || !/^[^<>]*<?[^\s<>@]+@(?:[a-z0-9-]+\.)*aarambh-community\.in>?$/i.test(from)) {
      return respond(503, { message: retryMessage });
    }
    const title = body.kind === 'student' ? 'Student Tester Application' : 'Startup Pilot Application';
    const name = body.kind === 'student' ? values.fullName : values.startupName;
    const email = {
      from,
      to: [recipient],
      reply_to: values.email,
      subject: `[AARAMBH] ${title} — ${name}`,
      text: `${title}\n\n${applicationFields[body.kind].map(field => `${field.label}:\n${values[field.name] || 'Not provided'}`).join('\n\n')}`,
    };
    // Stable across retries, including a lost network response. Resend deduplicates for 24h.
    const key = createHash('sha256').update(JSON.stringify(email)).digest('hex');
    try {
      const response = await fetcher('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': `product-testing/${key}` },
        body: JSON.stringify(email),
        signal: AbortSignal.timeout(10000),
      });
      const result = await response.json();
      if (!response.ok || typeof result?.id !== 'string' || !result.id.trim()) return respond(502, { message: retryMessage });
      return respond(200, { success: true });
    } catch { return respond(502, { message: retryMessage }); }
  };
}
