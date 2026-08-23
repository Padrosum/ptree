/**
 * Path helpers that respect the Astro `base` (GitHub Pages project sites).
 *
 * Never hardcode leading-slash asset URLs; always route through `withBase` so
 * the site also works under a custom domain or a `/repo/` base path.
 */

const BASE = import.meta.env.BASE_URL ?? "/";

function normalizeBase(): string {
  return BASE.endsWith("/") ? BASE.slice(0, -1) : BASE;
}

/**
 * Prefix an absolute asset path (e.g. "/avatar.webp") with the site base.
 */
export function withBase(path: string): string {
  if (!path.startsWith("/")) return path;
  const base = normalizeBase();
  return `${base}${path}`;
}

/**
 * Absolute URL for SEO/canonical metadata, combining the configured `site`
 * origin with the base and a path.
 */
export function absoluteUrl(path = ""): string {
  const site = (import.meta.env.SITE ?? "").replace(/\/$/, "");
  const base = normalizeBase();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  if (!site) return `${base}${cleanPath}`;
  return `${site}${base}${cleanPath}`;
}
