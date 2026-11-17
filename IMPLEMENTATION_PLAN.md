# Berrin growth automation: implementation plan

## Current state (audited 2026-11-17)

- The site is a Vite/React static site deployed on Cloudflare Pages. The repository has no Worker, D1 schema, Pages Functions, or deployment workflow.
- The community drawer, email form, and pathway quiz do not persist submissions. The drawer reports success regardless of delivery.
- Hard-coded testimonials, case studies, portfolio outcomes, digital marketing case metrics, brand-content volume, partner/media labels, and impact numbers have no supporting evidence in the repository. Keep them unpublished until verified and approved.
- Meta Pixel is configured in the website. Google Ads uses a placeholder ID, so its conversion calls cannot be treated as validated tracking.
- Selfany publicly lists integrations, including Zapier, but no verified event payload or account-specific access has been provided. Payments and membership access remain on Selfany.
- The 34-page testimonial PDF was received and reviewed on 2026-11-17. The project owner subsequently confirmed that all items are authenticated and authorized for marketing use. Twenty-one distinct excerpts are cataloged; page 29 repeats page 4. All 34 source page images were uploaded to the private `dwn-testimonials-production` R2 bucket. The catalog preserves exact source excerpts and page references.
- The owner authorized retirement of the three Sagesse databases and dependent Workers. SQL exports and Worker-content/settings backups were saved under ignored `tmp/backups/`, validated, then those resources were removed. Separate `dwn-growth-staging` and `dwn-growth-production` D1 databases were created and migrated.
- The preview Pages environment is bound to staging D1 and R2; live API smoke checks confirmed 21 testimonials, an R2 image, lead deduplication, and proof-event deduplication. Production Pages is bound to the separate production D1 and R2 bucket.
- Production deployment from Git commit `16fbe90` passed live API checks and deduplicated lead/proof-event smoke tests; test records were removed. Separate Turnstile widgets and Pages variables are configured; preview rejects a lead without a challenge token. A production Git rebuild and solved browser challenge test remain. Cloudflare Access app creation was rejected for the current OAuth token; the admin API remains fail closed until an Access application and `ACCESS_ISSUER`/`ACCESS_AUD` are configured.

## Delivery order

1. Build a D1-backed lead intake with validation, consent capture, deduplication, source attribution, rate limiting, and honest user feedback. Replace unsupported public claims.
2. Add authenticated CRM administration, consultation pipeline, idempotent event imports, and reports. Configure Cloudflare bindings and run a staging migration before production.
3. Confirm Selfany's supported account-level export or integration, map verified webinar and purchase records, then enable appropriate follow-ups. No purchase is inferred from a CTA click.
4. Add Resend only after domain verification, API key, approved templates, suppression handling, and a tested unsubscribe flow. No marketing sends without explicit consent.
5. Import genuine testimonials from the requested PDF as private drafts. Publish only records with consent, redacted screenshots, and reviewed claims.
6. Add measured funnel and referral experiments after trustworthy registration and purchase event data exists. Connect analytics and ad spend through authorized credentials. Never launch or change ads automatically.
7. Complete audit trails, access controls, operational checks, staging tests, and a reviewed production deployment.

## External setup needed

- Cloudflare Pages project identification and authenticated Wrangler or dashboard access; a D1 database bound as `DB` in both staging and production.
- Selfany account-level integration/export documentation or authorized exports with stable record IDs.
- Resend verified sender, API key, and approved email templates.
- Testimonial PDF, publication consent, and evidence review.
- GA4, Search Console, Meta, and Cloudflare Analytics read access for external reporting.

All disconnected metrics remain unavailable. Revenue is recorded only from verified transactions.
