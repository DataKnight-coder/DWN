import React, { useEffect, useState } from 'react';

const consentKey = 'dwn-marketing-tracking-consent-v1';

const TrackingConsent: React.FC = () => {
  const [choice, setChoice] = useState<string | null>(() => {
    try { return localStorage.getItem(consentKey); } catch { return null; }
  });
  useEffect(() => {
    const reopen = () => setChoice(null);
    window.addEventListener('dwn-open-tracking-choices', reopen);
    return () => window.removeEventListener('dwn-open-tracking-choices', reopen);
  }, []);
  const decide = (value: 'accepted' | 'declined') => {
    let prior: string | null = null;
    try { prior = localStorage.getItem(consentKey); } catch { /* Session-only choice. */ }
    try { localStorage.setItem(consentKey, value); } catch { /* Choice still applies to this visit. */ }
    if (prior === 'accepted' && value === 'declined') { window.location.reload(); return; }
    setChoice(value);
  };
  if (choice) return null;
  return <div role="region" aria-label="Marketing tracking choice" className="fixed bottom-4 left-4 right-4 z-[90] max-w-2xl mx-auto bg-dark text-ivory border border-ivory/20 shadow-2xl rounded-2xl p-5">
    <p className="text-sm mb-4">Allow optional website engagement and offer click tracking? Cloudflare may collect basic visit analytics separately. Your choice does not affect access to the site.</p>
    <div className="flex flex-wrap gap-3">
      <button type="button" onClick={() => decide('accepted')} className="bg-accent text-primary font-bold rounded-full px-5 py-2">Allow tracking</button>
      <button type="button" onClick={() => decide('declined')} className="border border-ivory/50 text-ivory font-bold rounded-full px-5 py-2">Decline</button>
    </div>
  </div>;
};

export default TrackingConsent;
