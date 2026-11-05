// Sign-up: gift photo, the e-mail form for a gift code. Server component; the form is the island.
import Image from "next/image";
import { getMessages, getTranslations } from "next-intl/server";
import { RevealLines } from "@/components/motion/RevealLines";
import { RevealPhoto } from "@/components/motion/RevealPhoto";
import { Lines } from "@/components/ui/Lines/Lines";
import { media } from "@/content/media";
import type { Locale } from "@/i18n/routing";
import { cx } from "@/lib/cx";
import { SignupForm } from "./SignupForm";
import styles from "./Signup.module.scss";

export async function Signup({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "signup" });
  const messages = await getMessages({ locale });
  const photo = media.gift;

  return (
    <section id="signup" className={styles.root} aria-labelledby="signup-title" data-section="signup">
      <div className={cx(styles.inner, "container")}>
        <RevealPhoto className={styles.photo}>
          <Image
            src={photo.src}
            width={photo.width}
            height={photo.height}
            sizes="(min-width: 90rem) 520px, (min-width: 64rem) 37vw, 100vw"
            alt={t("photoAlt")}
            data-sample="true"
          />
        </RevealPhoto>
        <div>
          <RevealLines id="signup-title" className={cx(styles.word, "t-h2 t-h2--long")}>
            <Lines lines={messages.signup.title} />
          </RevealLines>
          <p className={cx(styles.lead, "t-body-lg")}>{t("line")}</p>
          <SignupForm
            locale={locale}
            copy={{
              emailLabel: t("emailLabel"),
              emailPlaceholder: t("emailPlaceholder"),
              consent: t("consent"),
              privacyLink: t("privacyLink"),
              submit: t("submit"),
              terms: t("terms"),
              done: t("done"),
              errors: { email: t("errors.email"), consent: t("errors.consent"), server: t("errors.server") },
            }}
          />
        </div>
      </div>
    </section>
  );
}
