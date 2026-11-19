PRAGMA foreign_keys = ON;

-- Preserve prior outbound events while adding verified offer identifiers.
CREATE TABLE IF NOT EXISTS outbound_events_v2 (
  id TEXT PRIMARY KEY,
  destination TEXT NOT NULL CHECK (destination IN (
    'webinar','membership','whatsapp',
    'free-guide','dwn-membership','strategy-session','africa-waiting-room',
    'rent-free-blueprint','monetization-masterclass'
  )),
  offer_id TEXT,
  placement TEXT NOT NULL,
  path TEXT NOT NULL,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO outbound_events_v2
  (id,destination,offer_id,placement,path,utm_source,utm_medium,utm_campaign,created_at)
SELECT id,destination,
  CASE destination WHEN 'webinar' THEN 'monetization-masterclass'
    WHEN 'membership' THEN 'dwn-membership' ELSE NULL END,
  placement,path,utm_source,utm_medium,utm_campaign,created_at
FROM outbound_events;

DROP TABLE outbound_events;
ALTER TABLE outbound_events_v2 RENAME TO outbound_events;
CREATE INDEX IF NOT EXISTS idx_outbound_events ON outbound_events(destination,created_at);
CREATE INDEX IF NOT EXISTS idx_outbound_offer_path ON outbound_events(offer_id,path,created_at);
