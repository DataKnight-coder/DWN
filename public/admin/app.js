const $ = id => document.getElementById(id);
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
let actor;
let consultations = [];
let selectedConsultation;
let contacts = [];
async function getJson(path, options) {
  const response = await fetch(path, { credentials: 'same-origin', ...options });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `Request failed (${response.status})`);
  return data;
}
async function loadOverview() {
  const data = await getJson('/api/admin/overview');
  const metrics = [
    ['Contacts', data.contacts], ['Lead submissions', data.leadSubmissions],
    ['Verified webinar registrations', data.verifiedWebinarRegistrations],
    ['Members with latest imported active status', data.members], ['Consultation enquiries', data.consultations],
  ];
  for (const row of data.confirmedRevenue) metrics.push([`Membership receipts (${row.currency}, minor units)`, row.amount_minor]);
  for (const row of data.confirmedConsultationRevenue) metrics.push([`Confirmed consultation revenue (${row.currency}, minor units)`, row.amount_minor]);
  $('metrics').innerHTML = metrics.map(([label,value]) => `<div class="metric"><strong>${esc(value)}</strong><span>${esc(label)}</span></div>`).join('');
  $('integrations').innerHTML = Object.entries(data.integrations).map(([name,status]) => `<p><strong>${esc(name)}</strong>: ${esc(status)}</p>`).join('');
}
async function loadContacts() {
  const params = new URLSearchParams({ q: $('contact-search').value, from: $('contact-from').value,
    to: $('contact-to').value, source: $('contact-source').value, consent: $('contact-consent').value });
  const data = await getJson(`/api/admin/contacts?${params}`);
  contacts = data.contacts;
  $('contacts').innerHTML = contacts.map(row => `<tr><td>${esc(row.email)}</td><td>${esc(row.first_name)}</td><td>${esc(row.first_source)}</td><td>${row.marketing_consent ? 'Yes' : 'No'}</td><td>${esc(row.event_count)}</td><td>${esc(row.created_at)}</td></tr>`).join('');
}
async function loadLogs() {
  const data = await getJson('/api/admin/logs');
  $('audit-list').innerHTML = data.audit.map(row => `<tr><td>${esc(row.created_at)}</td><td>${esc(row.actor)}</td><td>${esc(row.action)}</td><td>${esc(row.target_type)}: ${esc(row.target_id)}</td></tr>`).join('');
  $('automation-list').textContent = data.automation.length ? `${data.automation.length} recorded operations.` : 'No automation runs recorded.';
}
async function loadConsultations() {
  const data = await getJson('/api/admin/consultations');
  consultations = data.consultations;
  $('consultations').innerHTML = consultations.map(row => `<tr><td>${esc(row.email)}</td><td>${esc(row.stage)}</td><td>${esc(row.created_at)}</td><td><button type="button" data-consultation-id="${esc(row.id)}">Manage</button></td></tr>`).join('');
}
async function loadReferrals() {
  const data = await getJson('/api/admin/referrals');
  $('referrals-list').innerHTML = data.referrals.map(row => `<tr><td>${esc(row.code)}</td><td>${esc(row.owner_email)}</td><td>${esc(row.leads)}</td><td>${esc(row.registrations)}</td><td>${esc(row.purchases)}</td></tr>`).join('');
}
async function loadTestimonials() {
  const data = await getJson('/api/admin/testimonials');
  $('testimonial-list').innerHTML = data.testimonials.map(row => `<article><p>“${esc(row.quote)}” — ${esc(row.attribution)}</p><small>${esc(row.category)} · ${esc(row.status)} · consent: ${esc(row.consent_reference || 'missing')} · evidence: ${esc(row.evidence_key || 'missing')}</small>${actor.role === 'admin' && row.status !== 'approved' ? `<div><button data-testimonial-id="${esc(row.id)}" data-action="approved">Approve</button><button data-testimonial-id="${esc(row.id)}" data-action="rejected">Reject</button></div>` : ''}</article>`).join('') || '<p>No drafts yet.</p>';
}
async function loadTestimonialPerformance() {
  const data = await getJson('/api/admin/testimonial-performance');
  $('testimonial-performance').innerHTML = data.results.map(row => `<tr><td>${esc(row.placement)}</td><td>${esc(row.variant)}</td><td>${esc(row.impressions)}</td><td>${esc(row.clicks)}</td><td>${row.clickRate === null ? 'Unavailable' : `${(row.clickRate * 100).toFixed(1)}%`}</td></tr>`).join('');
}
async function start() {
  actor = await getJson('/api/admin/whoami');
  if (actor.role === 'reviewer') {
    document.querySelectorAll('main > aside a, main section').forEach(element => {
      if (element.getAttribute('href') !== '#testimonials' && element.id !== 'testimonials') element.hidden = true;
    });
    await loadTestimonials();
  } else await Promise.all([loadOverview(),loadContacts(),loadConsultations(),loadTestimonials(),loadTestimonialPerformance(),loadReferrals(),loadLogs()]);
}
let searchTimer;
$('contact-search').addEventListener('input', () => { clearTimeout(searchTimer); searchTimer = setTimeout(() => loadContacts().catch(error => $('error').textContent = error.message), 300); });
for (const id of ['contact-from','contact-to','contact-source','contact-consent']) $(id).addEventListener('change', () => loadContacts().catch(error => $('error').textContent = error.message));
$('export-contacts').addEventListener('click', () => {
  const cell = value => {
    let text = String(value ?? '');
    if (/^[=+\-@]/.test(text)) text = `'${text}`;
    return `"${text.replace(/"/g, '""')}"`;
  };
  const columns = ['email','first_name','first_source','marketing_consent','event_count','created_at'];
  const csv = [columns.join(','), ...contacts.map(row => columns.map(column => cell(row[column])).join(','))].join('\r\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url; link.download = 'dwn-contacts-visible.csv'; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
$('import-button').addEventListener('click', async () => {
  $('import-status').textContent = '';
  if (!$('verified').checked) { $('import-status').textContent = 'Verify the source first.'; return; }
  let rows;
  try { rows = JSON.parse($('import-json').value); } catch { $('import-status').textContent = 'Enter valid JSON.'; return; }
  $('import-button').disabled = true;
  try {
    const result = await getJson('/api/admin/import', { method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ source: 'selfany_admin_export', verified: true, rows }) });
    $('import-status').textContent = `${result.imported} imported; ${result.duplicates} duplicates.`;
    await Promise.all([loadOverview(), loadContacts()]);
  } catch (error) { $('import-status').textContent = error.message; }
  finally { $('import-button').disabled = false; }
});
$('create-referral').addEventListener('click', async () => {
  $('referral-status').textContent = '';
  try {
    const data = await getJson('/api/admin/referrals', { method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ ownerEmail: $('referral-owner').value }) });
    $('referral-status').textContent = `Created: ${data.url}`;
    await loadReferrals();
  } catch (error) { $('referral-status').textContent = error.message; }
});
$('suppress-button').addEventListener('click', async () => {
  $('suppress-status').textContent = '';
  try {
    await getJson('/api/admin/suppressions', { method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ email: $('suppress-email').value, reason: $('suppress-reason').value }) });
    $('suppress-status').textContent = 'Address suppressed.';
    await loadContacts();
  } catch (error) { $('suppress-status').textContent = error.message; }
});
$('testimonial-create').addEventListener('click', async () => {
  $('testimonial-status').textContent = '';
  try {
    await getJson('/api/admin/testimonials', { method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ quote: $('testimonial-quote').value, attribution: $('testimonial-attribution').value,
        category: $('testimonial-category').value, evidenceKey: $('testimonial-evidence').value,
        consentReference: $('testimonial-consent').value }) });
    $('testimonial-status').textContent = 'Private draft saved.';
    await loadTestimonials();
  } catch (error) { $('testimonial-status').textContent = error.message; }
});
$('testimonial-list').addEventListener('click', async event => {
  const button = event.target.closest('button[data-testimonial-id]');
  if (!button) return;
  $('testimonial-status').textContent = '';
  try {
    await getJson(`/api/admin/testimonials/${encodeURIComponent(button.dataset.testimonialId)}`, {
      method: 'PATCH', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ status: button.dataset.action }) });
    $('testimonial-status').textContent = `Review status: ${button.dataset.action}.`;
    await loadTestimonials();
  } catch (error) { $('testimonial-status').textContent = error.message; }
});
$('consultations').addEventListener('click', event => {
  const button = event.target.closest('button[data-consultation-id]');
  if (!button) return;
  selectedConsultation = consultations.find(row => row.id === button.dataset.consultationId);
  if (!selectedConsultation) return;
  $('pipeline-editor').hidden = false;
  $('pipeline-contact').textContent = `${selectedConsultation.email} · ${selectedConsultation.message}`;
  $('pipeline-stage').value = selectedConsultation.stage;
  $('pipeline-amount').value = selectedConsultation.confirmed_revenue_minor ?? '';
  $('pipeline-currency').value = selectedConsultation.currency ?? '';
  $('pipeline-evidence').value = selectedConsultation.revenue_evidence ?? '';
});
$('pipeline-save').addEventListener('click', async () => {
  if (!selectedConsultation) return;
  $('pipeline-status').textContent = '';
  try {
    await getJson(`/api/admin/consultations/${encodeURIComponent(selectedConsultation.id)}`, {
      method: 'PATCH', headers: {'Content-Type':'application/json'}, body: JSON.stringify({
        stage: $('pipeline-stage').value, confirmedRevenueMinor: $('pipeline-amount').value,
        currency: $('pipeline-currency').value, revenueEvidence: $('pipeline-evidence').value }) });
    $('pipeline-status').textContent = 'Stage saved.';
    await Promise.all([loadConsultations(),loadOverview()]);
  } catch (error) { $('pipeline-status').textContent = error.message; }
});
start().catch(error => {
  $('error').textContent = `${error.message} Check the Cloudflare Access application and D1 binding.`;
});
