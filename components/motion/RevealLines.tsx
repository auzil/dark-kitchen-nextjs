"use client";
// A section word (h2) that reveals line by line (data-reveal="lines"). The lines are server-rendered children.
import { useRef, type ReactNode } from "react";
import { useRevealLines } from "./useRevealLines";

export function RevealLines({ id, className, children }: { id: string; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useRevealLines(ref);
  return (
    <h2 ref={ref} id={id} className={className} data-reveal="lines">
      {children}
    </h2>
  );
}
