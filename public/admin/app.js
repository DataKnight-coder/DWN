const $ = id => document.getElementById(id);
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
let actor;
let aiAvailable = false;
let consultations = [];
let selectedConsultation;
let contacts = [];
let selectedContact;
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
    ['Consultation enquiries', data.consultations],
  ];
  for (const row of data.confirmedConsultationRevenue) metrics.push([`Confirmed consultation revenue (${row.currency}, minor units)`, row.amount_minor]);
  $('metrics').innerHTML = metrics.map(([label,value]) => `<div class="metric"><strong>${esc(value)}</strong><span>${esc(label)}</span></div>`).join('');
  $('integrations').innerHTML = Object.entries(data.integrations).map(([name,status]) => `<p><strong>${esc(name)}</strong>: ${esc(status)}</p>`).join('');
  aiAvailable = data.integrations.ai === 'on_demand';
  $('ai-suggest').disabled = !aiAvailable;
  $('ai-status').textContent = aiAvailable ? 'On-demand draft; a person must review it.' : 'AI binding not connected. Use the rule-based segment and activity history.';
}
async function loadContacts() {
  const params = new URLSearchParams({ q: $('contact-search').value, from: $('contact-from').value,
    to: $('contact-to').value, source: $('contact-source').value, consent: $('contact-consent').value });
  const data = await getJson(`/api/admin/contacts?${params}`);
  contacts = data.contacts;
  $('contacts').innerHTML = contacts.map(row => `<tr><td>${esc(row.email)}</td><td>${esc(row.first_name)}</td><td>${esc(row.first_source)}</td><td>${esc(row.segment || '—')}</td><td>${esc(row.score ?? '—')}</td><td>${esc(row.stage || 'new')}</td><td>${esc(row.owner_email || '—')}</td><td>${row.marketing_consent ? 'Yes' : 'No'}</td><td>${esc(row.created_at)}</td><td><button type="button" data-contact-id="${esc(row.id)}">View</button></td></tr>`).join('');
}
async function loadContactDetail(id) {
  const data = await getJson(`/api/admin/contacts/${encodeURIComponent(id)}`);
  selectedContact = data.contact;
  $('contact-detail').hidden = false;
  $('contact-summary').textContent = `${data.contact.email} · ${data.contact.segment || 'general'} · score ${data.contact.score ?? 0} · first source ${data.contact.first_source} · UTM ${data.contact.first_utm_source || 'none'} / ${data.contact.first_utm_medium || 'none'} / ${data.contact.first_utm_campaign || 'none'}`;
  $('contact-stage').value = data.contact.stage || 'new';
  $('contact-owner').value = data.contact.owner_email || '';
  $('contact-next-action').value = data.contact.next_action || '';
  $('contact-events').innerHTML = data.events.map(row => {
    let details = {};
    try { details = JSON.parse(row.details_json); } catch { /* Historical event. */ }
    return `<p><strong>${esc(row.kind)}</strong> · ${esc(row.source)} · ${esc(row.created_at)}<br>Interest: ${esc(details.interest || '—')} · Obstacle: ${esc(details.obstacle || '—')} · Referral: ${esc(details.referralCode || '—')}</p>`;
  }).join('') || '<p>No activity yet.</p>';
  $('contact-consultations').innerHTML = data.consultations.map(row => `<p>${esc(row.created_at)} · ${esc(row.stage)} · ${esc(row.message)}</p>`).join('') || '<p>No consultation enquiry.</p>';
  $('contact-tasks').innerHTML = data.tasks.map(row => `<p>${esc(row.status)} · ${esc(row.title)} · due ${esc(row.due_at || 'unscheduled')}</p>`).join('') || '<p>No tasks.</p>';
  $('contact-detail').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
async function loadTasks() {
  const data = await getJson('/api/admin/tasks');
  $('tasks-list').innerHTML = data.tasks.map(row => `<tr><td>${esc(row.email)}</td><td>${esc(row.title)}</td><td>${esc(row.due_at || '—')}</td><td>${esc(row.status)}</td><td>${row.status === 'open' ? `<button type="button" data-task-id="${esc(row.id)}">Mark done</button>` : ''}</td></tr>`).join('');
}
async function loadFunnel() {
  const data = await getJson('/api/admin/funnel');
  $('funnel-summary').textContent = data.note;
  $('funnel-outbound').innerHTML = data.outboundClicks.map(row => `<tr><td>${esc(row.destination)}</td><td>${esc(row.placement)}</td><td>${esc(row.clicks)}</td></tr>`).join('');
  $('funnel-leads').innerHTML = data.leadSubmissions.map(row => `<p>${esc(row.source)}: ${esc(row.submissions)}</p>`).join('') || '<p>No website leads in this window.</p>';
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
  $('referrals-list').innerHTML = data.referrals.map(row => `<tr><td>${esc(row.code)}</td><td>${esc(row.owner_email)}</td><td>${esc(row.leads)}</td></tr>`).join('');
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
  } else await Promise.all([loadOverview(),loadContacts(),loadConsultations(),loadTestimonials(),loadTestimonialPerformance(),loadReferrals(),loadLogs(),loadTasks(),loadFunnel()]);
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
  const columns = ['email','first_name','first_source','segment','score','stage','owner_email','next_action','marketing_consent','event_count','created_at'];
  const csv = [columns.join(','), ...contacts.map(row => columns.map(column => cell(row[column])).join(','))].join('\r\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url; link.download = 'dwn-contacts-visible.csv'; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
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
$('contacts').addEventListener('click', event => {
  const button = event.target.closest('button[data-contact-id]');
  if (button) loadContactDetail(button.dataset.contactId).catch(error => $('contact-status').textContent = error.message);
});
$('contact-save').addEventListener('click', async () => {
  if (!selectedContact) return;
  try {
    await getJson(`/api/admin/contacts/${encodeURIComponent(selectedContact.id)}`, { method: 'PATCH',
      headers: {'Content-Type':'application/json'}, body: JSON.stringify({ stage: $('contact-stage').value,
        ownerEmail: $('contact-owner').value, nextAction: $('contact-next-action').value }) });
    $('contact-status').textContent = 'Lead profile saved.';
    await Promise.all([loadContacts(),loadContactDetail(selectedContact.id)]);
  } catch (error) { $('contact-status').textContent = error.message; }
});
$('new-task-save').addEventListener('click', async () => {
  if (!selectedContact) return;
  try {
    const due = $('new-task-due').value;
    await getJson('/api/admin/tasks', { method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ contactId: selectedContact.id, title: $('new-task-title').value,
        dueAt: due ? new Date(due).toISOString() : '' }) });
    $('new-task-status').textContent = 'Task added.';
    $('new-task-title').value = '';
    await Promise.all([loadTasks(),loadContactDetail(selectedContact.id)]);
  } catch (error) { $('new-task-status').textContent = error.message; }
});
$('ai-suggest').addEventListener('click', async () => {
  if (!selectedContact || !aiAvailable) return;
  $('ai-status').textContent = 'Preparing a review draft…';
  $('ai-suggest').disabled = true;
  try {
    const data = await getJson('/api/admin/ai-suggestion', { method: 'POST',
      headers: {'Content-Type':'application/json'}, body: JSON.stringify({ contactId: selectedContact.id }) });
    $('ai-status').textContent = `${data.suggestion} — Draft for human review; no message sent.`;
  } catch (error) { $('ai-status').textContent = error.message; }
  finally { $('ai-suggest').disabled = !aiAvailable; }
});
$('tasks-list').addEventListener('click', async event => {
  const button = event.target.closest('button[data-task-id]');
  if (!button) return;
  try {
    await getJson(`/api/admin/tasks/${encodeURIComponent(button.dataset.taskId)}`, { method: 'PATCH',
      headers: {'Content-Type':'application/json'}, body: JSON.stringify({ status: 'done' }) });
    await loadTasks();
    if (selectedContact) await loadContactDetail(selectedContact.id);
  } catch (error) { $('error').textContent = error.message; }
});
start().catch(error => {
  $('error').textContent = `${error.message} Check the Cloudflare Access application and D1 binding.`;
});
