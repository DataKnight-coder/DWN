import React, { useEffect, useState } from 'react';

const consentKey = 'dwn-marketing-tracking-consent-v1';

function loadMetaPixel() {
  const win = window as any;
  if (win.fbq) return;
  const fbq: any = (...args: unknown[]) => {
    if (fbq.callMethod) fbq.callMethod.apply(fbq, args);
    else fbq.queue.push(args);
  };
  fbq.queue = [];
  fbq.loaded = true;
  fbq.version = '2.0';
  win.fbq = fbq;
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(script);
  fbq('init', '1140755995061186');
  fbq('track', 'PageView');
}

const TrackingConsent: React.FC = () => {
  const [choice, setChoice] = useState<string | null>(() => {
    try { return localStorage.getItem(consentKey); } catch { return null; }
  });
  useEffect(() => { if (choice === 'accepted') loadMetaPixel(); }, [choice]);
  const decide = (value: 'accepted' | 'declined') => {
    try { localStorage.setItem(consentKey, value); } catch { /* Choice still applies to this visit. */ }
    setChoice(value);
  };
  if (choice) return null;
  return <div role="region" aria-label="Marketing tracking choice" className="fixed bottom-4 left-4 right-4 z-[300] max-w-2xl mx-auto bg-dark text-ivory border border-ivory/20 shadow-2xl rounded-2xl p-5">
    <p className="text-sm mb-4">May we use marketing tracking to understand visits and enquiries? Your choice does not affect access to the site.</p>
    <div className="flex flex-wrap gap-3">
      <button type="button" onClick={() => decide('accepted')} className="bg-accent text-primary font-bold rounded-full px-5 py-2">Allow tracking</button>
      <button type="button" onClick={() => decide('declined')} className="border border-ivory/50 text-ivory font-bold rounded-full px-5 py-2">Decline</button>
    </div>
  </div>;
};

export default TrackingConsent;
