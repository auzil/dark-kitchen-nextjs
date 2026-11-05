import type { MetadataRoute } from "next";
import { allowPlaceholders } from "@/lib/placeholders";
import { SITE_URL } from "@/lib/site-url";

// previews (Vercel Preview, or any build with placeholders allowed) are not indexed
const isPreview = allowPlaceholders || (process.env.VERCEL_ENV !== undefined && process.env.VERCEL_ENV !== "production");

export default function robots(): MetadataRoute.Robots {
  if (isPreview) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${SITE_URL}/sitemap.xml` };
}
