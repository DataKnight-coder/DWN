import { readFileSync, writeFileSync } from 'node:fs';

const rows = JSON.parse(readFileSync(new URL('../content/testimonials.json', import.meta.url), 'utf8'));
const seen = new Set();
const quote = value => `'${String(value).replaceAll("'", "''")}'`;
const sql = [
  '-- Approved DWN source excerpts. The original PDF remains the source of record.',
  '-- Page 29 repeats page 4 and is intentionally not seeded twice.',
  'CREATE TABLE IF NOT EXISTS testimonial_experiment_events (',
  '  id TEXT PRIMARY KEY, session_id TEXT NOT NULL, variant TEXT NOT NULL CHECK (variant IN (\'control\',\'quote\')),',
  '  placement TEXT NOT NULL CHECK (placement IN (\'webinar\',\'membership\')),',
  '  action TEXT NOT NULL CHECK (action IN (\'impression\',\'click\')),',
  '  testimonial_id TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,',
  '  UNIQUE(session_id, placement, action)',
  ');',
  'CREATE INDEX IF NOT EXISTS idx_testimonial_experiment ON testimonial_experiment_events(placement,variant,action,created_at);',
];
for (const row of rows) {
  if (seen.has(row.id) || !Number.isInteger(row.page) || row.page < 1 || row.page > 34) throw new Error(`Bad testimonial ${row.id}`);
  seen.add(row.id);
  const key = `source/page-${String(row.page).padStart(2, '0')}.jpg`;
  sql.push(`INSERT INTO testimonials(id,quote,attribution,category,evidence_key,consent_reference,status,approved_by,approved_at)`);
  sql.push(`VALUES(${[row.id,row.quote,row.attribution,row.category,key,'owner-confirmed-2026-11-17','approved','project-owner'].map(quote).join(',')},CURRENT_TIMESTAMP)`);
  sql.push(`ON CONFLICT(id) DO NOTHING;`);
}
writeFileSync(new URL('../migrations/0002_testimonials.sql', import.meta.url), sql.join('\n') + '\n');
console.log(`Generated ${rows.length} approved testimonial excerpts.`);
