import { authorize } from '../../../server/access.mjs';
import { json } from '../../../server/crm.mjs';

export async function onRequestGet(context) {
  const auth = await authorize(context);
  if (auth.response) return auth.response;
  const rows = await context.env.DB.prepare(`SELECT q.id,q.stage,q.message,q.confirmed_revenue_minor,q.currency,
    q.revenue_evidence,q.created_at,q.updated_at,c.email,c.first_name FROM consultations q
    JOIN contacts c ON c.id=q.contact_id ORDER BY q.updated_at DESC LIMIT 100`).all();
  return json({ consultations: rows.results });
}
