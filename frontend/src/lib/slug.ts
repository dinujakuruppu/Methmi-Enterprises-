/** "Sigiriya Day Tour!" -> "sigiriya-day-tour" */
export function slugify(input: string): string {
  const base = input
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  return base || "item";
}

/** Appends -2, -3, ... until the slug is free. */
export function uniqueSlug(desired: string, existingSlugs: string[], ignoreSlug?: string): string {
  const taken = new Set(existingSlugs.filter((s) => s !== ignoreSlug));
  const base = slugify(desired);

  if (!taken.has(base)) return base;

  let suffix = 2;
  let candidate = `${base}-${suffix}`;
  while (taken.has(candidate)) {
    suffix += 1;
    candidate = `${base}-${suffix}`;
  }
  return candidate;
}
