import { Wordmark } from "@/components/ui/Wordmark/Wordmark";
import styles from "./Logo.module.scss";

export function Logo({ label, size }: { label: string; size?: "menu" }) {
  return (
    <a className={styles.root} href="#top" aria-label={label} data-size={size}>
      <Wordmark className={styles.mark} />
    </a>
  );
}
