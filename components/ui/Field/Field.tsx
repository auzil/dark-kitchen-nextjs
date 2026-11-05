// Form field pieces for the sign-up form. No hooks: rendered inside the SignupForm island.
import type { InputHTMLAttributes, LabelHTMLAttributes, ReactNode } from "react";
import styles from "./Field.module.scss";

export function FieldLabel(props: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={styles.label} {...props} />;
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={styles.input} {...props} />;
}

/** Checkbox with its text; the box is the native input, restyled. */
export function Checkbox({ children, ...input }: InputHTMLAttributes<HTMLInputElement> & { children: ReactNode }) {
  return (
    <label className={styles.check}>
      <input type="checkbox" {...input} />
      {children}
    </label>
  );
}

/** Error text next to a field: announced, linked from the field's aria-describedby. */
export function FieldError({ id, name, message }: { id: string; name: string; message: string | null }) {
  return (
    <p className={styles.error} id={id} aria-live="polite" data-error={name} hidden={!message}>
      {message}
    </p>
  );
}
