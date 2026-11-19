import test from 'node:test';
import assert from 'node:assert/strict';
import { cleanLead, classifyLead } from '../server/crm.mjs';
import { onRequestPost } from '../functions/api/leads.js';
import { DatabaseSync } from 'node:sqlite';
import { sendServiceEmail, renderEmail, emailState } from '../server/email.mjs';
import { readFileSync } from 'node:fs';
import { saveLead } from '../server/crm.mjs';
import { onRequestPost as postImport } from '../functions/api/admin/import.js';
import { onRequestGet as getOverview } from '../functions/api/admin/overview.js';
import { onRequestGet as getContacts } from '../functions/api/admin/contacts.js';
import { onRequestGet as getTestimonials } from '../functions/api/testimonials.js';
import { onRequestGet as getTestimonialImage } from '../functions/api/testimonial-images/[id].js';
import { onRequestPost as postTestimonialEvent } from '../functions/api/testimonial-experiment.js';
import { onRequestPost as postOutbound } from '../functions/api/outbound.js';
import { onRequestPost as postEngagement } from '../functions/api/engagement.js';
import { onRequestGet as getFunnel } from '../functions/api/admin/funnel.js';
import { onRequestGet as getContactDetail, onRequestPatch as patchContact } from '../functions/api/admin/contacts/[id].js';
import { onRequestGet as getTasks, onRequestPost as postTask } from '../functions/api/admin/tasks.js';
import { onRequestPost as postUnsubscribe } from '../functions/api/unsubscribe.js';
import { onRequestPost as postAiSuggestion } from '../functions/api/admin/ai-suggestion.js';

const requestId = '54ed12cb-8507-46f2-ad0d-a039144ce021';

test('lead validation normalizes identity and preserves explicit consent', () => {
  const lead = cleanLead({ email: '  Jane@Example.COM ', firstName: '  Jane  ', source: 'newsletter', requestId,
    marketingConsent: true, utm_source: 'campaign' });
  assert.equal(lead.email, 'jane@example.com');
  assert.equal(lead.firstName, 'Jane');
  assert.equal(lead.marketingConsent, true);
  assert.equal(lead.attribution.utm_source, 'campaign');
});

test('invalid email and unknown source are rejected', () => {
  assert.throws(() => cleanLead({ email: 'bad', source: 'newsletter', requestId }), /valid email/);
  assert.throws(() => cleanLead({ email: 'a@b.com', source: 'purchase', requestId }), /source/);
});

test('free guide and AI enquiries reuse CRM records and log consent per submission', async () => {
  const { sqlite, db } = database();
  assert.throws(() => cleanLead({ email: 'lead@example.com', firstName: 'Lee', source: 'free_guide_popup', requestId }), /primary interest/);
  const popup = cleanLead({ email: 'lead@example.com', firstName: 'Lee', source: 'free_guide_popup',
    requestId, interest: 'Digital Income', country: 'Canada', landingPage: '/', marketingConsent: false });
  await saveLead(db, popup);
  assert.equal(sqlite.prepare('SELECT marketing_consent FROM contacts').get().marketing_consent, 0);
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM followup_tasks').get().n, 0);
  const details = JSON.parse(sqlite.prepare("SELECT details_json FROM crm_events WHERE source='free_guide_popup'").get().details_json);
  assert.equal(details.interest, 'Digital Income');
  assert.equal(details.landingPage, '/');
  assert.equal(details.marketingConsent, false);
  const mentor = cleanLead({ email: 'mentor@example.com', firstName: 'Mo', source: 'free_guide_popup',
    requestId, interest: 'Personal Mentorship', marketingConsent: false });
  assert.equal(classifyLead(mentor).segment, 'consulting');
  const ai = cleanLead({ email: 'lead@example.com', firstName: 'Lee', source: 'ai_training',
    requestId: crypto.randomUUID(), interest: 'AI', message: 'I want to learn AI tools.', landingPage: '/ai-training/',
    marketingConsent: true });
  await saveLead(db, ai);
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM contacts').get().n, 1);
  assert.equal(sqlite.prepare('SELECT marketing_consent FROM contacts').get().marketing_consent, 1);
  assert.equal(sqlite.prepare('SELECT segment FROM lead_profiles').get().segment, 'ai_training');
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM followup_tasks').get().n, 1);
  sqlite.close();
});

test('popup measurements deduplicate a session and validate event kinds', async () => {
  const { sqlite, db } = database();
  const base = { id: crypto.randomUUID(), sessionId: crypto.randomUUID(), surface: 'free_guide',
    kind: 'popup_impression', path: '/' };
  const send = payload => postEngagement({ request: new Request('https://drhauwaphd.ca/api/engagement', {
    method: 'POST', headers: { Origin: 'https://drhauwaphd.ca', 'Content-Type': 'application/json' },
    body: JSON.stringify(payload) }), env: { DB: db, RATE_LIMIT_SALT: 'test' } });
  assert.equal((await send(base)).status, 201);
  assert.equal((await send({ ...base, id: crypto.randomUUID() })).status, 201);
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM engagement_events').get().n, 1);
  assert.equal((await send({ ...base, id: crypto.randomUUID(), kind: 'popup_submission' })).status, 201);
  assert.equal((await send({ ...base, id: crypto.randomUUID(), kind: 'purchase' })).status, 400);
  sqlite.close();
});

test('lead endpoint fails closed without a configured database', async () => {
  const request = new Request('https://drhauwaphd.ca/api/leads', { method: 'POST',
    headers: { Origin: 'https://drhauwaphd.ca', 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'jane@example.com', source: 'newsletter', requestId }) });
  const response = await onRequestPost({ request, env: {} });
  assert.equal(response.status, 503);
  assert.equal((await response.json()).error, 'Lead intake is temporarily unavailable.');
});

test('lead endpoint requires Turnstile token when challenge is configured', async () => {
  const request = new Request('https://drhauwaphd.ca/api/leads', { method: 'POST',
    headers: { Origin: 'https://drhauwaphd.ca', 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'jane@example.com', source: 'newsletter', requestId }) });
  const response = await onRequestPost({ request, env: { DB: {}, RATE_LIMIT_SALT: 'local', TURNSTILE_SECRET: 'test' } });
  assert.equal(response.status, 400);
  assert.match((await response.json()).error, /security check/i);
});

test('offer migration preserves prior clicks and verified offer events reject invented destinations', async () => {
  const sqlite = new DatabaseSync(':memory:');
  for (const migration of ['0001_crm.sql', '0002_testimonials.sql', '0003_growth.sql'])
    sqlite.exec(readFileSync(new URL(`../migrations/${migration}`, import.meta.url), 'utf8'));
  sqlite.prepare(`INSERT INTO outbound_events(id,destination,placement,path) VALUES(?,?,?,?)`)
    .run(crypto.randomUUID(), 'membership', 'old_cta', '/');
  sqlite.exec(readFileSync(new URL('../migrations/0004_offers.sql', import.meta.url), 'utf8'));
  sqlite.exec(readFileSync(new URL('../migrations/0005_engagement.sql', import.meta.url), 'utf8'));
  assert.equal(sqlite.prepare('SELECT offer_id FROM outbound_events').get().offer_id, 'dwn-membership');
  const { db } = database();
  const send = body => postOutbound({ request: new Request('https://drhauwaphd.ca/api/outbound', {
    method: 'POST', headers: { Origin: 'https://drhauwaphd.ca', 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: crypto.randomUUID(), placement: 'guide_inline_free-guide',
      path: '/blog/online-side-hustles-canada/', ...body }) }), env: { DB: db, RATE_LIMIT_SALT: 'test' } });
  assert.equal((await send({ destination: 'free-guide', offerId: 'free-guide' })).status, 201);
  assert.equal((await send({ destination: 'not-a-real-offer', offerId: 'not-a-real-offer' })).status, 400);
  sqlite.close();
});

function database() {
  const sqlite = new DatabaseSync(':memory:');
  sqlite.exec(readFileSync(new URL('../migrations/0001_crm.sql', import.meta.url), 'utf8'));
  sqlite.exec(readFileSync(new URL('../migrations/0002_testimonials.sql', import.meta.url), 'utf8'));
  sqlite.exec(readFileSync(new URL('../migrations/0003_growth.sql', import.meta.url), 'utf8'));
  sqlite.exec(readFileSync(new URL('../migrations/0004_offers.sql', import.meta.url), 'utf8'));
  sqlite.exec(readFileSync(new URL('../migrations/0005_engagement.sql', import.meta.url), 'utf8'));
  sqlite.exec(readFileSync(new URL('../migrations/0006_email_log.sql', import.meta.url), 'utf8'));
  const db = {
    prepare(sql) {
      let args = [];
      return {
        bind(...values) { args = values; return this; },
        run() { const result = sqlite.prepare(sql).run(...args); return { meta: { changes: Number(result.changes) } }; },
        first() { return sqlite.prepare(sql).get(...args) || null; },
        all() { return { results: sqlite.prepare(sql).all(...args) }; },
      };
    },
    batch(statements) {
      sqlite.exec('BEGIN');
      try { const results = statements.map(statement => statement.run()); sqlite.exec('COMMIT'); return results; }
      catch (error) { sqlite.exec('ROLLBACK'); throw error; }
    },
  };
  return { sqlite, db };
}

test('approved PDF excerpts seed once and proof events deduplicate by session', async () => {
  const { sqlite, db } = database();
  sqlite.exec(readFileSync(new URL('../migrations/0002_testimonials.sql', import.meta.url), 'utf8'));
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM testimonials').get().n, 21);
  assert.equal(sqlite.prepare("SELECT COUNT(*) AS n FROM testimonials WHERE id='dwn-pdf-04'").get().n, 1);
  const publicData = await (await getTestimonials({ env: { DB: db } })).json();
  assert.equal(publicData.testimonials.length, 21);
  const payload = { sessionId: requestId, placement: 'membership', variant: 'quote', action: 'impression', testimonialId: 'dwn-pdf-13' };
  const send = () => postTestimonialEvent({ request: new Request('https://drhauwaphd.ca/api/testimonial-experiment', {
    method: 'POST', headers: { Origin: 'https://drhauwaphd.ca', 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }), env: { DB: db } });
  assert.equal((await send()).status, 200);
  assert.equal((await send()).status, 200);
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM testimonial_experiment_events').get().n, 1);
  sqlite.close();
});

test('public source images exclude screenshots with unrelated private details', async () => {
  const { sqlite, db } = database();
  const env = { DB: db, TESTIMONIAL_IMAGES: { get: async () => ({ body: 'image' }) } };
  const testimonials = (await (await getTestimonials({ env })).json()).testimonials;
  assert.equal(testimonials.find(row => row.id === 'dwn-pdf-08').publicEvidence, false);
  assert.equal(testimonials.find(row => row.id === 'dwn-pdf-13').publicEvidence, true);
  assert.equal((await getTestimonialImage({ params: { id: 'dwn-pdf-08' }, env })).status, 404);
  assert.equal((await getTestimonialImage({ params: { id: 'dwn-pdf-13' }, env })).status, 200);
  sqlite.close();
});

test('lead and consultation persist once in SQLite', async () => {
  const { sqlite, db } = database();
  const lead = cleanLead({ email: 'member@example.com', firstName: 'Member', source: 'consultation', requestId,
    message: 'Please contact me', marketingConsent: true });
  assert.deepEqual(await saveLead(db, lead), { duplicate: false });
  assert.deepEqual(await saveLead(db, lead), { duplicate: true });
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM contacts').get().n, 1);
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM consultations').get().n, 1);
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM followup_tasks').get().n, 1);
  assert.equal(sqlite.prepare('SELECT segment FROM lead_profiles').get().segment, 'consulting');
  assert.equal(sqlite.prepare('SELECT marketing_consent FROM contacts').get().marketing_consent, 1);

  sqlite.close();
});

test('suppressed contacts cannot silently opt back into marketing', async () => {
  const { sqlite, db } = database();
  sqlite.prepare('INSERT INTO suppressions(email,reason) VALUES(?,?)').run('blocked@example.com', 'unsubscribe');
  const lead = cleanLead({ email: 'blocked@example.com', source: 'newsletter', requestId, marketingConsent: true });
  await saveLead(db, lead);
  assert.equal(sqlite.prepare('SELECT marketing_consent FROM contacts').get().marketing_consent, 0);
  sqlite.close();
});

test('self-service unsubscribe needs Turnstile and suppresses marketing consent', async () => {
  const { sqlite, db } = database();
  const lead = cleanLead({ email: 'optout@example.com', source: 'newsletter', requestId, marketingConsent: true });
  await saveLead(db, lead);
  const url = 'https://drhauwaphd.ca/api/unsubscribe';
  const makeRequest = token => new Request(url, { method: 'POST',
    headers: { Origin: 'https://drhauwaphd.ca', 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: lead.email, turnstileToken: token }) });
  const env = { DB: db, RATE_LIMIT_SALT: 'test', TURNSTILE_SECRET: 'test' };
  assert.equal((await postUnsubscribe({ request: makeRequest(''), env })).status, 400);
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => Response.json({ success: true, hostname: 'drhauwaphd.ca' });
  try { assert.equal((await postUnsubscribe({ request: makeRequest('valid'), env })).status, 200); }
  finally { globalThis.fetch = originalFetch; }
  assert.equal(sqlite.prepare('SELECT marketing_consent FROM contacts').get().marketing_consent, 0);
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM suppressions').get().n, 1);
  sqlite.close();
});

test('referral attribution counts website leads and excludes self-referrals', async () => {
  const { sqlite, db } = database();
  const owner = cleanLead({ email: 'owner@example.com', source: 'community', requestId });
  await saveLead(db, owner);
  const ownerId = sqlite.prepare('SELECT id FROM contacts WHERE email=?').get(owner.email).id;
  sqlite.prepare('INSERT INTO referrals(code,owner_contact_id) VALUES(?,?)').run('REF12345', ownerId);
  const referred = cleanLead({ email: 'referred@example.com', source: 'newsletter',
    requestId: '8e58caf3-a678-4120-a421-95ed5214bc71', referralCode: 'REF12345' });
  await saveLead(db, referred);
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM referral_conversions').get().n, 1);
  sqlite.close();
});

test('Access-signed admin blocks Selfany imports and reports website leads', async () => {
  const { sqlite, db } = database();
  const keys = await crypto.subtle.generateKey({ name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048,
    publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' }, true, ['sign', 'verify']);
  const publicKey = await crypto.subtle.exportKey('jwk', keys.publicKey);
  publicKey.kid = 'test-key';
  const encode = value => Buffer.from(JSON.stringify(value)).toString('base64url');
  const signed = `${encode({ alg: 'RS256', kid: 'test-key' })}.${encode({
    iss: 'https://test.cloudflareaccess.com', aud: ['test-app'], exp: Math.floor(Date.now() / 1000) + 300,
    email: 'admin@example.com' })}`;
  const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', keys.privateKey, new TextEncoder().encode(signed));
  const jwt = `${signed}.${Buffer.from(signature).toString('base64url')}`;
  const env = { DB: db, ACCESS_ISSUER: 'https://test.cloudflareaccess.com', ACCESS_AUD: 'test-app',
    ADMIN_EMAILS: 'admin@example.com' };
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => Response.json({ keys: [publicKey] });
  try {
    const lead = cleanLead({ email: 'attendee@example.com', source: 'community', requestId });
    await saveLead(db, lead);
    const request = new Request('https://drhauwaphd.ca/api/admin/import', { method: 'POST',
      headers: { 'Cf-Access-Jwt-Assertion': jwt, 'Content-Type': 'application/json' },
      body: '{}' });
    const imported = await postImport({ request, env });
    assert.equal(imported.status, 410);
    assert.match((await imported.json()).error, /disabled/);
    const overview = await getOverview({ request: new Request('https://drhauwaphd.ca/api/admin/overview',
      { headers: { 'Cf-Access-Jwt-Assertion': jwt } }), env });
    const metrics = await overview.json();
    assert.equal(metrics.leadSubmissions, 1);
    assert.equal(metrics.integrations.selfany, 'external_links_only');
    const today = new Date().toISOString().slice(0, 10);
    const contacts = await getContacts({ request: new Request(`https://drhauwaphd.ca/api/admin/contacts?q=attendee&from=${today}&to=${today}`,
      { headers: { 'Cf-Access-Jwt-Assertion': jwt } }), env });
    const rows = (await contacts.json()).contacts;
    assert.equal(rows.length, 1);
    assert.equal(rows[0].segment, 'community');
    const detailRequest = new Request(`https://drhauwaphd.ca/api/admin/contacts/${rows[0].id}`,
      { headers: { 'Cf-Access-Jwt-Assertion': jwt } });
    const detail = await getContactDetail({ request: detailRequest, env, params: { id: rows[0].id } });
    assert.equal((await detail.json()).events.length, 1);
    const updated = await patchContact({ request: new Request(detailRequest.url, { method: 'PATCH',
      headers: { 'Cf-Access-Jwt-Assertion': jwt, 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage: 'qualified', ownerEmail: 'admin@example.com', nextAction: 'Call lead' }) }),
      env, params: { id: rows[0].id } });
    assert.equal(updated.status, 200);
    assert.equal(sqlite.prepare('SELECT stage FROM lead_profiles').get().stage, 'qualified');
    const task = await postTask({ request: new Request('https://drhauwaphd.ca/api/admin/tasks', { method: 'POST',
      headers: { 'Cf-Access-Jwt-Assertion': jwt, 'Content-Type': 'application/json' },
      body: JSON.stringify({ contactId: rows[0].id, title: 'Call lead' }) }), env });
    assert.equal(task.status, 201);
    assert.equal((await (await getTasks({ request: detailRequest, env })).json()).tasks.length, 2);
    const outboundPayload = { id: crypto.randomUUID(), destination: 'webinar', placement: 'dwn_webinar',
      path: '/', utm_source: 'instagram' };
    const click = await postOutbound({ request: new Request('https://drhauwaphd.ca/api/outbound', { method: 'POST',
      headers: { Origin: 'https://drhauwaphd.ca', 'Content-Type': 'application/json' },
      body: JSON.stringify(outboundPayload) }), env: { DB: db, RATE_LIMIT_SALT: 'test' } });
    assert.equal(click.status, 201);
    const funnel = await getFunnel({ request: detailRequest, env });
    assert.equal((await funnel.json()).outboundClicks[0].clicks, 1);
    let promptText = '';
    env.AI = { run: async (_model, input) => {
      promptText = input.messages[1].content;
      return { response: 'Summary: DWN enquiry. Next action: review interests.' };
    } };
    const suggestion = await postAiSuggestion({ request: new Request('https://drhauwaphd.ca/api/admin/ai-suggestion', {
      method: 'POST', headers: { 'Cf-Access-Jwt-Assertion': jwt, 'Content-Type': 'application/json' },
      body: JSON.stringify({ contactId: rows[0].id }) }), env });
    assert.equal(suggestion.status, 200);
    assert.equal((await suggestion.json()).status, 'draft_for_human_review');
    assert.equal(promptText.includes('attendee@example.com'), false);
  } finally { globalThis.fetch = originalFetch; sqlite.close(); }
});

test('service emails stay off by default, log skips, and never block lead capture', async () => {
  const { sqlite, db } = database();
  const lead = cleanLead({ email: 'guide@example.com', firstName: 'Gia', source: 'free_guide_popup',
    requestId: crypto.randomUUID(), interest: 'AI', marketingConsent: false });
  await saveLead(db, lead);
  let calls = 0;
  const fetchStub = async (url, init) => { calls++; fetchStub.last = { url, init }; return Response.json({ id: 'resend-1' }); };
  // Disabled flag: nothing leaves the building, but the skip is logged.
  assert.equal((await sendServiceEmail({ DB: db, RESEND_API_KEY: 'k' }, lead, fetchStub)).status, 'skipped_disabled');
  assert.equal(calls, 0);
  // Enabled without a key is also off.
  assert.equal((await sendServiceEmail({ DB: db, EMAIL_SENDING_ENABLED: 'true' }, lead, fetchStub)).status, 'skipped_disabled');
  assert.equal(emailState({}), 'not_connected');
  assert.equal(emailState({ RESEND_API_KEY: 'k' }), 'connected_sending_disabled');
  assert.equal(emailState({ RESEND_API_KEY: 'k', EMAIL_SENDING_ENABLED: 'true' }), 'enabled');
  // Enabled: sends once with the approved sender, reply-to and idempotency key.
  const lead2 = { ...lead, requestId: crypto.randomUUID() };
  const env = { DB: db, RESEND_API_KEY: 'k', EMAIL_SENDING_ENABLED: 'true' };
  assert.equal((await sendServiceEmail(env, lead2, fetchStub)).status, 'sent');
  const body = JSON.parse(fetchStub.last.init.body);
  assert.equal(body.from, 'Dr. Hauwa | Diaspora Wealth Network <hello@mail.drhauwaphd.ca>');
  assert.equal(body.reply_to, 'hello@drhauwaphd.ca');
  assert.deepEqual(body.to, ['guide@example.com']);
  assert.equal(fetchStub.last.init.headers['Idempotency-Key'], `${lead2.requestId}:free_guide_delivery`);
  assert.match(body.html, /selfany\.com\/ABNVUFTKMG/);
  assert.doesNotMatch(body.html, /unsubscribe/i); // service email, not marketing
  // A repeat within 24 hours is skipped, not re-sent.
  const lead3 = { ...lead, requestId: crypto.randomUUID() };
  assert.equal((await sendServiceEmail(env, lead3, fetchStub)).status, 'skipped_recent');
  assert.equal(calls, 1);
  // Suppressed contacts get nothing.
  sqlite.prepare('INSERT INTO suppressions(email,reason) VALUES(?,?)').run('guide@example.com', 'unsubscribe');
  assert.equal((await sendServiceEmail(env, { ...lead, requestId: crypto.randomUUID() }, fetchStub)).status, 'skipped_suppressed');
  // Newsletter and quiz sources have no service email.
  assert.equal((await sendServiceEmail(env, { ...lead, source: 'newsletter' }, fetchStub)).status, 'none');
  // A provider failure is logged and swallowed.
  const bad = cleanLead({ email: 'fail@example.com', firstName: 'Fay', source: 'consultation', requestId: crypto.randomUUID(), message: 'Hi' });
  await saveLead(db, bad);
  const failing = async () => Response.json({ message: 'domain not verified' }, { status: 403 });
  assert.equal((await sendServiceEmail(env, bad, failing)).status, 'failed');
  const statuses = sqlite.prepare('SELECT status FROM email_log ORDER BY created_at').all().map(row => row.status);
  assert.ok(statuses.includes('sent') && statuses.includes('failed') && statuses.includes('skipped_suppressed'));
  sqlite.close();
});

test('email templates escape names and read cleanly as plain text', () => {
  const mail = renderEmail('community_ack', '<script>alert(1)</script>');
  assert.doesNotMatch(mail.html, /<script>/);
  assert.match(mail.html, /&lt;script&gt;/);
  assert.match(mail.html, /viewport/);
  assert.match(mail.text, /selfany\.com\/thedwn/);
  assert.equal(renderEmail('consultation_ack', '').subject, 'We received your consultation request');
  assert.match(renderEmail('ai_training_ack', 'Ada').text, /not published yet/);
});
