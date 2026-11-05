"use client";
/*
 * revealLines — scroll into view — section words rise line by line out of a mask (SplitText) — the big
 * condensed words are the design; they arrive, not blink.
 * Reduced motion: nothing runs (no html.motion-ok, so the headline was never hidden).
 *
 * The split is never reverted when the animation ends: reverting re-wraps the plain text, and its line breaks
 * can differ from the animated ones. autoSplit re-splits (keeping the progress) if the font arrives late or
 * the viewport resizes. Everything is reverted on unmount (useGSAP context).
 */
import type { RefObject } from "react";
import { fontReady, gsap, markMotionBooted, SplitText, useGSAP } from "@/lib/motion/gsap";
import { MEDIA, MOTION, ONCE_VISIBLE } from "@/lib/motion/tokens";

type SplitElement = HTMLElement & { _kitSplit?: SplitText | null };

export function useRevealLines(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const el = scope.current as SplitElement | null;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MEDIA.motion, (ctx) => {
        markMotionBooted();
        // the headline never stays hidden longer than this, whatever happens to the font or the split
        const failsafe = setTimeout(() => el.classList.add("is-split"), MOTION.wait.failsafe); // motion-lint-disable-line timer-sequencing
        let observer: IntersectionObserver | null = null;
        let cancelled = false;

        fontReady(el).then(() => {
          if (cancelled) return;
          // created after an await: add it to the matchMedia context so it's reverted with the rest
          ctx.add(() => {
            let tween: gsap.core.Tween | null = null;
            const split = SplitText.create(el, {
              type: "lines",
              mask: "lines",
              autoSplit: true,
              onSplit(self) {
                // Masks are exactly one line box tall. With tight display line-heights, descenders and
                // diacritics (g y p, Č Ř Ů) stick out and would be clipped: a clip-path that reaches past the
                // box keeps the mask effect and leaves room for the glyphs, without changing layout.
                self.masks.forEach((mask) => {
                  const box = mask as HTMLElement;
                  box.style.overflow = "visible";
                  box.style.clipPath = "inset(-0.25em -0.1em -0.35em -0.1em)";
                });
                el.classList.add("is-split");

                const firstSplit = !tween;
                tween = gsap.from(self.lines, {
                  // start each line fully below its (extended) mask: line height + bottom room + top overhang
                  y: (_i: number, line: HTMLElement) => line.offsetHeight + parseFloat(getComputedStyle(line).fontSize) * 0.65,
                  duration: MOTION.dur.lines,
                  ease: MOTION.ease.lines,
                  stagger: MOTION.stagger.lines,
                  paused: firstSplit, // plays when the headline scrolls into view
                });
                return tween;
              },
            });
            el._kitSplit = split; // read by check-linebreaks.mjs

            // plays once, the first time the headline scrolls into view
            observer = new IntersectionObserver((entries) => {
              if (!entries.some((entry) => entry.isIntersecting)) return;
              observer?.disconnect();
              tween?.play();
            }, ONCE_VISIBLE);
            observer.observe(el);
          });
        });

        return () => {
          cancelled = true;
          clearTimeout(failsafe);
          observer?.disconnect();
          el._kitSplit = null;
        };
      });
    },
    { scope },
  );
}
