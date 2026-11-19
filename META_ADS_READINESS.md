# Meta Ads readiness pack (no ads running, nothing spent)

Prepared 19 Nov 2026. Meta's advertising rules change, so confirm the linked policy pages before you launch. This pack is general guidance, not legal or financial advice.

## 1. What is already in place

| Item | Status |
|---|---|
| Meta Pixel `1140755995061186` | Live, but it loads **only after a visitor clicks Allow tracking**. |
| Events sent | `PageView`, `Lead` (free guide, enquiries), `OfferClick` (custom), `PathFinderSelect` (custom). |
| Privacy | Cookie banner and privacy policy mention Meta. |
| Campaign attribution | `utm_source`, `utm_medium` and `utm_campaign` are remembered for the whole visit and saved on the CRM contact when they sign up, even if they browse several pages first. (Fixed and tested on 19 Nov.) |
| Conversions API, audiences, retargeting, ads | **Not set up.** |

**Important consequence of consent:** Meta only sees visitors who clicked Allow tracking, so its numbers will understate your real traffic and leads. Your CRM is the source of truth for leads.

## 2. Your checklist before any spend (only you can do these)

1. A Meta Business account, an ad account and a Facebook Page for Dr. Hauwa.
2. A payment method on the ad account (enter it yourself, never share it).
3. **Verify the domain** `drhauwaphd.ca` in Business settings.
4. In Events Manager, open **Test Events**, visit the site in a private window, click Allow tracking, and confirm `PageView` appears. Submit a test free-guide form and confirm `Lead` appears. The Chrome extension **Meta Ads Data Advisor** (formerly Pixel Helper) shows which events fire.
5. In **Aggregated Event Measurement**, make `Lead` your top-priority event. (PageView cannot be used as a conversion event there.)
6. Check the Diagnostics tab for warnings.

## 3. Campaign-tagged links

Use one link per ad so the CRM shows which ad produced a lead. Only three tags are stored, so put the ad variant inside `utm_campaign`.

Convention: `utm_source=meta` · `utm_medium=paid_social` · `utm_campaign=<goal>_<page>_<variant>`

| Landing page | Link to paste into the ad |
|---|---|
| AI training jobs guide | `https://drhauwaphd.ca/blog/ai-training-jobs-guide/?utm_source=meta&utm_medium=paid_social&utm_campaign=lead_ai-jobs_a1` |
| Job scam warning signs | `https://drhauwaphd.ca/blog/ai-training-job-scams/?utm_source=meta&utm_medium=paid_social&utm_campaign=lead_job-scams_a1` |
| Dropshipping comparison | `https://drhauwaphd.ca/blog/dropshipping-beginners-guide/?utm_source=meta&utm_medium=paid_social&utm_campaign=lead_dropshipping_a1` |
| AI Training page | `https://drhauwaphd.ca/ai-training/?utm_source=meta&utm_medium=paid_social&utm_campaign=lead_ai-page_a1` |
| Homepage | `https://drhauwaphd.ca/?utm_source=meta&utm_medium=paid_social&utm_campaign=lead_home_a1` |

For a second creative, change `_a1` to `_a2`, and so on.

## 4. What Meta's rules mean for this site

- **Personal attributes.** Meta's [Privacy Violations and Personal Attributes policy](https://transparency.meta.com/policies/ad-standards/objectionable-content/privacy-violations-personal-attributes/) bars ads that assert or imply a person's characteristics, including ethnicity and vulnerable financial status. Copy such as "Are you an immigrant struggling with bills?" is high risk. Describe the benefit instead ("A plain-language guide to...").
- **Unrealistic outcomes.** Meta's [prohibited commercial practices](https://transparency.meta.com/policies/community-standards/prohibited-commercial-practices/) include get-rich-quick offers and unrealistic financial reward for little effort. **Never** put income figures, "easy money" or guaranteed results in an ad.
- **Employment category.** Ads that promote job opportunities may have to be declared as an Employment special ad category, which limits targeting. See [About ads for employment](https://www.facebook.com/business/help/1537759006681893). Frame ads as education ("how it works", "how to stay safe"), not as job offers.
- **Existing videos are not ad-safe.** The founder-story video opens with "You moved abroad, you got a survival job, you're paying your bills", which asserts personal circumstances. The earnings video shows hourly and dollar figures. Do not use either as an ad without re-editing.
- **Financial products.** Do not advertise real estate investing returns. Keep any property content strictly educational and have it reviewed first.

## 5. Policy-safe ad drafts (education first, each links to a guide)

**A. AI training explainer** (to `ai-training-jobs-guide`)
- Headline: *How AI-training work really works*
- Text: *What does AI-training work involve, who can do it and how do you apply safely? Read the plain-language guide. Each platform sets its own terms and no income is guaranteed.*
- Button: Learn more

**B. Safety** (to `ai-training-job-scams`)
- Headline: *Warning signs of fake remote job offers*
- Text: *Real work exists, and scammers copy it. See the red flags listed by Canadian fraud authorities, and how to check an employer before you share anything.*
- Button: Learn more

**C. Dropshipping rules** (to `dropshipping-beginners-guide`)
- Headline: *Dropshipping on eBay, Shopify and Amazon: what each allows*
- Text: *A beginner comparison of the three routes, with the rules explained and Canadian tax and customs basics. No guaranteed profit.*
- Button: Learn more

**D. Free guide** (to the homepage or a guide; the popup collects the lead)
- Headline: *A free beginner guide to online income options*
- Text: *A clear, no-hype starting point for exploring practical ways to earn online. Results vary.*
- Button: Learn more

Avoid: income numbers, "quit your job", countdown pressure, before-and-after money claims, naming a person's circumstances, and testimonials that state earnings.

## 6. Suggested structure (you choose the budget)

- **Objective:** start with traffic to a guide, then switch to optimising for the `Lead` event once Meta has enough of them. Optimising for offer clicks is not recommended, because a click is not a sale.
- **One campaign, two or three audiences, two or three ads each.** Change one thing at a time.
- **Budget:** a small test you could afford to lose completely. I will not choose it for you.
- **Judge by CRM leads and cost per lead,** not by clicks. Selfany sales are outside this site, so the Pixel cannot see them.
- **Expect a slow start:** with consent-only tracking, Meta learns slowly.

## 7. Decisions needed from you

1. Budget and how long the test runs.
2. Which three or four ads from section 5 you approve (or your edits).
3. Whether you want me to drive Ads Manager while you are signed in (you approve each spend step), or you build it from this pack.
4. A privacy review of the Pixel and any audiences by a qualified adviser before you scale.

## 8. Not done, on purpose

Conversions API, custom or lookalike audiences, retargeting, ad creation, anything that spends money.
