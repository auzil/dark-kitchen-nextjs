# Plan: Google Analytics 4 for the dark-kitchen site

## Context

The site (`clients/dark-kitchen/site`, Next.js) earns nothing directly. It sends visitors to Wolt, foodora and Bolt Food. The owner needs to know where visitors come from (Telegram channel posts, Instagram, TikTok, Google search, the Google profile, the QR card in the bag), what they click, and which channel produces "conversions". On this site a conversion is a tap that leaves for a delivery app, plus a newsletter sign-up.

Today `components/analytics/TrackClicks.tsx` sends an `App tap` event to Plausible. Plausible is paid. The owner wants no paid tools, so **GA4 replaces Plausible**. GA4 standard is free; the paid tier, GA360, is aimed at enterprises and isn't relevant here. The consent banner is our own, so it is also free.

Decisions from the questions:
- GA4 only. Plausible is removed.
- Our own consent banner, with no paid consent service (CMP).
- No paid ads yet. Every channel is a free post tagged with UTMs, so there is no Google Ads link and no Meta Pixel. Both can be added later.

Known limitation, stated up front: in the EU, GA4 may run only after the visitor consents. Visitors who decline or ignore the banner are not counted (basic consent mode, which is the legally safest option). The numbers are therefore a sample of consenting visitors. Comparisons still hold: the tap rate per channel and Telegram against Instagram remain meaningful. Actual orders are visible only in the partner portals (brief, "Success metrics").

## 1. Loading GA4 (basic Consent Mode v2)

New server component `components/analytics/Analytics.tsx`, rendered in `app/[locale]/layout.tsx` in place of the Plausible `<Script>` (line 88):
- Renders only when `NEXT_PUBLIC_GA_ID` (`G-XXXXXXX`) is set, so previews and local runs don't pollute the data. This mirrors the current `NEXT_PUBLIC_ANALYTICS_DOMAIN` pattern.
- Uses `InlineScript` (`components/ui/InlineScript/InlineScript.tsx`) to define `window.dataLayer` and `gtag`, and sets the consent default: `ad_storage`, `ad_user_data`, `ad_personalization` and `analytics_storage` are all `denied`.
- Loads `https://www.googletagmanager.com/gtag/js?id=…` only after consent: when the stored choice is `granted`, or when the visitor clicks Accept. The loader is a small function in `lib/analytics.ts`.
- On load: `consent update { analytics_storage: granted }`, then `config` with `page_location` set to the **landing URL** saved in sessionStorage. If the visitor consents after scrolling or tapping anchors, the visit still keeps its `utm_*` tags and referrer. Further settings: `allow_google_signals: false`, `allow_ad_personalization_signals: false`, and `debug_mode: true` when `?debug` is in the URL.

New `lib/analytics.ts`, the single place that sends events:
- `track(event, params)` calls `window.gtag?.('event', …)`, and with `?debug` also logs to the console, as `TrackClicks` does now. It never throws.
- Consent storage: `localStorage` key `consent-analytics` = `{ value: "granted" | "denied", at }`. Reads are wrapped in try/catch. The choice is asked again after 12 months.
- Saves the landing URL on the first page view of the visit (sessionStorage, replacing today's `tr-src`).
- Remove the `window.plausible` global type and add `gtag` / `dataLayer`.

## 2. Consent banner

New client component `components/analytics/ConsentBanner.tsx` plus `ConsentBanner.module.scss`:
- Shows only when GA is configured and no choice is stored. A small bottom sheet that never covers the first screen's order buttons: it sits above the mobile order bar (`components/overlays/OrderBar`) and doesn't block the page, in line with rule 6, "sell first".
- **Accept** and **Reject** are equally prominent, plus a link to the privacy policy (currently the `#privacy` placeholder in the footer).
- Styled with the existing tokens (`app/styles/tokens.scss`) and button styles. The look of the Chooser and dialogs is the visual reference.
- A "Cookie settings" link in the footer (`components/sections/Footer/Footer.tsx`, next to the privacy link) reopens the banner.
- Copy goes in `messages/cs.json`, `en.json` and `ru.json` under a new `consent` namespace.

## 3. Events (what "clicks" means)

Extend the single delegated listener in `components/analytics/TrackClicks.tsx`; do not add per-button components. This follows `.claude/skills/nextjs/references/scripts-analytics.md`. Links stay server-rendered `<a>` elements carrying `data-track-*` attributes.

| Event | When | Params | Key event |
|---|---|---|---|
| `app_tap` | tap on any Wolt / foodora / Bolt link (`a[data-app]`, already in `components/ui/AppLinks/AppLinks.tsx`) | `app`, `cuisine`, `section` (hero / pizza / sushi / chooser / chooser-combos), `lang` | **yes**: the main conversion |
| `generate_lead` | sign-up succeeds (`state.status === "ok"` in `components/sections/Signup/SignupForm.tsx`) | `lang` | **yes** |
| `directions_tap` | "Google Maps" in Pickup (`components/sections/Pickup/Pickup.tsx`) | `section: pickup` | yes (pickup intent) |
| `contact_tap` | phone / e-mail links (Footer, Combos) | `method: phone|email`, `section` | no |
| `social_tap` | Instagram / TikTok in the footer | `network` | no |
| `chooser_open` | the order bar opens the app chooser (`DialogButton dialog="chooser"`) | `opener` (bar / header) | no, it's a funnel step |

- Attributes: `data-track-event="contact_tap" data-track-method="phone" data-track-section="footer"`, and so on. The listener reads every `data-track-*` attribute into the params. App links keep their current `data-app` / `data-cuisine` / `data-track` attributes, and the listener maps them to `app_tap`.
- GA4 attributes each event to the session's source, medium and campaign, so a separate `source` param is no longer needed.
- Leaving the page right after the tap is safe: gtag sends events with `sendBeacon`.
- GA4 enhanced measurement also records page views, scroll depth and outbound clicks automatically.

## 4. Where visitors come from: the UTM convention

New file `clients/dark-kitchen/UTM.md` for whoever posts. It contains a table of ready links and the naming rules: lowercase, hyphens, and a new `utm_campaign` for every post or story, so each post gets its own conversion count.

| Channel | Link tags | Notes |
|---|---|---|
| Telegram channel post | `utm_source=telegram&utm_medium=social&utm_campaign=2026-11-weekend-combo` | Telegram often sends no referrer, so without the tags the visit shows as "Direct" |
| Instagram bio | `utm_source=instagram&utm_medium=social&utm_campaign=bio` | links in captions aren't clickable on Instagram |
| Instagram story (link sticker) | `utm_source=instagram&utm_medium=social&utm_campaign=<story-name>&utm_content=story` | this is how a single "post" is attributed |
| TikTok bio | `utm_source=tiktok&utm_medium=social&utm_campaign=bio` | |
| Google profile (Maps) "Website" link | `utm_source=google-profile&utm_medium=organic` | lands in Organic Search but stays separate from search |
| Google search (organic) | no tags, automatic (`google / organic`) | detail is in Search Console, linked to GA4 for free |
| QR card in the bag | `utm_source=qr-bag&utm_medium=offline&utm_campaign=bag-card` | matches the brief's `qr-bag` |

Later, paid ads would use `utm_medium=paid_social` or `cpc`, plus Google Ads auto-tagging.

## 5. GA4 settings (manual, in the owner's Google account)

Add a checklist to `clients/dark-kitchen/site/README.md` ("Analytics"):
- Create the property with time zone Europe/Prague and currency CZK, then a web stream. Copy its `G-…` ID into `NEXT_PUBLIC_GA_ID` on Vercel Production.
- Enhanced measurement on. Data retention 14 months. Google signals off.
- Register event-scoped custom dimensions: `app`, `cuisine`, `section`, `method`, `network`, `lang`.
- Mark key events: `app_tap`, `generate_lead`, `directions_tap`.
- Create a custom channel group with these channels: Telegram, Instagram, TikTok, Google search, Google profile, QR bag, Direct, Other (rules on source and medium). The QR medium `offline` has no default GA4 channel, so this group is needed.
- Create a saved exploration with session source / medium / campaign as rows, and `app_tap` by `app` plus `generate_lead` as values. This report answers "which channel and which post produce taps, and in which app".
- Link Search Console (free) to see the Google search queries.

## 6. Cleanup and documentation

- Remove the Plausible `<Script>` and `NEXT_PUBLIC_ANALYTICS_DOMAIN` from `app/[locale]/layout.tsx`, `.env.example` and the README env table. Add `NEXT_PUBLIC_GA_ID`.
- `lib/required-env.ts`: add `NEXT_PUBLIC_GA_ID` to `REQUIRED_ENV`, so a production build can't ship without analytics. Preview builds pass through `ALLOW_PLACEHOLDERS`.
- `clients/dark-kitchen/TODO-OWNER.md`: create the GA4 property; the privacy policy must name Google Analytics as processor, the `_ga` / `_ga_<id>` cookies, their purpose and how long they're kept, and the transfer to the US (EU-US Data Privacy Framework); remove the Plausible mention.
- `clients/dark-kitchen/brief.md`, "Analytics": change to "GA4 with our own consent banner (free); Plausible dropped". `TrackClicks`'s header comment and the README code map get the same change.
- `.claude/skills/nextjs/references/scripts-analytics.md`: record the variant "free GA4: basic consent mode, own banner, landing-URL `page_location`" next to the Plausible default.

## Verification

1. `npm run check` (lint, typecheck, build). The build must still show every page as `○`, because the banner is a client leaf and needs no request-time API.
2. Run `next dev` with `NEXT_PUBLIC_GA_ID` set and open `/?utm_source=telegram&utm_medium=social&utm_campaign=test&debug`:
   - Before consent: no request to `googletagmanager.com` or `google-analytics.com` (Playwright network log), and no `_ga` cookie.
   - After Reject: still none, and the banner stays hidden after a reload.
   - After Accept: gtag loads and `page_view` carries the UTMs. Tapping Wolt in the hero logs `app_tap { app: wolt, cuisine: pizza, section: hero }` in the console and sends a `collect` request with `en=app_tap`.
   - Consent given after scrolling: `page_location` is still the tagged landing URL.
3. Screenshot the banner on a phone and on desktop, in CS, EN and RU, with `screenshot.mjs --section`. Check that it doesn't cover the hero buttons or the order bar.
4. After deploying with the real ID, open GA4 DebugView with `?debug` and check every event in the table plus the custom dimensions.
