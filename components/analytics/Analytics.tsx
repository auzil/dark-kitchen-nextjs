// GA4 setup (references/scripts-analytics.md): the gtag stub with every consent type denied, and the consent
// banner. Renders nothing without NEXT_PUBLIC_GA_ID. gtag.js itself is loaded by lib/analytics.ts after consent.
import { getTranslations } from "next-intl/server";
import { InlineScript } from "@/components/ui/InlineScript/InlineScript";
import type { Locale } from "@/i18n/routing";
import { GA_ID } from "@/lib/analytics";
import { ConsentBanner } from "./ConsentBanner";

// dataLayer + gtag queue, and basic consent mode: all denied until the visitor accepts
const GTAG_STUB = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag("consent","default",{ad_storage:"denied",ad_user_data:"denied",ad_personalization:"denied",analytics_storage:"denied"})`;

export async function Analytics({ locale }: { locale: Locale }) {
  if (!GA_ID) return null;
  const t = await getTranslations({ locale, namespace: "consent" });
  return (
    <>
      <InlineScript html={GTAG_STUB} />
      <ConsentBanner
        copy={{ title: t("title"), text: t("text"), privacy: t("privacy"), accept: t("accept"), reject: t("reject") }}
      />
    </>
  );
}
