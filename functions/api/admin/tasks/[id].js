import { authorize } from '../../../../server/access.mjs';
import { json } from '../../../../server/crm.mjs';

export async function onRequestPatch(context) {
  const auth = await authorize(context);
  if (auth.response) return auth.response;
  let input;
  try { input = await context.request.json(); } catch { return json({ error: 'Invalid JSON.' }, 400); }
  if (!['open','done'].includes(input?.status)) return json({ error: 'Invalid status.' }, 400);
  const task = await context.env.DB.prepare('SELECT id FROM followup_tasks WHERE id=?').bind(context.params.id).first();
  if (!task) return json({ error: 'Task not found.' }, 404);
  await context.env.DB.batch([
    context.env.DB.prepare('UPDATE followup_tasks SET status=?,updated_at=? WHERE id=?')
      .bind(input.status,new Date().toISOString(),context.params.id),
    context.env.DB.prepare(`INSERT INTO audit_log(id,actor,action,target_type,target_id)
      VALUES(?,?,'update_followup_task','task',?)`).bind(crypto.randomUUID(),auth.actor.email,context.params.id),
  ]);
  return json({ updated: true });
}
