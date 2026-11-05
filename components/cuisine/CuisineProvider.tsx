"use client";
/*
 * Pizza / sushi state (was js/cuisine.js). Three independent choices:
 *
 *   hero     the hero switch (pizza on every load): hero photo focus, the "Objednej …:" label, the hero app
 *            links, and which menu section comes first
 *   inView   the menu section in the middle of the viewport (IntersectionObserver), else null
 *   chooser  preset by DialogProvider each time the chooser opens; its own switch changes only the chooser
 *
 * The page context (inView ?? hero) goes on <body data-cuisine> (accent of the header button and the order
 * bar), the one global DOM side effect, in one effect below. Everything else reads the context.
 */
import { createContext, use, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Cuisine } from "@/content/types";

const CUISINES: Cuisine[] = ["pizza", "sushi"];

type CuisineState = {
  hero: Cuisine;
  /** true after the first tap on the hero switch: only then is the photo move animated */
  live: boolean;
  inView: Cuisine | null;
  chooser: Cuisine;
  setHero: (cuisine: Cuisine) => void;
  setChooser: (cuisine: Cuisine) => void;
};

const CuisineContext = createContext<CuisineState | null>(null);

export function CuisineProvider({ children }: { children: ReactNode }) {
  const [hero, setHeroState] = useState<Cuisine>("pizza");
  const [live, setLive] = useState(false);
  const [inView, setInView] = useState<Cuisine | null>(null);
  const [chooser, setChooser] = useState<Cuisine>("pizza");

  const setHero = useCallback((cuisine: Cuisine) => {
    setHeroState(cuisine);
    setLive(true);
  }, []);

  // the menu section that crosses the middle of the viewport
  useEffect(() => {
    const visible = new Map<string, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => visible.set(entry.target.id, entry.isIntersecting));
        setInView(CUISINES.find((cuisine) => visible.get(cuisine)) ?? null);
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    for (const cuisine of CUISINES) {
      const section = document.getElementById(cuisine);
      if (section) observer.observe(section);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.dataset.cuisine = inView ?? hero;
  }, [inView, hero]);

  const value = useMemo(() => ({ hero, live, inView, chooser, setHero, setChooser }), [hero, live, inView, chooser, setHero]);
  return <CuisineContext value={value}>{children}</CuisineContext>;
}

export function useCuisine(): CuisineState {
  const value = use(CuisineContext);
  if (!value) throw new Error("useCuisine() outside <CuisineProvider>");
  return value;
}
