// Tracking for static editorial and offer pages. The React homepage has its own listener.
const consentKey = 'dwn-marketing-tracking-consent-v1';
function choice() { try { return localStorage.getItem(consentKey); } catch { return null; } }
function showChoice() {
  if (document.querySelector('#static-tracking-choice')) return;
  const banner = document.createElement('div');
  banner.id = 'static-tracking-choice';
  banner.setAttribute('role', 'region');
  banner.setAttribute('aria-label', 'Marketing tracking choice');
  banner.className = 'static-consent';
  const metaNote = /^\d{8,20}$/.test(document.querySelector('meta[name="dwn-meta-pixel-id"]')?.content || '') ? ' Meta (Facebook and Instagram) may also receive page views and sign-up or offer-click events to measure advertising.' : '';
  banner.innerHTML = '<p>Allow optional website engagement and offer click tracking? Cloudflare may collect basic visit analytics separately.' + metaNote + ' Your choice does not affect access to the site.</p><div><button type="button" data-choice="accepted">Allow tracking</button><button type="button" data-choice="declined">Decline</button></div>';
  banner.addEventListener('click', event => {
    const value = event.target.closest('button[data-choice]')?.dataset.choice;
    if (!value) return;
    const prior = choice();
    try { localStorage.setItem(consentKey, value); } catch { /* Current page choice only. */ }
    banner.remove();
    window.dispatchEvent(new Event('dwn-tracking-choice'));
    if (prior === 'accepted' && value === 'declined') { location.reload(); return; }
  });
  document.body.appendChild(banner);
}
if (!choice()) showChoice();
document.addEventListener('click', event => {
  if (event.target.closest('[data-open-tracking-choice]')) { event.preventDefault(); showChoice(); return; }
  const anchor = event.target.closest('a[data-offer-id]');
  if (!anchor || choice() !== 'accepted') return;
  const offerId = anchor.dataset.offerId;
  const placement = anchor.dataset.cta || 'static_offer';
  if (!/^[a-z0-9-]{1,60}$/.test(offerId) || !/^[a-z0-9_-]{1,60}$/.test(placement)) return;
  const params = new URLSearchParams(location.search);
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign']) {
    if (params.get(key)) try { sessionStorage.setItem(`dwn-attribution:${key}`, params.get(key).slice(0, 100)); } catch { /* Continue without session attribution. */ }
  }
  const utm = key => { try { return (params.get(key) || sessionStorage.getItem(`dwn-attribution:${key}`) || '').slice(0, 100); } catch { return (params.get(key) || '').slice(0, 100); } };
  const payload = JSON.stringify({ id: crypto.randomUUID(), destination: offerId, offerId,
    placement, path: location.pathname, utm_source: utm('utm_source'),
    utm_medium: utm('utm_medium'), utm_campaign: utm('utm_campaign') });
  if (navigator.sendBeacon) navigator.sendBeacon('/api/outbound', new Blob([payload], { type: 'application/json' }));
  else fetch('/api/outbound', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload, keepalive: true }).catch(() => {});
  if (window.fbq) window.fbq('trackCustom', 'OfferClick', { offer_id: offerId, placement });
  if (window.gtag) window.gtag('event', 'offer_outbound_click', { offer_id: offerId, page_location: location.href, link_url: anchor.href });
});
