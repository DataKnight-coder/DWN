import { json } from '../../server/crm.mjs';
import { publicEvidenceIds } from '../../server/testimonialEvidence.mjs';

export async function onRequestGet({ env }) {
  if (!env.DB) return json({ testimonials: [] });
  try {
    const rows = await env.DB.prepare(`SELECT id,quote,attribution,category FROM testimonials
      WHERE status='approved' AND consent_reference IS NOT NULL ORDER BY approved_at DESC LIMIT 50`).all();
    return json({ testimonials: rows.results.map(row => ({ ...row, publicEvidence: publicEvidenceIds.has(row.id) })) });
  } catch (error) {
    console.error('Testimonials query failed', error);
    return json({ testimonials: [] });
  }
}
