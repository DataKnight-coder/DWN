import { json, limitRequest } from '../../server/crm.mjs';

export async function onRequestPost({ request, env }) {
  if (!env.DB || !env.RATE_LIMIT_SALT) return json({ error: 'Tracking unavailable.' }, 503);
  const url = new URL(request.url);
  if (request.headers.get('Origin') !== url.origin) return json({ error: 'Invalid origin.' }, 403);
  if (!request.headers.get('Content-Type')?.startsWith('application/json')) return json({ error: 'JSON required.' }, 415);
  const raw = await request.text();
  if (raw.length > 1024) return json({ error: 'Event too large.' }, 413);
  let input;
  try { input = JSON.parse(raw); } catch { return json({ error: 'Invalid JSON.' }, 400); }
  if (!/^[0-9a-f-]{36}$/i.test(input?.id || '') ||
      !/^[0-9a-f-]{36}$/i.test(input?.sessionId || '') ||
      !['popup_impression','popup_submission'].includes(input?.kind) ||
      input?.surface !== 'free_guide' ||
      !/^\/[a-z0-9_/-]{0,120}$/i.test(input?.path || '')) return json({ error: 'Invalid event.' }, 400);
  if (!await limitRequest(env.DB, request, `${env.RATE_LIMIT_SALT}:engagement`, 30))
    return json({ error: 'Rate limit reached.' }, 429);
  await env.DB.prepare(`INSERT OR IGNORE INTO engagement_events(id,kind,surface,session_id,path)
    VALUES(?,?,?,?,?)`).bind(input.id,input.kind,input.surface,input.sessionId,input.path).run();
  return json({ ok: true }, 201);
}
