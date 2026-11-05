// Hero: photo, open-now status, headline, pizza/sushi switch, app links, facts band. Server component;
// the switch, the label, the app links and the section's state attributes are small client islands.
import { getMessages, getTranslations } from "next-intl/server";
import { Lines } from "@/components/ui/Lines/Lines";
import { OpenStatus } from "@/components/ui/OpenStatus/OpenStatus";
import type { Locale } from "@/i18n/routing";
import type { AppLinksByCuisine } from "@/lib/app-links";
import { cx } from "@/lib/cx";
import { features } from "@/lib/features";
import { fields } from "@/lib/fields";
import type { StatusInput } from "@/lib/open-status";
import { HeroApps } from "./HeroApps";
import { HeroOrder } from "./HeroOrder";
import { HeroPhoto } from "./HeroPhoto";
import { HeroRoot } from "./HeroRoot";
import { HeroSwitch } from "./HeroSwitch";
import { InAppHint } from "./InAppHint";
import styles from "./Hero.module.scss";

type HeroProps = { locale: Locale; appLinks: AppLinksByCuisine; status: StatusInput };

export async function Hero({ locale, appLinks, status }: HeroProps) {
  const t = await getTranslations({ locale });
  const messages = await getMessages({ locale });
  const f = fields(locale);

  return (
    <HeroRoot className={styles.root}>
      <div className={styles.media}>
        <div className={styles.pan}>
          <HeroPhoto alt={t("hero.photoAlt")} />
        </div>
      </div>

      <div className={styles.main}>
        <div className={cx(styles.body, "container")} data-hero-body="">
          <OpenStatus input={status} />
          <h1 id="hero-title" className={cx(styles.title, "t-display")}>
            <Lines lines={messages.hero.title} />
          </h1>
          <p className={cx(styles.delivery, "t-body-lg")}>
            {f.area}
          </p>
          <HeroSwitch
            className={styles.fill}
            labels={{ legend: t("switch.legend"), pizza: t("switch.pizza"), sushi: t("switch.sushi") }}
          />
          <HeroOrder className={styles.order} prompts={{ pizza: t("order.prompt.pizza"), sushi: t("order.prompt.sushi") }} />
          <HeroApps className={styles.fill} links={appLinks} />
          <p className={styles.pickup}>
            <a href="#pickup">{t("hero.pickup", { address: f.address })}</a>
          </p>
          <p className={cx(styles.prices, "t-fine")}>{t("order.prices")}</p>
          <InAppHint className={styles.hint} text={t("hero.inAppHint")} />
        </div>
      </div>

      <div className={styles.factsBand}>
        <ul className={cx(styles.facts, "container")} role="list">
          <li>
            <p className={styles.factTitle}>{t("facts.delivery.title")}</p>
            <p className={styles.factText}>{t("facts.delivery.text", { areaShort: f.areaShort })}</p>
          </li>
          <li>
            <p className={styles.factTitle}>
              <a href="#pickup">{t("facts.pickup.title")}</a>
            </p>
            <p className={styles.factText}>{t("facts.pickup.text", { hours: f.hours })}</p>
          </li>
          {features.signup && (
            <li>
              <p className={styles.factTitle}>
                <a href="#signup">{t("facts.gift.title")}</a>
              </p>
              <p className={styles.factText}>{t("facts.gift.text")}</p>
            </li>
          )}
          <li>
            <p className={styles.factTitle}>{t("facts.prices.title")}</p>
            <p className={styles.factText}>{t("order.prices")}</p>
          </li>
        </ul>
      </div>
    </HeroRoot>
  );
}
