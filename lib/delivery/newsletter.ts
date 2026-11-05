import "server-only";
/*
 * Newsletter delivery behind one interface (references/forms.md). The provider is still undecided
 * (Brevo or Ecomail, TODO-OWNER "E-mail service"); both do double opt-in. Until one is implemented here,
 * only the development `log` adapter exists:
 *   NEWSLETTER_PROVIDER=log   logs the sign-up on the server (development; previews with ALLOW_PLACEHOLDERS)
 *   unset / anything else     production: the action returns an error and the build guard lists the variable
 */
import { allowPlaceholders } from "@/lib/placeholders";

export type Subscriber = { email: string; locale: string; consentAt: string };
export type DeliveryResult = { ok: true } | { ok: false; reason: string };
type Adapter = (subscriber: Subscriber) => Promise<DeliveryResult>;

const adapters: Record<string, Adapter> = {
  log: async (subscriber) => {
    console.info("[newsletter:log] sign-up (not sent anywhere)", { locale: subscriber.locale, at: subscriber.consentAt });
    return { ok: true };
  },
  // brevo: TODO when the owner picks Brevo — POST https://api.brevo.com/v3/contacts/doubleOptinConfirmation (BREVO_API_KEY)
  // ecomail: TODO when the owner picks Ecomail — POST https://api2.ecomailapp.cz/lists/{id}/subscribe (ECOMAIL_API_KEY)
};

/** Providers that may run in a production build. Empty until Brevo or Ecomail is implemented. */
export const PRODUCTION_PROVIDERS: string[] = [];

function pickAdapter(): Adapter | null {
  const name = process.env.NEWSLETTER_PROVIDER ?? (process.env.NODE_ENV === "development" ? "log" : undefined);
  if (!name) return null;
  if (name === "log" && process.env.NODE_ENV === "production" && !allowPlaceholders) return null;
  return adapters[name] ?? null;
}

export async function deliver(subscriber: Subscriber): Promise<DeliveryResult> {
  const adapter = pickAdapter();
  if (!adapter) return { ok: false, reason: `no newsletter provider configured (NEWSLETTER_PROVIDER=${process.env.NEWSLETTER_PROVIDER ?? ""})` };
  return adapter(subscriber);
}
