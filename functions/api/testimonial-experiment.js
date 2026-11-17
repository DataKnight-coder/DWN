import { json } from '../../server/crm.mjs';

const valid = { placement: new Set(['webinar', 'membership']), variant: new Set(['control', 'quote']),
  action: new Set(['impression', 'click']) };

export async function onRequestPost({ request, env }) {
  if (!env.DB) return json({ error: 'Tracking unavailable.' }, 503);
  const origin = request.headers.get('Origin');
  if (origin && new URL(origin).origin !== new URL(request.url).origin) return json({ error: 'Origin denied.' }, 403);
  if (Number(request.headers.get('Content-Length') || 0) > 2048) return json({ error: 'Too large.' }, 413);
  let input;
  try { input = await request.json(); } catch { return json({ error: 'Invalid JSON.' }, 400); }
  const { sessionId, placement, variant, action, testimonialId } = input || {};
  if (!/^[0-9a-f-]{36}$/i.test(String(sessionId)) || !valid.placement.has(placement) ||
      !valid.variant.has(variant) || !valid.action.has(action) ||
      (testimonialId && !/^dwn-pdf-\d{2}$/.test(testimonialId))) return json({ error: 'Invalid event.' }, 400);
  await env.DB.prepare(`INSERT INTO testimonial_experiment_events(id,session_id,variant,placement,action,testimonial_id)
    VALUES(?,?,?,?,?,?) ON CONFLICT(session_id,placement,action) DO NOTHING`)
    .bind(crypto.randomUUID(), sessionId, variant, placement, action, testimonialId || null).run();
  return json({ ok: true });
}
