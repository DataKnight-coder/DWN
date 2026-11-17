import { authorize } from '../../../server/access.mjs';
import { json } from '../../../server/crm.mjs';

export async function onRequestGet(context) {
  const auth = await authorize(context);
  if (auth.response) return auth.response;
  const rows = await context.env.DB.prepare(`SELECT r.code,c.email AS owner_email,
    COUNT(DISTINCT CASE WHEN v.kind='lead_submitted' THEN v.id END) AS leads,
    COUNT(DISTINCT CASE WHEN v.kind='webinar_registration' THEN v.id END) AS registrations,
    COUNT(DISTINCT CASE WHEN v.kind='membership_purchase' THEN v.id END) AS purchases
    FROM referrals r JOIN contacts c ON c.id=r.owner_contact_id
    LEFT JOIN referral_conversions v ON v.code=r.code GROUP BY r.code,c.email ORDER BY leads DESC LIMIT 100`).all();
  return json({ referrals: rows.results });
}

export async function onRequestPost(context) {
  const auth = await authorize(context);
  if (auth.response) return auth.response;
  let input;
  try { input = await context.request.json(); } catch { return json({ error: 'Invalid JSON.' }, 400); }
  const email = String(input.ownerEmail || '').trim().toLowerCase();
  if (!email) return json({ error: 'Owner email required.' }, 400);
  const contact = await context.env.DB.prepare('SELECT id FROM contacts WHERE email=?').bind(email).first();
  if (!contact) return json({ error: 'Owner contact not found.' }, 404);
  const code = crypto.randomUUID().replace(/-/g, '').slice(0, 12).toUpperCase();
  await context.env.DB.batch([
    context.env.DB.prepare('INSERT INTO referrals(code,owner_contact_id) VALUES(?,?)').bind(code, contact.id),
    context.env.DB.prepare('INSERT INTO audit_log(id,actor,action,target_type,target_id) VALUES(?,?,?,?,?)')
      .bind(crypto.randomUUID(), auth.actor.email, 'create_referral_code', 'referral', code),
  ]);
  return json({ code, url: `https://drhauwaphd.ca/?ref=${code}` }, 201);
}
