import { authorize } from '../../../server/access.mjs';
import { json } from '../../../server/crm.mjs';

export async function onRequestGet(context) {
  const auth = await authorize(context);
  if (auth.response) return auth.response;
  const rows = await context.env.DB.prepare(`SELECT t.id,t.contact_id,t.title,t.due_at,t.status,t.created_at,
    c.email,c.first_name FROM followup_tasks t JOIN contacts c ON c.id=t.contact_id
    ORDER BY t.status ASC,t.due_at ASC,t.created_at DESC LIMIT 100`).all();
  return json({ tasks: rows.results });
}

export async function onRequestPost(context) {
  const auth = await authorize(context);
  if (auth.response) return auth.response;
  let input;
  try { input = await context.request.json(); } catch { return json({ error: 'Invalid JSON.' }, 400); }
  const contactId = String(input?.contactId || '');
  const title = String(input?.title || '').trim();
  const dueAt = String(input?.dueAt || '').trim();
  if (!/^[0-9a-f-]{36}$/i.test(contactId) || !title || title.length > 200 ||
    (dueAt && (Number.isNaN(Date.parse(dueAt)) || dueAt.length > 40)))
    return json({ error: 'Valid contact, title, and due time required.' }, 400);
  const contact = await context.env.DB.prepare('SELECT id FROM contacts WHERE id=?').bind(contactId).first();
  if (!contact) return json({ error: 'Contact not found.' }, 404);
  const id = crypto.randomUUID(), now = new Date().toISOString();
  await context.env.DB.batch([
    context.env.DB.prepare(`INSERT INTO followup_tasks(id,contact_id,title,due_at,created_at,updated_at)
      VALUES(?,?,?,?,?,?)`).bind(id,contactId,title,dueAt || null,now,now),
    context.env.DB.prepare(`INSERT INTO audit_log(id,actor,action,target_type,target_id)
      VALUES(?,?,'create_followup_task','task',?)`).bind(crypto.randomUUID(),auth.actor.email,id),
  ]);
  return json({ id, status: 'open' }, 201);
}
