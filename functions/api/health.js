import { json } from '../../server/crm.mjs';
import { emailState } from '../../server/email.mjs';
import { sequenceState } from '../../server/sequence.mjs';

export async function onRequestGet({ env }) {
  return json({ leadIntake: Boolean(env.DB && env.RATE_LIMIT_SALT), turnstile: Boolean(env.TURNSTILE_SECRET), testimonialImages: Boolean(env.TESTIMONIAL_IMAGES),
    selfany: 'external_links_only', resend: emailState(env), welcomeSequence: sequenceState(env) });
}
