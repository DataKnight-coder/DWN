# Meta Pixel (consent-gated, inert until you add a Pixel ID)

**Status:** the code is deployed but does nothing. No Pixel ID is set, so no visitor data goes to Meta. No ads, retargeting audiences or Conversions API have been created.

## How it works
- `public/meta-pixel.js` is loaded on every page. It exits immediately unless the page contains `<meta name="dwn-meta-pixel-id">`, which is written at build time from the `VITE_META_PIXEL_ID` variable.
- Even with an ID, it loads Meta's script **only after a visitor clicks "Allow tracking"**. Declining, or never choosing, loads nothing. Withdrawing consent reloads the page without it.
- When an ID is set, the consent banner and the privacy policy tell visitors that Meta may receive page views and sign-up or offer-click events for advertising measurement.
- Automatic advanced matching is turned off (`autoConfig` false): no form fields, names or emails are sent.

## Events sent (only for consenting visitors)
| Event | When | Data |
|---|---|---|
| `PageView` | Each page load | none |
| `Lead` | Free-guide popup saved; DWN, consultation or AI Training enquiry saved | `content_name` only |
| `OfferClick` (custom) | Click on a verified Selfany or Stan Store offer link | `offer_id`, button location |
| `PathFinderSelect` (custom) | A choice in "What do you want to do first?" | `choice` |

A click on an offer link is **never** reported as a purchase or checkout. Real sales happen on Selfany, outside this website, so the Pixel cannot see them.

## To turn it on (you do this; I do not handle your Meta account)
1. In Meta Events Manager, create a Pixel and copy its numeric ID.
2. In Cloudflare: Pages, project **dwn**, Settings, Variables and Secrets. Add a **Production build variable** named `VITE_META_PIXEL_ID` with the numeric ID. It is a public identifier, not a secret.
3. Redeploy (push any commit, or retry the latest deployment).
4. Open the site in a private window, click Allow tracking, and confirm with the Meta Pixel Helper browser extension that `PageView` fires. Also confirm nothing loads after Decline.
5. In Meta Business settings, verify the domain `drhauwaphd.ca`.

## Before running any ads
- Review the privacy policy wording with Dr. Hauwa, and have a qualified adviser check Canadian privacy requirements for advertising audiences.
- Decide which conversion you will optimise for. Offer clicks are interest signals, not sales.
- Meta begins building audiences from consenting visitors as soon as the Pixel is live.

## Not set up (deliberately)
Conversions API (server-side events), ad campaigns, custom or lookalike audiences, retargeting.

## To turn it off again
Delete the `VITE_META_PIXEL_ID` variable and redeploy. The Pixel code returns to doing nothing.
