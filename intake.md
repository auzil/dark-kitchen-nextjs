# Intake — Těsto & Rýže (TEMPORARY working name)

> Fill what you know. Anything unknown: write `TODO` — the agents use flagged placeholders and never invent facts. The first three sections matter most.
>
> Source of facts: `clients/dark-kitchen/brief.md` (Nov 4, 2026, Viktar Pryshchepa) = "(brief)". Extra rules from the user's `/design` call = "(design call)". No links were given; nothing fetched. No current website, logo, photos or listings available yet.
> Marking: plain text = stated in brief / design call; `TODO` = unknown (owner must answer); `ASSUMPTION:` = strategist's default, overrule freely; `sample: true` = prototype-only content, must be replaced.

## 1. Business

- What it is (one sentence): a new dark kitchen in Prague — no dining room, delivery and pickup only; menu: pizza and sushi (brief).
- Business type: Café / restaurant row of the skill table, adapted to delivery-only: no "reserve", no vibe/interior; primary action = order in an app (Wolt, foodora, Bolt Food). Closest variant: "ordering system already exists → style the entry points, link out".
- Location / area served:
  - City: Prague (brief).
  - Kitchen address: TODO.
  - Delivery area (districts or radius) and delivery hours per app: TODO.
  - ASSUMPTION (prototype only, `sample: true`): kitchen in a residential district, sample address in Praha 3 – Žižkov; sample delivery line "Vozíme po Žižkově, Vinohradech a Karlíně". Replace on answer.
- Working / temporary brand name: ASSUMPTION / TODO — **"Těsto & Rýže"** ("dough & rice": one sign over both cuisines; contains ě/ý so it tests Czech diacritics in display type). Clearly temporary; real brand name, logo files, and whether the pizza and sushi listings merge = TODO (brief).
- Website / domain (if any): none yet; a `.cz` domain is planned (brief). Domain name: TODO.
- Situation (brief): at break-even or losing money; every order goes through an aggregator and pays commission; rating 4.5, below nearby competitors; two listings per aggregator (pizza and sushi), owner is considering merging them.
- Site goals, in priority order (brief): 1) a tap on an order button; 2) a newsletter sign-up; 3) people choosing pickup (cheaper for the restaurant than delivery).
- v1 scope (brief): one static page, no cart, takes no orders; sends people to the apps, measures sources and apps, collects e-mails. Direct ordering = v2.

## 2. Audience — who the page is for

- Primary audience (one only): people living in the delivery area, ordering in the evening and at weekends, on a phone, arriving from a link (brief, priority 1).
- Other segments (brief):
  - Priority 1: people who already ordered through an app — need a reason to come back (sign-up gift, pickup); arrive via QR code on a card in the bag.
  - Priority 2: offices nearby — sets for a team, phone or e-mail for large orders; arrive via direct outreach, Google.
  - Priority 2: expats in the area — English version, the same buttons; arrive via Google, Instagram, local expat groups.
  - Dropped from v1: tourists and hotels; LinkedIn as an office source.
- What's in their head when they land (ASSUMPTION, derived from brief's "what they need"):
  1. "Co to je a vozíte ke mně?" (pizza + sushi, do you deliver to my area)
  2. "Jak to vypadá?" (photos of the best sellers)
  3. "Máte to ve Woltu / foodoře / Boltu?" (the app I already use)
  4. "Máte teď otevřeno?"
  5. "Můžu si to vyzvednout a kde?"
- How they arrive (brief): Instagram, TikTok, Google Maps, flyers in the bag, QR card in the bag; almost everyone on a phone. Instagram/TikTok in-app browsers may not hand off to the apps — test; if not, show a hint like "Open in browser for the app".
- Languages (default first) (design call): Czech default (`/`), English (`/en/`), Russian (`/ru/`), with `hreflang`.
  - CONFLICT to note: the brief says "Russian and Ukrainian are not in v1"; the user's later /design call adds `/ru/`. Intake follows the design call (latest instruction). Prototype: CZ/EN/RU switch. TODO (user): confirm RU stays in v1.
  - Type must therefore cover Czech diacritics (ř, ů, ě) and Cyrillic (brief: "if Russian comes later — Cyrillic").

## 3. Primary action

- The one thing the page must get them to do: **tap an order button that opens the restaurant's listing in Wolt, foodora or Bolt Food** (brief, goal 1).
- Secondary path: newsletter sign-up with a gift (goal 2); pickup (goal 3); phone / e-mail for office and large orders (brief). Phone/e-mail: TODO.
- Where leads go:
  - Orders: Wolt, foodora, Bolt Food listings — two per app (pizza, sushi) (brief). All listing URLs: TODO.
  - E-mails: Brevo or Ecomail (brief; choice TODO), double opt-in.
- Link rules (brief + design call):
  - Buttons link **straight** to each app listing; the tap is sent to analytics (app + section) just before leaving. No `/go/…` redirects.
  - All links in one data file with keys `wolt.pizza`, `wolt.sushi`, `foodora.pizza`, `foodora.sushi`, `bolt.pizza`, `bolt.sushi` (brief: "`wolt.pizza`, `wolt.sushi`, `foodora.pizza` and so on"). A listing merge only changes these values.
  - On a phone the link should open the app, not the aggregator website; test iOS/Android, app installed and not.
  - App buttons in the site's style, with the app name as text; Wolt / foodora / Bolt logos only as their partner brand guidelines allow.
  - No cart, no prices.
- Sticky order bar (mobile) (brief + design call): always at the bottom; opens a small chooser with the three apps; hidden while the hero buttons are on screen.
- Header (sticky) (brief): logo, anchors Pizza / Sushi / Pickup, language switch, Order button.

## 4. Offer facts

| Fact | Value |
|---|---|
| Price(s) and period | No prices on the page (brief, design call). One line under the menu: "Current prices and the full menu are in the apps". Optional "from … Kč" per section only if the owner wants it — TODO. |
| What's included | Pizza and sushi, delivery via Wolt / foodora / Bolt Food, plus pickup (brief). Best sellers per cuisine (top 5–6), key ingredients and sizes: TODO. Combo sets in the apps: TODO. Prototype uses sample dishes below (`sample: true`). |
| Requirements / who qualifies | Delivery area: TODO. |
| Deposit / payment | Handled in the apps. Buying at the door or ordering pickup by phone outside the apps: TODO. |
| Address, hours | Kitchen address: TODO. How to find the door: TODO. Pickup hours: TODO. Delivery hours per app: TODO. Prototype: sample hours `sample: true` (brief's layout example shows "Open now · until 22:00"; ASSUMPTION sample 11:00–22:00 daily), drives the "Open now · until …" / closed status. |
| How fast they can start / get a slot | Delivery time: TODO (do not state). |
| Guarantees | None. Do not invent. |
| Contacts (phone, WhatsApp, Telegram, email, Instagram) | Phone and e-mail for office / large orders: TODO. Instagram, TikTok accounts: TODO. Google Business Profile link: TODO. Prototype: realistic sample values flagged `sample: true`. |
| Company details (footer) | Company name, IČO, registered office, commercial-register entry: TODO (required by § 435 Civil Code, brief). Privacy policy (CZ + EN): TODO. |

### Sign-up offer (brief)

- Gift must depend on the restaurant, not an aggregator. v1 default: **a free roll or a drink at pickup**; which one and who checks the code: TODO.
- Alternatives (brief): early access to direct orders (if v2 within 2–3 months); aggregator promo code (only if the portals allow — TODO).
- Form: e-mail field + separate **unticked** consent checkbox for marketing e-mails + privacy-policy link; double opt-in; then e-mail with code and terms (valid until, once per person, pickup only); then 1–2 e-mails a month.
- Codes: one shared code per month, checked on the customer's phone screen; count redemptions on paper / sheet.
- Gift terms on a short separate page (out of scope for the prototype).

### Sample content for the prototype (`sample: true`, ASSUMPTION — not the real menu)

Names must later be replaced with the exact names from the apps (brief). Copy: 2–4 main ingredients + size. No prices.

Pizza (sample: true)
| Name | Line | Size | Tags |
|---|---|---|---|
| Margherita | rajčata San Marzano, mozzarella, bazalka | 32 cm | vegetarian |
| Diavola | pikantní salám, mozzarella, chilli | 32 cm | spicy |
| Quattro formaggi | mozzarella, gorgonzola, parmazán, eidam | 32 cm | vegetarian |
| Prosciutto e funghi | šunka, žampiony, mozzarella | 32 cm | — |
| Tonno e cipolla | tuňák, červená cibule, olivy | 32 cm | — |
| Salsiccia | italská klobása, pečené brambory, rozmarýn | 32 cm | — |

Sushi (sample: true)
| Name | Line | Size | Tags |
|---|---|---|---|
| Philadelphia roll | losos, krémový sýr, okurka | 8 ks | — |
| California roll | krab, avokádo, okurka, tobiko | 8 ks | — |
| Spicy tuna roll | tuňák, spicy mayo, jarní cibulka | 8 ks | spicy |
| Avocado maki | avokádo, sezam | 6 ks | vegetarian |
| Sake nigiri | losos na rýži | 2 ks | — |
| Set Salmon Lover | Philadelphia (8), California (8), sake maki (6), sake nigiri (2) | 24 ks | — |

Combos (sample: true — block renders only if combo data exists; real combos TODO)
| Name | Contents |
|---|---|
| Pro dva | 1 pizza 32 cm + 1 roll (8 ks) |
| Pro partu | 2 pizzy 32 cm + set 24 ks |
| Do kanclu | 3 pizzy 32 cm + 2 sety (48 ks) |

ASSUMPTION: the designer may keep the Combos samples on to show the block; the data flag decides whether it renders.

## 5. Why them (only true things)

- Real differentiators vs competitors: TODO — owner to give 3 true facts (dough, fish supplier, delivery time…). Fewer than 3 confirmed → drop the block (brief). Prototype: **no data → Why us block does not render.** Do not fill it with invented claims.
- Proof that exists: rating 4.5 in the apps, below nearby competitors (brief) → **not shown**. No star ratings or review widgets anywhere (brief, design call). No testimonials, statistics, years in business, partner claims.
- Real structural advantages the page may use (facts from brief): pizza and sushi from one kitchen in one order; pickup available (address TODO).

## 6. Content that exists

- Logo / brand assets: exist per brief ("the owner's logo, signage, bags and boxes") but not received — logo files TODO. Start the look from what arrives at the door once received. Final accent colours after the logo is confirmed (brief).
- Own photos / video: none received. Plan (brief): the kitchen's own food, one light, one angle; minimum 1 hero shot, 12 dishes, 3 sets. Shoot date OR written permission to use app listing photos meanwhile: TODO.
- **Temporary AI-generated food photos: allowed for the prototype only** (user instruction). They must be listed in `TODO-OWNER.md`, flagged in data, and must never go live — the brief forbids stock and AI-generated food on the live site ("the page must show what arrives in the box").
- Team / owner willing to be on the site: not relevant / not planned (no mention). Not needed.
- Who writes: we write the copy, the owner supplies facts, a native speaker proofreads the Czech (brief).

## 7. Tone and limits

- Tone (brief + design call): friendly and short, informal "ty" as young Czech food brands use it; plain informal English (and Russian, same register). The page sells with photos; text = a name and one line per dish.
- Must avoid:
  - Clichés like "the best pizza in Prague" (brief).
  - Italian trattoria look and Japanese minimalism (brief, design call). Target feel: modern street food, both cuisines under one sign.
  - Star ratings, review widgets (brief, design call).
  - Prices, cart, `/go/` redirects (design call).
  - Stock photos and AI-generated food on the live site (brief).
  - Aggregator logos beyond their brand guidelines (brief).
- Visual direction (brief + design call):
  - One brand, two accents: shared warm dark base (charcoal, near-black), shared type, grid and logo; **Pizza section in tomato red / fire orange**, **Sushi section in salmon / matcha**.
  - Photos big: food takes most of the screen; text on or under the photo.
  - Type: expressive headline face + calm text face, both with full Czech diacritics and Cyrillic.
- Mobile first screen (design call, refining brief block 1): one big photo with pizza and a sushi set together; name; one line (what + where we deliver); three app buttons; "Open now · until …" status; pickup line ("Pickup: address").
- Block order (brief, design call — keep exactly):
  0. Header (sticky) — logo, anchors Pizza / Sushi / Pickup, language switch, Order button
  1. First screen
  2. Pizza — 5–6 best sellers: photo, name, one line of key ingredients, size, tags (spicy, vegetarian); below: buttons to the pizza listing in each app
  3. Sushi — 5–6 rolls and sets, pieces per set, buttons to the sushi listing
  4. Combos — 2–3 pizza + rolls sets (for two, for friends, for the office); only if they exist in the apps / data
  5. Why us — 3 true facts; fewer than 3 → drop
  6. Pickup — address, hours, map (placeholder in prototype), how to find the door, link to the Google profile
  7. Sign-up — offer/gift line, e-mail field, unticked consent checkbox, button
  8. Footer — social links, phone for office orders, company name, IČO, registered address, privacy policy
  - Plus: sticky mobile order bar → chooser with the three apps, hidden while hero buttons are visible.
- Motion (brief + design call, per `web-motion` skill): light card reveals on scroll, a small pizza/sushi switch, off for reduced motion, never in the way of first-screen loading.
- Performance (brief): loads in under 2 s on mobile data; AVIF/WebP with set dimensions; below-the-fold lazy-loaded.
- Content data (brief): dishes, app links, hours, address in one JSON file; edits never touch the layout.
- Legal or factual claims that need the owner's confirmation:
  - Company details (name, IČO, registered office, register entry) — TODO.
  - Privacy policy (GDPR, CZ + EN) and gift terms — TODO; have them checked (brief: not legal advice).
  - Whether Plausible/Umami can run without a consent banner — confirm with whoever writes the privacy policy (brief).
  - Allergens: not on the page in v1; link to the apps for allergen details (brief).
  - Use of app listing photos outside the apps — written permission TODO.
  - Never reward reviews (Google policy, brief) — the QR feedback page must not offer gifts for reviews.

## 8. Signature idea (optional)

- Brief/design call: **a small pizza/sushi switch** — one control that flips the page accent (tomato/fire ↔ salmon/matcha) and the featured menu. ASSUMPTION on exact behaviour: the switch sits near the menu (and/or under the hero), swaps the visible section accent and dish grid, and keeps each section's own app buttons; must stay usable with reduced motion and without JS (both sections still reachable by anchors).
- "Open now · until …" live status from the hours data (brief) — small but useful; renders "closed · opens …" outside hours.
- Not in v1: cart, own ordering, loyalty, full menu.

## 9. Notes

- Analytics (brief): Plausible or Umami (no cookies); UTM tags `utm_source=instagram`, `tiktok`, `qr-bag`, `google-profile`; source stored for the visit and attached to each app-tap event. GA4 / Meta Pixel only with a consent banner, when paid ads start.
- SEO (brief): schema.org `Restaurant` (address, hours, cuisine, `hasMenu`, `sameAs` to app listings); Open Graph images; title with the district, e.g. "Pizza a sushi s rozvozem — Praha X" (district TODO); same name, address, phone as the Google Business Profile.
- QR card in the bag → separate short feedback page ("How was it?") + sign-up (brief). In v1 scope, but not part of this landing prototype.
- Success metrics (brief): app-button taps / visits 25–40 %; sign-ups / visits 3–5 %; gifts redeemed at pickup and `qr-bag` scans counted from day one; orders and pickup share per app per week from partner portals (baseline: 4 weeks before launch — owner's order counts TODO).
- Launch timing (brief): 1–2 weeks after the photos and the owner's answers are in; photos set the date.
- Prototype placeholders (CLAUDE.md rule 4): temporary brand name, sample dishes/hours/address/phone, AI food photos from `media/temp/` — all flagged in data and listed in `TODO-OWNER.md`.
- Competitors: kitchen address unknown, so nearby competitors (the ones with a higher rating, per brief) can't be identified yet — TODO once the address is known. One quick search found a Prague Wolt listing that presents itself the same way: **La Crosta | PIZZA & SUSHI** — sells both cuisines under one name in Wolt (from web search; location not checked). The ref-scout can use "pizza & sushi" combined listings on Wolt Prague as a starting point.
- Links fetched: none given. No current website → no `capture-refs` screenshots.

## Owner questions → TODO (all from brief "Questions for the owner"; first five block the build)

1. TODO (blocking) Kitchen address, how to find the door, pickup hours
2. TODO (blocking) Delivery area (districts or a radius) and delivery hours per app
3. TODO (blocking) Brand name on the site, logo files, and whether the pizza and sushi listings will merge
4. TODO (blocking) Links to the restaurant in Wolt, foodora and Bolt Food (each listing)
5. TODO (blocking) Photos: a shoot date, or written permission to use the app listing photos meanwhile
6. TODO Can customers buy at the door or order pickup by phone, outside the apps? (the one channel with no commission)
7. TODO A phone number and e-mail for office and large orders
8. TODO Best sellers per cuisine (top 5–6), their key ingredients and sizes
9. TODO Combo sets that exist in the apps
10. TODO 3 true facts for "Why us" (dough, fish supplier, delivery time…)
11. TODO The sign-up gift: which roll or drink, and who checks the code at pickup
12. TODO Do the partner portals allow restaurant promo codes?
13. TODO Company name, IČO, registered office, commercial-register entry
14. TODO Social accounts (Instagram, TikTok) and who posts
15. TODO Order counts per app for the last 4 weeks (the baseline)

Additional TODOs (from this intake): e-mail service choice (Brevo or Ecomail); optional "from … Kč" line per section (yes/no); domain name; confirm Russian `/ru/` in v1 (brief says no, design call says yes).
