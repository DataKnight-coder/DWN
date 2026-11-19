# Email templates (DRAFT: not approved, not sent)

**Status:** Drafts only. Nothing in the code sends these. Resend is not connected (`/api/health` reports `resend: "not_connected"`). Do not activate sending until the sender domain, email service and final copy are approved by Dr. Hauwa.

**Rules for every email**
- Marketing emails go only to contacts with `marketing_consent = 1`. Check the flag at send time, not just at signup.
- Every marketing email carries the unsubscribe link and the sender's postal address. Unsubscribing sets suppression; suppressed contacts are never emailed again (the CRM already enforces this).
- Only verified offers and links from `content/offers.json` appear. No prices, dates, earnings, curriculum or guarantees unless confirmed by Dr. Hauwa.
- Placeholders: `{{firstName}}`, `{{unsubscribe_link}}`, `{{sender_name}}`, `{{postal_address}}`.
- Sender and reply-to: to be decided (`{{sender_name}}` and a verified domain address).

Segments come from the CRM `lead_profiles.segment`: `ai_training`, `community` (DWN), `consulting`, `digital_business`, `career`, `real_estate`, `networking`.

## Service emails: implementation and go-live (code added, sending OFF)

Code: `server/email.mjs`, called from `functions/api/leads.js` after a lead is saved. Log table: `email_log` (migration `0006_email_log.sql`).

- **Sends only service emails:** free-guide delivery, AI Training / consultation / DWN enquiry acknowledgements. Newsletter and quiz signups get none. Welcome sequence and promotions are not implemented.
- **Off unless both are set:** Pages secret `RESEND_API_KEY` and variable `EMAIL_SENDING_ENABLED=true`. Anything else logs `skipped_disabled` and sends nothing.
- **Sender:** `Dr. Hauwa | Diaspora Wealth Network <hello@mail.drhauwaphd.ca>`; reply-to `hello@drhauwaphd.ca` (override with `EMAIL_FROM`, `EMAIL_REPLY_TO`).
- **Guards:** skips suppressed addresses, skips a repeat of the same template within 24 hours, and uses an idempotency key so retries cannot double-send. A failed send is logged and never blocks the form.
- **Health:** `/api/health` and the admin overview report `not_connected`, `connected_sending_disabled` or `enabled`.

Go-live order: apply `0006_email_log.sql` to production D1, deploy, verify the domain in Resend, add `RESEND_API_KEY`, run controlled test sends to an authorized address, then get approval before setting `EMAIL_SENDING_ENABLED=true`.

---

## 1. Free guide delivery (service message, sent once per request, no consent needed)

Trigger: successful `free_guide_popup` submission. Not a marketing email; contains no promotion beyond the guide.

**Subject:** Your free guide: How to Make Money Online

Hi {{firstName}},

Thanks for requesting the free beginner guide. You can open it here:

[Download Free Guide](https://selfany.com/ABNVUFTKMG)

If the link does not work, reply to this email and we will help.

{{sender_name}}

---

## 2. Welcome sequence (marketing; consent required)

Trigger: `free_guide_popup` with marketing consent. Send email 2 about two days after the guide, email 3 about three days after that, then stop. Wait times are suggestions for approval.

### Email 2: Where to start (segment-aware paragraph)

**Subject:** A practical next step after the guide

Hi {{firstName}},

Many people read a guide and are not sure what to do next. Start with one idea that fits the time and skills you have now, rather than trying everything at once.

*(Choose one paragraph by the interest the person selected.)*

- **AI Training (`ai_training`):** You told us AI interests you. Practical AI skills can support work, learning and business. Training details are still being finalised, so tell us what you want to learn and we will follow up: [Register your interest](https://drhauwaphd.ca/ai-training/)
- **Digital Income (`digital_business`):** The free Online Monetization Masterclass looks at practical ways to monetize skills online for diaspora professionals: [Secure Your Seat](https://selfany.com/w/DrHauwaPhD1)
- **DWN Membership (`community`):** DWN is a community with mentorship and exploration of 18 income pathways: [Learn about DWN](https://selfany.com/thedwn)
- **Cybersecurity (`career`):** Read our guide on getting into cybersecurity in Canada: [Read the article](https://drhauwaphd.ca/blog/cybersecurity-career-canada/)
- **Real Estate (`real_estate`):** An educational blueprint on strategies for reducing or offsetting housing costs: [Explore the Blueprint](https://stan.store/DrHauwaPhD/p/how-to-live-rentfree-in-canada)
- **Personal Mentorship (`consulting`):** A one-on-one session gives personalized guidance on opportunities and a growth strategy: [Book a Strategy Session](https://selfany.com/oneononewithdrhauwa)

{{sender_name}}

{{postal_address}} · [Unsubscribe]({{unsubscribe_link}})

### Email 3: Join the community

**Subject:** Build with others, not alone

Hi {{firstName}},

Progress is easier with people who understand your situation. The Diaspora Wealth Network is a community with education and mentorship, and it explores 18 income pathways. It is not a promise of any result; outcomes vary by person.

[Become a DWN Member](https://selfany.com/thedwn)

If DWN is not right for you, the [free masterclass](https://selfany.com/w/DrHauwaPhD1) is a no-cost way to learn more.

{{sender_name}}

{{postal_address}} · [Unsubscribe]({{unsubscribe_link}})

---

## 3. AI Training enquiry acknowledgement (service message; follow-up marketing needs consent)

Trigger: `ai_training` enquiry from the website form.

**Subject:** We received your AI Training enquiry

Hi {{firstName}},

Thank you for your interest in practical AI training. We received your enquiry and will respond personally. Curriculum, dates, pricing and registration details are not published yet, so we do not want to guess. We will share them directly when they are confirmed.

In the meantime, the free guide [How to Make Money Online](https://selfany.com/ABNVUFTKMG) is a good place to begin.

{{sender_name}}

*(Add the unsubscribe footer only if this contact has marketing consent and the email goes beyond acknowledging the enquiry.)*

---

## 4. DWN membership enquiry (service acknowledgement)

Trigger: `community` enquiry (consultation drawer "Join DWN").

**Subject:** Thanks for your interest in the Diaspora Wealth Network

Hi {{firstName}},

Thanks for getting in touch. DWN offers community education, mentorship and exploration of 18 income pathways. You can read the details and join here:

[Become a DWN Member](https://selfany.com/thedwn)

We will also follow up if you have questions.

{{sender_name}}

---

## 5. Consultation acknowledgement (service message)

Trigger: `consulting` enquiry.

**Subject:** We received your consultation request

Hi {{firstName}},

Thank you for your request. A one-on-one strategy session offers personalized guidance to identify opportunities and develop an actionable growth strategy. You can book it here:

[Book a Strategy Session](https://selfany.com/oneononewithdrhauwa)

If you have questions first, reply to this email.

{{sender_name}}

---

## Approval checklist (before any sending)

- [ ] Sender domain verified (SPF, DKIM, DMARC) with the chosen email service.
- [ ] Final copy approved by Dr. Hauwa, including subject lines and sign-off.
- [ ] Postal address and sender name confirmed.
- [ ] Unsubscribe link tested end to end, including suppression.
- [ ] Wait times between emails approved.
- [ ] Test sends to an authorized tester only, then a small first batch.

---

## Welcome sequence: implementation and go-live (built, switched OFF)

Copy approved by the site owner on 19 Nov 2026 exactly as written in section 2.

**Code:** `server/sequence.mjs`, protected hourly endpoint `/api/cron/sequence`, and the `dwn-cron` worker (`workers/dwn-cron`, runs at the top of every hour and only calls the endpoint). `/api/health` shows `welcomeSequence`.

**Who gets it:** only contacts who ticked the optional marketing box on the free-guide popup (`consent_source = free_guide_popup`) **and** whose consent was recorded on or after `SEQUENCE_SINCE`. Never suppressed addresses. Consent is re-checked before each email, so someone who withdraws stops receiving them.

**When:** email 2 two days after consent; email 3 three days after email 2 was sent; then it stops. Each email is sent once (log plus idempotency key). A failed send is retried hourly, at most three times.

**It sends nothing until all of these are set (Pages, Production):**
| Setting | Value |
|---|---|
| `SEQUENCE_ENABLED` | `true` |
| `EMAIL_POSTAL_ADDRESS` | the sender's postal address, shown in every footer (required by Canadian anti-spam law) |
| `SEQUENCE_SINCE` | an ISO date such as `2026-11-20T00:00:00Z`; people who consented earlier are not enrolled |
| `EMAIL_SENDING_ENABLED` | already `true` |

**Test first:** set `EMAIL_TEST_ALLOWLIST` to your own address; only that address is emailed (health shows `on_test_allowlist_only`). Remove it to go live for everyone.

**Unsubscribe:** every email links to the site's Stop DWN emails form and carries a List-Unsubscribe header; unsubscribing suppresses the address everywhere.

**Switch off:** delete `SEQUENCE_ENABLED` and redeploy.
