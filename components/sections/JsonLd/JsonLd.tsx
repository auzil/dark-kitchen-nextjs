// schema.org Restaurant, built only from content/site.ts. Values still flagged `sample: true` are left out of
// production; they appear only on previews (ALLOW_PLACEHOLDERS=true, noindex) — a production build with
// samples fails the guard anyway.
import { site } from "@/content/site";
import type { Locale } from "@/i18n/routing";
import { allowPlaceholders } from "@/lib/placeholders";
import { localePath, SITE_URL } from "@/lib/site-url";

const DAY = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const usable = (value: { sample?: boolean }) => !value.sample || allowPlaceholders;

export function JsonLd({ locale }: { locale: Locale }) {
  const { brand, address, hours, contacts } = site;
  const [, postalCode, locality] = /^(\d{3} \d{2}) (.+)$/.exec(address.city) ?? [];
  const data = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    url: SITE_URL + localePath(locale),
    ...(usable(brand) && { name: brand.name }),
    servesCuisine: ["Pizza", "Sushi"],
    ...(usable(address) && {
      address: {
        "@type": "PostalAddress",
        streetAddress: address.street,
        postalCode,
        addressLocality: locality,
        addressCountry: "CZ",
      },
    }),
    ...(usable(hours) && {
      openingHoursSpecification: [
        { "@type": "OpeningHoursSpecification", dayOfWeek: hours.days.map((d) => DAY[d]), opens: hours.open, closes: hours.close },
      ],
    }),
    ...(usable(contacts) && {
      telephone: contacts.phone.replace(/\s/g, ""),
      email: contacts.email,
      sameAs: [contacts.instagram.url, contacts.tiktok.url],
    }),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
