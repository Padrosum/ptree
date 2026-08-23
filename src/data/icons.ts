/**
 * Icon resolution.
 *
 * `astr-icon` inlines SVGs from the Iconify ecosystem at build time, so we ship
 * zero runtime JavaScript for icons. Friendly keys in the config map to iconify
 * names below; anything containing ":" is treated as an explicit iconify name
 * (e.g. "lucide:rocket").
 */
import type { SocialPlatform } from "../config/schema";

export const FALLBACK_ICON = "lucide:link";

/** Friendly link-card icon keys -> iconify names. */
export const LINK_ICON_MAP: Record<string, string> = {
  arrow: "lucide:arrow-right",
  book: "lucide:book-open",
  briefcase: "lucide:briefcase",
  camera: "lucide:camera",
  code: "lucide:code",
  coffee: "lucide:coffee",
  download: "lucide:download",
  external: "lucide:external-link",
  file: "lucide:file-text",
  "file-text": "lucide:file-text",
  globe: "lucide:globe",
  heart: "lucide:heart",
  link: "lucide:link",
  mail: "lucide:mail",
  map: "lucide:map-pin",
  music: "lucide:music",
  pin: "lucide:map-pin",
  play: "lucide:play",
  puzzle: "lucide:puzzle",
  rocket: "lucide:rocket",
  rss: "lucide:rss",
  sparkles: "lucide:sparkles",
  star: "lucide:star",
  terminal: "lucide:terminal",
  zap: "lucide:zap",

  github: "simple-icons:github",
  x: "simple-icons:x",
  twitter: "simple-icons:x",
  youtube: "simple-icons:youtube",
  instagram: "simple-icons:instagram",
  linkedin: "simple-icons:linkedin",
  discord: "simple-icons:discord",
  telegram: "simple-icons:telegram",
  twitch: "simple-icons:twitch",
  spotify: "simple-icons:spotify",
};

/** Social platform -> iconify name. */
export const SOCIAL_ICON_MAP: Record<SocialPlatform, string> = {
  github: "simple-icons:github",
  x: "simple-icons:x",
  instagram: "simple-icons:instagram",
  youtube: "simple-icons:youtube",
  linkedin: "simple-icons:linkedin",
  discord: "simple-icons:discord",
  mastodon: "simple-icons:mastodon",
  telegram: "simple-icons:telegram",
  tiktok: "simple-icons:tiktok",
  twitch: "simple-icons:twitch",
  reddit: "simple-icons:reddit",
  spotify: "simple-icons:spotify",
  threads: "simple-icons:threads",
  medium: "simple-icons:medium",
  website: "lucide:globe",
  email: "lucide:mail",
};

/** Human-friendly label used for accessible names. */
export const SOCIAL_LABEL: Record<SocialPlatform, string> = {
  github: "GitHub",
  x: "X",
  instagram: "Instagram",
  youtube: "YouTube",
  linkedin: "LinkedIn",
  discord: "Discord",
  mastodon: "Mastodon",
  telegram: "Telegram",
  tiktok: "TikTok",
  twitch: "Twitch",
  reddit: "Reddit",
  spotify: "Spotify",
  threads: "Threads",
  medium: "Medium",
  website: "Website",
  email: "Email",
};

/**
 * Resolve a config icon key to an iconify name.
 * Unknown keys fall back to a neutral link icon rather than breaking the build.
 */
export function resolveIcon(key: string | undefined): string {
  if (!key) return FALLBACK_ICON;
  const trimmed = key.trim();
  if (trimmed.includes(":")) return trimmed;
  return LINK_ICON_MAP[trimmed.toLowerCase()] ?? FALLBACK_ICON;
}
