"use client";
// A menu <section>: the one that comes second (not the hero choice) is flipped (panel on the right).
import type { ReactNode } from "react";
import { useCuisine } from "@/components/cuisine/CuisineProvider";
import type { Cuisine } from "@/content/types";

export function MenuRoot({ cuisine, className, children }: { cuisine: Cuisine; className?: string; children: ReactNode }) {
  const { hero } = useCuisine();
  return (
    <section
      id={cuisine}
      className={className}
      aria-labelledby={`${cuisine}-title`}
      data-section={cuisine}
      data-cuisine={cuisine}
      data-variant={hero === cuisine ? undefined : "flip"}
    >
      {children}
    </section>
  );
}
