import { currentAttribution } from './attribution';

export type LeadSource = 'community' | 'newsletter' | 'pathway_quiz' | 'consultation' | 'free_guide_popup' | 'ai_training';

export async function submitLead(input: {
  email: string;
  firstName?: string;
  source: LeadSource;
  marketingConsent: boolean;
  interest?: string;
  obstacle?: string;
  message?: string;
  country?: string;
  landingPage?: string;
  website?: string;
  turnstileToken?: string;
}) {
  const attribution = currentAttribution();
  const storageKey = `dwn-lead:${input.source}:${input.email.trim().toLowerCase()}`;
  let requestId = crypto.randomUUID();
  try {
    const prior = JSON.parse(sessionStorage.getItem(storageKey) || 'null');
    if (prior && Date.now() - prior.at < 15 * 60 * 1000) requestId = prior.id;
    else sessionStorage.setItem(storageKey, JSON.stringify({ id: requestId, at: Date.now() }));
  } catch { /* A blocked storage API does not block the submission. */ }
  const response = await fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...input,
      requestId,
      utm_source: attribution.utm_source,
      utm_medium: attribution.utm_medium,
      utm_campaign: attribution.utm_campaign,
      referralCode: attribution.ref,
    }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.ok) throw new Error(result.error || 'Could not save your details. Please try again.');
  return result;
}
