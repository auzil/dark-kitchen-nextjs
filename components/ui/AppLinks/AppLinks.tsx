// Three order links (one per app) for one cuisine. No hooks: the hero and chooser islands re-render it
// when the cuisine changes; the menu sections render it on the server. Taps are tracked by TrackClicks
// through data-app / data-cuisine / data-track.
import type { Ref } from "react";
import type { Cuisine } from "@/content/types";
import type { AppLinkItem } from "@/lib/app-links";
import { cx } from "@/lib/cx";
import styles from "./AppLinks.module.scss";

type AppLinksProps = {
  items: AppLinkItem[];
  cuisine: Cuisine;
  /** analytics section and the data-apps group name */
  group: string;
  track: string;
  variant?: "stack";
  className?: string;
  ref?: Ref<HTMLDivElement>;
  hidden?: boolean;
  /** extra hooks the page behaviours and motion select by */
  hooks?: Record<`data-${string}`, string | boolean>;
};

export function AppLinks({ items, cuisine, group, track, variant, className, ref, hidden, hooks }: AppLinksProps) {
  return (
    <div ref={ref} className={cx(styles.root, className)} data-variant={variant} data-apps={group} data-track={track} hidden={hidden} {...hooks}>
      {items.map((item) => (
        <a
          key={item.app}
          className={styles.link}
          href={item.href}
          data-app={item.app}
          data-cuisine={cuisine}
          data-track={track}
          data-sample={item.sample ? "true" : undefined}
          aria-label={item.ariaLabel}
        >
          {item.label}
        </a>
      ))}
    </div>
  );
}
