// Brand lockup. PLACEHOLDER crown drawn to echo the storefront; replace with the owner's logo (TODO-OWNER.md).
// <WordmarkSymbol /> is rendered once per page; every <Wordmark /> reuses it through <use href="#wordmark">.
import { cx } from "@/lib/cx";
import styles from "./Wordmark.module.scss";

export function WordmarkSymbol() {
  return (
    <svg className="sr-only" width="0" height="0" aria-hidden="true" focusable="false">
      <symbol id="wordmark" viewBox="0 0 124 54">
        <g fill="currentColor">
          <path d="M50 11.5 47 3l6 4.2L62 1l9 6.2L77 3l-3 8.5z" />
          <circle cx="47" cy="2.6" r="1.2" />
          <circle cx="62" cy=".9" r="1.2" />
          <circle cx="77" cy="2.6" r="1.2" />
          <rect x="50" y="12.6" width="24" height="1" />
        </g>
        <text x="0" y="31" fontSize="17" textLength="124" lengthAdjust="spacing">
          IMPERIAL
        </text>
        <text x="31" y="52" fontSize="17" textLength="62" lengthAdjust="spacing">
          FOOD
        </text>
      </symbol>
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <svg className={cx(styles.root, className)} viewBox="0 0 124 54" aria-hidden="true">
      <use href="#wordmark" />
    </svg>
  );
}
