CREATE TABLE IF NOT EXISTS engagement_events (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL CHECK(kind IN ('popup_impression','popup_submission')),
  surface TEXT NOT NULL CHECK(surface IN ('free_guide')),
  session_id TEXT NOT NULL,
  path TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(kind,surface,session_id)
);
CREATE INDEX IF NOT EXISTS idx_engagement_kind_date ON engagement_events(kind,created_at);
