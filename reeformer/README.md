# reef founder quiz funnel

A static site with no build step. Upload the `reeformer/` folder to reeformer.com, for example at `/founders/`, on Vercel.

## Testing everything (test mode)
`assets/config.js` has `testMode: true` while you test:
- a light blue bar on every page links to **`lab.html` (the Funnel Lab)**
- every Add to bag and Checkout button runs a simulated checkout (`checkout.html`) and then the thank-you page with its one-time offers
- quiz leads are logged on your device, not sent to Momence (the Lab shows them)

The Funnel Lab has:
- an answer builder that predicts the outcome and opens any page
- 8 ready-made customers
- all 96 routes to a pack
- all 7 result profiles
- every product page, checkout and thank-you page per pack
- the copy of every encouragement screen

Set `testMode: false` to go live.

## Pages
| Page | What it does |
|---|---|
| `index.html` | The quiz: a hook screen, 15 questions, 3 encouragement screens, email and mobile capture, then the result (profile, 12 week plan, matched pack) |
| `founder-5.html` | Founder 5, £99 |
| `founder-plus.html` | Founder Plus, £299 (hero pack) |
| `founding-member.html` | Founding Member, £549 (launch gate: needs the monthly rate and terms first) |
| `founding-year.html` | Founding Year, £1,499 (long letter, with a buy button or a call with Ricky) |
| `packs.html` | All four packs side by side. The visitor's matched pack is highlighted |
| `checkout.html` | Test mode only: Shopify-style checkout with order summary and an upgrade checkbox. When live, buyers go straight to Momence |
| `lab.html` | Funnel Lab for testing (noindex) |
| `thank-you.html` | After purchase: one-time Recovery Trio offer, then Red Light Five if they decline, then Guest Passes on WhatsApp |

## How the personalisation works
Every pack page rebuilds itself from the visitor's answers:
- headline (6 goals)
- "what you told us" section
- pain modules (5 body areas, 5 day types)
- science (picked by goal and age)
- objection killer (7 barriers)
- decade module (6 bands)
- a men's module
- an experience module

That gives thousands of combinations.

Answers are saved in the browser. Pages can also be personalised from a link:
- `founder-plus.html?n=Sarah&goal=posture&day=desk&barrier=time&age=40s` lets you send ad-specific landing pages.
- `?r=<code>` restores a full set of answers. The code is `REEF.shareCode(answers)`; use it in emails.

## Upsell and downsell flow (retail style)
- **Product page:** Add to bag opens a slide-in bag with an upgrade card (Founder 5 to Plus +£200, Plus to Member +£250, Member to Year +£950).
- **Checkout (test):** an upgrade checkbox in the order summary.
- **Exit intent:** offers the next pack down as a quick add. On Founder 5 it offers a call with Ricky.
- **After purchase:** Recovery Trio (one-time offer). If declined, Red Light Five. Then Guest Passes on WhatsApp.

## Imagery
`assets/img/concept-*.jpg` are the four concept renders from The Reeformer Pilates Manual, and they are always labelled "Concept visual". Swap in real studio photos when you have them, keeping the same file names.

## Before going live (all in `assets/config.js`)
1. **Momence leads:** go to Marketing > Leads > Collect Leads using API, then paste `hostId`, `token` and `sourceId`.
   - Leads are posted to `api.momence.com/integrations/customer-leads/{hostId}/collect`. The quiz profile, matched pack and all answers go as extra fields.
   - If Momence rejects the extra fields, the code retries with the core fields only.
   - Optional: a `backupWebhook` (Make or Zapier) gets the full answers.
2. **Momence checkout links:** one per pack (`momence.com/m/...`), plus the add-on links.
3. **Momence redirect:** go to Settings > General Setup > Checkout purchase tracking and set it to your `thank-you.html` URL.
4. **Places left:** update daily with real numbers. The DMCC Act makes fake scarcity illegal.
5. **Remaining fields:**
   - opening date
   - long stop date
   - founder monthly rate
   - Mum's first name
   - Ricky's booking link or WhatsApp number
   - Meta Pixel ID
   - video URLs
6. **Confirm the add-on prices.** The Recovery Trio £149 and Red Light Five £249 are placeholders.

## Tracking (Meta Pixel and GA4)
- Standard events: `PageView`, `Lead`, `ViewContent`, `InitiateCheckout`, `Purchase`.
- Custom events: `QuizStart`, `QuizAnswer`, `QuizComplete`, `BumpAccepted`, `ExitIntent`, `AddonClick`, `GuestPassShare`.

## Copy rules applied
- No dashes or hyphens in customer copy (scanned).
- "reef" is always lowercase.
- No invented reviews.
- Every statistic is sourced from The Reeformer Pilates Manual.
- Experience-only wording for wellness sessions.
- Parking: 122m, free after 6pm.
