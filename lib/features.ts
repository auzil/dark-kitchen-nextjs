// Feature flags: build-time switches per deployment (env), all on unless set to false/0/off.
// A flag also names the placeholder paths it owns, so a switched-off feature doesn't block the build.
const FLAGS = {
  signup: { env: "FEATURE_SIGNUP", placeholders: ["site.gift", "media.gift"] },
} as const;

type Feature = keyof typeof FLAGS;
const isOn = (env: string) => !["false", "0", "off"].includes((process.env[env] ?? "").trim().toLowerCase());

export const features = Object.fromEntries(
  Object.entries(FLAGS).map(([name, flag]) => [name, isOn(flag.env)]),
) as Record<Feature, boolean>;

/** Placeholder paths of switched-off features: the guard skips them. */
export const skippedPlaceholders = Object.entries(FLAGS).flatMap(([name, flag]) =>
  features[name as Feature] ? [] : flag.placeholders,
);
