// One combo card (was #tpl-combo + comboCard() in js/render.js). Server component.
import Image from "next/image";
import { RevealPhoto } from "@/components/motion/RevealPhoto";
import { media } from "@/content/media";
import type { Combo as ComboData } from "@/content/types";
import type { Locale } from "@/i18n/routing";
import { cx } from "@/lib/cx";
import { pick } from "@/lib/fields";
import styles from "./Combo.module.scss";

// mobile carousel cards are 82% wide; desktop 3 columns of the container
const SIZES = "(min-width: 90rem) 460px, (min-width: 64rem) 31vw, 82vw";

export function Combo({ combo, locale }: { combo: ComboData; locale: Locale }) {
  const photo = media[combo.img];
  const name = pick(combo.name, locale);
  return (
    <li className={styles.root} data-sample={combo.sample ? "true" : undefined}>
      <RevealPhoto className={styles.photo}>
        <Image src={photo.src} width={photo.width} height={photo.height} sizes={SIZES} alt={name} />
      </RevealPhoto>
      <h3 className={cx(styles.name, "t-h3")}>{name}</h3>
      <p className={styles.line}>{pick(combo.line, locale)}</p>
    </li>
  );
}
