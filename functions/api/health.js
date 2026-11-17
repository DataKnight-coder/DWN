import { json } from '../../server/crm.mjs';

export async function onRequestGet({ env }) {
  return json({ leadIntake: Boolean(env.DB && env.RATE_LIMIT_SALT), turnstile: Boolean(env.TURNSTILE_SECRET), testimonialImages: Boolean(env.TESTIMONIAL_IMAGES),
    selfany: 'not_connected', resend: 'not_connected' });
}
