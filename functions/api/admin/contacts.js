import { authorize } from '../../../server/access.mjs';
import { json } from '../../../server/crm.mjs';

export async function onRequestGet(context) {
  const auth = await authorize(context);
  if (auth.response) return auth.response;
  const query = new URL(context.request.url).searchParams.get('q')?.trim().slice(0, 100) || '';
  const params = new URL(context.request.url).searchParams;
  const from = params.get('from') || '';
  const to = params.get('to') || '';
  const source = params.get('source') || '';
  const consent = params.get('consent') || '';
  const segment = params.get('segment') || '';
  const stage = params.get('stage') || '';
  const interest = params.get('interest') || '';
  if ((from && !/^\d{4}-\d\d-\d\d$/.test(from)) || (to && !/^\d{4}-\d\d-\d\d$/.test(to)) ||
      (consent && !['yes','no'].includes(consent)) || source.length > 50 ||
      segment.length > 50 || !/^[a-z_]*$/.test(segment) ||
      (stage && !['new','contacted','qualified','nurture','closed'].includes(stage)) ||
      (interest && !['Digital Income','AI','Cybersecurity','Real Estate','DWN Membership'].includes(interest)))
    return json({ error: 'Invalid filter.' }, 400);
  if ((from && Number.isNaN(Date.parse(`${from}T00:00:00Z`))) || (to && Number.isNaN(Date.parse(`${to}T00:00:00Z`))))
    return json({ error: 'Invalid date.' }, 400);
  const pattern = `%${query.replace(/[\\%_]/g, '\\$&')}%`;
  const end = to ? new Date(Date.parse(`${to}T00:00:00Z`) + 86400000).toISOString() : '9999';
  const rows = await context.env.DB.prepare(`SELECT c.id,c.email,c.first_name,c.marketing_consent,c.first_source,
    c.first_utm_source,c.first_utm_medium,c.first_utm_campaign,c.created_at,
    p.segment,p.score,p.stage,p.owner_email,p.next_action,
    (SELECT json_extract(e.details_json,'$.interest') FROM crm_events e WHERE e.contact_id=c.id
      AND e.kind='lead_submitted' ORDER BY e.created_at DESC LIMIT 1) AS last_interest,
    (SELECT COUNT(*) FROM crm_events e WHERE e.contact_id=c.id) AS event_count
    FROM contacts c LEFT JOIN lead_profiles p ON p.contact_id=c.id
    WHERE (c.email LIKE ? ESCAPE '\\' OR c.first_name LIKE ? ESCAPE '\\')
    AND c.created_at>=? AND c.created_at<? AND (?='' OR c.first_source=?)
    AND (?='' OR c.marketing_consent=?)
    AND (?='' OR p.segment=?) AND (?='' OR p.stage=?)
    AND (?='' OR EXISTS(SELECT 1 FROM crm_events e WHERE e.contact_id=c.id
      AND e.kind='lead_submitted' AND json_extract(e.details_json,'$.interest')=?))
    ORDER BY c.created_at DESC LIMIT 100`).bind(pattern, pattern, from ? `${from}T00:00:00.000Z` : '0000', end,
      source, source, consent, consent === 'yes' ? 1 : 0,
      segment, segment, stage, stage, interest, interest).all();
  return json({ contacts: rows.results, limit: 100 });
}
