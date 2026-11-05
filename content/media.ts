/*
 * Every image the site renders. Sections import images from here, never by path.
 * temp: true = AI-generated for the prototype (clients/dark-kitchen/media/temp/TEMP-MEDIA.md): never live.
 * Replacing one: drop the real file into public/images/, update src/size here, delete `temp`.
 */
import type { MediaItem } from "./types";

const ai = (file: string, width: number, height: number): MediaItem => ({
  src: `/images/${file}`,
  width,
  height,
  temp: true,
  source: "ai",
});

export const media = {
  heroMobile: ai("hero-mobile-1.webp", 1200, 1490),
  heroWide: ai("hero-wide-cc.webp", 2400, 1340),

  pizzaMargherita: ai("pizza-margherita-1.webp", 720, 720),
  pizzaDiavola: ai("pizza-diavola-1.webp", 720, 720),
  pizzaQuattroFormaggi: ai("pizza-quattro-formaggi-1.webp", 720, 720),
  pizzaProsciuttoFunghi: ai("pizza-prosciutto-funghi-1.webp", 720, 720),
  pizzaTonnoCipolla: ai("pizza-tonno-cipolla-1.webp", 720, 720),
  pizzaSalsiccia: ai("pizza-salsiccia-1.webp", 720, 720),
  sushiPhiladelphia: ai("sushi-philadelphia-1.webp", 720, 720),
  sushiCalifornia: ai("sushi-california-1.webp", 720, 720),
  sushiSpicyTuna: ai("sushi-spicy-tuna-1.webp", 720, 720),
  sushiAvocadoMaki: ai("sushi-avocado-maki-1.webp", 720, 720),
  sushiSakeNigiri: ai("sushi-sake-nigiri-1.webp", 720, 720),
  sushiSetSalmon: ai("sushi-set-salmon-1.webp", 720, 720),

  comboProDva: ai("combo-pro-dva-cc.webp", 1000, 671),
  comboProPartu: ai("combo-pro-partu-cc.webp", 1000, 671),
  comboDoKanclu: ai("combo-do-kanclu-cc.webp", 1000, 671),

  // the storefront photo from the client folder (clients/dark-kitchen/media/, not media/temp/)
  pickupDoor: { src: "/images/imperial-food-place.webp", width: 1350, height: 896, source: "client" },
  gift: ai("gift-2.webp", 900, 900),

  // app/[locale]/opengraph-image.jpg: the prototype export's 1200×630 screenshot of the hero (AI photo)
  og: ai("../../app/[locale]/opengraph-image.jpg", 1200, 630), // file convention, not rendered from here
} satisfies Record<string, MediaItem>;

export type MediaKey = keyof typeof media;
