// Transactional service emails through Resend.
// Safety: sends nothing unless EMAIL_SENDING_ENABLED === 'true' AND RESEND_API_KEY is set.
// Only service messages (guide delivery, enquiry acknowledgements). No marketing content is sent here.

const DEFAULT_FROM = 'Dr. Hauwa | Diaspora Wealth Network <hello@mail.drhauwaphd.ca>';
const DEFAULT_REPLY_TO = 'hello@drhauwaphd.ca';
const SITE = 'https://drhauwaphd.ca';

const GUIDE_URL = 'https://selfany.com/ABNVUFTKMG';
const DWN_URL = 'https://selfany.com/thedwn';
const SESSION_URL = 'https://selfany.com/oneononewithdrhauwa';

// Which lead sources get which service email. Newsletter and quiz signups get none.
export const templateBySource = {
  free_guide_popup: 'free_guide_delivery',
  ai_training: 'ai_training_ack',
  consultation: 'consultation_ack',
  community: 'community_ack',
};

const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const content = {
  free_guide_delivery: name => ({
    subject: 'Your free guide: How to Make Money Online',
    heading: 'Your free guide is ready',
    paragraphs: [`Hi ${name},`, 'Thank you for requesting the free beginner guide, How to Make Money Online. You can open it using the button below.'],
    cta: { label: 'Open the free guide', url: GUIDE_URL },
    note: 'If the button does not work, reply to this email and we will help.',
  }),
  ai_training_ack: name => ({
    subject: 'We received your AI Training enquiry',
    heading: 'Thank you for your AI Training enquiry',
    paragraphs: [`Hi ${name},`,
      'We received your enquiry about practical AI training and will respond personally. Curriculum, dates, pricing and registration details are not published yet, so we will share them directly once they are confirmed.',
      'In the meantime, the free guide is a good place to begin.'],
    cta: { label: 'Open the free guide', url: GUIDE_URL },
  }),
  consultation_ack: name => ({
    subject: 'We received your consultation request',
    heading: 'We received your request',
    paragraphs: [`Hi ${name},`,
      'Thank you for your request. A one-on-one strategy session offers personalized guidance to identify opportunities and develop an actionable growth strategy. You can book a session using the button below.'],
    cta: { label: 'Book a Strategy Session', url: SESSION_URL },
    note: 'If you have questions first, reply to this email.',
  }),
  community_ack: name => ({
    subject: 'Thanks for your interest in the Diaspora Wealth Network',
    heading: 'Thanks for your interest in DWN',
    paragraphs: [`Hi ${name},`,
      'Thanks for getting in touch. The Diaspora Wealth Network offers community education, mentorship and exploration of 18 income pathways. You can read the details and join using the button below.'],
    cta: { label: 'Become a DWN Member', url: DWN_URL },
    note: 'If you have questions, reply to this email.',
  }),
};

export function renderEmail(template, firstName) {
  const build = content[template];
  if (!build) throw new Error(`Unknown email template: ${template}`);
  const name = esc((firstName || '').trim() || 'there');
  const c = build(name);
  const plain = s => s.replace(/&amp;/g, '&');
  const html = `<!doctype html><html lang="en-CA"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(c.subject)}</title></head>
<body style="margin:0;padding:0;background:#F4F1EA;font-family:-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;color:#091A16;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#F4F1EA;"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;">
<tr><td style="background:#0E3328;padding:20px 28px;color:#F4F1EA;font-size:18px;font-weight:800;letter-spacing:.5px;">DR. HAUWA <span style="color:#D4F670;">|</span> Diaspora Wealth Network</td></tr>
<tr><td style="padding:32px 28px 8px;"><h1 style="margin:0 0 16px;font-size:24px;line-height:1.25;color:#0E3328;">${esc(c.heading)}</h1>
${c.paragraphs.map(p => `<p style="margin:0 0 14px;font-size:16px;line-height:1.6;">${p}</p>`).join('\n')}</td></tr>
<tr><td style="padding:8px 28px 24px;"><a href="${esc(c.cta.url)}" style="display:inline-block;background:#D4F670;color:#0E3328;font-weight:700;font-size:16px;text-decoration:none;padding:14px 28px;border-radius:999px;">${esc(c.cta.label)}</a>
${c.note ? `<p style="margin:18px 0 0;font-size:14px;line-height:1.5;color:#3b4a43;">${esc(c.note)}</p>` : ''}</td></tr>
<tr><td style="padding:18px 28px 26px;border-top:1px solid #e6e2d8;font-size:12px;line-height:1.5;color:#5b6a63;">You received this message because you submitted a request on <a href="${SITE}" style="color:#0E3328;">drhauwaphd.ca</a>. This is a service email about your request, not a marketing email. Reply to this message if you need help.</td></tr>
</table></td></tr></table></body></html>`;
  const text = [plain(c.paragraphs.join('\n\n')), `${c.cta.label}: ${c.cta.url}`, c.note || '',
    `You received this message because you submitted a request on ${SITE}. This is a service email about your request, not a marketing email.`]
    .filter(Boolean).join('\n\n');
  return { subject: c.subject, html, text };
}

export function emailState(env) {
  if (!env.RESEND_API_KEY) return 'not_connected';
  if (env.EMAIL_SENDING_ENABLED !== 'true') return 'connected_sending_disabled';
  return String(env.EMAIL_TEST_ALLOWLIST || '').trim() ? 'enabled_test_allowlist_only' : 'enabled';
}

async function record(db, entry) {
  await db.prepare(`INSERT OR IGNORE INTO email_log(id,contact_id,template,status,provider_id,error,request_id,created_at)
    VALUES(?,?,?,?,?,?,?,?)`).bind(crypto.randomUUID(), entry.contactId, entry.template, entry.status,
    entry.providerId || null, entry.error || null, entry.requestId, new Date().toISOString()).run();
}

// Never throws: email trouble must never affect lead capture.
export async function sendServiceEmail(env, lead, fetchImpl = fetch) {
  try {
    const template = templateBySource[lead.source];
    if (!template || !env.DB) return { status: 'none' };
    const contact = await env.DB.prepare('SELECT id FROM contacts WHERE email=?').bind(lead.email).first();
    if (!contact) return { status: 'none' };
    const base = { contactId: contact.id, template, requestId: lead.requestId };
    if (env.EMAIL_SENDING_ENABLED !== 'true' || !env.RESEND_API_KEY) {
      await record(env.DB, { ...base, status: 'skipped_disabled' });
      return { status: 'skipped_disabled' };
    }
    // Controlled-test mode: while EMAIL_TEST_ALLOWLIST is set, only those addresses are ever emailed.
    const allowlist = String(env.EMAIL_TEST_ALLOWLIST || '').toLowerCase().split(',').map(item => item.trim()).filter(Boolean);
    if (allowlist.length && !allowlist.includes(lead.email)) {
      await record(env.DB, { ...base, status: 'skipped_disabled', error: 'not on test allowlist' });
      return { status: 'skipped_disabled' };
    }
    if (await env.DB.prepare('SELECT email FROM suppressions WHERE email=?').bind(lead.email).first()) {
      await record(env.DB, { ...base, status: 'skipped_suppressed' });
      return { status: 'skipped_suppressed' };
    }
    const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
    if (await env.DB.prepare(`SELECT id FROM email_log WHERE contact_id=? AND template=? AND status='sent' AND created_at>?`)
      .bind(contact.id, template, since).first()) {
      await record(env.DB, { ...base, status: 'skipped_recent' });
      return { status: 'skipped_recent' };
    }
    const message = renderEmail(template, lead.firstName);
    const response = await fetchImpl('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json',
        'Idempotency-Key': `${lead.requestId}:${template}` },
      body: JSON.stringify({ from: env.EMAIL_FROM || DEFAULT_FROM, to: [lead.email],
        reply_to: env.EMAIL_REPLY_TO || DEFAULT_REPLY_TO, subject: message.subject, html: message.html, text: message.text }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      await record(env.DB, { ...base, status: 'failed', error: String(result.message || response.status).slice(0, 200) });
      return { status: 'failed' };
    }
    await record(env.DB, { ...base, status: 'sent', providerId: result.id });
    return { status: 'sent' };
  } catch (error) {
    console.error('Service email failed', error?.message);
    return { status: 'failed' };
  }
}
