// ✕ inside a dialog. data-dialog-close: the Dialog closes on clicks on it.
import styles from "./CloseButton.module.scss";

export function CloseButton({ label }: { label: string }) {
  return (
    <button className={styles.root} type="button" aria-label={label} data-dialog-close="">
      ✕
    </button>
  );
}
