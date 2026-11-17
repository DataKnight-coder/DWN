import { json } from '../../server/crm.mjs';

export async function onRequestGet({ env }) {
  if (!env.DB) return json({ testimonials: [] });
  try {
    const rows = await env.DB.prepare(`SELECT id,quote,attribution,category FROM testimonials
      WHERE status='approved' AND consent_reference IS NOT NULL ORDER BY approved_at DESC LIMIT 50`).all();
    return json({ testimonials: rows.results });
  } catch (error) {
    console.error('Testimonials query failed', error);
    return json({ testimonials: [] });
  }
}
