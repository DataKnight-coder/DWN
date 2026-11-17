export function validateImport(row) {
  const kind = String(row.kind || '');
  if (!['webinar_registration', 'webinar_attendance', 'membership_purchase', 'membership_renewal', 'membership_cancellation', 'membership_refund'].includes(kind)) throw new Error('Unsupported event kind.');
  const externalId = String(row.externalId || '').trim();
  const email = String(row.email || '').trim().toLowerCase();
  const occurredAt = String(row.occurredAt || '');
  if (!externalId || externalId.length > 150) throw new Error('External ID required.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) throw new Error('Valid email required.');
  if (!/^\d{4}-\d\d-\d\dT/.test(occurredAt) || Number.isNaN(Date.parse(occurredAt))) throw new Error('Valid event time required.');
  const amountMinor = row.amountMinor == null ? null : Number(row.amountMinor);
  const currency = row.currency == null ? null : String(row.currency).toUpperCase();
  if (kind === 'membership_purchase' || kind === 'membership_renewal' || kind === 'membership_refund') {
    if (!Number.isSafeInteger(amountMinor) || amountMinor < 0 || !/^[A-Z]{3}$/.test(currency || '')) throw new Error('Verified amount and currency required.');
  }
  return { kind, externalId, email, occurredAt, amountMinor, currency,
    firstName: String(row.firstName || '').trim().slice(0, 80),
    webinarCode: String(row.webinarCode || 'DrHauwaPhD1').trim().slice(0, 100) };
}

export async function importSelfanyRow(db, row, actor) {
  const now = new Date().toISOString();
  await db.prepare(`INSERT INTO contacts(id,email,first_name,first_source,created_at,updated_at) VALUES(?,?,?,'selfany_import',?,?)
    ON CONFLICT(email) DO UPDATE SET updated_at=excluded.updated_at`)
    .bind(crypto.randomUUID(), row.email, row.firstName, now, now).run();
  const contact = await db.prepare('SELECT id FROM contacts WHERE email=?').bind(row.email).first();
  const eventId = crypto.randomUUID();
  const statements = [db.prepare(`INSERT OR IGNORE INTO crm_events(id,contact_id,kind,source,external_id,details_json,created_at)
    VALUES(?,?,?,'selfany_import',?,?,?)`).bind(eventId, contact.id, row.kind, row.externalId,
      JSON.stringify({ occurredAt: row.occurredAt, webinarCode: row.webinarCode }), now)];
  if (row.kind === 'webinar_registration') {
    statements.push(db.prepare(`INSERT OR IGNORE INTO webinar_registrations(id,contact_id,external_id,webinar_code,registered_at,verified_source)
      SELECT ?,contact_id,?, ?,?,'selfany_admin_export' FROM crm_events WHERE id=?`)
      .bind(crypto.randomUUID(), row.externalId, row.webinarCode, row.occurredAt, eventId));
  } else if (row.kind === 'webinar_attendance') {
    statements.push(db.prepare(`UPDATE webinar_registrations SET attended_at=? WHERE contact_id=? AND webinar_code=?
      AND attended_at IS NULL AND EXISTS(SELECT 1 FROM crm_events WHERE id=?)`)
      .bind(row.occurredAt, contact.id, row.webinarCode, eventId));
  } else {
    const status = { membership_purchase: 'active', membership_renewal: 'renewed',
      membership_cancellation: 'cancelled', membership_refund: 'refunded' }[row.kind];
    statements.push(db.prepare(`INSERT OR IGNORE INTO memberships(id,contact_id,external_id,status,amount_minor,currency,occurred_at,verified_source)
      SELECT ?,contact_id,?,?,?,?,?,'selfany_admin_export' FROM crm_events WHERE id=?`)
      .bind(crypto.randomUUID(), row.externalId, status, row.amountMinor, row.currency, row.occurredAt, eventId));
  }
  statements.push(db.prepare(`INSERT INTO audit_log(id,actor,action,target_type,target_id)
    SELECT ?,?,'import_selfany_event','crm_event',id FROM crm_events WHERE id=?`)
    .bind(crypto.randomUUID(), actor, eventId));
  if (row.kind === 'webinar_registration' || row.kind === 'membership_purchase') {
    statements.push(db.prepare(`INSERT OR IGNORE INTO referral_conversions(id,code,referred_contact_id,event_id,kind)
      SELECT ?,r.code,?,e.id,? FROM referral_conversions r JOIN crm_events e ON e.id=?
      WHERE r.referred_contact_id=? AND r.kind='lead_submitted' ORDER BY r.created_at LIMIT 1`)
      .bind(crypto.randomUUID(), contact.id, row.kind, eventId, contact.id));
  }
  const results = await db.batch(statements);
  return { duplicate: !results[0].meta?.changes };
}
