// Server side of the open-now status: hours from content + the three translated strings.
import { getTranslations } from "next-intl/server";
import { site } from "@/content/site";
import type { Locale } from "@/i18n/routing";
import type { StatusInput } from "./open-status";

export async function getStatusInput(locale: Locale): Promise<StatusInput> {
  const t = await getTranslations({ locale, namespace: "status" });
  const { days, open, close } = site.hours;
  return {
    timeZone: site.timeZone,
    days,
    open,
    close,
    text: {
      openUntil: t("openUntil", { time: close }),
      opensAt: t("opensAt", { time: open }),
      opensTomorrow: t("opensTomorrow", { time: open }),
    },
  };
}
