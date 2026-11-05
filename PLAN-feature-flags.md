# Feature flag: sign-up (gift code) — dark-kitchen site

## Context

The first rollout of `clients/dark-kitchen/site` may ship **without sign-up**: the owner hasn't decided on the
e-mail service (Brevo / Ecomail, TODO-OWNER "E-mail service") or the gift (TODO-OWNER #11). Today that blocks
the production build in three ways: `NEWSLETTER_PROVIDER` is required by the guard, and `site.gift`
(`sample: true`) and `media.gift` (`temp: true`) are placeholders. We need a flag that turns the whole sign-up
feature off cleanly — section, links to it, copy that promises the gift, the Server Action, and its build-guard
entries. **Default: enabled.** Turning it off is an explicit per-deployment choice.

## Decision

- Build-time env flag `FEATURE_SIGNUP`. Unset / anything else → **on**; `false` / `0` / `off` → off.
  Env (not `content/site.ts`) because it's a rollout switch per deployment (Vercel Production vs Preview),
  not content. Server-only, no `NEXT_PUBLIC_`: every consumer is a Server Component or the Server Action.
- The page is prerendered, so changing the flag needs a rebuild/redeploy (same as every other env here).
- A tiny typed registry so the next flags follow the same pattern; each flag also lists the placeholder
  paths it owns, so a disabled feature never blocks the build.

## Changes

### 1. New `lib/features.ts`
```ts
// Feature flags: build-time switches per deployment (env), all on unless set to false/0/off.
// A flag also names the placeholder paths it owns, so a switched-off feature doesn't block the build.
const FLAGS = {
  signup: { env: "FEATURE_SIGNUP", placeholders: ["site.gift", "media.gift"] },
} as const;

type Feature = keyof typeof FLAGS;
const isOn = (env: string) => !["false", "0", "off"].includes((process.env[env] ?? "").trim().toLowerCase());

export const features = Object.fromEntries(
  Object.entries(FLAGS).map(([name, flag]) => [name, isOn(flag.env)]),
) as Record<Feature, boolean>;

/** Placeholder paths of switched-off features: the guard skips them. */
export const skippedPlaceholders = Object.entries(FLAGS).flatMap(([name, flag]) =>
  features[name as Feature] ? [] : flag.placeholders,
);
```

### 2. Page and links (render nothing when off)
- [app/[locale]/page.tsx](app/[locale]/page.tsx) — `{features.signup && <Signup locale={locale} />}` (same idiom as `site.combos.length > 0 && <Combos …/>`).
- [components/sections/Header/Header.tsx](components/sections/Header/Header.tsx) — wrap the `#signup` nav link.
- [components/overlays/MobileMenu/MobileMenu.tsx](components/overlays/MobileMenu/MobileMenu.tsx) — wrap the `#signup` `<li>`.
- [components/sections/Hero/Hero.tsx](components/sections/Hero/Hero.tsx) — wrap the `facts.gift` `<li>` (the gift exists only via sign-up).
- [components/sections/Hero/Hero.module.scss](components/sections/Hero/Hero.module.scss) `.facts` — make the band work with 3 items instead of hard-coding 4:
  tablet+ `grid-auto-flow: column; grid-auto-columns: 1fr` (replaces `repeat(4, 1fr)`; identical with 4 items),
  mobile 2-col grid: `li:last-child:nth-child(odd) { grid-column: 1 / -1; }` so the 3rd fact spans the row.
- [components/sections/Pickup/Pickup.tsx](components/sections/Pickup/Pickup.tsx) — `pickup.line` ends with "The e-mail gift is only handed out here." When off, use a new key `pickup.lineNoGift` = the same text minus that sentence, in `messages/{cs,en,ru}.json` (a cut of existing proofread copy, no new wording).

### 3. Server Action refuses when off
- [app/actions/signup.ts](app/actions/signup.ts) — first line of `signup()`:
  `if (!features.signup) return { status: "error", fieldErrors: {}, message: "server" };`
  (Server Actions are public endpoints; the form being hidden isn't enough.)

### 4. Build guard ignores a switched-off feature
- [lib/placeholders.ts](lib/placeholders.ts) — `findPlaceholders(roots, requiredEnv = [], skip: readonly string[] = [])`: in `walk`, return early when `path` is in `skip` (or starts with `skip + "."` / `"["`).
- [app/[locale]/layout.tsx](app/[locale]/layout.tsx) — pass `skippedPlaceholders` as the third argument.
- [lib/required-env.ts](lib/required-env.ts) — `settingPlaceholders()` checks `NEWSLETTER_PROVIDER` only when `features.signup`.
- Result: with `FEATURE_SIGNUP=false` the guard no longer lists `site.gift`, `media.gift`, `env NEWSLETTER_PROVIDER`; the preview badge count drops accordingly.

### 5. Docs
- [.env.example](.env.example) — `FEATURE_SIGNUP=` with a comment: on by default; `false` hides the sign-up section, its nav/hero links and the gift line, disables the action and drops its guard entries.
- [README.md](README.md) — env table row; `lib/features.ts` in the file map; placeholder table note that `site.gift`, `media.gift`, `NEWSLETTER_PROVIDER` only block when sign-up is on.
- `clients/dark-kitchen/TODO-OWNER.md` — note under "E-mail service" / #11: launch can go without sign-up (`FEATURE_SIGNUP=false`), these become required when it's switched on.

Not touched: `messages` signup namespace (unused keys are harmless), `JsonLd`, `TrackClicks`, `AnchorScroll`, motion (none reference sign-up).

## Verification

From `clients/dark-kitchen/site`:
1. `npm run check` (lint + typecheck + build) with defaults → passes/fails exactly as before (flag on, guard unchanged).
2. `ALLOW_PLACEHOLDERS=true FEATURE_SIGNUP=false npm run build` → builds; `grep -c 'id="signup"\|#signup'` on the prerendered `.next/server/app/cs.html` is 0; badge count is 3 lower than with the flag on.
3. Guard proof: `FEATURE_SIGNUP=false npm run build` (no ALLOW_PLACEHOLDERS) → the error list no longer contains `site.gift`, `media.gift`, `env NEWSLETTER_PROVIDER`.
4. `npm run start` with the flag off; screenshot (`node ../../../.claude/skills/award-landing/scripts/screenshot.mjs http://localhost:3000/cs <out>`) mobile + desktop: header nav, mobile menu, hero facts band (3 items, no gap), pickup line. Then the same with the flag on → hero facts band pixel-identical to today (`npm run port-compare` against `final/` if it still matches).
5. Action: open the page in `next dev` with the flag on, restart dev with `FEATURE_SIGNUP=false`, submit the still-open form → the server error message shows and no `[newsletter:log]` line is printed.
