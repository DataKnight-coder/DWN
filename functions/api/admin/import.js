import { authorize } from '../../../server/access.mjs';
import { json } from '../../../server/crm.mjs';

export async function onRequestPost(context) {
  const auth = await authorize(context);
  if (auth.response) return auth.response;
  return json({ error: 'Selfany imports are disabled. Sales remain in Selfany.' }, 410);
}
