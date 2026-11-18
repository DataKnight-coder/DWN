import { useEffect } from 'react';
import { currentAttribution } from '../utils/attribution';

type Destination = 'webinar' | 'membership' | 'whatsapp';

function destinationOf(anchor: HTMLAnchorElement): Destination | null {
  let url: URL;
  try { url = new URL(anchor.href); } catch { return null; }
  if (url.hostname === 'selfany.com' && url.pathname === '/w/DrHauwaPhD1') return 'webinar';
  if (url.hostname === 'selfany.com' && url.pathname === '/thedwn') return 'membership';
  if (url.hostname === 'wa.me') return 'whatsapp';
  return null;
}

export default function OutboundTracking() {
  useEffect(() => {
    // First-party click analytics follows the visitor's marketing-tracking choice.
    const handleClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement)?.closest<HTMLAnchorElement>('a[href]');
      if (!anchor) return;
      const destination = destinationOf(anchor);
      if (!destination) return;
      try { if (localStorage.getItem('dwn-marketing-tracking-consent-v1') !== 'accepted') return; }
      catch { return; }
      const attribution = currentAttribution();
      const payload = JSON.stringify({ id: crypto.randomUUID(), destination,
        placement: anchor.dataset.cta || 'other', path: window.location.pathname,
        utm_source: attribution.utm_source, utm_medium: attribution.utm_medium,
        utm_campaign: attribution.utm_campaign });
      if (navigator.sendBeacon) navigator.sendBeacon('/api/outbound',new Blob([payload],{ type:'application/json' }));
      else fetch('/api/outbound',{ method:'POST',headers:{'Content-Type':'application/json'},body:payload,keepalive:true }).catch(() => {});
    };
    document.addEventListener('click',handleClick);
    return () => document.removeEventListener('click',handleClick);
  }, []);
  return null;
}
