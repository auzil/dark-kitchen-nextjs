// Root layout (there is no app/layout.tsx): <html lang>, fonts, global CSS, metadata, the guards and the
// page-wide behaviours (anchor scroll, click tracking, GA4 + consent banner).
// Global CSS order matters only here: base.scss declares the @layer order and must come first.
import "../styles/base.scss";
import "../styles/tokens.scss";
import "../styles/motion.scss";

import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Analytics } from "@/components/analytics/Analytics";
import { TrackClicks } from "@/components/analytics/TrackClicks";
import { AnchorScroll } from "@/components/page/AnchorScroll";
import { InlineScript } from "@/components/ui/InlineScript/InlineScript";
import { PreviewBadge } from "@/components/ui/PreviewBadge/PreviewBadge";
import { media } from "@/content/media";
import { site } from "@/content/site";
import { routing } from "@/i18n/routing";
import { skippedPlaceholders } from "@/lib/features";
import { fontVariables } from "@/lib/fonts";
import { allowPlaceholders, assertNoPlaceholders, findPlaceholders } from "@/lib/placeholders";
import { REQUIRED_ENV, settingPlaceholders } from "@/lib/required-env";
import { localePath, SITE_URL } from "@/lib/site-url";

// Motion start states (app/styles/motion.scss) apply only under html.motion-ok. Set before paint so nothing
// flashes, never under reduced motion; if the motion code never boots (JS failed), the failsafe removes it
// so the page shows in its final state. The motion hooks set window.__motionBooted (lib/motion/gsap.ts).
const MOTION_CLASS_SCRIPT = `(function(){var r=document.documentElement;if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;r.classList.add("motion-ok");setTimeout(function(){if(!window.__motionBooted)r.classList.remove("motion-ok")},4000)})()`;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(SITE_URL),
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: localePath(locale),
      languages: {
        ...Object.fromEntries(routing.locales.map((l) => [l, localePath(l)])),
        "x-default": "/",
      },
    },
    openGraph: {
      type: "website",
      locale,
      siteName: site.brand.name,
      url: localePath(locale),
      title: t("title"),
      description: t("description"),
    },
    twitter: { card: "summary_large_image" },
    robots: allowPlaceholders || process.env.VERCEL_ENV === "preview" ? { index: false, follow: false } : undefined,
  };
}

export const viewport: Viewport = {
  themeColor: "#1A120D",
  viewportFit: "cover",
};

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const placeholders = [...findPlaceholders({ site, media }, REQUIRED_ENV, skippedPlaceholders), ...settingPlaceholders()];
  assertNoPlaceholders(placeholders);
  const t = await getTranslations({ locale, namespace: "meta" });

  return (
    // the inline script adds a class before React hydrates
    <html lang={locale} className={fontVariables} suppressHydrationWarning>
      <head>
        <InlineScript html={MOTION_CLASS_SCRIPT} />
      </head>
      {/* data-cuisine: the page context (CuisineProvider updates it); accent of the header button and the bar */}
      <body data-cuisine="pizza">
        {children}
        <AnchorScroll />
        <TrackClicks lang={locale} />
        <Analytics locale={locale} />
        {allowPlaceholders && placeholders.length > 0 && <PreviewBadge label={t("previewBadge")} count={placeholders.length} />}
      </body>
    </html>
  );
}
