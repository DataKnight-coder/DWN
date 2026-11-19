import { useEffect } from 'react';
import { currentAttribution } from '../utils/attribution';
import offers from '../../content/offers.json';

function destinationOf(anchor: HTMLAnchorElement): { destination: string; offerId: string } | null {
  let url: URL;
  try { url = new URL(anchor.href); } catch { return null; }
  const matched = offers.find(offer => offer.url === url.href);
  if (matched) return { destination: matched.id, offerId: matched.id };
  if (url.hostname === 'wa.me') return { destination: 'whatsapp', offerId: '' };
  return null;
}

export default function OutboundTracking() {
  useEffect(() => {
    // First-party click analytics follows the visitor's marketing-tracking choice.
    const handleClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement)?.closest<HTMLAnchorElement>('a[href]');
      if (!anchor) return;
      const target = destinationOf(anchor);
      if (!target) return;
      try { if (localStorage.getItem('dwn-marketing-tracking-consent-v1') !== 'accepted') return; }
      catch { return; }
      const attribution = currentAttribution();
      const payload = JSON.stringify({ id: crypto.randomUUID(), destination: target.destination,
        offerId: target.offerId,
        placement: anchor.dataset.cta || 'other', path: window.location.pathname,
        utm_source: attribution.utm_source, utm_medium: attribution.utm_medium,
        utm_campaign: attribution.utm_campaign });
      if (navigator.sendBeacon) navigator.sendBeacon('/api/outbound',new Blob([payload],{ type:'application/json' }));
      else fetch('/api/outbound',{ method:'POST',headers:{'Content-Type':'application/json'},body:payload,keepalive:true }).catch(() => {});
      if (target.offerId && (window as any).fbq) (window as any).fbq('trackCustom', 'OfferClick', { offer_id: target.offerId, placement: anchor.dataset.cta || 'other' });
      if (target.offerId && (window as any).gtag) (window as any).gtag('event', 'offer_outbound_click', {
        offer_id: target.offerId, page_location: window.location.href, link_url: anchor.href });
    };
    document.addEventListener('click',handleClick);
    return () => document.removeEventListener('click',handleClick);
  }, []);
  return null;
}
