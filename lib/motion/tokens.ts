/*
 * Motion — dark-kitchen / c-custom (motion map moved unchanged from the prototype's js/motion.js)
 *
 * moment         trigger          what moves                                           why
 * revealLines    scroll into view section words (data-reveal="lines") rise line by      the big condensed words are
 *                                 line out of a mask (SplitText)                       the design; they arrive, not blink
 * revealPhotos   scroll into view dish, combo, pickup and sign-up photos wipe up        food photos land one by one
 *                                 (data-reveal="photo", CSS clip-path transition)
 * cuisineNudge   switch change    hero app links rise in; the photo focus move and     shows that the buttons now
 *                                 the accent cross-fade are CSS (Hero.module.scss)     open the other listing
 * (CSS only)     dialog open      mobile menu wipes down, chooser sheet slides up      MobileMenu / Chooser modules
 *
 * Reduced motion: no moments run and html.motion-ok is never set, so nothing starts hidden; the page is in its
 *                 final state. The switch still changes accent, label, links and photo focus instantly
 *                 (motion.scss zeroes the CSS transitions).
 *
 * Code: components/motion/useRevealLines.ts, components/motion/useRevealPhoto.ts,
 *       components/sections/Hero/useCuisineNudge.ts. html.motion-ok is set before paint by the inline
 *       script in app/[locale]/layout.tsx.
 */

export const MOTION = {
  dur: { fast: 0.3, base: 0.6, lines: 0.9 }, // seconds
  ease: { out: "power3.out", lines: "expo.out" },
  stagger: { tight: 0.06, lines: 0.08 },
  dist: { rise: 12 }, // px
  wait: { font: 2500, failsafe: 3000 }, // ms: longest wait for a headline's font; headlines never stay hidden longer
} as const;

export const MEDIA = {
  motion: "(prefers-reduced-motion: no-preference)",
} as const;

/** IntersectionObserver options for "the first time it scrolls into view" (onceVisible in the prototype). */
export const ONCE_VISIBLE: IntersectionObserverInit = { threshold: 0.15, rootMargin: "0px 0px -8% 0px" };
