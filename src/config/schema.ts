/**
 * ptree configuration schema.
 *
 * These types describe the shape of `config/profile.ts`. The file is validated
 * at build time by `validate.ts`, which produces human-friendly error messages.
 */

export type ThemeName = "void" | "glass" | "terminal";

export type ThemeMode = "auto" | "light" | "dark";

export type FontPreference = "system" | "sans" | "serif" | "mono";

export type LinkStyle = "card" | "minimal";

export interface ThemeConfig {
  /** Which theme family to render. */
  name: ThemeName;
  /** Light / dark / follow the visitor's system preference. */
  mode: ThemeMode;
  /** Accent color used for highlights (any CSS color, hex recommended). */
  accent?: string;
  /** Override the theme background (any CSS color). */
  background?: string;
  /** Typography preference. Overrides the theme default. */
  font?: FontPreference;
  /** Visual style of link cards. */
  linkStyle: LinkStyle;
}

export interface ProfileConfig {
  name: string;
  username: string;
  bio?: string;
  /** Path (from the site base) to an avatar image, e.g. "/avatar.webp". */
  avatar?: string;
  location?: string;
}

export interface LinkConfig {
  title: string;
  url: string;
  /** Friendly icon key (see `src/data/icons.ts`) or an iconify name. */
  icon?: string;
  description?: string;
  badge?: string;
  /** Rendered larger / first when enabled. */
  featured?: boolean;
}

export type SocialPlatform =
  | "github"
  | "x"
  | "instagram"
  | "youtube"
  | "linkedin"
  | "discord"
  | "mastodon"
  | "telegram"
  | "tiktok"
  | "twitch"
  | "reddit"
  | "spotify"
  | "threads"
  | "medium"
  | "website"
  | "email";

export interface SocialConfig {
  platform: SocialPlatform;
  url: string;
}

export interface SeoConfig {
  title?: string;
  description?: string;
  image?: string;
  twitterHandle?: string;
}

export interface FooterConfig {
  /** Show the "Built with ptree" badge. */
  showPoweredBy?: boolean;
  /** Custom footer text (defaults to the ptree badge). */
  text?: string;
  url?: string;
}

export type BackgroundEffect = "voxel";

export interface PtreeConfig {
  /** Page language for the <html lang> attribute (e.g. "en", "tr"). */
  lang?: string;
  profile: ProfileConfig;
  theme: ThemeConfig;
  links: LinkConfig[];
  socials: SocialConfig[];
  seo?: SeoConfig;
  footer?: FooterConfig;
  /** Optional full-screen WebGL background effect (see README). */
  background?: BackgroundEffect;
  /** Inline CSS injected on the page (owner-controlled, used as-is). */
  customCss?: string;
}

export const THEME_NAMES: ThemeName[] = ["void", "glass", "terminal"];

export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  "github",
  "x",
  "instagram",
  "youtube",
  "linkedin",
  "discord",
  "mastodon",
  "telegram",
  "tiktok",
  "twitch",
  "reddit",
  "spotify",
  "threads",
  "medium",
  "website",
  "email",
];

export const FONT_PREFERENCES: FontPreference[] = [
  "system",
  "sans",
  "serif",
  "mono",
];

export const LINK_STYLES: LinkStyle[] = ["card", "minimal"];

export const THEME_DEFAULTS: Record<ThemeName, { font: FontPreference; linkStyle: LinkStyle }> = {
  void: { font: "system", linkStyle: "card" },
  glass: { font: "system", linkStyle: "card" },
  terminal: { font: "mono", linkStyle: "card" },
};

export const DEFAULT_THEME: ThemeConfig = {
  name: "void",
  mode: "auto",
  linkStyle: "card",
};
