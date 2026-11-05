"use client";
/*
 * App-tap tracking (was js/analytics.js): every tap on an app link ("App tap" { app, cuisine, section, source,
 * lang }) goes to Plausible if it's loaded (cookieless). source = the visit's first utm_source, kept in
 * sessionStorage. ?debug logs taps to the console. One listener on document; links stay plain server-rendered
 * <a data-app data-cuisine data-track>.
 */
import { useEffect } from "react";

const SOURCE_KEY = "tr-src";

declare global {
  interface Window {
    plausible?: (event: string, options?: { props: Record<string, string> }) => void;
  }
}

// sessionStorage can throw (private mode, blocked storage): tracking must never break the page
const session = {
  get(key: string) {
    try {
      return sessionStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string) {
    try {
      sessionStorage.setItem(key, value);
    } catch {
      /* ignore */
    }
  },
};

export function TrackClicks({ lang }: { lang: string }) {
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const debug = params.has("debug");
    const source = params.get("utm_source");
    if (source) session.set(SOURCE_KEY, source);

    const onTap = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>("a[data-app]");
      if (!link) return;
      const props = {
        app: link.dataset.app ?? "",
        cuisine: link.dataset.cuisine ?? "",
        section: link.dataset.track ?? "",
        source: session.get(SOURCE_KEY) ?? "direct",
        lang,
      };
      window.plausible?.("App tap", { props });
      if (debug) console.info("[track] App tap", props);
    };
    document.addEventListener("click", onTap);
    return () => document.removeEventListener("click", onTap);
  }, [lang]);

  return null;
}
