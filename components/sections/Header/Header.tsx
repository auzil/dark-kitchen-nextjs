// Header: logo, section anchors (the chosen cuisine first), language switch, Objednat (desktop) and the
// burger (mobile). Server component with client islands.
import { getTranslations } from "next-intl/server";
import { CuisineOrder } from "@/components/cuisine/CuisineOrder";
import { DialogButton } from "@/components/dialogs/DialogButton";
import { LangSwitch } from "@/components/ui/LangSwitch/LangSwitch";
import { Logo } from "@/components/ui/Logo/Logo";
import { site } from "@/content/site";
import type { Locale } from "@/i18n/routing";
import { cx } from "@/lib/cx";
import { features } from "@/lib/features";
import { HeaderRoot } from "./HeaderRoot";
import styles from "./Header.module.scss";

export async function Header({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  return (
    <HeaderRoot className={styles.root}>
      <div className={cx(styles.inner, "container")}>
        <Logo label={site.brand.name} />
        <nav className={styles.nav} aria-label={t("nav.menu")}>
          <CuisineOrder pizza={<a href="#pizza">{t("nav.pizza")}</a>} sushi={<a href="#sushi">{t("nav.sushi")}</a>} />
          {site.combos.length > 0 && <a href="#combos">{t("nav.combos")}</a>}
          <a href="#pickup">{t("nav.pickup")}</a>
          {features.signup && <a href="#signup">{t("nav.gift")}</a>}
        </nav>
        <LangSwitch current={locale} label={t("lang.label")} className={styles.langs} />
        <DialogButton dialog="chooser" openerKey="header" variant="accent" className={styles.order}>
          {t("order.button")}
        </DialogButton>
        <DialogButton dialog="menu" openerKey="burger" variant="plain" haspopup={false} className={styles.burger} label={t("nav.menu")}>
          <span />
        </DialogButton>
      </div>
    </HeaderRoot>
  );
}
