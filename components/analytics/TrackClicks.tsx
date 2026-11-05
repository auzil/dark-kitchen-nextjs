"use client";
/*
 * Click tracking for GA4 (see lib/analytics.ts): one listener on document, links stay plain server-rendered <a>.
 * - a[data-app] (+ data-cuisine, data-track = section) → app_tap { app, cuisine, section, lang }, a key event
 * - any element with data-track-event="name" → that event, params = its other data-track-* attributes
 *   (data-track-method="phone" → { method: "phone" }) plus lang. Events: directions_tap, contact_tap, social_tap,
 *   chooser_open. Sent only after consent; with ?debug they are also logged to the console.
 */
import { useEffect } from "react";
import { track } from "@/lib/analytics";

/** Every data-track-* except -event as a param: data-track-method="phone" (dataset.trackMethod) → { method: "phone" } */
function trackParams(element: HTMLElement): Record<string, string> {
  const params: Record<string, string> = {};
  for (const [key, value] of Object.entries(element.dataset)) {
    const name = /^track([A-Z]\w*)$/.exec(key)?.[1];
    if (name && name !== "Event" && value !== undefined) params[name.charAt(0).toLowerCase() + name.slice(1)] = value;
  }
  return params;
}

export function TrackClicks({ lang }: { lang: string }) {
  useEffect(() => {
    const onTap = (event: MouseEvent) => {
      const element = (event.target as Element | null)?.closest<HTMLElement>("a[data-app], [data-track-event]");
      if (!element) return;
      if (element.dataset.app) {
        track("app_tap", { app: element.dataset.app, cuisine: element.dataset.cuisine ?? "", section: element.dataset.track ?? "", lang });
      } else if (element.dataset.trackEvent) {
        track(element.dataset.trackEvent, { ...trackParams(element), lang });
      }
    };
    document.addEventListener("click", onTap);
    return () => document.removeEventListener("click", onTap);
  }, [lang]);

  return null;
}
