// Combos: three cards from content + the chooser button + the office phone/e-mail line.
// Not rendered at all when site.combos is empty (the page and the nav check the same list).
import { getMessages, getTranslations } from "next-intl/server";
import { DialogButton } from "@/components/dialogs/DialogButton";
import { RevealLines } from "@/components/motion/RevealLines";
import { Combo } from "@/components/ui/Combo/Combo";
import { Lines } from "@/components/ui/Lines/Lines";
import { site } from "@/content/site";
import type { Locale } from "@/i18n/routing";
import { cx } from "@/lib/cx";
import { fields, links } from "@/lib/fields";
import styles from "./Combos.module.scss";

export async function Combos({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  const messages = await getMessages({ locale });
  const f = fields(locale);

  return (
    <section id="combos" className={styles.root} aria-labelledby="combos-title" data-section="combos">
      <div className="container">
        <div className={styles.head}>
          <RevealLines id="combos-title" className={cx(styles.word, "t-h2")}>
            <Lines lines={messages.combos.title} />
          </RevealLines>
          <p className={cx(styles.lead, "t-body-lg")}>{t("combos.line")}</p>
          <DialogButton dialog="chooser" openerKey="combos" mode="combos" className={styles.headButton}>
            {t("combos.cta")}
          </DialogButton>
        </div>
        <ul className={styles.list} role="list" data-combos="">
          {site.combos.map((combo) => (
            <Combo key={combo.id} combo={combo} locale={locale} />
          ))}
        </ul>
        <p className={styles.office}>
          {t.rich("combos.office", {
            phone: (chunks) => <a href={links.phone}>{chunks}</a>,
            email: (chunks) => <a href={links.email}>{chunks}</a>,
            phoneNumber: f.phone,
            emailAddress: f.email,
          })}
        </p>
      </div>
    </section>
  );
}
