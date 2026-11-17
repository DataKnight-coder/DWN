# Berrin DWN growth system runbook

## Current deployment status

The implementation is connected to separate staging and production D1 databases. On 2026-11-17, the owner authorized retirement of Sagesse, whose three databases occupied D1 capacity. Their SQL exports and the three dependent Workers' settings/content were backed up under ignored `tmp/backups/` and verified before deletion. Staging and production D1 databases were then created and migrated. Preview API smoke checks confirmed a lead persisted once on retry, 21 testimonial rows loaded, an R2 image served, and experiment events deduplicated. Production Pages bindings are configured; release verification is recorded separately below.

The Pages project is `dwn` in Cloudflare account `519906a985c9857f844edee4c785dbe1`. Its production domains are `drhauwaphd.ca` and `www.drhauwaphd.ca`. The project is Git connected.

## Local setup and verification

1. `npm ci`
2. Copy `wrangler.local.toml` to `wrangler.toml`. The latter is gitignored and contains only a local dummy database ID.
3. `npm run db:local:migrate` (uses the isolated local D1 ID in `wrangler.local.toml`)
4. `npm run build`
5. `npm run test:crm` and `npm run test:blog`
6. `npm run dev:api`, then test `http://localhost:8788/api/health` and a form submission against local D1.

The local Wrangler configuration contains no production database ID or secret. Do not use it for production deployment.

## Cloudflare deployment status

1. **Done:** Separate `dwn-growth-staging` and `dwn-growth-production` D1 databases were created. `migrations/0001_crm.sql` and `migrations/0002_testimonials.sql` ran on both. The Pages `DB` binding points to the matching database in each environment. Separate private `dwn-testimonials-staging` and `dwn-testimonials-production` R2 buckets are bound as `TESTIMONIAL_IMAGES`.
2. **Done in preview:** `/api/health` reports `leadIntake:true`; a consented test lead persisted once after retry, and testimonial exposure/click events deduplicated. The public testimonial API returned 21 records and an R2 image endpoint returned HTTP 200.
3. **Configured:** The owner created one Cloudflare Access application for the admin page and API on both production hostnames, with an email-restricted Allow policy. Unauthenticated requests redirect to Access while the public homepage stays open. Production Pages has `ACCESS_ISSUER`, `ACCESS_AUD`, and `ADMIN_EMAILS`; the API verifies Access JWT signatures and role allowlists. A signed-in admin browser check remains.
4. **Deployed:** Separate Turnstile widgets were created for preview and production. Each Pages environment has its own public `VITE_TURNSTILE_SITE_KEY` and secret `TURNSTILE_SECRET`. Both live builds include the matching site key, `/api/health` reports `turnstile:true`, and production rejects a lead without a challenge token. A valid solved challenge still needs browser verification.
5. **Done:** The production Git release returned 21 approved testimonials, a source image, and connected lead intake. A test lead and proof events persisted with deduplication; synthetic records were removed from production D1 afterward. Retain the prior Pages deployment for rollback.

The preview branch is `codex/growth-automation-preview`; its D1 and R2 bindings are live. The production domain was released from Git commit `04283c3`, including the production Turnstile build variable. Production D1 showed 21 approved testimonials and zero synthetic contacts or experiment events after cleanup. Browser UI verification remains pending because the computer-use runtime could not initialize.

## Testimonial review

The supplied 34-page scanned PDF was visually reviewed. It includes community posts about affiliate sales, AI and remote work, Airbnb hosting, digital businesses, and community support, as well as private conversations and screenshots of reported earnings. Some pages repeat or support the same report. The PDF is stored outside the public repository, and the rendered review images are under ignored `tmp/`.

On 2026-11-17, the project owner explicitly confirmed that all items are authenticated and authorized for marketing use. The owner confirmation is recorded as `owner-confirmed-2026-11-17` in the seed migration; no additional consent collection is required for these supplied assets. `content/testimonials.json` has 21 distinct source excerpts grouped by category, achievement and placement; page 29 duplicates page 4. `scripts/build-testimonial-seed.mjs` generates the idempotent `migrations/0002_testimonials.sql`. All 34 source page images were uploaded to the private `dwn-testimonials-production` R2 bucket under `source/page-NN.jpg`. The public image endpoint requires an approved D1 row, the `TESTIMONIAL_IMAGES` R2 binding, and a public evidence allowlist. Source pages 5, 8, 15 and 19 remain private because their full screenshots show separate conversations, third-party names or financial details beyond the published excerpt. Their approved quotes remain on the site. Keep the source PDF and local renders out of GitHub. Do not imply that reported results are typical or guaranteed.

The site assigns visitors consistently to a no-quote or quote variant at the webinar and membership CTAs. A first-party endpoint records only exposure and outbound-click events, deduplicated by session and placement. These clicks are not registrations or purchases. The admin dashboard reports each variant's exposures and outbound clicks over the last 30 days. Wait for enough traffic and a full closed window before interpreting the result.

## External integrations

- **Selfany:** Payments and membership access remain there. The admin import endpoint accepts authorized, verified exports with stable external IDs. Confirm the account-specific export fields or official event contract before enabling an automated sync. A website CTA click never counts as a registration or purchase.
- **Resend:** Sender domain, API key, and approved email templates are still required. No email is sent by this build. Consent and suppression data are stored, but sending jobs must wait for the approved templates and delivery testing.
- **Analytics and ads:** GA4, Search Console, Cloudflare Web Analytics, and Meta account authorization are not configured. The dashboard marks disconnected metrics unavailable. No ad changes or spend are automated.
- **Referrals:** Codes and attribution are stored, but rewards require administrator approval and verified conversion events.

## Rollback

Keep the last production Pages deployment available. If a verified production release fails, roll back in Pages and investigate the API logs before restoring form traffic. D1 data should be backed up before migrations or imports; do not roll back schema changes by deleting live records.

The production Access application covers `/admin`, `/admin/*`, and `/api/admin/*` on both `drhauwaphd.ca` and `www.drhauwaphd.ca`. Its Allow policy includes `berrinagency@gmail.com`. The Pages production environment sets the matching `ACCESS_ISSUER` and `ACCESS_AUD`; the API verifies the Access JWT signature, issuer, audience, expiry, and email allowlist. After deployment, sign in at `/admin/` as the allowed email and verify `/api/admin/whoami` returns the administrator role. A missing setting fails closed.

## Selfany import contract

Selfany's public documentation lists an Integrations area and Zapier support, but it does not establish this account's webinar registration, attendance, membership, renewal, or cancellation event payloads. The system therefore has an **administrator-verified import**, not a live Selfany sync. Do not infer registrations or purchases from website clicks.

An admin may paste up to 100 mapped rows into `/admin/` and attest that they were checked against an authorized Selfany admin export. Each event needs a stable Selfany transaction or registration ID and a timestamp. Example:

```json
[
  {"kind":"webinar_registration","externalId":"selfany-registration-123","email":"member@example.com","occurredAt":"2026-11-17T12:00:00Z","webinarCode":"DrHauwaPhD1"},
  {"kind":"membership_purchase","externalId":"selfany-order-456","email":"member@example.com","occurredAt":"2026-11-17T13:00:00Z","amountMinor":15000,"currency":"CAD"}
]
```

Supported kinds: `webinar_registration`, `webinar_attendance`, `membership_purchase`, `membership_renewal`, `membership_cancellation`, `membership_refund`. Purchase, renewal, and refund amounts use the currency's minor unit. Events are deduplicated by source and external ID. Revenue is summed by currency, with recorded refunds subtracted. Membership status uses the latest imported event per contact. Imports do not grant or remove access in Selfany.

Before a real-time connector is added, obtain account-level Selfany documentation and sample signed payloads or an authorized export. Verify event signatures and replay protection. Do not send webinar reminders without a trusted event schedule and approved template.

## Testimonial administration

The supplied 34-page PDF has been reviewed, its 21 distinct approved excerpts are live in D1, and the source images are in private R2. The public endpoint returns only approved records. An administrator can add a private draft with evidence and approval references, then approve or revoke it in the dashboard. The public evidence allowlist limits screenshot links to reviewed pages; new images remain private until explicitly added to that list.

## Other disconnected services

- Resend: no verified sender, API key, or approved templates supplied. No welcome, reminder, follow-up, or marketing email is sent. Admin suppression is available; a recipient-facing unsubscribe flow must be completed before activation.
- GA4, Search Console, Cloudflare Web Analytics, and Meta Marketing API: no authorized read connection. Dashboard marks metrics unavailable. The existing Meta Pixel is now loaded only after an explicit visitor tracking choice.
- A/B testing: no traffic and conversion baseline or verified Selfany outcomes. Do not claim a winner or automatically change prices, guarantees, ads, or membership terms.
- Referral links can be assigned by an admin. A lead attribution is recorded only for a valid code and a different owner; registration and purchase counts require verified Selfany imports. No rewards are issued.

## Source documentation

- [Cloudflare Pages D1 bindings](https://developers.cloudflare.com/pages/functions/bindings/)
- [Cloudflare D1 batch transaction behavior](https://developers.cloudflare.com/d1/worker-api/d1-database/)
- [Cloudflare Access JWT validation](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/)
- [Selfany integrations](https://www.support.selfany.com/integrations)
- [Selfany master FAQ](https://www.support.selfany.com/blog/selfany-master-faq)
