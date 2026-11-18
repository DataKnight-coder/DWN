PRAGMA foreign_keys = ON;

-- Website lead management is independent of Selfany payments and membership.
CREATE TABLE IF NOT EXISTS lead_profiles (
  contact_id TEXT PRIMARY KEY REFERENCES contacts(id),
  segment TEXT NOT NULL DEFAULT 'general',
  score INTEGER NOT NULL DEFAULT 0 CHECK (score BETWEEN 0 AND 100),
  stage TEXT NOT NULL DEFAULT 'new' CHECK (stage IN ('new','contacted','qualified','nurture','closed')),
  owner_email TEXT,
  next_action TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_lead_profiles_stage ON lead_profiles(stage,segment);

CREATE TABLE IF NOT EXISTS followup_tasks (
  id TEXT PRIMARY KEY,
  contact_id TEXT NOT NULL REFERENCES contacts(id),
  title TEXT NOT NULL,
  due_at TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','done')),
  source_event_id TEXT UNIQUE REFERENCES crm_events(id),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_followup_tasks_due ON followup_tasks(status,due_at);

-- Anonymous, consented website click counts. These are never Selfany outcomes.
CREATE TABLE IF NOT EXISTS outbound_events (
  id TEXT PRIMARY KEY,
  destination TEXT NOT NULL CHECK (destination IN ('webinar','membership','whatsapp')),
  placement TEXT NOT NULL,
  path TEXT NOT NULL,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_outbound_events ON outbound_events(destination,created_at);
