// Google Analytics 4, basic Consent Mode v2 (references/scripts-analytics.md). The one place that talks to gtag:
// consent storage, loading gtag.js after a "granted" choice, the visit's landing URL, track().
// Everything here is browser-only and must never throw: storage can be blocked, gtag can be missing.

/** `G-XXXXXXX`; unset in previews and local runs, then nothing loads and no banner shows. */
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export type ConsentChoice = "granted" | "denied";
type Params = Record<string, string | number | boolean>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    // GA's own opt-out switch, set while consent is withdrawn
    [disable: `ga-disable-${string}`]: boolean | undefined;
  }
}

const CONSENT_KEY = "consent-analytics";
const LANDING_KEY = "landing";
const CONSENT_TTL = 365 * 24 * 60 * 60 * 1000; // asked again after 12 months
const GA_SRC = "https://www.googletagmanager.com/gtag/js";

/** Fired on window by the footer "Cookie settings" button to show the banner again. */
export const CONSENT_OPEN_EVENT = "consent-open";

// storage can throw (private mode, blocked site data): analytics must never break the page
function read(storage: "local" | "session", key: string): string | null {
  try {
    return (storage === "local" ? localStorage : sessionStorage).getItem(key);
  } catch {
    return null;
  }
}

function write(storage: "local" | "session", key: string, value: string) {
  try {
    (storage === "local" ? localStorage : sessionStorage).setItem(key, value);
  } catch {
    /* ignore */
  }
}

/** The stored choice, or null when none was made, it is unreadable or older than 12 months. */
export function readConsent(): ConsentChoice | null {
  try {
    const stored = JSON.parse(read("local", CONSENT_KEY) ?? "null") as { value?: unknown; at?: unknown } | null;
    if (stored?.value !== "granted" && stored?.value !== "denied") return null;
    if (typeof stored.at !== "number" || Date.now() - stored.at > CONSENT_TTL) return null;
    return stored.value;
  } catch {
    return null;
  }
}

/** Stores the choice, then loads gtag (granted) or switches measurement off and clears the cookies (denied). */
export function setConsent(value: ConsentChoice) {
  write("local", CONSENT_KEY, JSON.stringify({ value, at: Date.now() }));
  try {
    if (value === "granted") loadGa();
    else revokeGa();
  } catch {
    /* ignore */
  }
}

/** Saves the first URL and referrer of the visit, so a later consent still reports the tagged landing page. */
export function rememberLanding() {
  if (read("session", LANDING_KEY)) return;
  write("session", LANDING_KEY, JSON.stringify({ url: location.href, referrer: document.referrer }));
}

function landing(): { url: string; referrer: string } {
  try {
    const stored = JSON.parse(read("session", LANDING_KEY) ?? "null") as { url?: unknown; referrer?: unknown } | null;
    if (typeof stored?.url === "string") return { url: stored.url, referrer: typeof stored.referrer === "string" ? stored.referrer : "" };
  } catch {
    /* fall through */
  }
  return { url: location.href, referrer: document.referrer };
}

/** `?debug` on the landing URL or the current one: DebugView in GA4, console logs for events. */
function isDebug(): boolean {
  try {
    return new URL(landing().url).searchParams.has("debug") || new URLSearchParams(location.search).has("debug");
  } catch {
    return false;
  }
}

/**
 * Starts measuring after a "granted" choice: loads gtag.js once, or switches it back on when consent was
 * withdrawn and given again on the same page. Never called before consent, so nothing reaches Google before it.
 */
export function loadGa() {
  if (!GA_ID || !window.gtag) return;
  window[`ga-disable-${GA_ID}`] = false;
  window.gtag("consent", "update", { analytics_storage: "granted" });
  if (document.querySelector("script[data-ga]")) return;
  const { url, referrer } = landing();
  window.gtag("js", new Date());
  window.gtag("config", GA_ID, {
    page_location: url,
    page_referrer: referrer,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    ...(isDebug() ? { debug_mode: true } : {}),
  });
  const script = document.createElement("script");
  script.async = true;
  script.src = `${GA_SRC}?id=${encodeURIComponent(GA_ID)}`;
  script.dataset.ga = "";
  document.head.appendChild(script);
}

// a withdrawn choice: stop measuring now and drop the cookies gtag set (the script stays until the next load)
function revokeGa() {
  if (!GA_ID) return;
  window[`ga-disable-${GA_ID}`] = true;
  window.gtag?.("consent", "update", { analytics_storage: "denied" });
  // gtag puts its cookies on the highest domain it may (www.example.cz → example.cz): clear every level
  const labels = location.hostname.split(".");
  const domains = labels.map((_, i) => labels.slice(i).join("."));
  const gaCookies = document.cookie.split(";").map((c) => (c.split("=")[0] ?? "").trim()).filter((name) => name === "_ga" || name.startsWith("_ga_"));
  for (const name of gaCookies) {
    document.cookie = `${name}=; Max-Age=0; path=/`;
    for (const domain of domains) document.cookie = `${name}=; Max-Age=0; path=/; domain=${domain}`;
  }
}

/** Sends a GA4 event, only after consent. Logs to the console with `?debug`. Never throws. */
export function track(event: string, params: Params = {}) {
  try {
    if (isDebug()) console.info("[track]", event, params);
    if (!GA_ID || readConsent() !== "granted") return;
    window.gtag?.("event", event, params);
  } catch {
    /* ignore */
  }
}
