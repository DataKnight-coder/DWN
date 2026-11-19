import { json, limitRequest } from '../../server/crm.mjs';

const offers = new Set(['free-guide','dwn-membership','strategy-session','africa-waiting-room',
  'rent-free-blueprint','monetization-masterclass']);
const legacy = new Set(['webinar','membership','whatsapp']);

export async function onRequestPost({ request, env }) {
  if (!env.DB || !env.RATE_LIMIT_SALT) return json({ error: 'Tracking unavailable.' }, 503);
  const url = new URL(request.url);
  if (request.headers.get('Origin') !== url.origin) return json({ error: 'Invalid origin.' }, 403);
  if (!request.headers.get('Content-Type')?.startsWith('application/json')) return json({ error: 'JSON required.' }, 415);
  const body = await request.text();
  if (body.length > 2048) return json({ error: 'Event too large.' }, 413);
  let input;
  try { input = JSON.parse(body); } catch { return json({ error: 'Invalid JSON.' }, 400); }
  const id = String(input?.id || '');
  const destination = String(input?.destination || '');
  const offerId = String(input?.offerId || '');
  const placement = String(input?.placement || '');
  const path = String(input?.path || '');
  if (!/^[0-9a-f-]{36}$/i.test(id) || !(offers.has(destination) || legacy.has(destination)) ||
    (offers.has(destination) && offerId !== destination) ||
    (legacy.has(destination) && offerId) ||
    !/^[a-z0-9_-]{1,60}$/.test(placement) || !/^\/[a-z0-9_/-]{0,120}$/i.test(path))
    return json({ error: 'Invalid event.' }, 400);
  if (!await limitRequest(env.DB, request, `${env.RATE_LIMIT_SALT}:outbound`, 100))
    return json({ error: 'Rate limit reached.' }, 429);
  const utm = key => String(input?.[key] || '').trim().slice(0,100);
  await env.DB.prepare(`INSERT OR IGNORE INTO outbound_events
    (id,destination,offer_id,placement,path,utm_source,utm_medium,utm_campaign) VALUES(?,?,?,?,?,?,?,?)`)
    .bind(id,destination,offerId || null,placement,path,utm('utm_source'),utm('utm_medium'),utm('utm_campaign')).run();
  return json({ ok: true }, 201);
}
