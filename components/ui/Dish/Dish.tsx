// One dish card (was #tpl-dish + dishCard() in js/render.js). Server component.
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { RevealPhoto } from "@/components/motion/RevealPhoto";
import { media } from "@/content/media";
import type { Dish as DishData } from "@/content/types";
import type { Locale } from "@/i18n/routing";
import { cx } from "@/lib/cx";
import { pick } from "@/lib/fields";
import styles from "./Dish.module.scss";

// the grid is 2 columns on phones, 3 columns in 8/12 of the container from 64rem
const SIZES = "(min-width: 90rem) 300px, (min-width: 64rem) 21vw, 50vw";

export async function Dish({ dish, locale }: { dish: DishData; locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "dish" });
  const photo = media[dish.img];
  const [amount, unit] = dish.size;

  return (
    <li className={styles.root} data-sample={dish.sample ? "true" : undefined}>
      <RevealPhoto className={styles.photo}>
        <Image src={photo.src} width={photo.width} height={photo.height} sizes={SIZES} alt={dish.name} />
      </RevealPhoto>
      <h3 className={cx(styles.name, "t-h3")}>{dish.name}</h3>
      <p className={styles.line}>{pick(dish.line, locale)}</p>
      <p className={styles.meta}>
        <span className="tabular">{`${amount} ${t(`unit.${unit}`)}`}</span>
        {dish.tags.map((tag) => (
          <span key={tag} className={styles.tag} data-tag={tag}>
            {t(`tag.${tag}`)}
          </span>
        ))}
      </p>
    </li>
  );
}
