"use client";
// The fixed header: solid background once the page scrolls (was solidHeader() in js/page.js).
import { useSyncExternalStore, type ReactNode } from "react";

const subscribe = (onChange: () => void) => {
  addEventListener("scroll", onChange, { passive: true });
  return () => removeEventListener("scroll", onChange);
};

export function HeaderRoot({ className, children }: { className?: string; children: ReactNode }) {
  const solid = useSyncExternalStore(subscribe, () => window.scrollY > 8, () => false);
  return (
    <header className={className} data-header="" data-solid={solid ? "" : undefined}>
      {children}
    </header>
  );
}
