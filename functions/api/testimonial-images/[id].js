import { json } from '../../../server/crm.mjs';
import { publicEvidenceIds } from '../../../server/testimonialEvidence.mjs';

export async function onRequestGet({ params, env }) {
  if (!env.DB || !env.TESTIMONIAL_IMAGES) return json({ error: 'Image unavailable.' }, 503);
  if (!publicEvidenceIds.has(params.id)) return json({ error: 'Not found.' }, 404);
  const row = await env.DB.prepare(`SELECT evidence_key FROM testimonials WHERE id=? AND status='approved'`)
    .bind(params.id).first();
  if (!row || !/^source\/page-\d{2}\.jpg$/.test(String(row.evidence_key))) return json({ error: 'Not found.' }, 404);
  const object = await env.TESTIMONIAL_IMAGES.get(row.evidence_key);
  if (!object) return json({ error: 'Not found.' }, 404);
  return new Response(object.body, { headers: { 'Content-Type': 'image/jpeg',
    'Cache-Control': 'public, max-age=3600', 'X-Content-Type-Options': 'nosniff' } });
}
