import { authorize } from '../../../server/access.mjs';
import { json } from '../../../server/crm.mjs';

export async function onRequestGet(context) {
  const auth = await authorize(context);
  if (auth.response) return auth.response;
  const rows = await context.env.DB.prepare(`SELECT placement,variant,action,COUNT(*) AS total
    FROM testimonial_experiment_events WHERE created_at >= datetime('now','-30 days')
    GROUP BY placement,variant,action ORDER BY placement,variant,action`).all();
  const results = [];
  for (const placement of ['webinar', 'membership']) for (const variant of ['control', 'quote']) {
    const value = action => Number(rows.results.find(row => row.placement === placement && row.variant === variant && row.action === action)?.total || 0);
    const impressions = value('impression');
    const clicks = value('click');
    results.push({ placement, variant, impressions, clicks, clickRate: impressions ? clicks / impressions : null });
  }
  return json({ window: 'last 30 days', results });
}
