# Imperial Food — landing page (Next.js)

Port of the approved prototype `clients/dark-kitchen/prototype/c-custom` (static export `clients/dark-kitchen/final/`).
Next 16.4.5 (App Router, Turbopack, Cache Components), next-intl 4.14.9, SCSS Modules, GSAP 3.13.0.
Locales: Czech at `/` (default), English `/en`, Russian `/ru`. Every page is prerendered (`○`).

`DESIGN.md` (variant) and `intake.md` (client) are read-only copies for reference.

## Run

```bash
npm install
npm run dev                                   # http://localhost:3000 (sign-ups go to the `log` adapter)
npm run check                                 # lint + types + build; FAILS while placeholders remain (see below)
ALLOW_PLACEHOLDERS=true npm run build && npm start   # preview build with the "Preview — not final" badge
```

Port proof (from the repo root, server on :3000): `npm run port-compare -- clients/dark-kitchen/final http://localhost:3000 --out=clients/dark-kitchen/.port/compare --locales=/,/en,/ru --widths=390,768,1440` and `node clients/dark-kitchen/.port/states.mjs http://localhost:3000`.
Styles are SCSS (breakpoint mixins in `app/styles/_breakpoints.scss`, shallow nesting); `.port/css-compare.mjs` proved the SCSS rewrite compiles to the same 282 rules as the earlier plain-CSS port.

## Deploy (Vercel)

Root directory `clients/dark-kitchen/site`, framework Next.js, Node 20+. Env vars per environment:

| Variable | Production | Preview | What |
|---|---|---|---|
| `SITE_URL` | `https://<domain>.cz` (domain TODO) | the preview URL | canonical, hreflang, OG, sitemap, JSON-LD. Required. |
| `NEWSLETTER_PROVIDER` | `brevo` or `ecomail` once implemented | `log` | sign-up delivery (`lib/delivery/newsletter.ts`) |
| `FEATURE_SIGNUP` | `false` to launch without sign-up | unset (on) | switch, set for build and runtime, changing it needs a redeploy (`lib/features.ts`); `false`/`0`/`off` hides the section, its links and the gift line, and the action refuses |
| `BREVO_API_KEY` / `ECOMAIL_API_KEY` | when chosen | — | server only |
| `ALLOW_PLACEHOLDERS` | never | `true` | lets sample content through the build, shows the badge, noindex |
| `NEXT_PUBLIC_ANALYTICS_DOMAIN` | the domain | empty | loads cookieless Plausible |

See `.env.example`. The sign-up rate limit is in memory (one Node instance); on serverless use a KV store.

## Code map

| File | Owns |
|---|---|
| `app/[locale]/layout.tsx` | root layout: `<html lang>`, fonts, global styles, metadata (title, description, canonical, hreflang, OG), viewport/theme colour, motion-class inline script, placeholder guard + badge, AnchorScroll, TrackClicks, Plausible |
| `app/[locale]/page.tsx` | composes the page: skip link, header, sections in prototype order, footer, dialogs, order bar, JSON-LD; wraps them in the two providers |
| `app/[locale]/opengraph-image.jpg` | 1200×630 share image (the export's `og.jpg`, AI photo: temp) |
| `app/actions/signup.ts` | Server Action: spam checks (honeypot, min fill time, per-IP rate limit), zod, delivery |
| `app/sitemap.ts`, `app/robots.ts` | sitemap with language alternates; robots (disallow on previews) |
| `app/styles/base.scss` | `@layer` order (first import), reset, page defaults, type roles (`.t-*`), utilities (`.container`, `.sr-only`, `.line`, `.skip-link`) |
| `app/styles/tokens.scss` | design tokens, unchanged from the prototype, `@layer base` |
| `app/styles/motion.scss` | reveal start states (`html.motion-ok`, `data-reveal`), reduced-motion override |
| `app/styles/_breakpoints.scss` | `bp.from(tablet \| desktop)` = 48rem / 64rem, `bp.reduced-motion` |
| `components/sections/*` | one folder per `data-section`: Header, Hero, Menu (pizza + sushi), Combos, Pickup (+ PickupMap), Signup (+ SignupForm), Footer, JsonLd |
| `components/overlays/*` | MobileMenu, Chooser (+ ChooserBody), OrderBar (+ OrderBarRoot) |
| `components/ui/*` | Button, AppLinks, CuisineSwitch, OpenStatus, LangSwitch, Logo, Wordmark, Lines, Dish, Combo, Field, CloseButton, Dialog, InlineScript, PreviewBadge |
| `components/cuisine/*` | CuisineProvider (pizza/sushi state), CuisineOrder (chosen cuisine first) |
| `components/dialogs/*` | DialogProvider (which dialog, chooser preset), DialogButton (openers), PageDialog |
| `components/motion/*` | RevealLines / useRevealLines, RevealPhoto / useRevealPhoto |
| `components/page/AnchorScroll.tsx`, `components/analytics/TrackClicks.tsx` | page-wide click delegates |
| `content/site.ts`, `content/types.ts`, `content/media.ts` | business data (was `js/data.js`), its types, every image |
| `messages/{cs,en,ru}.json` | all copy (was `js/messages.js`) |
| `lib/fields.ts` | values and hrefs from content (was FIELDS / LINKS in `js/i18n.js`) |
| `lib/app-links.ts`, `lib/status-input.ts`, `lib/open-status.ts` | app links per cuisine; open-now inputs and the pure status function |
| `lib/placeholders.ts`, `lib/required-env.ts` | the build guard |
| `lib/features.ts` | feature flags (`FEATURE_SIGNUP`): on/off per deployment, plus the placeholder paths a flag owns (the guard skips them when off) |
| `lib/delivery/newsletter.ts`, `lib/signup/schema.ts` | delivery adapters; form schema and result type |
| `lib/motion/tokens.ts`, `lib/motion/gsap.ts` | motion map + MOTION tokens; GSAP setup (SplitText only) |
| `i18n/*`, `proxy.ts`, `global.d.ts` | next-intl routing (as-needed, no locale detection), request config, typed messages |

## State map

| State | Owner | Shown by |
|---|---|---|
| hero cuisine (pizza on every load), `live` after first tap | `CuisineProvider` | HeroRoot (`data-cuisine`, `data-live` → photo focus), HeroSwitch, HeroOrder label, HeroApps links, CuisineOrder (menu sections + nav links order), MenuRoot (`data-variant="flip"` on the second) |
| section in view (#pizza / #sushi, middle of the viewport) | `CuisineProvider` (IntersectionObserver) | `<body data-cuisine>` = inView ?? hero (header button + bar accent) |
| chooser cuisine | `CuisineProvider`, preset by `DialogProvider.openDialog` | ChooserBody switch + links, `<dialog data-cuisine>` |
| open dialog + opener, chooser "both" mode | `DialogProvider` | PageDialog (`showModal`/`close`), DialogButton `aria-expanded` |
| header solid | HeaderRoot (scroll) | `data-solid` |
| order bar visible | OrderBarRoot (IntersectionObserver on `[data-sticky-anchor]`) | `data-visible`, `inert`, `aria-hidden` |
| `--stack-h` | HeroRoot (ResizeObserver) | mobile photo height |
| open-now | OpenStatus (inline script before paint, then useSyncExternalStore, 1 min) | `data-open`, text |
| sign-up | SignupForm (`useActionState` + client checks) | error texts, `aria-invalid`, success |
| utm source | TrackClicks (sessionStorage `tr-src`) | analytics props |

## Placeholders → owner answers

`npm run build` without `ALLOW_PLACEHOLDERS` fails and lists every placeholder (51 at handover). They are the `sample: true` values in `content/site.ts`, the `temp: true` photos in `content/media.ts` and missing settings:

| Guard entry | Replaced by (TODO-OWNER.md) |
|---|---|
| `site.brand` | brand name + logo (#3); the wordmark SVG is also a placeholder |
| `site.links.*` (6 listings + `google.profile`) | real Wolt / foodora / Bolt Food links (#4), Google profile |
| `site.hours`, `site.address`, `site.delivery`, `site.door` | pickup address/door/hours (#1), delivery area (#2) |
| `site.contacts` | office phone + e-mail (#7), Instagram/TikTok (#14) |
| `site.company` | company name, IČO, seat (#13) |
| `site.gift` | which gift, who checks the code (#11) |
| `site.dishes.*`, `site.combos[*]` | best sellers (#8), combos (#9); `combosListing` question |
| `media.*` (temp) | real photos (#5): hero ×2, 12 dishes, 3 combos, gift, OG image |
| `env SITE_URL` | domain (.cz) |
| `env NEWSLETTER_PROVIDER` | e-mail service: Brevo or Ecomail (then implement its adapter) |

`site.gift`, `media.gift` and `env NEWSLETTER_PROVIDER` only block (and count) while sign-up is on; with `FEATURE_SIGNUP=false` the guard skips them.

Also still placeholders on the page without a flag of their own: the drawn street map (`data-sample`), the privacy link (dead `#privacy` anchor, policy page out of scope), copy proofreading (cs/en/ru, plus the two new strings below).

## Differences from the prototype (deliberate)

1. Content is server-rendered: dish grids, combos, app links and en/ru copy are in the HTML; without JS the page is complete (was a NOTES known gap).
2. Real metadata: absolute canonical + hreflang, OG/Twitter (file-convention OG image), JSON-LD `Restaurant` from content, sitemap, robots. The export was always `noindex`; here only previews are.
3. The sign-up posts to a Server Action (works without JS) instead of a fake success. Extra hidden inputs: honeypot `website`, `startedAt`, `locale`, React's action ids. A spam hit is accepted silently and not delivered. New copy `signup.errors.server` (cs/en/ru, proofread) shown when delivery fails; new `meta.previewBadge`.
4. Fonts self-hosted by `next/font` (same families; whole `wght` axis of the two variable families; metric-adjusted fallbacks). Images optimized (AVIF/WebP `srcset`); pixel differences are inside photos only (resampling).
5. `combos.office` uses tags (`<phone>{phoneNumber}</phone>`) instead of `{phone}` arguments for the links; the text is unchanged.
6. No locale detection: `/` is always Czech, as in the prototype (next-intl `localeDetection: false`).
7. Removed: edit panel, `data-kit-panel`, `window.pageMotion`, `<template>`s, `kit-source` meta. State classes became attributes (`data-solid`, `data-visible`, `data-variant="flip"`); `is-split` / `is-in` stay global classes for `motion.scss`.
8. The tokens block moved from an unlayered `<style>` into `@layer base` (no layered rule sets the same properties).

## Prototype bugs fixed

- `cuisineNudge` never ran on a switch: `ctx.add(() => …)` invokes an anonymous function once and doesn't return a listener. Now the hero app links rise in on each hero switch, as the motion map says.
