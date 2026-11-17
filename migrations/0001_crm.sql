PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS contacts (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL DEFAULT '',
  marketing_consent INTEGER NOT NULL DEFAULT 0 CHECK (marketing_consent IN (0, 1)),
  consent_at TEXT,
  consent_source TEXT,
  first_source TEXT NOT NULL,
  first_utm_source TEXT,
  first_utm_medium TEXT,
  first_utm_campaign TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS crm_events (
  id TEXT PRIMARY KEY,
  contact_id TEXT NOT NULL REFERENCES contacts(id),
  kind TEXT NOT NULL,
  source TEXT NOT NULL,
  external_id TEXT NOT NULL,
  details_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (source, kind, external_id)
);
CREATE INDEX IF NOT EXISTS idx_events_contact ON crm_events(contact_id, created_at);
CREATE INDEX IF NOT EXISTS idx_events_kind ON crm_events(kind, created_at);

CREATE TABLE IF NOT EXISTS webinar_registrations (
  id TEXT PRIMARY KEY,
  contact_id TEXT NOT NULL REFERENCES contacts(id),
  external_id TEXT NOT NULL UNIQUE,
  webinar_code TEXT NOT NULL,
  registered_at TEXT NOT NULL,
  attended_at TEXT,
  verified_source TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS memberships (
  id TEXT PRIMARY KEY,
  contact_id TEXT NOT NULL REFERENCES contacts(id),
  external_id TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('active', 'renewed', 'cancelled', 'expired', 'refunded')),
  amount_minor INTEGER,
  currency TEXT,
  occurred_at TEXT NOT NULL,
  verified_source TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_memberships_contact ON memberships(contact_id, occurred_at);

CREATE TABLE IF NOT EXISTS consultations (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL UNIQUE REFERENCES crm_events(id),
  contact_id TEXT NOT NULL REFERENCES contacts(id),
  stage TEXT NOT NULL DEFAULT 'new_lead' CHECK (stage IN ('new_lead','qualified','booked','completed','proposal','won','lost')),
  message TEXT NOT NULL DEFAULT '',
  confirmed_revenue_minor INTEGER,
  currency TEXT,
  revenue_evidence TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS testimonials (
  id TEXT PRIMARY KEY,
  quote TEXT NOT NULL,
  attribution TEXT NOT NULL,
  category TEXT NOT NULL,
  evidence_key TEXT,
  consent_reference TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','approved','rejected')),
  approved_by TEXT,
  approved_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS referrals (
  code TEXT PRIMARY KEY,
  owner_contact_id TEXT NOT NULL REFERENCES contacts(id),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS referral_conversions (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL REFERENCES referrals(code),
  referred_contact_id TEXT NOT NULL REFERENCES contacts(id),
  event_id TEXT NOT NULL UNIQUE REFERENCES crm_events(id),
  kind TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (code, referred_contact_id, kind)
);

CREATE TABLE IF NOT EXISTS suppressions (
  email TEXT PRIMARY KEY,
  reason TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS automation_logs (
  id TEXT PRIMARY KEY,
  action TEXT NOT NULL,
  status TEXT NOT NULL,
  reference_id TEXT,
  message TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_log (
  id TEXT PRIMARY KEY,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT PRIMARY KEY,
  hits INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
