import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["cs", "en", "ru"], // intake: Czech default at "/", English "/en", Russian "/ru"
  defaultLocale: "cs",
  localePrefix: "as-needed", // the default locale lives at "/", the others at "/<locale>"
  // "/" is always Czech, as in the prototype: no redirect by Accept-Language or cookie. The language
  // switch is explicit (CS / EN / RU links), so plain links work without a locale cookie.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
