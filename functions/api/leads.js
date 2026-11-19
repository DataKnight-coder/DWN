import { cleanLead, json, limitRequest, saveLead } from '../../server/crm.mjs';
import { sendServiceEmail } from '../../server/email.mjs';

export async function onRequestPost({ request, env, waitUntil }) {
  if (!env.DB || !env.RATE_LIMIT_SALT) return json({ error: 'Lead intake is temporarily unavailable.' }, 503);
  const url = new URL(request.url);
  if (request.headers.get('Origin') !== url.origin) return json({ error: 'Invalid request origin.' }, 403);
  if (!request.headers.get('Content-Type')?.startsWith('application/json')) return json({ error: 'JSON required.' }, 415);
  const body = await request.text();
  if (body.length > 8192) return json({ error: 'Submission too large.' }, 413);
  let input;
  try { input = JSON.parse(body); } catch { return json({ error: 'Invalid JSON.' }, 400); }
  if (input.website) return json({ ok: true }); // Honeypot: no contact is stored.
  let lead;
  try { lead = cleanLead(input); } catch (error) { return json({ error: error.message }, 400); }
  if (env.TURNSTILE_SECRET) {
    const token = String(input.turnstileToken || '');
    if (!token) return json({ error: 'Complete the security check.' }, 400);
    const check = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST', body: new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: token }),
    });
    const result = await check.json();
    if (!result.success || result.hostname !== url.hostname) return json({ error: 'Security check failed. Please retry.' }, 403);
  }
  try {
    if (!await limitRequest(env.DB, request, env.RATE_LIMIT_SALT)) return json({ error: 'Please try again later.' }, 429);
    const result = await saveLead(env.DB, lead);
    // Service email (guide delivery / enquiry acknowledgement). Off unless explicitly enabled; never blocks the response.
    if (!result.duplicate) {
      const sending = sendServiceEmail(env, lead);
      if (typeof waitUntil === 'function') waitUntil(sending);
    }
    return json({ ok: true, duplicate: result.duplicate }, 201);
  } catch (error) {
    console.error('Lead persistence failed', error);
    return json({ error: 'Your details could not be saved. Please retry.' }, 503);
  }
}

export function onRequestGet() { return json({ error: 'Method not allowed.' }, 405); }
