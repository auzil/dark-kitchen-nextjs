"use client";
// The hero's pizza / sushi switch: drives the hero state of CuisineProvider.
import { useCuisine } from "@/components/cuisine/CuisineProvider";
import { CuisineSwitch, type SwitchLabels } from "@/components/ui/CuisineSwitch/CuisineSwitch";

export function HeroSwitch({ labels, className }: { labels: SwitchLabels; className?: string }) {
  const { hero, setHero } = useCuisine();
  return <CuisineSwitch name="cuisine" value={hero} onChange={setHero} labels={labels} className={className} />;
}
