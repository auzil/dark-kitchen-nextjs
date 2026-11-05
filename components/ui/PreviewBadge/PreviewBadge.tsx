// Shown only on builds with ALLOW_PLACEHOLDERS=true: tells anyone looking that the content isn't final.
// The port compare hides it via [data-preview-badge].
import styles from "./PreviewBadge.module.scss";

export function PreviewBadge({ label, count }: { label: string; count: number }) {
  return (
    <p className={styles.root} data-preview-badge title={`${count} placeholders`}>
      {label}
    </p>
  );
}
