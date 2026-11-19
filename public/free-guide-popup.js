// Shared free-guide invitation for the homepage and static editorial pages.
(() => {
  // Remember campaign tags from the landing URL for this browsing session, so a sign-up on a later page is still attributed to the ad.
  try {
    const landing = new URLSearchParams(location.search);
    for (const key of ['utm_source', 'utm_medium', 'utm_campaign']) {
      const value = (landing.get(key) || '').trim().slice(0, 100);
      if (value) sessionStorage.setItem(`dwn-attribution:${key}`, value);
    }
  } catch { /* Attribution is optional. */ }
  const guideUrl = 'https://selfany.com/ABNVUFTKMG';
  const conversionKey = 'dwn-free-guide-converted-v1';
  const dismissKey = 'dwn-free-guide-dismissed-v1';
  const trackingKey = 'dwn-marketing-tracking-consent-v1';
  const campaignKeys = ['utm_source', 'utm_medium', 'utm_campaign'];
  const mobile = matchMedia('(max-width: 767px)').matches;
  let root, expanded = false, opened = false, priorFocus, turnstileToken = '';
  let widgetId;

  const safeGet = (store, key) => { try { return store.getItem(key); } catch { return null; } };
  const safeSet = (store, key, value) => { try { store.setItem(key, value); } catch { /* Storage is optional. */ } };
  const uuid = () => crypto.randomUUID();
  const measured = kind => {
    if (safeGet(localStorage, trackingKey) !== 'accepted') return;
    const sessionId = safeGet(sessionStorage, 'dwn-free-guide-session-v1') || uuid();
    safeSet(sessionStorage, 'dwn-free-guide-session-v1', sessionId);
    fetch('/api/engagement', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: uuid(), sessionId, kind, surface: 'free_guide', path: location.pathname }),
      keepalive: true }).catch(() => {});
    if (window.gtag) window.gtag('event', kind, { page_location: location.href, lead_magnet: 'free-guide' });
  };
  const recentlyDismissed = () => { const at = Number(safeGet(localStorage, dismissKey)); return at > 0 && Date.now() - at < 7 * 86400000; };
  const close = () => {
    root?.remove(); root = null;
    safeSet(localStorage, dismissKey, String(Date.now()));
    if (widgetId !== undefined) try { window.turnstile?.remove(widgetId); } catch { /* Continue. */ }
    priorFocus?.focus();
  };
  const focusTrap = event => {
    if (!root || !expanded) return;
    if (event.key === 'Escape') { close(); return; }
    if (event.key !== 'Tab' || !mobile) return; // Desktop card is not modal: Tab moves freely through the page.
    const controls = [...root.querySelectorAll('button:not([disabled]),input:not([disabled]):not([tabindex="-1"]),select:not([disabled]),a[href]')];
    if (!controls.length) return;
    const first = controls[0], last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };
  document.addEventListener('keydown', focusTrap);
  const renderChallenge = async siteKey => {
    if (!siteKey) return;
    const host = root?.querySelector('#free-guide-turnstile');
    if (!host) return;
    if (!window.turnstile) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.onload = resolve; script.onerror = reject; document.head.appendChild(script);
      }).catch(() => {});
    }
    if (window.turnstile && root?.contains(host)) widgetId = window.turnstile.render(host, {
      sitekey: siteKey, callback: token => { turnstileToken = token; root.querySelector('[type="submit"]').disabled = false; },
      'expired-callback': () => { turnstileToken = ''; root.querySelector('[type="submit"]').disabled = true; },
    });
  };
  const formMarkup = siteKey => `<div class="dwn-guide-backdrop"><div class="dwn-guide-panel" role="dialog" aria-modal="${mobile}" aria-labelledby="dwn-guide-title"><button class="dwn-guide-close" type="button" aria-label="Close free guide form">✕</button><p class="dwn-guide-kicker">Free resource</p><h2 id="dwn-guide-title">How to Make Money Online</h2><p>Get the beginner guide and choose the opportunity you want to explore first.</p><form class="dwn-guide-form"><label>First name<input name="firstName" autocomplete="given-name" maxlength="80" required></label><label>Email<input name="email" type="email" autocomplete="email" required></label><label>Primary interest<select name="interest" required><option value="" selected disabled>Choose one</option><option>Digital Income</option><option>AI</option><option>Cybersecurity</option><option>Real Estate</option><option>DWN Membership</option><option>Personal Mentorship</option></select></label><label>Country <small>(optional)</small><input name="country" autocomplete="country-name" maxlength="80"></label><label class="dwn-guide-consent"><input name="consent" type="checkbox"><span>Send me DWN news and offers by email. I can unsubscribe at any time.</span></label><p class="dwn-guide-fine">We use your details to save this request and show your guide link. Marketing emails require the separate checkbox. Read our <a href="/privacy-policy/" target="_blank">privacy policy</a>.</p><input name="website" tabindex="-1" autocomplete="off" aria-hidden="true" class="dwn-guide-honeypot"><div id="free-guide-turnstile" role="group" aria-label="Security check"></div><button type="submit" ${siteKey ? 'disabled' : ''}>Get my free guide</button><p class="dwn-guide-status" role="status" aria-live="polite"></p></form></div></div>`;
  const expand = siteKey => {
    priorFocus = document.activeElement;
    expanded = true;
    root.innerHTML = formMarkup(siteKey);
    root.querySelector('.dwn-guide-close').addEventListener('click', close);
    root.querySelector('.dwn-guide-backdrop').addEventListener('mousedown', event => {
      if (event.target === event.currentTarget) close();
    });
    if (mobile) root.querySelector('.dwn-guide-close').focus(); // Never pull focus away from a reader on desktop.
    renderChallenge(siteKey);
    root.querySelector('form').addEventListener('submit', async event => {
      event.preventDefault();
      const form = event.currentTarget, data = new FormData(form);
      const button = form.querySelector('[type="submit"]'), status = form.querySelector('.dwn-guide-status');
      const email = String(data.get('email') || '').trim().toLowerCase();
      button.disabled = true; status.textContent = 'Saving your request…';
      const requestKey = `dwn-lead:free_guide_popup:${email}`;
      let requestId = uuid();
      try {
        const prior = JSON.parse(sessionStorage.getItem(requestKey) || 'null');
        if (prior && Date.now() - prior.at < 900000) requestId = prior.id;
        else safeSet(sessionStorage, requestKey, JSON.stringify({ id: requestId, at: Date.now() }));
      } catch { /* Continue without id reuse. */ }
      const params = new URLSearchParams(location.search), utm = {};
      for (const key of campaignKeys) {
        const value = (params.get(key) || safeGet(sessionStorage, `dwn-attribution:${key}`) || '').slice(0, 100);
        utm[key] = value;
        if (params.get(key)) safeSet(sessionStorage, `dwn-attribution:${key}`, value);
      }
      const payload = { requestId, source: 'free_guide_popup', email, firstName: String(data.get('firstName') || ''),
        interest: String(data.get('interest') || ''), country: String(data.get('country') || ''),
        landingPage: location.pathname, marketingConsent: data.get('consent') === 'on',
        website: String(data.get('website') || ''), turnstileToken, ...utm };
      try {
        const response = await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const result = await response.json().catch(() => ({}));
        if (!response.ok || !result.ok) throw new Error(result.error || 'Could not save your details. Please retry.');
        safeSet(localStorage, conversionKey, '1');
        measured('popup_submission');
        if (window.fbq) window.fbq('track', 'Lead', { content_name: 'Free Guide' });
        root.querySelector('.dwn-guide-panel').innerHTML = `<button class="dwn-guide-close" type="button" aria-label="Close free guide confirmation">✕</button><p class="dwn-guide-kicker">Saved</p><h2 id="dwn-guide-title">Your guide is ready.</h2><p>Open the free resource on Selfany. Your website enquiry has been saved.</p><a class="dwn-guide-delivery" href="${guideUrl}" data-offer-id="free-guide" data-cta="popup_delivery" target="_blank" rel="noreferrer">Open free guide ↗</a>`;
        root.querySelector('.dwn-guide-close').addEventListener('click', close);
        root.querySelector('.dwn-guide-close').focus();
      } catch (error) {
        status.textContent = error.message;
        button.disabled = Boolean(siteKey && !turnstileToken);
      }
    });
  };
  const open = siteKey => {
    if (safeGet(localStorage, trackingKey) === null) { setTimeout(() => open(siteKey), 3000); return; }
    if (opened) return;
    // Another dialog is open: wait and try again rather than losing this visit's one chance.
    if (document.querySelector('[role="dialog"]') || ['#contact','#join-dwn','#ai-training'].includes(location.hash)) { setTimeout(() => open(siteKey), 3000); return; }
    opened = true;
    root = document.createElement('div'); root.id = 'dwn-free-guide-popup';
    document.body.appendChild(root);
    if (mobile) {
      root.innerHTML = `<div class="dwn-guide-teaser" role="region" aria-label="Free guide invitation"><div><strong>Free online income guide</strong><p>Explore practical ways to get started.</p></div><button type="button" class="dwn-guide-teaser-close" aria-label="Dismiss free guide invitation">✕</button><button type="button" class="dwn-guide-teaser-open">Get the guide</button></div>`;
      root.querySelector('.dwn-guide-teaser-close').addEventListener('click', close);
      root.querySelector('.dwn-guide-teaser-open').addEventListener('click', () => expand(siteKey));
    } else expand(siteKey);
    measured('popup_impression');
  };
  fetch('/api/health', { cache: 'no-store' }).then(response => response.ok ? response.json() : null)
    .then(health => {
      const metaKey = document.querySelector('meta[name="dwn-turnstile-site-key"]')?.content || '';
      const siteKey = /^[A-Za-z0-9_-]{10,}$/.test(metaKey) ? metaKey : '';
      if (!health?.leadIntake || (health.turnstile && !siteKey) ||
          safeGet(localStorage, conversionKey) || recentlyDismissed()) return;
      let triggered = false;
      const trigger = () => {
        if (triggered) return;
        triggered = true;
        window.removeEventListener('scroll', onScroll);
        open(siteKey);
      };
      const onScroll = () => {
        const distance = document.documentElement.scrollHeight - innerHeight;
        if (distance > 0 && scrollY / distance >= 0.5) trigger();
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      if (!mobile) setTimeout(trigger, 8000);
    }).catch(() => {});
})();
