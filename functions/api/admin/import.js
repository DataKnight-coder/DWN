import { authorize } from '../../../server/access.mjs';
import { json } from '../../../server/crm.mjs';
import { importSelfanyRow, validateImport } from '../../../server/import.mjs';

export async function onRequestPost(context) {
  const auth = await authorize(context);
  if (auth.response) return auth.response;
  let input;
  try { input = await context.request.json(); } catch { return json({ error: 'Invalid JSON.' }, 400); }
  if (!input || input.source !== 'selfany_admin_export' || input.verified !== true ||
      !Array.isArray(input.rows) || input.rows.length < 1 || input.rows.length > 100) {
    return json({ error: 'A verified Selfany admin export with 1–100 rows is required.' }, 400);
  }
  let rows;
  try { rows = input.rows.map(validateImport); } catch (error) { return json({ error: error.message }, 400); }
  let imported = 0, duplicates = 0;
  try {
    for (const row of rows) {
      const result = await importSelfanyRow(context.env.DB, row, auth.actor.email);
      result.duplicate ? duplicates++ : imported++;
    }
    return json({ imported, duplicates });
  } catch (error) {
    console.error('Selfany import failed', error);
    return json({ error: 'Import stopped. Retry the same export; completed rows will be deduplicated.', imported, duplicates }, 503);
  }
}
