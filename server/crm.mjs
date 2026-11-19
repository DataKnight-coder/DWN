export const leadSources = new Set(['community', 'newsletter', 'pathway_quiz', 'consultation', 'free_guide_popup', 'ai_training']);

export function classifyLead(lead) {
  if (lead.source === 'consultation') return { segment: 'consulting', score: 80, nextAction: 'Review consultation enquiry' };
  if (lead.source === 'ai_training' || lead.interest === 'AI') return { segment: 'ai_training', score: 60, nextAction: 'Review AI training enquiry' };
  if (lead.interest === 'Personal Mentorship') return { segment: 'consulting', score: 65, nextAction: 'Review mentorship interest' };
  if (lead.interest === 'DWN Membership') return { segment: 'community', score: 55, nextAction: 'Review DWN membership interest' };
  const focus = `${lead.interest} ${lead.obstacle}`.toLowerCase();
  if (/real estate|property/.test(focus)) return { segment: 'real_estate', score: 55, nextAction: 'Review property interest' };
  if (/career|cyber|skill/.test(focus)) return { segment: 'career', score: 55, nextAction: 'Review career interest' };
  if (/digital|income|business/.test(focus)) return { segment: 'digital_business', score: 55, nextAction: 'Review business interest' };
  if (lead.source === 'pathway_quiz') return { segment: 'networking', score: 45, nextAction: 'Review quiz responses' };
  return { segment: lead.source === 'newsletter' ? 'newsletter' : 'community', score: 30,
    nextAction: lead.source === 'newsletter' ? 'Await email programme activation' : 'Review DWN enquiry' };
}

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
  if (source === 'free_guide_popup' && !['Digital Income','AI','Cybersecurity','Real Estate','DWN Membership','Personal Mentorship'].includes(interest))
    throw new Error('Choose your primary interest.');
  if ((source === 'free_guide_popup' || source === 'ai_training') && !firstName) throw new Error('Enter your first name.');
  const country = String(input.country || '').trim();
  if (country.length > 80 || /[<>]/.test(country)) throw new Error('Enter a valid country.');
  const landingPage = String(input.landingPage || '').trim();
  if (landingPage && (!/^\/[a-z0-9_/-]{0,150}$/i.test(landingPage) || landingPage.includes('//')))
    throw new Error('Invalid landing page.');
  const obstacle = String(input.obstacle || '').trim().slice(0, 120);
  const message = String(input.message || '').trim();
  if (message.length > 2000) throw new Error('Message is too long.');
  const attribution = {};
  const referralCode = String(input.referralCode || '').trim().toUpperCase();
  if (referralCode && !/^[A-Z0-9]{6,20}$/.test(referralCode)) throw new Error('Invalid referral code.');
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign']) {
    attribution[key] = String(input[key] || '').trim().slice(0, 100);
  }
  return { email, firstName, source, requestId, interest, obstacle, message, country,
    landingPage, marketingConsent: input.marketingConsent === true, attribution, referralCode };
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
  const classification = classifyLead(lead);
  const eventId = crypto.randomUUID();
  const statements = [db.prepare(`INSERT OR IGNORE INTO crm_events (id,contact_id,kind,source,external_id,details_json,created_at)
    VALUES (?,?,?,?,?,?,?)`).bind(eventId, contact.id, 'lead_submitted', lead.source,
      lead.requestId, JSON.stringify({ interest: lead.interest, obstacle: lead.obstacle,
        country: lead.country, landingPage: lead.landingPage, marketingConsent: Boolean(consent),
        consentRequested: lead.marketingConsent, submittedAt: now,
        utm: lead.attribution, referralCode: lead.referralCode }), now)];
  statements.push(db.prepare(`INSERT INTO lead_profiles(contact_id,segment,score,next_action,updated_at)
    VALUES(?,?,?,?,?) ON CONFLICT(contact_id) DO UPDATE SET
    segment=excluded.segment,score=MAX(lead_profiles.score,excluded.score),
    next_action=CASE WHEN lead_profiles.stage='new' THEN excluded.next_action ELSE lead_profiles.next_action END,
    updated_at=excluded.updated_at`)
    .bind(contact.id, classification.segment, classification.score, classification.nextAction, now));
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
  if (lead.source !== 'newsletter' && (lead.source !== 'free_guide_popup' || consent)) {
    const title = lead.source === 'consultation' ? 'Review consultation enquiry' :
      lead.source === 'pathway_quiz' ? 'Review pathway quiz enquiry' :
      lead.source === 'ai_training' ? 'Review AI training enquiry' :
      lead.source === 'free_guide_popup' ? `Review ${lead.interest} interest; confirm consent before any follow-up` : 'Review DWN enquiry';
    statements.push(db.prepare(`INSERT OR IGNORE INTO followup_tasks(id,contact_id,title,due_at,source_event_id,created_at,updated_at)
      SELECT ?,contact_id,?,?,id,?,? FROM crm_events WHERE id=?`)
      .bind(crypto.randomUUID(), title, new Date(Date.now() + 86400000).toISOString(), now, now, eventId));
    statements.push(db.prepare(`INSERT INTO automation_logs(id,action,status,reference_id,message,created_at)
      SELECT ?,'create_followup_task','queued_for_human',id,?,? FROM crm_events WHERE id=?`)
      .bind(crypto.randomUUID(), title, now, eventId));
  }
  const results = await db.batch(statements);
  return { duplicate: !results[0].meta?.changes };
}

export function json(data, status = 200) {
  return Response.json(data, { status, headers: {
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  } });
}

export async function limitRequest(db, request, salt, maxHits = 10) {
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const minuteWindow = Math.floor(Date.now() / 900000);
  const bytes = new TextEncoder().encode(`${salt}:${ip}:${minuteWindow}`);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  const key = Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
  await db.prepare(`INSERT INTO rate_limits(key,hits,expires_at) VALUES(?,1,?)
    ON CONFLICT(key) DO UPDATE SET hits=hits+1`).bind(key, (minuteWindow + 1) * 900).run();
  const row = await db.prepare('SELECT hits FROM rate_limits WHERE key=?').bind(key).first();
  if (Math.random() < 0.01) await db.prepare('DELETE FROM rate_limits WHERE expires_at < ?').bind(Math.floor(Date.now() / 1000)).run();
  return row.hits <= maxHits;
}
