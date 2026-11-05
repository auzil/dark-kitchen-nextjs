// Shapes of content/site.ts and content/media.ts — the prototype's JSDoc @typedefs (js/data.js), one for one.
// Only change: images are keys into content/media.ts instead of paths.
import type { Locale } from "@/i18n/routing";
import type { MediaKey } from "./media";

export type Localized<T = string> = Record<Locale, T>;
export type Cuisine = "pizza" | "sushi";
export type AppId = "wolt" | "foodora" | "bolt";
export type Link = { url: string; sample?: boolean };
export type DishTag = "spicy" | "veg";
export type SizeUnit = "cm" | "pcs";

export type Dish = {
  id: string;
  name: string;
  img: MediaKey;
  size: [number, SizeUnit];
  tags: DishTag[];
  line: Localized;
  sample?: boolean;
};

export type Combo = { id: string; img: MediaKey; name: Localized; line: Localized; sample?: boolean };

export type SiteData = {
  brand: { name: string; sample?: boolean };
  /** "<app>.<cuisine>" order links + "google.profile" */
  links: Record<`${AppId}.${Cuisine}` | "google.profile", Link>;
  /** order of the app buttons */
  apps: { id: AppId; label: string }[];
  timeZone: string;
  /** ISO weekdays, 1 = Monday */
  hours: { days: number[]; open: string; close: string; sample?: boolean };
  address: { street: string; city: string; district: Localized; sample?: boolean };
  delivery: { area: Localized; areaShort: Localized; sample?: boolean };
  door: Localized & { sample?: boolean };
  contacts: {
    phone: string;
    email: string;
    instagram: { handle: string; url: string };
    tiktok: { handle: string; url: string };
    sample?: boolean;
  };
  company: { name: string; ico: string; seat: string; sample?: boolean };
  gift: { sample?: boolean };
  dishes: Record<Cuisine, Dish[]>;
  /** which listing sells the combos; null = offer both */
  combosListing: Cuisine | null;
  /** empty → the combos section is not rendered */
  combos: Combo[];
};

export type MediaItem = {
  src: string;
  width: number;
  height: number;
  /** temporary (AI-generated / prototype only): blocks the production build */
  temp?: true;
  source: "ai" | "stock" | "client";
};
