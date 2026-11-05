// Sticky order bar (mobile): open-now status + Objednat, hidden while the hero app links are on screen.
import { getTranslations } from "next-intl/server";
import { DialogButton } from "@/components/dialogs/DialogButton";
import { OpenStatus } from "@/components/ui/OpenStatus/OpenStatus";
import type { Locale } from "@/i18n/routing";
import type { StatusInput } from "@/lib/open-status";
import { OrderBarRoot } from "./OrderBarRoot";
import styles from "./OrderBar.module.scss";

export async function OrderBar({ locale, status }: { locale: Locale; status: StatusInput }) {
  const t = await getTranslations({ locale });
  return (
    <OrderBarRoot className={styles.root}>
      <OpenStatus input={status} className={styles.status} />
      <DialogButton dialog="chooser" openerKey="bar" variant="accent" className={styles.button}>
        {t("order.button")}
      </DialogButton>
    </OrderBarRoot>
  );
}
