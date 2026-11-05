"use client";
/*
 * revealPhotos — scroll into view — the photo inside a data-reveal="photo" wrapper wipes up (CSS clip-path
 * transition in app/styles/motion.scss, keyed by .is-in) — food photos land one by one.
 * Reduced motion: nothing runs; without html.motion-ok the photo was never clipped.
 * The observed element is the unclipped wrapper (Chromium's IntersectionObserver counts a target's own clip-path).
 */
import { useEffect, type RefObject } from "react";
import { markMotionBooted } from "@/lib/motion/gsap";
import { MEDIA, ONCE_VISIBLE } from "@/lib/motion/tokens";

export function useRevealPhoto(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !matchMedia(MEDIA.motion).matches) return;
    markMotionBooted();
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      el.classList.add("is-in");
    }, ONCE_VISIBLE);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
}
