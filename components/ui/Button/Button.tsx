// The pill button, as <button> or <a>. No hooks: usable from server and client components.
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { cx } from "@/lib/cx";
import styles from "./Button.module.scss";

type Variant = "accent" | "fire";

export function Button({ variant, className, type = "button", ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button type={type} className={cx(styles.root, className)} data-variant={variant} {...rest} />;
}

export function ButtonLink({ variant, className, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant; href: string }) {
  return <a className={cx(styles.root, className)} data-variant={variant} {...rest} />;
}
