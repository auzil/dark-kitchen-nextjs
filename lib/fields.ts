// Values from content/site.ts that the copy and markup show (was FIELDS / LINKS in js/i18n.js).
import type { Locale } from "@/i18n/routing";
import { site } from "@/content/site";
import type { Localized } from "@/content/types";

/** A localized value ({ cs, en, ru }) in the page's language. */
export const pick = <T,>(value: Localized<T>, locale: Locale): T => value[locale];

/** Text values for `{name}` arguments in messages and for the markup (data-field="name" in the prototype). */
export function fields(locale: Locale) {
  const { address, delivery, hours, contacts, company } = site;
  return {
    brand: site.brand.name,
    street: address.street,
    city: `${address.city} – ${pick(address.district, locale)}`,
    address: `${address.street}, ${address.city}`,
    area: pick(delivery.area, locale),
    areaShort: pick(delivery.areaShort, locale),
    hours: `${hours.open}–${hours.close}`,
    door: site.door[locale],
    phone: contacts.phone,
    email: contacts.email,
    company: company.name,
    ico: company.ico,
    seat: company.seat,
  };
}

/** Hrefs (data-link-to="name" in the prototype). */
export const links = {
  phone: `tel:${site.contacts.phone.replace(/\s/g, "")}`,
  email: `mailto:${site.contacts.email}`,
  instagram: site.contacts.instagram.url,
  tiktok: site.contacts.tiktok.url,
  maps: site.links["google.profile"].url,
};
