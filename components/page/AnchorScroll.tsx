"use client";
/*
 * In-page links (was anchorScroll() in js/page.js): a[href^="#"] scrolls smoothly (instantly with reduced
 * motion) and moves focus to the target, so keyboard and screen-reader users continue from there.
 * data-no-scroll opts out. Dialogs close on link clicks before this runs (their listener is on the dialog).
 */
import { useEffect } from "react";

export function AnchorScroll() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link || event.defaultPrevented || link.hasAttribute("data-no-scroll")) return;

      const hash = link.getAttribute("href") ?? "";
      let target: HTMLElement | null = null;
      try {
        target = hash.length > 1 ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
      } catch {
        /* malformed hash: let the browser handle it */
      }
      if (!target) return;

      event.preventDefault();
      const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
      if (location.hash !== hash) history.pushState(null, "", hash);
      if (!target.matches("a, button, input, select, textarea, [tabindex]")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
