import { authorize } from '../../../server/access.mjs';
import { json } from '../../../server/crm.mjs';

export async function onRequestGet(context) {
  const auth = await authorize(context);
  if (auth.response) return auth.response;
  const [outbound,leads,segments,tasks,popup] = await Promise.all([
    context.env.DB.prepare(`SELECT COALESCE(offer_id,destination) AS offer_id,placement,path,COUNT(*) AS clicks FROM outbound_events
      WHERE created_at >= datetime('now','-30 days') GROUP BY COALESCE(offer_id,destination),placement,path ORDER BY clicks DESC`).all(),
    context.env.DB.prepare(`SELECT source,COUNT(*) AS submissions FROM crm_events
      WHERE kind='lead_submitted' AND created_at >= datetime('now','-30 days')
      GROUP BY source ORDER BY submissions DESC`).all(),
    context.env.DB.prepare(`SELECT p.segment,p.stage,COUNT(*) AS contacts FROM lead_profiles p
      GROUP BY p.segment,p.stage ORDER BY contacts DESC`).all(),
    context.env.DB.prepare(`SELECT status,COUNT(*) AS tasks FROM followup_tasks GROUP BY status`).all(),
    context.env.DB.prepare(`SELECT kind,COUNT(*) AS count FROM engagement_events
      WHERE created_at >= datetime('now','-30 days') GROUP BY kind`).all(),
  ]);
  const impressions = Number(popup.results.find(row => row.kind === 'popup_impression')?.count || 0);
  const submissions = Number(popup.results.find(row => row.kind === 'popup_submission')?.count || 0);
  return json({ window: 'rolling 30 days', outboundClicks: outbound.results,
    leadSubmissions: leads.results, segments: segments.results, tasks: tasks.results,
    popup: { impressions, submissions, conversionRate: impressions ? submissions / impressions : null },
    note: 'Only consented popup impressions/submissions and outbound intent are counted. Popup rate is measured submissions divided by measured impressions, not all visitors. Clicks are not Selfany or Stan Store registrations or purchases.' });
}
