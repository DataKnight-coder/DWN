export type ProofPlacement = 'webinar' | 'membership';
export type ProofVariant = 'control' | 'quote';

export function proofVariant(placement: ProofPlacement): ProofVariant {
  const key = `dwn-proof-variant-${placement}`;
  const saved = localStorage.getItem(key);
  if (saved === 'control' || saved === 'quote') return saved;
  const next = crypto.getRandomValues(new Uint8Array(1))[0] < 128 ? 'control' : 'quote';
  localStorage.setItem(key, next);
  return next;
}

export function recordProofEvent(placement: ProofPlacement, variant: ProofVariant,
  action: 'impression' | 'click', testimonialId?: string) {
  try { if (localStorage.getItem('dwn-marketing-tracking-consent-v1') !== 'accepted') return; }
  catch { return; }
  const sessionKey = 'dwn-proof-session';
  let sessionId = sessionStorage.getItem(sessionKey);
  if (!sessionId) { sessionId = crypto.randomUUID(); sessionStorage.setItem(sessionKey, sessionId); }
  const onceKey = `${sessionKey}:${placement}:${action}`;
  if (sessionStorage.getItem(onceKey)) return;
  sessionStorage.setItem(onceKey, '1');
  const payload = JSON.stringify({ sessionId, placement, variant, action, testimonialId });
  if (navigator.sendBeacon) navigator.sendBeacon('/api/testimonial-experiment', new Blob([payload], { type: 'application/json' }));
  else fetch('/api/testimonial-experiment', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload, keepalive: true }).catch(() => {});
}
