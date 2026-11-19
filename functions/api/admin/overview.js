import { authorize } from '../../../server/access.mjs';
import { json } from '../../../server/crm.mjs';
import { emailState } from '../../../server/email.mjs';

export async function onRequestGet(context) {
  const auth = await authorize(context);
  if (auth.response) return auth.response;
  const db = context.env.DB;
  try {
    const [contacts, leads, consultations, consultationRevenue, testimonials] = await Promise.all([
      db.prepare('SELECT COUNT(*) AS n FROM contacts').first(),
      db.prepare("SELECT COUNT(*) AS n FROM crm_events WHERE kind='lead_submitted'").first(),
      db.prepare('SELECT COUNT(*) AS n FROM consultations').first(),
      db.prepare(`SELECT currency,SUM(confirmed_revenue_minor) AS amount_minor FROM consultations
        WHERE stage='won' AND confirmed_revenue_minor IS NOT NULL AND revenue_evidence IS NOT NULL GROUP BY currency`).all(),
      db.prepare("SELECT status, COUNT(*) AS n FROM testimonials GROUP BY status").all(),
    ]);
    return json({ contacts: contacts.n, leadSubmissions: leads.n, consultations: consultations.n,
      confirmedConsultationRevenue: consultationRevenue.results,
      testimonials: testimonials.results,
      integrations: { selfany: 'external_links_only', ai: context.env.AI ? 'on_demand' : 'not_connected',
        resend: emailState(context.env), ga4: 'not_connected',
        searchConsole: 'not_connected', metaAds: 'not_connected', cloudflareAnalytics: 'not_connected' } });
  } catch (error) {
    console.error('Overview query failed', error);
    return json({ error: 'Overview unavailable.' }, 503);
  }
}
