"use client";
// "Objednej pizzu:" / "Objednej sushi:" above the hero app links, follows the hero switch.
import { useCuisine } from "@/components/cuisine/CuisineProvider";
import type { Cuisine } from "@/content/types";

export function HeroOrder({ className, prompts }: { className?: string; prompts: Record<Cuisine, string> }) {
  const { hero } = useCuisine();
  return (
    <p className={className} aria-live="polite" data-hero-order="">
      {prompts[hero]}
    </p>
  );
}
