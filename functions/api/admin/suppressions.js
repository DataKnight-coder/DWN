import { authorize } from '../../../server/access.mjs';
import { json } from '../../../server/crm.mjs';

export async function onRequestPost(context) {
  const auth = await authorize(context);
  if (auth.response) return auth.response;
  let input;
  try { input = await context.request.json(); } catch { return json({ error: 'Invalid JSON.' }, 400); }
  const email = String(input.email || '').trim().toLowerCase();
  const reason = String(input.reason || '').trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !reason || reason.length > 100)
    return json({ error: 'Valid email and reason required.' }, 400);
  await context.env.DB.batch([
    context.env.DB.prepare(`INSERT INTO suppressions(email,reason) VALUES(?,?)
      ON CONFLICT(email) DO UPDATE SET reason=excluded.reason`).bind(email, reason),
    context.env.DB.prepare('UPDATE contacts SET marketing_consent=0,updated_at=? WHERE email=?')
      .bind(new Date().toISOString(), email),
    context.env.DB.prepare('INSERT INTO audit_log(id,actor,action,target_type,target_id) VALUES(?,?,?,?,?)')
      .bind(crypto.randomUUID(), auth.actor.email, 'suppress_email', 'contact', email),
  ]);
  return json({ suppressed: true });
}
