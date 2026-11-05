// Locale routing: "/" is the default locale, "/en" etc. the others; also sends hreflang Link headers.
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // everything except API routes, Next internals and files with an extension (images, robots.txt …)
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
