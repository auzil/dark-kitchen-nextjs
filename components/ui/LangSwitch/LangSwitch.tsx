// CS / EN / RU links. Server component: plain <a>s to "/", "/en", "/ru" (getPathname from i18n/navigation.ts).
// localeDetection is off (i18n/routing.ts), so no locale cookie has to be kept in step.
import { getPathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { cx } from "@/lib/cx";
import styles from "./LangSwitch.module.scss";

type LangSwitchProps = {
  current: Locale;
  /** the header and menu use a labelled <nav>; the footer list item is an <li> */
  as?: "nav" | "li";
  label?: string;
  className?: string;
};

export function LangSwitch({ current, as: Tag = "nav", label, className }: LangSwitchProps) {
  return (
    <Tag className={cx(styles.root, className)} aria-label={label}>
      {routing.locales.map((locale) => (
        <a
          key={locale}
          href={getPathname({ locale, href: "/" })}
          hrefLang={locale}
          lang={locale}
          data-lang-link=""
          aria-current={locale === current ? "page" : undefined}
        >
          {locale.toUpperCase()}
        </a>
      ))}
    </Tag>
  );
}
