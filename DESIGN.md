# DESIGN — Imperial Food, variant c-convert

**Direction in one sentence:** a dark street-food order board — big glossy food on a warm brown-black, loud condensed caps, and the three app buttons always within one tap, with the pizza/sushi switch deciding which listing they open.

Start: `dark-poster` (medium distance) + pizzburg's warm red/orange family, condensed caps, solid tappable blocks; pizza22cm's food-fills-the-screen hero and one huge word per section.

## Tokens
| Token | Value | Role |
|---|---|---|
| `--color-ink` | `#1A120D` | page base, warm brown-black (hue of pizzburg `#471C00`) |
| `--color-ink-2` | `#261A12` | raised surfaces: cards, chooser, facts strip |
| `--color-paper` | `#FFF3E6` | text, headlines |
| `--color-muted` | `#BBA898` | secondary text on ink (AA 7.9:1) |
| `--color-line` | `#FFF3E629` | hairlines |
| `--color-tomato` | `#D42E18` | pizza primary (buttons, paper text 5.0:1) |
| `--color-fire` | `#FF7A1F` | pizza secondary (big word, spicy tag) |
| `--color-salmon` | `#FF8F6E` | sushi primary (buttons, ink text 8:1) |
| `--color-matcha` | `#9CBF5A` | sushi secondary, vege tag, "open" dot |
Accent aliases `--accent`, `--accent-ink`, `--accent-2` are set per `[data-cuisine]` (body for hero/chooser/bar, fixed on each menu section). Radius 0, no shadows, grain 6% on ink panels.

**Type:** Sofia Sans Extra Condensed 800–900 (display, caps for short loud parts) + Sofia Sans 400–700 (body). One superfamily, OFL (Google Fonts), latin-ext (ř ů ě ž) + Cyrillic, tabular figures (`tnum`) for hours. Why: pizzburg's condensed-caps street-food voice without Oswald/Bebas; Bebas has no Cyrillic.
Scale: display `clamp(2.75rem, 12.5vw, 8rem)` / lh .9; h2 (section word) `clamp(4.5rem, 24vw, 13rem)` / lh .82; h3 `clamp(1.35rem, 1.6vw, 1.75rem)`; body 1.0625rem; ui 1.125rem condensed 800.

## Section map (intake order)
0. Header (sticky): wordmark, Pizza / Sushi / Výdej anchors, CS EN RU, Objednat (opens chooser; desktop only, mobile has the bar).
1. Hero `[hero]`: photo ≥57% of the mobile fold; open-now status, H1 "Co dneska: / pizza, nebo sushi?", delivery line, Pizza|Sushi switch, Wolt / foodora / Bolt Food buttons, pickup line. Facts strip (Rozvoz, Výdej, Dárek, Ceny) closes the hero — inside the desktop fold, just under the mobile fold.
2. Pizza `[pizza]`: desktop = sticky left panel (huge "PIZZA", one line, 3 app buttons, prices line) + 3×2 grid; mobile = word, 2-col grid, buttons.
3. Sushi `[sushi]`: same, panel on the right, salmon/matcha.
4. Combos `[combos]`: renders only if `combos` in `js/data.js` has items. 3 photo cards + chooser button + office phone/e-mail line.
5. Why us: not built until the owner gives 3 true facts (TODO-OWNER.md).
6. Pickup `[pickup]`: address, hours, how to find the door, Google Maps link; drawn street map (SVG) + door photo.
7. Sign-up `[signup]`: gift photo, e-mail, unticked consent (required), success state.
8. Footer: socials, office phone/e-mail, company lines, privacy, languages.
+ Sticky mobile bar (status + Objednat) → chooser (bottom sheet / desktop dialog): switch + 3 apps; focus trap, Esc.

## Signature moment
The Pizza|Sushi switch in the hero (and in the chooser): flips the accent of the hero, bar and chooser (tomato ↔ salmon), re-points the three buttons to `wolt.pizza` ↔ `wolt.sushi` etc., and pans the hero photo toward the chosen dish. State persists in sessionStorage; without JS both menu sections are reachable by anchors and the buttons default to pizza.

## Motion plan (light)
- No load animation: the hero is in its final (zoomed) state from first paint. Buttons/status never hidden.
- Section words: `data-reveal="lines"` (`revealLines` in `js/motion.js`).
- Card photos: `data-reveal="photo"` (clip from bottom), once (`revealPhotos`).
- `cuisineSwitch`: CSS transitions on accent colors + photo pan (`translateX ±3%`), switch thumb slide. Reduced motion: instant, all states final.

## Photos (temp AI, resized WebP copies in `media/`)
hero mobile `hero-mobile-1` (clearer food, black sushi tray, dark lower band; -3 has a styrofoam clamshell) · hero desktop `media/hero-wide-cc.webp` (round 2, regenerated in this folder) · 12 dish cards `pizza-*-1`, `sushi-*-1` · combos `combo-*-cc.webp` (round 2, regenerated) · pickup `pickup-door-1` · sign-up `gift-2` (pickup hatch ties to pickup).

## Hero wireframes
```
MOBILE 390×844                         DESKTOP 1440×900
┌──────────────────────────┐           ┌────────────────────────────────────────────────┐
│Imperial Food    CS EN RU  ≡ │ 56        │Imperial Food  Pizza Sushi Výdej  CS EN RU [OBJEDNAT]│
│                          │           │                                                │
│   PHOTO pizza + sushi    │ 0–484     │● Otevřeno do 22:00            PHOTO full-bleed │
│   (fades into ink)       │           │PIZZA A SUSHI                  food right 55%   │
│● Otevřeno do 22:00       │           │CO DNESKA:                                      │
│CO DNESKA:                │           │Vozíme po Praze 4 a okolí.                     │
│PIZZA, NEBO SUSHI?          │           │[ PIZZA | sushi ]                               │
│Vozíme po Praze 4 …       │           │[ Wolt ][ foodora ][ Bolt Food ]                │
│[ PIZZA |  sushi  ]       │           │Výdej: Krejnická 2021/1, 148 00 Praha 4        │
│[Wolt][foodora][Bolt Food]│           ├────────────┬────────────┬───────────┬──────────┤
│Výdej: Krejnická 2021/1  │ 844       │Rozvoz …    │Výdej …     │Dárek …    │Ceny …    │
└──────────────────────────┘           └────────────┴────────────┴───────────┴──────────┘
```

## Anti-pattern check (changed defaults)
No eyebrow labels, no mono, no numbering, no middot meta strings ("Otevřeno do 22:00", not "Open · until"), no thick borders, no stamps/tickets, map is a drawn street plan (not a hatched box), no hover lift, no `→` on buttons, no ratings. Accent is two pairs on a *hued* black, photos full colour. Caps only for the condensed display words and UI labels.

- Radius tokens (2026-11-04): --radius-pill 999px, --radius-card 1.25rem, --radius-chip .75rem, --radius-sheet 1.5rem; --color-tint #FFF3E614, --color-tint-2 #FFF3E61F; --btn-h 3rem.
