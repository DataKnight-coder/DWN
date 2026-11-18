# Deployment report

**Release:** `codex/growth-system`, 18 November 2026. Production was first released from Git commit `26421d9`; this report includes the subsequent visual polish release.

## Verification completed before release

- `npm run test:crm`: 11/11 passed, covering lead validation, Turnstile failure, proof deduplication, consultation persistence, suppression, self-service unsubscribe, referral attribution, Access-admin behavior, and the disabled Selfany import.
- `npm run test:blog`: passed for article content, metadata, schema, assets, and sitemap.
- `npx tsc --noEmit` and `node --check public/admin/app.js`: passed.
- Staging D1 migration `0003_growth.sql`: applied successfully. Preview health showed D1 intake, Turnstile, and R2 availability; the outbound API accepted one synthetic event. Preview admin APIs remained closed without Access credentials.
- Final preview at `https://codex-growth-system.dwn-am3.pages.dev`: `/`, `/blog/`, `/sitemap.xml`, `/api/health`, `/api/testimonials`, and an allowlisted R2 screenshot returned HTTP 200. Health returned `leadIntake:true`, `turnstile:true`, and `testimonialImages:true`. Unauthenticated `/api/admin/overview` returned HTTP 403.
- Final desktop Lighthouse preview: performance 90, accessibility 100, best practices 100, SEO 69; FCP 0.8 s, LCP 1.3 s, TBT 80 ms, CLS 0.002. Final mobile Lighthouse preview: performance 54, accessibility 100, best practices 100, SEO 69; FCP 1.9 s, LCP 3.8 s, TBT 2,840 ms, CLS 0.008. Mobile CPU work remains a performance opportunity. Preview SEO is affected by Cloudflare preview `noindex`; production SEO should be measured separately. These are simulated runs, not field Core Web Vitals.
- Production D1 migration `0003_growth.sql`: applied successfully before the application release. It added profile, task, and outbound-event tables without removing existing data.

## Release and production checks

- The Git-connected Pages deployment for `main` became Active as production deployment `775e259a-9e47-4fb4-a4c6-d8b9c2fa5099` from commit `26421d9`. The branch preview also became Active. No direct production Pages upload was used.
- After edge propagation, `https://drhauwaphd.ca/api/health` and the production deployment URL reported `leadIntake:true`, `turnstile:true`, `testimonialImages:true`, and `selfany:"external_links_only"`. Apex and `www` homepages, blog index, article, sitemap, robots file, approved testimonial API, and an allowlisted R2 image returned HTTP 200.
- The apex homepage returned HSTS, content security policy, frame protection, referrer policy, and permissions policy headers. The production page did not carry the preview `noindex` header.
- Unauthenticated `/admin/`, `/api/admin/overview`, and `/api/admin/import` redirected to Cloudflare Access. A read-only production D1 query confirmed `lead_profiles`, `followup_tasks`, and `outbound_events` exist.
- Invalid production POSTs to `/api/leads` and `/api/unsubscribe` returned HTTP 400 without writing data. A live headless-browser visit to `/#contact` visibly opened the consultation drawer; visual review led to a tracking-banner stacking and placeholder-contrast fix in the final release.

The final visual-polish patch adjusts the consent banner behind an open dialog and raises form placeholder contrast. The source of truth for its deployment ID is the Cloudflare Pages production deployment list; verify the newest `main` entry is Active before relying on this report.

## Operational limits

No email is sent: the sender and approved templates are unavailable. Workers AI is not bound, so optional draft suggestions remain disabled. Website counts cannot verify Selfany registrations or payments. A real Turnstile-solved browser submission and an authenticated admin session require a person on the live site; automated tests verify the request handling but cannot substitute for those checks.
