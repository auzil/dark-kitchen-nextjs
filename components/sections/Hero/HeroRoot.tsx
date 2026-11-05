"use client";
/*
 * The hero <section>: reflects the hero cuisine (data-cuisine, data-live after the first tap) and measures
 * the text stack into --stack-h for the mobile photo height (was heroPhotoHeight() in js/page.js).
 * The content is server-rendered children.
 */
import { useEffect, useRef, type ReactNode } from "react";
import { useCuisine } from "@/components/cuisine/CuisineProvider";

export function HeroRoot({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const { hero, live } = useCuisine();

  useEffect(() => {
    const section = ref.current;
    const body = section?.querySelector<HTMLElement>("[data-hero-body]");
    if (!section || !body) return;
    const observer = new ResizeObserver(() => section.style.setProperty("--stack-h", `${body.offsetHeight}px`));
    observer.observe(body);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id="top"
      className={className}
      aria-labelledby="hero-title"
      data-section="hero"
      data-hero=""
      data-cuisine={hero}
      data-picked=""
      data-live={live ? "" : undefined}
    >
      {children}
    </section>
  );
}
