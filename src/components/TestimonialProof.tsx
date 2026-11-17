import React, { useEffect, useRef, useState } from 'react';
import { proofVariant, recordProofEvent, type ProofPlacement, type ProofVariant } from '../utils/testimonialExperiments';

const choices = { webinar: 'dwn-pdf-16', membership: 'dwn-pdf-13' };

export default function TestimonialProof({ placement }: { placement: ProofPlacement }) {
  const [variant, setVariant] = useState<ProofVariant | null>(null);
  const [item, setItem] = useState<{ id: string; quote: string; attribution: string } | null>(null);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => { setVariant(proofVariant(placement)); }, [placement]);
  useEffect(() => {
    fetch('/api/testimonials').then(response => response.ok ? response.json() : null)
      .then(data => setItem(data?.testimonials?.find((row: { id: string }) => row.id === choices[placement]) || null))
      .catch(() => setItem(null));
  }, [placement]);
  useEffect(() => {
    if (!variant || !item || !root.current) return;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        recordProofEvent(placement, variant, 'impression', variant === 'quote' ? item?.id : undefined);
        observer.disconnect();
      }
    }, { threshold: 0.5 });
    observer.observe(root.current);
    return () => observer.disconnect();
  }, [placement, variant, item?.id]);

  return <div ref={root} className="min-h-px max-w-2xl mx-auto mb-7" data-proof-placement={placement} data-proof-variant={variant || ''}>
    {variant === 'quote' && item && <blockquote className="rounded-2xl border border-accent/30 bg-ivory/10 p-5 text-left">
      <p className="text-base text-ivory">“{item.quote}”</p>
      <footer className="mt-2 text-sm text-accent">{item.attribution} · Member-reported experience</footer>
    </blockquote>}
  </div>;
}
