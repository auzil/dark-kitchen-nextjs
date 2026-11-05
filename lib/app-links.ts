// The app order links per cuisine, with their translated aria-labels (was appLink() in js/render.js).
// Built on the server and passed to the client islands as plain data.
import { getTranslations } from "next-intl/server";
import { site } from "@/content/site";
import type { AppId, Cuisine } from "@/content/types";
import type { Locale } from "@/i18n/routing";

export type AppLinkItem = { app: AppId; label: string; href: string; ariaLabel: string; sample: boolean };
export type AppLinksByCuisine = Record<Cuisine, AppLinkItem[]>;

export async function getAppLinks(locale: Locale): Promise<AppLinksByCuisine> {
  const t = await getTranslations({ locale, namespace: "order" });
  const forCuisine = (cuisine: Cuisine): AppLinkItem[] =>
    site.apps.map((app) => {
      const link = site.links[`${app.id}.${cuisine}`];
      return {
        app: app.id,
        label: app.label,
        href: link.url,
        ariaLabel: t("appLabel", { cuisine: t(`cuisine.${cuisine}`), app: app.label }),
        sample: Boolean(link.sample),
      };
    });
  return { pizza: forCuisine("pizza"), sushi: forCuisine("sushi") };
}
