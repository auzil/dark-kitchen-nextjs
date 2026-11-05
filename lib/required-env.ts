// Production settings the placeholder guard checks (lib/placeholders.ts): missing ones block the build.
import { PRODUCTION_PROVIDERS } from "@/lib/delivery/newsletter";
import { features } from "@/lib/features";

export const REQUIRED_ENV = ["SITE_URL"];

/** Guard entries for settings that need more than "is set". */
export function settingPlaceholders(): string[] {
  const found: string[] = [];
  const provider = process.env.NEWSLETTER_PROVIDER;
  if (features.signup && (!provider || !PRODUCTION_PROVIDERS.includes(provider))) {
    found.push(`env NEWSLETTER_PROVIDER (Brevo or Ecomail, TODO-OWNER "E-mail service"; now: ${provider ?? "unset"})`);
  }
  return found;
}
