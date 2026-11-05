// Mobile menu (dialog): section links (the chosen cuisine first), open-now status, languages.
import { getTranslations } from "next-intl/server";
import { CuisineOrder } from "@/components/cuisine/CuisineOrder";
import { PageDialog } from "@/components/dialogs/PageDialog";
import { CloseButton } from "@/components/ui/CloseButton/CloseButton";
import { LangSwitch } from "@/components/ui/LangSwitch/LangSwitch";
import { Logo } from "@/components/ui/Logo/Logo";
import { OpenStatus } from "@/components/ui/OpenStatus/OpenStatus";
import { site } from "@/content/site";
import type { Locale } from "@/i18n/routing";
import { features } from "@/lib/features";
import type { StatusInput } from "@/lib/open-status";
import styles from "./MobileMenu.module.scss";

export async function MobileMenu({ locale, status }: { locale: Locale; status: StatusInput }) {
  const t = await getTranslations({ locale });
  return (
    <PageDialog id="menu" className={styles.root} label={t("nav.menu")}>
      <div className={styles.top}>
        <Logo label={site.brand.name} size="menu" />
        <CloseButton label={t("nav.close")} />
      </div>
      <ul className={styles.links} role="list">
        <CuisineOrder
          pizza={
            <li>
              <a href="#pizza">{t("nav.pizza")}</a>
            </li>
          }
          sushi={
            <li>
              <a href="#sushi">{t("nav.sushi")}</a>
            </li>
          }
        />
        {site.combos.length > 0 && (
          <li>
            <a href="#combos">{t("nav.combos")}</a>
          </li>
        )}
        <li>
          <a href="#pickup">{t("nav.pickup")}</a>
        </li>
        {features.signup && (
          <li>
            <a href="#signup">{t("nav.gift")}</a>
          </li>
        )}
      </ul>
      <OpenStatus input={status} />
      <LangSwitch current={locale} label={t("lang.label")} className={styles.langs} />
    </PageDialog>
  );
}
