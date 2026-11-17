import { authorize } from '../../../server/access.mjs';
import { json } from '../../../server/crm.mjs';

export async function onRequestGet(context) {
  const auth = await authorize(context);
  if (auth.response) return auth.response;
  const [audit, automation] = await Promise.all([
    context.env.DB.prepare('SELECT actor,action,target_type,target_id,created_at FROM audit_log ORDER BY created_at DESC LIMIT 100').all(),
    context.env.DB.prepare('SELECT action,status,reference_id,message,created_at FROM automation_logs ORDER BY created_at DESC LIMIT 100').all(),
  ]);
  return json({ audit: audit.results, automation: automation.results });
}
