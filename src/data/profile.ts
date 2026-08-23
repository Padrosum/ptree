export function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]!.toUpperCase())
    .join("");
}

/** Whether a URL should open in a new tab (external http(s) links). */
export function isExternal(url: string): boolean {
  return /^https?:\/\//i.test(url);
}
