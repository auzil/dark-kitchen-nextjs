// Types next-intl's locale and message keys: t("hero.titel") is a type error.
import type { routing } from "@/i18n/routing";
import type messages from "./messages/cs.json"; // the default locale's file

declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}
