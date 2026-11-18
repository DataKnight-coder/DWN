import { json, limitRequest } from '../../server/crm.mjs';

export async function onRequestPost({ request, env }) {
  if (!env.DB || !env.RATE_LIMIT_SALT || !env.TURNSTILE_SECRET)
    return json({ error: 'Unsubscribe is temporarily unavailable.' }, 503);
  const url = new URL(request.url);
  if (request.headers.get('Origin') !== url.origin) return json({ error: 'Invalid origin.' }, 403);
  if (!request.headers.get('Content-Type')?.startsWith('application/json')) return json({ error: 'JSON required.' }, 415);
  const body = await request.text();
  if (body.length > 2048) return json({ error: 'Submission too large.' }, 413);
  let input;
  try { input = JSON.parse(body); } catch { return json({ error: 'Invalid JSON.' }, 400); }
  const email = String(input?.email || '').trim().toLowerCase();
  const token = String(input?.turnstileToken || '');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254)
    return json({ error: 'Enter a valid email address.' }, 400);
  if (!token) return json({ error: 'Complete the security check.' }, 400);
  const check = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST', body: new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: token }),
  });
  if (!check.ok) return json({ error: 'Security check unavailable. Retry shortly.' }, 503);
  const result = await check.json();
  if (!result.success || result.hostname !== url.hostname)
    return json({ error: 'Security check failed. Please retry.' }, 403);
  if (!await limitRequest(env.DB, request, `${env.RATE_LIMIT_SALT}:unsubscribe`, 5))
    return json({ error: 'Please try again later.' }, 429);
  await env.DB.batch([
    env.DB.prepare(`INSERT INTO suppressions(email,reason) VALUES(?,'self-service unsubscribe')
      ON CONFLICT(email) DO UPDATE SET reason=excluded.reason`).bind(email),
    env.DB.prepare('UPDATE contacts SET marketing_consent=0,updated_at=? WHERE email=?')
      .bind(new Date().toISOString(),email),
  ]);
  return json({ ok: true });
}
