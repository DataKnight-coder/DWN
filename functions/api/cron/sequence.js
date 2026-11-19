import { json } from '../../../server/crm.mjs';
import { runSequence } from '../../../server/sequence.mjs';

// Called hourly by the dwn-cron worker. Does nothing unless every guard in sequenceState() passes.
function sameSecret(a, b) {
  if (!a || !b || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function onRequestPost({ request, env }) {
  if (!env.CRON_SECRET || !sameSecret(request.headers.get('X-Cron-Secret') || '', env.CRON_SECRET))
    return json({ error: 'Not allowed.' }, 403);
  if (!env.DB) return json({ error: 'Unavailable.' }, 503);
  try { return json({ ok: true, ...await runSequence(env) }); }
  catch (error) { console.error('Sequence run failed', error?.message); return json({ error: 'Run failed.' }, 500); }
}
export function onRequestGet() { return json({ error: 'Method not allowed.' }, 405); }
