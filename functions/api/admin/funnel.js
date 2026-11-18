import { authorize } from '../../../server/access.mjs';
import { json } from '../../../server/crm.mjs';

export async function onRequestGet(context) {
  const auth = await authorize(context);
  if (auth.response) return auth.response;
  const [outbound,leads,segments,tasks] = await Promise.all([
    context.env.DB.prepare(`SELECT destination,placement,COUNT(*) AS clicks FROM outbound_events
      WHERE created_at >= datetime('now','-30 days') GROUP BY destination,placement ORDER BY clicks DESC`).all(),
    context.env.DB.prepare(`SELECT source,COUNT(*) AS submissions FROM crm_events
      WHERE kind='lead_submitted' AND created_at >= datetime('now','-30 days')
      GROUP BY source ORDER BY submissions DESC`).all(),
    context.env.DB.prepare(`SELECT p.segment,p.stage,COUNT(*) AS contacts FROM lead_profiles p
      GROUP BY p.segment,p.stage ORDER BY contacts DESC`).all(),
    context.env.DB.prepare(`SELECT status,COUNT(*) AS tasks FROM followup_tasks GROUP BY status`).all(),
  ]);
  return json({ window: 'rolling 30 days', outboundClicks: outbound.results,
    leadSubmissions: leads.results, segments: segments.results, tasks: tasks.results,
    note: 'Outbound clicks are not Selfany registrations or purchases; no visitor or sale attribution is inferred.' });
}
