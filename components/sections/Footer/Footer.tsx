// Footer: office contacts, socials, operator details, privacy link, cookie settings, languages. Server component.
import { getTranslations } from "next-intl/server";
import { CookieSettings } from "@/components/analytics/CookieSettings";
import { LangSwitch } from "@/components/ui/LangSwitch/LangSwitch";
import { Wordmark } from "@/components/ui/Wordmark/Wordmark";
import type { Locale } from "@/i18n/routing";
import { GA_ID } from "@/lib/analytics";
import { fields, links } from "@/lib/fields";
import styles from "./Footer.module.scss";

export async function Footer({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  const f = fields(locale);

  return (
    <footer className={styles.root}>
      <div className="container">
        <a className={styles.brand} href="#top" aria-label={f.brand}>
          <Wordmark className={styles.brandMark} />
        </a>
        <div className={styles.grid}>
          <div>
            <h2>{t("footer.office")}</h2>
            <ul role="list" data-sample="true">
              <li>
                <a href={links.phone} data-track-event="contact_tap" data-track-method="phone" data-track-section="footer">
                  {f.phone}
                </a>
              </li>
              <li>
                <a href={links.email} data-track-event="contact_tap" data-track-method="email" data-track-section="footer">
                  {f.email}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2>{t("footer.follow")}</h2>
            <ul role="list" data-sample="true">
              <li>
                <a href={links.instagram} data-track-event="social_tap" data-track-network="instagram">
                  Instagram
                </a>
              </li>
              <li>
                <a href={links.tiktok} data-track-event="social_tap" data-track-network="tiktok">
                  TikTok
                </a>
              </li>
            </ul>
          </div>
          <div className={styles.company}>
            <h2>{t("footer.company")}</h2>
            <ul role="list" data-sample="true">
              <li>{f.company}</li>
              <li>{t("footer.companyId", { ico: f.ico })}</li>
              <li>{f.seat}</li>
              <li className={styles.privacy}>
                {/* the privacy policy page is out of scope (TODO-OWNER): a dead anchor, as in the prototype */}
                <a id="privacy" href="#privacy" data-no-scroll="">
                  {t("footer.privacy")}
                </a>
              </li>
              {GA_ID && (
                <li>
                  <CookieSettings className={styles.cookies}>{t("consent.settings")}</CookieSettings>
                </li>
              )}
            </ul>
          </div>
          <div>
            <h2>{t("lang.label")}</h2>
            <ul role="list">
              <LangSwitch current={locale} as="li" className={styles.langs} />
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
