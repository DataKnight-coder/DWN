// Welcome email sequence (marketing). Sends ONLY to contacts who ticked the optional marketing box on the
// free-guide popup, only after that consent was recorded, and never to suppressed addresses.
// Email 2 is due 2 days after consent; email 3 is due 3 days after email 2 was sent; then it stops.
// Everything is OFF unless every guard below passes. See EMAIL_TEMPLATES.md.

const FROM_DEFAULT = 'Dr. Hauwa | Diaspora Wealth Network <hello@mail.drhauwaphd.ca>';
const REPLY_TO_DEFAULT = 'hello@drhauwaphd.ca';
const UNSUBSCRIBE_URL = 'https://drhauwaphd.ca/#unsubscribe';
const DAY = 86400000;
const BATCH = 25;
const MAX_FAILED_ATTEMPTS = 3;

const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Approved copy. Interest values are exactly what the popup stores.
const interestBlocks = {
  'AI': { text: 'Practical AI skills can support work, learning and business. Training details are still being finalised, so tell us what you want to learn and we will follow up.', label: 'Register your interest', url: 'https://drhauwaphd.ca/ai-training/' },
  'Digital Income': { text: 'The free Online Monetization Masterclass looks at practical ways to monetize skills online for diaspora professionals.', label: 'Secure Your Seat', url: 'https://selfany.com/w/DrHauwaPhD1' },
  'DWN Membership': { text: 'DWN is a community with mentorship and exploration of 18 income pathways.', label: 'Learn about DWN', url: 'https://selfany.com/thedwn' },
  'Cybersecurity': { text: 'Read our guide on getting into cybersecurity in Canada.', label: 'Read the article', url: 'https://drhauwaphd.ca/blog/cybersecurity-career-canada/' },
  'Real Estate': { text: 'A self-paced paid course on strategically reducing your housing costs. Educational only: the rules differ by country, and results vary.', label: 'Explore the Course', url: 'https://selfany.com/rentfree' },
  'Personal Mentorship': { text: 'A one-on-one session gives personalized guidance on opportunities and a growth strategy.', label: 'Book a Strategy Session', url: 'https://selfany.com/oneononewithdrhauwa' },
};
const fallbackBlock = interestBlocks['Digital Income'];

export function renderWelcome(template, { firstName, interest, postalAddress }) {
  const name = esc((firstName || '').trim() || 'there');
  let subject, heading, paragraphs, cta, extra = '';
  if (template === 'welcome_2') {
    const block = interestBlocks[interest] || fallbackBlock;
    subject = 'A practical next step after the guide';
    heading = 'A practical next step after the guide';
    paragraphs = [`Hi ${name},`,
      'Many people read a guide and are not sure what to do next. Start with one idea that fits the time and skills you have now, rather than trying everything at once.',
      esc(block.text)];
    cta = { label: block.label, url: block.url };
  } else if (template === 'welcome_3') {
    subject = 'Build with others, not alone';
    heading = 'Build with others, not alone';
    paragraphs = [`Hi ${name},`,
      'Progress is easier with people who understand your situation. The Diaspora Wealth Network is a community with education and mentorship, and it explores 18 income pathways. It is not a promise of any result; outcomes vary by person.'];
    cta = { label: 'Become a DWN Member', url: 'https://selfany.com/thedwn' };
    extra = 'If DWN is not right for you, the <a href="https://selfany.com/w/DrHauwaPhD1" style="color:#0E3328;">free masterclass</a> is a no-cost way to learn more.';
  } else throw new Error(`Unknown sequence template: ${template}`);
  const addr = esc(postalAddress);
  const footer = `You are receiving this because you asked for DWN news and offers when you requested the free guide at <a href="https://drhauwaphd.ca" style="color:#0E3328;">drhauwaphd.ca</a>.<br>${addr} · <a href="${UNSUBSCRIBE_URL}" style="color:#0E3328;">Unsubscribe</a>`;
  const html = `<!doctype html><html lang="en-CA"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background:#F4F1EA;font-family:-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;color:#091A16;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#F4F1EA;"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;">
<tr><td style="background:#0E3328;padding:20px 28px;color:#F4F1EA;font-size:18px;font-weight:800;letter-spacing:.5px;">DR. HAUWA <span style="color:#D4F670;">|</span> Diaspora Wealth Network</td></tr>
<tr><td style="padding:32px 28px 8px;"><h1 style="margin:0 0 16px;font-size:24px;line-height:1.25;color:#0E3328;">${esc(heading)}</h1>
${paragraphs.map(p => `<p style="margin:0 0 14px;font-size:16px;line-height:1.6;">${p}</p>`).join('\n')}</td></tr>
<tr><td style="padding:8px 28px 24px;"><a href="${esc(cta.url)}" style="display:inline-block;background:#D4F670;color:#0E3328;font-weight:700;font-size:16px;text-decoration:none;padding:14px 28px;border-radius:999px;">${esc(cta.label)}</a>
${extra ? `<p style="margin:18px 0 0;font-size:15px;line-height:1.5;color:#3b4a43;">${extra}</p>` : ''}
<p style="margin:18px 0 0;font-size:15px;color:#3b4a43;">Dr. Hauwa | Diaspora Wealth Network</p></td></tr>
<tr><td style="padding:18px 28px 26px;border-top:1px solid #e6e2d8;font-size:12px;line-height:1.6;color:#5b6a63;">${footer}</td></tr>
</table></td></tr></table></body></html>`;
  const plainParas = paragraphs.map(p => p.replace(/&amp;/g, '&').replace(/&#39;/g, "'")).join('\n\n');
  const text = [plainParas, `${cta.label}: ${cta.url}`,
    template === 'welcome_3' ? 'If DWN is not right for you, the free masterclass is a no-cost way to learn more: https://selfany.com/w/DrHauwaPhD1' : '',
    'Dr. Hauwa | Diaspora Wealth Network',
    `You are receiving this because you asked for DWN news and offers when you requested the free guide at drhauwaphd.ca.\n${postalAddress}\nUnsubscribe: ${UNSUBSCRIBE_URL}`].filter(Boolean).join('\n\n');
  return { subject, html, text };
}

export function sequenceState(env) {
  if (env.SEQUENCE_ENABLED !== 'true') return 'off';
  if (env.EMAIL_SENDING_ENABLED !== 'true' || !env.RESEND_API_KEY) return 'blocked_email_off';
  if (!String(env.EMAIL_POSTAL_ADDRESS || '').trim()) return 'blocked_no_postal_address';
  if (!Number.isFinite(Date.parse(env.SEQUENCE_SINCE || ''))) return 'blocked_no_start_date';
  return String(env.SEQUENCE_TEST_ALLOWLIST || '').trim() ? 'on_test_allowlist_only' : 'on';
}

const dueSql = (previous) => `
  SELECT c.id, c.email, c.first_name, c.consent_at,
    (SELECT json_extract(e.details_json,'$.interest') FROM crm_events e
       WHERE e.contact_id=c.id AND e.source='free_guide_popup' ORDER BY e.created_at DESC LIMIT 1) AS interest
  FROM contacts c
  WHERE c.marketing_consent=1 AND c.consent_source='free_guide_popup'
    AND c.consent_at>=? AND c.consent_at IS NOT NULL
    AND NOT EXISTS (SELECT 1 FROM suppressions s WHERE s.email=c.email)
    AND NOT EXISTS (SELECT 1 FROM email_log l WHERE l.contact_id=c.id AND l.template=? AND l.status='sent')
    AND (SELECT COUNT(*) FROM email_log l WHERE l.contact_id=c.id AND l.template=? AND l.status='failed')<${MAX_FAILED_ATTEMPTS}
    ${previous}
  ORDER BY c.consent_at LIMIT ${BATCH}`;

export async function runSequence(env, now = new Date(), fetchImpl = fetch) {
  const state = sequenceState(env);
  if (!state.startsWith('on')) return { state, sent: 0, failed: 0, skipped: 0 };
  const since = new Date(env.SEQUENCE_SINCE).toISOString();
  const allow = String(env.SEQUENCE_TEST_ALLOWLIST || '').toLowerCase().split(',').map(item => item.trim()).filter(Boolean);
  const totals = { state, sent: 0, failed: 0, skipped: 0 };
  const steps = [
    { template: 'welcome_2', sql: dueSql('AND c.consent_at<=?'), args: [since, 'welcome_2', 'welcome_2', new Date(now - 2 * DAY).toISOString()] },
    { template: 'welcome_3', sql: dueSql(`AND EXISTS (SELECT 1 FROM email_log p WHERE p.contact_id=c.id AND p.template='welcome_2' AND p.status='sent' AND p.created_at<=?)`),
      args: [since, 'welcome_3', 'welcome_3', new Date(now - 3 * DAY).toISOString()] },
  ];
  for (const step of steps) {
    const { results } = await env.DB.prepare(step.sql).bind(...step.args).all();
    for (const contact of results || []) {
      if (allow.length && !allow.includes(String(contact.email).toLowerCase())) { totals.skipped++; continue; }
      const requestId = `seq:${contact.id}:${step.template}`;
      try {
        const message = renderWelcome(step.template, { firstName: contact.first_name, interest: contact.interest, postalAddress: env.EMAIL_POSTAL_ADDRESS });
        const response = await fetchImpl('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': requestId },
          body: JSON.stringify({ from: env.EMAIL_FROM || FROM_DEFAULT, to: [contact.email], reply_to: env.EMAIL_REPLY_TO || REPLY_TO_DEFAULT,
            subject: message.subject, html: message.html, text: message.text,
            headers: { 'List-Unsubscribe': `<mailto:hello@drhauwaphd.ca?subject=Unsubscribe>, <${UNSUBSCRIBE_URL}>` } }),
        });
        const result = await response.json().catch(() => ({}));
        const ok = response.ok;
        await env.DB.prepare(`INSERT OR IGNORE INTO email_log(id,contact_id,template,status,provider_id,error,request_id,created_at)
          VALUES(?,?,?,?,?,?,?,?)`).bind(crypto.randomUUID(), contact.id, step.template, ok ? 'sent' : 'failed',
          ok ? result.id || null : null, ok ? null : String(result.message || response.status).slice(0, 200),
          ok ? requestId : `${requestId}:fail:${now.toISOString().slice(0, 13)}`, now.toISOString()).run();
        if (ok) totals.sent++; else totals.failed++;
      } catch (error) {
        console.error('Sequence send failed', error?.message);
        totals.failed++;
      }
    }
  }
  return totals;
}
