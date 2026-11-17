import { authorize } from '../../../server/access.mjs';
import { json } from '../../../server/crm.mjs';

const categories = new Set(['Affiliate marketing','AI and remote work','Airbnb and real estate',
  'Digital business','Career development','Community support']);

export async function onRequestGet(context) {
  const auth = await authorize(context, 'reviewer');
  if (auth.response) return auth.response;
  const rows = await context.env.DB.prepare(`SELECT id,quote,attribution,category,evidence_key,consent_reference,status,approved_by,approved_at,created_at
    FROM testimonials ORDER BY created_at DESC LIMIT 100`).all();
  return json({ testimonials: rows.results });
}

export async function onRequestPost(context) {
  const auth = await authorize(context, 'reviewer');
  if (auth.response) return auth.response;
  let input;
  try { input = await context.request.json(); } catch { return json({ error: 'Invalid JSON.' }, 400); }
  const quote = String(input.quote || '').trim();
  const attribution = String(input.attribution || '').trim();
  const category = String(input.category || '');
  if (!quote || quote.length > 2000 || !attribution || attribution.length > 100 || !categories.has(category))
    return json({ error: 'Quote, attribution, and valid category are required.' }, 400);
  const id = crypto.randomUUID();
  await context.env.DB.prepare(`INSERT INTO testimonials(id,quote,attribution,category,evidence_key,consent_reference)
    VALUES(?,?,?,?,?,?)`).bind(id, quote, attribution, category,
      String(input.evidenceKey || '').trim() || null, String(input.consentReference || '').trim() || null).run();
  await context.env.DB.prepare('INSERT INTO audit_log(id,actor,action,target_type,target_id) VALUES(?,?,?,?,?)')
    .bind(crypto.randomUUID(), auth.actor.email, 'create_testimonial_draft', 'testimonial', id).run();
  return json({ id, status: 'draft' }, 201);
}
