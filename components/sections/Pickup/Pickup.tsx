// Pickup: address, hours, how to find the door, Google Maps link; drawn map + door photo. Server component.
import Image from "next/image";
import { getMessages, getTranslations } from "next-intl/server";
import { RevealLines } from "@/components/motion/RevealLines";
import { RevealPhoto } from "@/components/motion/RevealPhoto";
import { ButtonLink } from "@/components/ui/Button/Button";
import { Lines } from "@/components/ui/Lines/Lines";
import { media } from "@/content/media";
import type { Locale } from "@/i18n/routing";
import { cx } from "@/lib/cx";
import { features } from "@/lib/features";
import { fields, links } from "@/lib/fields";
import { PickupMap } from "./PickupMap";
import styles from "./Pickup.module.scss";

export async function Pickup({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "pickup" });
  const messages = await getMessages({ locale });
  const f = fields(locale);
  const door = media.pickupDoor;

  return (
    <section id="pickup" className={styles.root} aria-labelledby="pickup-title" data-section="pickup">
      <div className={cx(styles.inner, "container")}>
        <div>
          <RevealLines id="pickup-title" className={cx(styles.word, "t-h2 t-h2--long")}>
            <Lines lines={messages.pickup.title} />
          </RevealLines>
          <p className={cx(styles.lead, "t-body-lg")}>{t(features.signup ? "line" : "lineNoGift")}</p>
          <dl className={styles.facts}>
            <div>
              <dt>{t("address")}</dt>
              <dd data-sample="true">
                <span className={styles.street}>{f.street}</span>
                <span>{f.city}</span>
              </dd>
            </div>
            <div>
              <dt>{t("hours")}</dt>
              <dd className={cx(styles.hours, "tabular")} data-sample="true">
                <span>{t("days")}</span> <span>{f.hours}</span>
              </dd>
            </div>
            <div>
              <dt>{t("door")}</dt>
              <dd data-sample="true">{f.door}</dd>
            </div>
          </dl>
          <ButtonLink className={styles.maps} href={links.maps} data-track-event="directions_tap" data-track-section="pickup">
            {t("maps")}
          </ButtonLink>
        </div>
        <div className={styles.visual}>
          <PickupMap title={t("mapAlt")} brand={f.brand} street={f.street} />
          <RevealPhoto className={styles.door}>
            <Image
              src={door.src}
              width={door.width}
              height={door.height}
              sizes="(min-width: 90rem) 340px, (min-width: 64rem) 25vw, 100vw"
              alt={t("doorPhotoAlt")}
            />
          </RevealPhoto>
        </div>
      </div>
    </section>
  );
}
