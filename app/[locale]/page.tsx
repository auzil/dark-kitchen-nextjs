// The landing page: header, sections in the prototype's order, footer, dialogs, the mobile order bar.
// Everything is server-rendered and prerendered per locale; the client islands share state through
// CuisineProvider (pizza / sushi) and DialogProvider (which dialog, chooser preset).
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { CuisineOrder } from "@/components/cuisine/CuisineOrder";
import { CuisineProvider } from "@/components/cuisine/CuisineProvider";
import { DialogProvider } from "@/components/dialogs/DialogProvider";
import { Chooser } from "@/components/overlays/Chooser/Chooser";
import { MobileMenu } from "@/components/overlays/MobileMenu/MobileMenu";
import { OrderBar } from "@/components/overlays/OrderBar/OrderBar";
import { Combos } from "@/components/sections/Combos/Combos";
import { Footer } from "@/components/sections/Footer/Footer";
import { Header } from "@/components/sections/Header/Header";
import { Hero } from "@/components/sections/Hero/Hero";
import { JsonLd } from "@/components/sections/JsonLd/JsonLd";
import { Menu } from "@/components/sections/Menu/Menu";
import { Pickup } from "@/components/sections/Pickup/Pickup";
import { Signup } from "@/components/sections/Signup/Signup";
import { ButtonLink } from "@/components/ui/Button/Button";
import { WordmarkSymbol } from "@/components/ui/Wordmark/Wordmark";
import { site } from "@/content/site";
import { routing } from "@/i18n/routing";
import { getAppLinks } from "@/lib/app-links";
import { features } from "@/lib/features";
import { getStatusInput } from "@/lib/status-input";

export default async function Page({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale });
  const [appLinks, status] = await Promise.all([getAppLinks(locale), getStatusInput(locale)]);

  return (
    <CuisineProvider>
      <DialogProvider combosListing={site.combosListing}>
        <ButtonLink className="skip-link" href="#pizza">
          {t("skipLink")}
        </ButtonLink>
        <WordmarkSymbol />
        <Header locale={locale} />
        <main>
          <Hero locale={locale} appLinks={appLinks} status={status} />
          {/* the hero choice comes first (CuisineOrder); the second one is flipped */}
          <CuisineOrder
            pizza={<Menu cuisine="pizza" locale={locale} appLinks={appLinks} />}
            sushi={<Menu cuisine="sushi" locale={locale} appLinks={appLinks} />}
          />
          {site.combos.length > 0 && <Combos locale={locale} />}
          <Pickup locale={locale} />
          {features.signup && <Signup locale={locale} />}
        </main>
        <Footer locale={locale} />
        <MobileMenu locale={locale} status={status} />
        <Chooser locale={locale} appLinks={appLinks} />
        <OrderBar locale={locale} status={status} />
        <JsonLd locale={locale} />
      </DialogProvider>
    </CuisineProvider>
  );
}
