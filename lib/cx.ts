/** Joins class names, skipping falsy ones: cx(styles.root, open && styles.open). */
export function cx(...names: (string | false | null | undefined)[]): string {
  return names.filter(Boolean).join(" ");
}
