"use client";
// Footer "Cookie settings": shows the consent banner again (ConsentBanner listens for the event).
import type { ReactNode } from "react";
import { CONSENT_OPEN_EVENT } from "@/lib/analytics";

export function CookieSettings({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))}>
      {children}
    </button>
  );
}
