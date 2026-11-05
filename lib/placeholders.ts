/*
 * Placeholder guard (references/placeholders.md). Anything flagged `sample: true` (content) or `temp: true`
 * (media), and every required production env var that is missing, is a placeholder. A production build
 * fails while any remain, unless ALLOW_PLACEHOLDERS=true (preview deployments only — the layout then
 * shows the preview badge and sets noindex).
 */

export const allowPlaceholders = process.env.ALLOW_PLACEHOLDERS === "true";

/**
 * Readable paths of every flagged value, e.g. "site.hours", "site.dishes.pizza[2]", "env NEWSLETTER_PROVIDER".
 * `skip` lists paths (and their children) of switched-off features (lib/features.ts).
 */
export function findPlaceholders(roots: Record<string, unknown>, requiredEnv: string[] = [], skip: readonly string[] = []): string[] {
  const found: string[] = [];

  const walk = (value: unknown, path: string) => {
    if (skip.some((s) => path === s || path.startsWith(`${s}.`) || path.startsWith(`${s}[`))) return;
    if (Array.isArray(value)) {
      value.forEach((item, i) => walk(item, `${path}[${i}]`));
      return;
    }
    if (value === null || typeof value !== "object") return;
    const record = value as Record<string, unknown>;
    if (record.sample === true || record.temp === true) found.push(path);
    for (const [key, child] of Object.entries(record)) {
      if (key !== "sample" && key !== "temp") walk(child, `${path}.${key}`);
    }
  };

  for (const [name, root] of Object.entries(roots)) walk(root, name);
  for (const name of requiredEnv) if (!process.env[name]) found.push(`env ${name}`);
  return found;
}

/** Throws in a production build while placeholders remain, so `next build` fails during prerendering. */
export function assertNoPlaceholders(found: string[]): void {
  if (process.env.NODE_ENV !== "production" || allowPlaceholders || found.length === 0) return;
  throw new Error(
    `Placeholders block the production build (${found.length}). Replace them (see TODO-OWNER.md), ` +
      `or build a preview with ALLOW_PLACEHOLDERS=true:\n  - ${found.join("\n  - ")}`,
  );
}
