import { accessActor } from '../../../server/access.mjs';
import { json } from '../../../server/crm.mjs';

export async function onRequestGet({ request, env }) {
  const actor = await accessActor(request, env);
  if (!actor) return json({ error: 'Access denied.' }, 403);
  return json(actor);
}
