"use client";
// Single place where GSAP is configured. Components import gsap and plugins from here, never from "gsap"
// directly. Only the plugin this page uses (SplitText) is registered.
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { MOTION } from "./tokens";

gsap.registerPlugin(useGSAP, SplitText);
gsap.defaults({ duration: MOTION.dur.base, ease: MOTION.ease.out });

declare global {
  interface Window {
    /** read by the motion-class failsafe in the root layout: the motion code is running */
    __motionBooted?: boolean;
  }
}

/** Marks the motion code as running, so the layout's failsafe keeps html.motion-ok. */
export function markMotionBooted() {
  window.__motionBooted = true;
}

/** Resolves when el's own font is loaded (a split made in the fallback font has different line breaks). */
export function fontReady(el: HTMLElement): Promise<unknown> {
  const style = getComputedStyle(el);
  const font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  const giveUp = new Promise((resolve) => setTimeout(resolve, MOTION.wait.font)); // motion-lint-disable-line timer-sequencing
  return Promise.race([document.fonts.load(font, el.textContent ?? undefined), giveUp]).catch(() => {});
}

export { gsap, SplitText, useGSAP };
