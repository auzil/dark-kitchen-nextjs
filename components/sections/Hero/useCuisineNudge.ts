"use client";
/*
 * cuisineNudge — hero switch change — the hero app links rise in; the photo focus move and the accent
 * cross-fade are CSS (Hero.module.scss) — shows that the buttons now open the other listing.
 * Reduced motion: nothing runs; the links just change.
 */
import { useRef, type RefObject } from "react";
import type { Cuisine } from "@/content/types";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { MEDIA, MOTION } from "@/lib/motion/tokens";

export function useCuisineNudge(scope: RefObject<HTMLElement | null>, cuisine: Cuisine) {
  const previous = useRef(cuisine);
  useGSAP(
    () => {
      if (previous.current === cuisine) return; // first render: the links are already in place
      previous.current = cuisine;
      const mm = gsap.matchMedia();
      mm.add(MEDIA.motion, () => {
        const links = scope.current?.children;
        if (!links?.length) return;
        gsap.from(links, { y: MOTION.dist.rise, autoAlpha: 0, duration: MOTION.dur.fast, stagger: MOTION.stagger.tight });
      });
    },
    { scope, dependencies: [cuisine] },
  );
}
