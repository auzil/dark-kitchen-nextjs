// Pizza / sushi radio pair, controlled by the island that owns the state (hero or chooser).
// No hooks of its own. Native radios: keyboard, focus and the no-JS default (pizza checked) for free.
import type { Cuisine } from "@/content/types";
import { cx } from "@/lib/cx";
import styles from "./CuisineSwitch.module.scss";

export type SwitchLabels = { legend: string; pizza: string; sushi: string };

type CuisineSwitchProps = {
  name: string;
  value: Cuisine;
  onChange: (value: Cuisine) => void;
  labels: SwitchLabels;
  className?: string;
  hidden?: boolean;
  hooks?: Record<`data-${string}`, string | boolean>;
};

const CUISINES: Cuisine[] = ["pizza", "sushi"];

export function CuisineSwitch({ name, value, onChange, labels, className, hidden, hooks }: CuisineSwitchProps) {
  return (
    <fieldset className={cx(styles.root, className)} hidden={hidden} {...hooks}>
      <legend className="sr-only">{labels.legend}</legend>
      {CUISINES.map((cuisine) => (
        <label key={cuisine} className={styles.option} data-cuisine-option={cuisine}>
          <input type="radio" name={name} value={cuisine} checked={value === cuisine} onChange={() => onChange(cuisine)} />
          <span>{labels[cuisine]}</span>
        </label>
      ))}
    </fieldset>
  );
}
