-- Audit log for transactional service emails. Additive; no existing data is changed.
CREATE TABLE IF NOT EXISTS email_log (
  id TEXT PRIMARY KEY,
  contact_id TEXT NOT NULL REFERENCES contacts(id),
  template TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('sent','failed','skipped_disabled','skipped_suppressed','skipped_recent')),
  provider_id TEXT,
  error TEXT,
  request_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (request_id, template)
);
CREATE INDEX IF NOT EXISTS idx_email_log_contact ON email_log(contact_id, template, created_at);
