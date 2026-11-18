import { authorize } from '../../../../server/access.mjs';
import { json } from '../../../../server/crm.mjs';

const stages = new Set(['new','contacted','qualified','nurture','closed']);

export async function onRequestGet(context) {
  const auth = await authorize(context);
  if (auth.response) return auth.response;
  const db = context.env.DB;
  const contact = await db.prepare(`SELECT c.id,c.email,c.first_name,c.marketing_consent,c.consent_at,c.first_source,
    c.first_utm_source,c.first_utm_medium,c.first_utm_campaign,c.created_at,
    p.segment,p.score,p.stage,p.owner_email,p.next_action,p.updated_at AS profile_updated_at
    FROM contacts c LEFT JOIN lead_profiles p ON p.contact_id=c.id WHERE c.id=?`).bind(context.params.id).first();
  if (!contact) return json({ error: 'Contact not found.' }, 404);
  const [events,tasks,consultations] = await Promise.all([
    db.prepare(`SELECT id,kind,source,details_json,created_at FROM crm_events WHERE contact_id=?
      ORDER BY created_at DESC LIMIT 100`).bind(contact.id).all(),
    db.prepare(`SELECT id,title,due_at,status,created_at FROM followup_tasks WHERE contact_id=?
      ORDER BY status ASC,due_at ASC LIMIT 100`).bind(contact.id).all(),
    db.prepare(`SELECT id,stage,message,created_at FROM consultations WHERE contact_id=?
      ORDER BY created_at DESC LIMIT 50`).bind(contact.id).all(),
  ]);
  return json({ contact, events: events.results, tasks: tasks.results, consultations: consultations.results });
}

export async function onRequestPatch(context) {
  const auth = await authorize(context);
  if (auth.response) return auth.response;
  let input;
  try { input = await context.request.json(); } catch { return json({ error: 'Invalid JSON.' }, 400); }
  const stage = String(input?.stage || '');
  const owner = String(input?.ownerEmail || '').trim().toLowerCase();
  const nextAction = String(input?.nextAction || '').trim();
  if (!stages.has(stage) || (owner && (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(owner) || owner.length > 254)) || nextAction.length > 250)
    return json({ error: 'Invalid stage, owner, or next action.' }, 400);
  const exists = await context.env.DB.prepare('SELECT id FROM contacts WHERE id=?').bind(context.params.id).first();
  if (!exists) return json({ error: 'Contact not found.' }, 404);
  await context.env.DB.batch([
    context.env.DB.prepare(`INSERT INTO lead_profiles(contact_id,stage,owner_email,next_action,updated_at)
      VALUES(?,?,?,?,?) ON CONFLICT(contact_id) DO UPDATE SET stage=excluded.stage,
      owner_email=excluded.owner_email,next_action=excluded.next_action,updated_at=excluded.updated_at`)
      .bind(context.params.id, stage, owner || null, nextAction || null, new Date().toISOString()),
    context.env.DB.prepare(`INSERT INTO audit_log(id,actor,action,target_type,target_id)
      VALUES(?,?,'update_lead_profile','contact',?)`).bind(crypto.randomUUID(),auth.actor.email,context.params.id),
  ]);
  return json({ updated: true });
}
