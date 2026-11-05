"use client";
// The bar slides in once the hero app links ([data-sticky-anchor]) leave the screen; while it is off screen
// (only translated away) it is inert and hidden from screen readers (was orderBar() in js/page.js).
import { useEffect, useState, type ReactNode } from "react";

export function OrderBarRoot({ className, children }: { className?: string; children: ReactNode }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const anchor = document.querySelector("[data-sticky-anchor]");
    if (!anchor) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(!entry?.isIntersecting));
    observer.observe(anchor);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={className} data-sticky-cta="" data-visible={visible ? "" : undefined} inert={!visible} aria-hidden={visible ? undefined : "true"}>
      {children}
    </div>
  );
}
