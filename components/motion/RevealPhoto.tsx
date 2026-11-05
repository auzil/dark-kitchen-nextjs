"use client";
// Wrapper whose child photo wipes up the first time it scrolls into view (data-reveal="photo").
import { useRef, type ReactNode } from "react";
import { useRevealPhoto } from "./useRevealPhoto";

export function RevealPhoto({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useRevealPhoto(ref);
  return (
    <div ref={ref} className={className} data-reveal="photo">
      {children}
    </div>
  );
}
