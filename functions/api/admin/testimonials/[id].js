import { authorize } from '../../../../server/access.mjs';
import { json } from '../../../../server/crm.mjs';

export async function onRequestPatch(context) {
  const auth = await authorize(context);
  if (auth.response) return auth.response;
  const id = context.params.id;
  let input;
  try { input = await context.request.json(); } catch { return json({ error: 'Invalid JSON.' }, 400); }
  if (!['approved', 'rejected', 'draft'].includes(input.status)) return json({ error: 'Invalid status.' }, 400);
  const existing = await context.env.DB.prepare('SELECT id,consent_reference,evidence_key,status FROM testimonials WHERE id=?').bind(id).first();
  if (!existing) return json({ error: 'Not found.' }, 404);
  if (input.status === 'approved' && (!existing.consent_reference || !existing.evidence_key))
    return json({ error: 'Publication requires consent and evidence references.' }, 400);
  const now = new Date().toISOString();
  await context.env.DB.batch([
    context.env.DB.prepare(`UPDATE testimonials SET status=?,approved_by=?,approved_at=? WHERE id=?`)
      .bind(input.status, input.status === 'approved' ? auth.actor.email : null,
        input.status === 'approved' ? now : null, id),
    context.env.DB.prepare('INSERT INTO audit_log(id,actor,action,target_type,target_id) VALUES(?,?,?,?,?)')
      .bind(crypto.randomUUID(), auth.actor.email, `testimonial_${input.status}`, 'testimonial', id),
  ]);
  return json({ id, status: input.status });
}
