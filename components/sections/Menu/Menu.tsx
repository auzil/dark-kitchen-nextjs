// Menu section for one cuisine: the word, a line, the dish grid (from content) and the order panel.
// Server component; MenuRoot only sets the flip. The page renders it for pizza and sushi.
import { getMessages, getTranslations } from "next-intl/server";
import { RevealLines } from "@/components/motion/RevealLines";
import { AppLinks } from "@/components/ui/AppLinks/AppLinks";
import { Dish } from "@/components/ui/Dish/Dish";
import { Lines } from "@/components/ui/Lines/Lines";
import { site } from "@/content/site";
import type { Cuisine } from "@/content/types";
import type { Locale } from "@/i18n/routing";
import type { AppLinksByCuisine } from "@/lib/app-links";
import { cx } from "@/lib/cx";
import { MenuRoot } from "./MenuRoot";
import styles from "./Menu.module.scss";

type MenuProps = { cuisine: Cuisine; locale: Locale; appLinks: AppLinksByCuisine };

export async function Menu({ cuisine, locale, appLinks }: MenuProps) {
  const t = await getTranslations({ locale });
  const messages = await getMessages({ locale });

  return (
    <MenuRoot cuisine={cuisine} className={styles.root}>
      <div className={cx(styles.inner, "container")}>
        <div className={styles.panel}>
          <RevealLines id={`${cuisine}-title`} className={cx(styles.word, "t-h2")}>
            <Lines lines={messages[cuisine].title} />
          </RevealLines>
          <p className={cx(styles.lead, "t-body-lg")}>{t(`${cuisine}.line`)}</p>
          <div className={styles.order}>
            <p className={styles.orderLabel}>{t(`order.heading.${cuisine}`)}</p>
            <AppLinks items={appLinks[cuisine]} cuisine={cuisine} group={cuisine} track={cuisine} />
            <p className="t-fine">{t("order.prices")}</p>
          </div>
        </div>
        <ul className={styles.grid} role="list" data-grid={cuisine}>
          {site.dishes[cuisine].map((dish) => (
            <Dish key={dish.id} dish={dish} locale={locale} />
          ))}
        </ul>
      </div>
    </MenuRoot>
  );
}
