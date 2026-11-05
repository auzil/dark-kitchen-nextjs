// The site's public origin (metadata, sitemap, JSON-LD). Required in production (the guard lists it).
export const SITE_URL = (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

/** "/" for the default locale, "/en" etc. for the others (localePrefix "as-needed"). */
export const localePath = (locale: string, defaultLocale = "cs") => (locale === defaultLocale ? "/" : `/${locale}`);
