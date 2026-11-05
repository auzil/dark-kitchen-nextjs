"use client";
// The hero app links: point at the hero cuisine's listings, nudge in when it changes. The order bar watches
// this row ([data-sticky-anchor]).
import { useRef } from "react";
import { useCuisine } from "@/components/cuisine/CuisineProvider";
import { AppLinks } from "@/components/ui/AppLinks/AppLinks";
import type { AppLinksByCuisine } from "@/lib/app-links";
import { useCuisineNudge } from "./useCuisineNudge";

export function HeroApps({ links, className }: { links: AppLinksByCuisine; className?: string }) {
  const { hero } = useCuisine();
  const ref = useRef<HTMLDivElement>(null);
  useCuisineNudge(ref, hero);
  return (
    <AppLinks
      ref={ref}
      items={links[hero]}
      cuisine={hero}
      group="hero"
      track="hero"
      className={className}
      hooks={{ "data-sticky-anchor": "", "data-motion": "hero-apps" }}
    />
  );
}
