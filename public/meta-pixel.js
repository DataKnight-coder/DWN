// Meta Pixel loader. INERT by default: it does nothing unless the page carries
// <meta name="dwn-meta-pixel-id" content="..."> (written at build time from VITE_META_PIXEL_ID),
// and even then it loads only after the visitor chooses "Allow tracking".
(() => {
  const id = document.querySelector('meta[name="dwn-meta-pixel-id"]')?.content || '';
  if (!/^\d{8,20}$/.test(id)) return;
  const consentKey = 'dwn-marketing-tracking-consent-v1';
  const allowed = () => { try { return localStorage.getItem(consentKey) === 'accepted'; } catch { return false; } };
  let started = false;
  const start = () => {
    if (started || !allowed()) return;
    started = true;
    if (window.fbq) return;
    const fbq = window.fbq = function () { fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments); };
    if (!window._fbq) window._fbq = fbq;
    fbq.push = fbq; fbq.loaded = true; fbq.version = '2.0'; fbq.queue = [];
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.appendChild(script);
    // Data minimisation: no automatic form or button scraping, and no visitor details are sent.
    window.fbq('set', 'autoConfig', false, id);
    window.fbq('init', id);
    window.fbq('track', 'PageView');
  };
  start();
  window.addEventListener('dwn-tracking-choice', start);
  window.addEventListener('storage', event => { if (event.key === consentKey) start(); });
})();
