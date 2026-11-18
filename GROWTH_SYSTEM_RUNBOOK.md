# DWN growth system runbook

**Updated:** 18 November 2026. The earlier runbook described a manual Selfany import that is now retired. The current architecture and measurement definitions are in `ARCHITECTURE.md` and `GROWTH_METRICS.md`.

## Local setup

1. Run `npm ci` and `npm run build`.
2. Run `npm run test:crm`, `npm run test:blog`, and `npx tsc --noEmit`.
3. For local API work, copy `wrangler.local.toml` to the ignored `wrangler.toml`; run `npm run db:local:migrate` and `npm run dev:api`. The local configuration has no production secrets or database IDs.

## Cloudflare environments

The Pages project is `dwn` in account `519906a985c9857f844edee4c785dbe1`. Production serves `drhauwaphd.ca` and `www.drhauwaphd.ca`. Preview uses `dwn-growth-staging` D1 and `dwn-testimonials-staging` R2; production uses `dwn-growth-production` D1 and `dwn-testimonials-production` R2. Keep the matching Pages bindings for `DB`, `TESTIMONIAL_IMAGES`, Turnstile, and Access settings.

Before releasing code that reads new tables, apply `migrations/0003_growth.sql` to the corresponding D1 database. Its tables are additive. Back up production D1 before future destructive schema work. The Git-connected Pages build runs `npm run build`; tracked historical `dist` and `node_modules` copies are not deployment inputs.

## Admin and lead operations

Cloudflare Access covers `/admin/` and `/api/admin/*` on both production hostnames. The Pages API also verifies signed Access JWTs, the configured audience/issuer, and the admin email allowlist. Missing Access configuration fails closed. An administrator should review open follow-up tasks, consultation enquiries, quiz answers, stages, and owners daily. Mark a task done only after the human follow-up is completed. Use exports only for authorized website CRM data.

The public lead form requires Turnstile and writes to D1. Marketing consent is separate from submitting an enquiry; a suppression record prevents silent re-enrollment. `/api/unsubscribe` lets a person suppress website DWN email using a Turnstile-protected form. No website marketing email is sent until a verified provider, approved templates, and delivery tests are available.

## Testimonials and evidence

The 34-page owner-approved DWN source supplied 21 distinct quotes. Source screenshots are in private R2; only reviewed, allowlisted evidence images are served publicly. An admin may create a private testimonial draft, then approve or revoke it after checking the evidence reference. Keep the PDF and unrestricted source renders out of the public repository. Individual earnings reports must stay exact and must never be presented as typical or guaranteed.

## External links and reporting

The free webinar is `https://selfany.com/w/DrHauwaPhD1` and paid DWN membership is `https://selfany.com/thedwn`. Selfany handles registration, payments, and member access. The website does not connect to Selfany through an API, webhook, CSV import, Zapier, or checkout. `/api/admin/import` returns HTTP 410. The pending `members.drhauwaphd.ca` hostname is not used for the purchase path.

The website CRM reports saved website leads, consultations, consented outbound clicks, referrals, follow-up tasks, and testimonial experiment events. Outbound clicks are not Selfany registrations or purchases. Search Console, GA4, email delivery, ad-account results, and Workers AI are not connected to the dashboard. Do not interpret an experiment winner without a full window and sufficient exposure.

## Rollback and incident response

Keep the preceding Pages deployment available for rollback. If a release breaks intake, roll back Pages and inspect Function logs and D1 status before resuming promotion. Do not delete production D1 records to roll back application code. Preserve audit logs and existing CRM data.
