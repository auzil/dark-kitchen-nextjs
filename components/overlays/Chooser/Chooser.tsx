// App chooser (dialog): opened by the header button, the order bar and the combos button.
import { getTranslations } from "next-intl/server";
import { PageDialog } from "@/components/dialogs/PageDialog";
import { CloseButton } from "@/components/ui/CloseButton/CloseButton";
import type { Locale } from "@/i18n/routing";
import type { AppLinksByCuisine } from "@/lib/app-links";
import { ChooserBody } from "./ChooserBody";
import styles from "./Chooser.module.scss";

export async function Chooser({ locale, appLinks }: { locale: Locale; appLinks: AppLinksByCuisine }) {
  const t = await getTranslations({ locale });
  return (
    <PageDialog id="chooser" className={styles.root} labelledBy="chooser-title">
      <div className={styles.backdrop} data-dialog-close="" />
      <div className={styles.sheet}>
        <div className={styles.head}>
          <h2 id="chooser-title" className={styles.title}>
            {t("chooser.title")}
          </h2>
          <CloseButton label={t("nav.close")} />
        </div>
        <ChooserBody
          links={appLinks}
          labels={{ legend: t("switch.legend"), pizza: t("switch.pizza"), sushi: t("switch.sushi") }}
          prompts={{ pizza: t("order.prompt.pizza"), sushi: t("order.prompt.sushi") }}
          classNames={{ switch: styles.switch, both: styles.both, bothLinks: styles.bothLinks, label: styles.label }}
        />
        <p className="t-fine">
          <span>{t("chooser.sub")}</span> <span>{t("order.prices")}</span>
        </p>
      </div>
    </PageDialog>
  );
}
