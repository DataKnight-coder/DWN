import test from 'node:test';
import assert from 'node:assert/strict';
import { cleanLead } from '../server/crm.mjs';
import { validateImport } from '../server/import.mjs';
import { onRequestPost } from '../functions/api/leads.js';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import { saveLead } from '../server/crm.mjs';
import { importSelfanyRow } from '../server/import.mjs';
import { onRequestPost as postImport } from '../functions/api/admin/import.js';
import { onRequestGet as getOverview } from '../functions/api/admin/overview.js';
import { onRequestGet as getContacts } from '../functions/api/admin/contacts.js';
import { onRequestGet as getTestimonials } from '../functions/api/testimonials.js';
import { onRequestGet as getTestimonialImage } from '../functions/api/testimonial-images/[id].js';
import { onRequestPost as postTestimonialEvent } from '../functions/api/testimonial-experiment.js';

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

test('purchase import requires a stable ID, amount, currency, and time', () => {
  const base = { kind: 'membership_purchase', externalId: 'selfany-001', email: 'jane@example.com',
    occurredAt: '2026-11-17T10:00:00Z' };
  assert.throws(() => validateImport(base), /amount and currency/);
  const row = validateImport({ ...base, amountMinor: 15000, currency: 'cad' });
  assert.equal(row.amountMinor, 15000);
  assert.equal(row.currency, 'CAD');
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

function database() {
  const sqlite = new DatabaseSync(':memory:');
  sqlite.exec(readFileSync(new URL('../migrations/0001_crm.sql', import.meta.url), 'utf8'));
  sqlite.exec(readFileSync(new URL('../migrations/0002_testimonials.sql', import.meta.url), 'utf8'));
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

test('lead, consultation, and import events persist once in SQLite', async () => {
  const { sqlite, db } = database();
  const lead = cleanLead({ email: 'member@example.com', firstName: 'Member', source: 'consultation', requestId,
    message: 'Please contact me', marketingConsent: true });
  assert.deepEqual(await saveLead(db, lead), { duplicate: false });
  assert.deepEqual(await saveLead(db, lead), { duplicate: true });
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM contacts').get().n, 1);
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM consultations').get().n, 1);
  assert.equal(sqlite.prepare('SELECT marketing_consent FROM contacts').get().marketing_consent, 1);

  const purchase = validateImport({ kind: 'membership_purchase', externalId: 'order-1', email: lead.email,
    occurredAt: '2026-11-17T10:00:00Z', amountMinor: 15000, currency: 'CAD' });
  assert.deepEqual(await importSelfanyRow(db, purchase, 'admin@example.com'), { duplicate: false });
  assert.deepEqual(await importSelfanyRow(db, purchase, 'admin@example.com'), { duplicate: true });
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM memberships').get().n, 1);
  assert.equal(sqlite.prepare('SELECT amount_minor FROM memberships').get().amount_minor, 15000);
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

test('referral attribution excludes self-referrals and counts verified imports', async () => {
  const { sqlite, db } = database();
  const owner = cleanLead({ email: 'owner@example.com', source: 'community', requestId });
  await saveLead(db, owner);
  const ownerId = sqlite.prepare('SELECT id FROM contacts WHERE email=?').get(owner.email).id;
  sqlite.prepare('INSERT INTO referrals(code,owner_contact_id) VALUES(?,?)').run('REF12345', ownerId);
  const referred = cleanLead({ email: 'referred@example.com', source: 'newsletter',
    requestId: '8e58caf3-a678-4120-a421-95ed5214bc71', referralCode: 'REF12345' });
  await saveLead(db, referred);
  const registration = validateImport({ kind: 'webinar_registration', externalId: 'reg-1', email: referred.email,
    occurredAt: '2026-11-17T10:00:00Z' });
  await importSelfanyRow(db, registration, 'admin@example.com');
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM referral_conversions').get().n, 2);
  sqlite.close();
});

test('Access-signed admin import powers real overview and filtered contacts', async () => {
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
    const rows = [{ kind: 'webinar_registration', externalId: 'webinar-1', email: 'attendee@example.com',
      occurredAt: '2026-11-17T10:00:00Z' }];
    const request = new Request('https://drhauwaphd.ca/api/admin/import', { method: 'POST',
      headers: { 'Cf-Access-Jwt-Assertion': jwt, 'Content-Type': 'application/json' },
      body: JSON.stringify({ source: 'selfany_admin_export', verified: true, rows }) });
    const imported = await postImport({ request, env });
    assert.equal(imported.status, 200);
    assert.deepEqual(await imported.json(), { imported: 1, duplicates: 0 });
    const overview = await getOverview({ request: new Request('https://drhauwaphd.ca/api/admin/overview',
      { headers: { 'Cf-Access-Jwt-Assertion': jwt } }), env });
    const metrics = await overview.json();
    assert.equal(metrics.verifiedWebinarRegistrations, 1);
    const contacts = await getContacts({ request: new Request('https://drhauwaphd.ca/api/admin/contacts?q=attendee&from=2026-11-17&to=2026-11-17',
      { headers: { 'Cf-Access-Jwt-Assertion': jwt } }), env });
    assert.equal((await contacts.json()).contacts.length, 1);
  } finally { globalThis.fetch = originalFetch; sqlite.close(); }
});
