# Growth metrics and event definitions

**Snapshot:** 18 November 2026. D1 and the admin dashboard report website activity. Keep Selfany outcomes separate.

| Metric | Source and definition | Limit |
| --- | --- | --- |
| Contacts | Distinct email rows in `contacts`. | Does not count Selfany customers. |
| Lead submissions | `crm_events.kind='lead_submitted'`; one event per unique submitted request ID. Report source and rolling 30-day count. | Multiple enquiries by one contact can count multiple times. |
| Consultation enquiries | `consultations` created from successful `source='consultation'` submissions. | A saved enquiry is not a booked or won consultation. |
| Lead quality | Rule-based `lead_profiles.segment` and `score`; consultation 80, quiz interests 45–55, other enquiries 30. | Triage heuristic, not a prediction or sales result. |
| Follow-up workload | `followup_tasks` open/done status and due time. | Completion is manually marked; it does not prove an email or call was delivered. |
| Acquisition attribution | First UTM fields on a contact and UTM/referral details on each submission. Referral conversion requires a valid website code and a distinct owner. | Last-click, cross-device, and Selfany purchase attribution are unavailable. |
| Webinar, membership, WhatsApp outbound clicks | `outbound_events` after visitor accepts optional tracking; grouped by destination and placement over a rolling 30-day window. | Clicks are not Selfany registrations, attendance, purchases, or WhatsApp conversations. Consent refusal and browser blocking reduce counts. |
| Testimonial experiment | Existing exposure and outbound-click events, deduplicated per visitor session and placement, summarized by variant. | No verified downstream conversion. Treat small or incomplete windows as directional only. |
| Consultation revenue | Only consultation rows explicitly marked won with confirmed amount, currency, and evidence. | No automatic Selfany revenue. Never combine currencies without a verified conversion method. |

## Reporting rules

- The 30-day website funnel is a rolling window; compare equally closed windows when evaluating a change. Do not divide partial-window leads by full-window traffic.
- The dashboard does not have a verified traffic count, so it cannot currently calculate overall visitor-to-lead conversion. Cloudflare Web Analytics may show visits outside the CRM but is not connected to its reports.
- A Meta `Lead` event fires only after the website API confirms a saved lead and the visitor has opted in to optional tracking. No purchase event is emitted.
- Use UTMs consistently: `utm_source` for channel/platform, `utm_medium` for method, `utm_campaign` for campaign. The site records them on form submissions and consented outbound clicks.
- Review the quote experiment after a full 30-day period and enough exposures in both arms. No winner is declared in this release.
