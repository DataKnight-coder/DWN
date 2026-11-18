# Growth system implementation status

**Snapshot:** 18 November 2026. This document describes the `codex/growth-system` release. See `DEPLOYMENT_REPORT.md` for the deployment and live verification result.

## Completed in the project

| Area | Implemented | Operational boundary |
| --- | --- | --- |
| Conversion paths | Clear free webinar and paid DWN membership links; `#contact` opens a consultation enquiry; DWN enquiry is labelled as an enquiry; mobile programme navigation is repaired. | Webinar registration, checkout, payment, and membership access remain entirely on Selfany. |
| Lead intake | Existing Turnstile-protected Pages Function and D1 CRM are extended with consultation messages, deterministic segments and scores, lead stages, owner, next action, and automatic human follow-up tasks. | No automated email or booking is sent. |
| CRM dashboard | Contact detail, quiz and activity history, consultation records, editable lead profile, follow-up tasks, referral attribution, 30-day website funnel, and existing testimonial controls. | The funnel shows website events only. Selfany import is disabled and returns HTTP 410. |
| Tracking | Consent-aware Meta Pixel; anonymous, first-party outbound clicks for verified Selfany and WhatsApp destinations; UTM/referral values survive same-session navigation; tracking choice can be reopened. | A click is not a registration or purchase. Cloudflare basic visit analytics are separate from the optional Meta and click tracking choice. |
| Email preference | Turnstile-protected self-service suppression and contact consent update. | No sender or approved templates are connected. Existing consent is recorded but no website marketing email is sent. |
| Proof | Existing 21 approved D1 testimonials and private R2 screenshots remain; contextual quote experiment remains. | Member outcomes are individual reports, not guarantees. Do not call a variant a winner without enough traffic and a closed window. |
| Site quality | Removed the preloader, Lenis scrolling, unused cursor/magnetic components, and false placeholder links; deferred lower-page images/video; initial SEO/social metadata and structured data; security headers; keyboard dialog and reduced-motion support. | Performance is device and network dependent; measured preview results are in the deployment report. |
| AI | Optional, admin-only on-demand next-action draft with redaction, a daily cap, and human review. Deterministic lead classification works without AI. | Cloudflare Workers AI binding is not configured; the button is disabled until a deliberate cost/configuration decision. |

## Preserved

The React/Vite Pages site, static article and sitemap, Cloudflare Access-protected admin, D1 production/staging separation, private R2 evidence, Turnstile, CRM consent and audit tables, referral codes, approved testimonial catalog, and direct Selfany checkout/webinar links remain in place.

## Remaining dependencies and limits

1. A verified email sender, credentials, approved message templates, and a delivery test are needed before welcome messages, enquiry notifications, reminders, or follow-up emails can operate. The CRM tasks provide a manual response queue now.
2. Search Console, GA4, advertising accounts, and Cloudflare analytics data are not read by the CRM. Website form and outbound event counts are available; traffic-to-lead and sale rates are unavailable.
3. Workers AI is intentionally inactive without an `AI` binding and usage decision. Rule-based segmentation remains available.
4. The project has no approved privacy/terms text. Placeholder legal links were removed; publish approved legal copy when supplied.
5. Selfany remains external by requirement. Its customer, registration, attendance, and revenue figures must be read there. The website cannot infer them from outbound clicks.

## Next operational action

Review new CRM follow-up tasks daily and record stage/owner/next action. Connect a verified sender only after approved templates and test delivery are ready. Establish a full 30-day measurement baseline before changing the testimonial experiment.
