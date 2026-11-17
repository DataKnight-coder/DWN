import { authorize } from '../../../../server/access.mjs';
import { json } from '../../../../server/crm.mjs';

const stages = new Set(['new_lead','qualified','booked','completed','proposal','won','lost']);

export async function onRequestPatch(context) {
  const auth = await authorize(context);
  if (auth.response) return auth.response;
  let input;
  try { input = await context.request.json(); } catch { return json({ error: 'Invalid JSON.' }, 400); }
  if (!stages.has(input.stage)) return json({ error: 'Invalid stage.' }, 400);
  const existing = await context.env.DB.prepare('SELECT id FROM consultations WHERE id=?').bind(context.params.id).first();
  if (!existing) return json({ error: 'Not found.' }, 404);
  let amount = null, currency = null, evidence = null;
  if (input.stage === 'won') {
    amount = Number(input.confirmedRevenueMinor);
    currency = String(input.currency || '').toUpperCase();
    evidence = String(input.revenueEvidence || '').trim();
    if (!Number.isSafeInteger(amount) || amount < 0 || !/^[A-Z]{3}$/.test(currency) || !evidence || evidence.length > 250)
      return json({ error: 'Won stage needs a confirmed amount, currency, and evidence reference.' }, 400);
  }
  await context.env.DB.batch([
    context.env.DB.prepare(`UPDATE consultations SET stage=?,confirmed_revenue_minor=?,currency=?,revenue_evidence=?,updated_at=? WHERE id=?`)
      .bind(input.stage, amount, currency, evidence, new Date().toISOString(), context.params.id),
    context.env.DB.prepare('INSERT INTO audit_log(id,actor,action,target_type,target_id) VALUES(?,?,?,?,?)')
      .bind(crypto.randomUUID(), auth.actor.email, `consultation_${input.stage}`, 'consultation', context.params.id),
  ]);
  return json({ id: context.params.id, stage: input.stage });
}
