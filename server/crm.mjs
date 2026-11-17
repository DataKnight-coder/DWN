export const leadSources = new Set(['community', 'newsletter', 'pathway_quiz', 'consultation']);

export function cleanLead(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Invalid submission.');
  const email = String(input.email || '').trim().toLowerCase();
  const firstName = String(input.firstName || '').trim().replace(/\s+/g, ' ');
  const source = String(input.source || '');
  const requestId = String(input.requestId || '');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) throw new Error('Enter a valid email address.');
  if (firstName.length > 80) throw new Error('First name is too long.');
  if (!leadSources.has(source)) throw new Error('Invalid form source.');
  if (!/^[0-9a-f]{8}-[0-9a-f-]{27,}$/i.test(requestId) || requestId.length > 64) throw new Error('Invalid submission ID.');
  const interest = String(input.interest || '').trim().slice(0, 120);
  const obstacle = String(input.obstacle || '').trim().slice(0, 120);
  const message = String(input.message || '').trim();
  if (message.length > 2000) throw new Error('Message is too long.');
  const attribution = {};
  const referralCode = String(input.referralCode || '').trim().toUpperCase();
  if (referralCode && !/^[A-Z0-9]{6,20}$/.test(referralCode)) throw new Error('Invalid referral code.');
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign']) {
    attribution[key] = String(input[key] || '').trim().slice(0, 100);
  }
  return { email, firstName, source, requestId, interest, obstacle, message,
    marketingConsent: input.marketingConsent === true, attribution, referralCode };
}

export async function saveLead(db, lead) {
  const now = new Date().toISOString();
  const suppression = await db.prepare('SELECT email FROM suppressions WHERE email=?').bind(lead.email).first();
  const consent = lead.marketingConsent && !suppression;
  await db.prepare(`INSERT INTO contacts
    (id,email,first_name,marketing_consent,consent_at,consent_source,first_source,first_utm_source,first_utm_medium,first_utm_campaign,created_at,updated_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
    ON CONFLICT(email) DO UPDATE SET
      first_name=CASE WHEN excluded.first_name <> '' THEN excluded.first_name ELSE contacts.first_name END,
      marketing_consent=MAX(contacts.marketing_consent,excluded.marketing_consent),
      consent_at=CASE WHEN excluded.marketing_consent=1 THEN excluded.consent_at ELSE contacts.consent_at END,
      consent_source=CASE WHEN excluded.marketing_consent=1 THEN excluded.consent_source ELSE contacts.consent_source END,
      updated_at=excluded.updated_at`)
    .bind(crypto.randomUUID(), lead.email, lead.firstName, Number(consent),
      consent ? now : null, consent ? lead.source : null, lead.source,
      lead.attribution.utm_source, lead.attribution.utm_medium, lead.attribution.utm_campaign, now, now).run();
  const contact = await db.prepare('SELECT id FROM contacts WHERE email=?').bind(lead.email).first();
  const eventId = crypto.randomUUID();
  const statements = [db.prepare(`INSERT OR IGNORE INTO crm_events (id,contact_id,kind,source,external_id,details_json,created_at)
    VALUES (?,?,?,?,?,?,?)`).bind(eventId, contact.id, 'lead_submitted', lead.source,
      lead.requestId, JSON.stringify({ interest: lead.interest, obstacle: lead.obstacle,
        utm: lead.attribution, referralCode: lead.referralCode }), now)];
  if (lead.referralCode) {
    statements.push(db.prepare(`INSERT OR IGNORE INTO referral_conversions(id,code,referred_contact_id,event_id,kind)
      SELECT ?,r.code,?,e.id,'lead_submitted' FROM referrals r JOIN crm_events e ON e.id=?
      WHERE r.code=? AND r.owner_contact_id<>?`)
      .bind(crypto.randomUUID(), contact.id, eventId, lead.referralCode, contact.id));
  }
  if (lead.source === 'consultation') {
    statements.push(db.prepare(`INSERT OR IGNORE INTO consultations (id,event_id,contact_id,message,created_at,updated_at)
      SELECT ?,id,?,?,?,? FROM crm_events WHERE id=?`).bind(crypto.randomUUID(), contact.id, lead.message, now, now, eventId));
  }
  const results = await db.batch(statements);
  return { duplicate: !results[0].meta?.changes };
}

export function json(data, status = 200) {
  return Response.json(data, { status, headers: {
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  } });
}

export async function limitRequest(db, request, salt) {
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const minuteWindow = Math.floor(Date.now() / 900000);
  const bytes = new TextEncoder().encode(`${salt}:${ip}:${minuteWindow}`);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  const key = Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
  await db.prepare(`INSERT INTO rate_limits(key,hits,expires_at) VALUES(?,1,?)
    ON CONFLICT(key) DO UPDATE SET hits=hits+1`).bind(key, (minuteWindow + 1) * 900).run();
  const row = await db.prepare('SELECT hits FROM rate_limits WHERE key=?').bind(key).first();
  if (Math.random() < 0.01) await db.prepare('DELETE FROM rate_limits WHERE expires_at < ?').bind(Math.floor(Date.now() / 1000)).run();
  return row.hits <= 10;
}
