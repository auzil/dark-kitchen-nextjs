"use client";
// Puts the hero's chosen cuisine first (was putFirst() in js/cuisine.js): the menu sections in <main>, and the
// Pizza / Sushi links in the header nav and the mobile menu. Server-rendered children, reordered by key.
import { Fragment, type ReactNode } from "react";
import { useCuisine } from "./CuisineProvider";

export function CuisineOrder({ pizza, sushi }: { pizza: ReactNode; sushi: ReactNode }) {
  const { hero } = useCuisine();
  const items = hero === "sushi" ? [["sushi", sushi] as const, ["pizza", pizza] as const] : [["pizza", pizza] as const, ["sushi", sushi] as const];
  return items.map(([key, node]) => <Fragment key={key}>{node}</Fragment>);
}
