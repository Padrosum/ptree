/**
 * Build-time validation for `config/profile.ts`.
 *
 * Kept deliberately dependency-free so the error messages are fully under our
 * control and formatting is predictable:
 *
 *   Invalid ptree configuration:
 *   links[2].url is required
 */
import {
  DEFAULT_THEME,
  FONT_PREFERENCES,
  LINK_STYLES,
  SOCIAL_PLATFORMS,
  THEME_DEFAULTS,
  THEME_NAMES,
  type LinkConfig,
  type PtreeConfig,
  type SocialConfig,
  type ThemeConfig,
} from "./schema";

export interface ValidationResult {
  config: PtreeConfig;
}

export class ConfigError extends Error {
  constructor(errors: string[]) {
    super(`Invalid ptree configuration:\n${errors.join("\n")}`);
    this.name = "ConfigError";
  }
}

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isPlainString(value: unknown): value is string {
  return typeof value === "string";
}

const URL_PATTERN =
  /^(https?:\/\/|mailto:|tel:|#|\.\/|\/|javascript:)/i;

function looksLikeUrl(value: string): boolean {
  return URL_PATTERN.test(value);
}

function validateUrl(value: unknown, path: string, errors: string[]): string {
  if (!isPlainString(value) || value.trim() === "") {
    errors.push(`${path} is required`);
    return "";
  }
  if (!looksLikeUrl(value.trim())) {
    errors.push(`${path} must be a valid URL (e.g. "https://example.com")`);
  }
  return value.trim();
}

function validateOptionalColor(value: unknown, path: string, errors: string[]): string | undefined {
  if (value === undefined) return undefined;
  if (!isPlainString(value) || value.trim() === "") {
    errors.push(`${path} must be a valid CSS color`);
    return undefined;
  }
  return value.trim();
}

export function validateConfig(input: unknown): PtreeConfig {
  const errors: string[] = [];
  if (!isRecord(input)) {
    throw new ConfigError(["config must be an object"]);
  }

  const profile = validateProfile(input.profile, "profile", errors);
  const theme = validateTheme(input.theme, "theme", errors);
  const links = validateLinks(input.links, "links", errors);
  const socials = validateSocials(input.socials, "socials", errors);
  const seo = validateSeo(input.seo, "seo", errors);
  const footer = validateFooter(input.footer, "footer", errors);

  const customCss = validateOptionalString(input.customCss, "customCss", errors);
  const lang = validateOptionalString(input.lang, "lang", errors);

  const backgroundRaw = input.background;
  const background = backgroundRaw === "voxel" ? ("voxel" as const) : undefined;
  if (backgroundRaw !== undefined && backgroundRaw !== "voxel") {
    errors.push("background must be one of: voxel");
  }

  if (errors.length > 0) {
    throw new ConfigError(errors);
  }

  return {
    profile,
    theme,
    links,
    socials,
    ...(lang ? { lang } : {}),
    ...(background ? { background } : {}),
    ...(seo ? { seo } : {}),
    ...(footer ? { footer } : {}),
    ...(customCss !== undefined ? { customCss } : {}),
  };
}

function validateProfile(value: unknown, path: string, errors: string[]): PtreeConfig["profile"] {
  if (!isRecord(value)) {
    errors.push(`${path} is required and must be an object`);
    return { name: "", username: "" };
  }

  const name = validateRequiredString(value.name, `${path}.name`, errors);
  const username = validateRequiredString(value.username, `${path}.username`, errors);
  const bio = validateOptionalString(value.bio, `${path}.bio`, errors);
  const avatar = validateOptionalString(value.avatar, `${path}.avatar`, errors);
  const location = validateOptionalString(value.location, `${path}.location`, errors);

  return {
    name,
    username,
    ...(bio !== undefined ? { bio } : {}),
    ...(avatar !== undefined ? { avatar } : {}),
    ...(location !== undefined ? { location } : {}),
  };
}

function isOneOf<T extends string>(values: readonly T[]) {
  return (value: unknown): value is T =>
    typeof value === "string" && (values as readonly string[]).includes(value);
}

const isThemeName = isOneOf(THEME_NAMES);
const isThemeMode = isOneOf(["auto", "light", "dark"] as const);
const isFont = isOneOf(FONT_PREFERENCES);
const isLinkStyle = isOneOf(LINK_STYLES);
const isSocialPlatform = isOneOf(SOCIAL_PLATFORMS);

function validateTheme(value: unknown, path: string, errors: string[]): ThemeConfig {
  // Shorthand: theme: "void"
  if (isPlainString(value)) {
    if (!isThemeName(value)) {
      errors.push(`${path} must be one of: ${THEME_NAMES.join(", ")}`);
      return { ...DEFAULT_THEME };
    }
    return { ...DEFAULT_THEME, ...THEME_DEFAULTS[value], name: value };
  }

  if (!isRecord(value)) {
    errors.push(`${path} must be a theme name or an object`);
    return { ...DEFAULT_THEME };
  }

  const name = value.name;
  if (!isThemeName(name)) {
    errors.push(`${path}.name must be one of: ${THEME_NAMES.join(", ")}`);
  }

  const modeRaw = value.mode;
  const mode = isThemeMode(modeRaw) ? modeRaw : "auto";
  if (modeRaw !== undefined && !isThemeMode(modeRaw)) {
    errors.push(`${path}.mode must be one of: auto, light, dark`);
  }

  const fontRaw = value.font;
  const font = isFont(fontRaw) ? fontRaw : undefined;
  if (fontRaw !== undefined && !isFont(fontRaw)) {
    errors.push(`${path}.font must be one of: ${FONT_PREFERENCES.join(", ")}`);
  }

  const linkStyleRaw = value.linkStyle;
  const linkStyle = isLinkStyle(linkStyleRaw) ? linkStyleRaw : "card";
  if (linkStyleRaw !== undefined && !isLinkStyle(linkStyleRaw)) {
    errors.push(`${path}.linkStyle must be one of: ${LINK_STYLES.join(", ")}`);
  }

  const accent = validateOptionalColor(value.accent, `${path}.accent`, errors);
  const background = validateOptionalColor(value.background, `${path}.background`, errors);

  const resolved = { ...DEFAULT_THEME, ...THEME_DEFAULTS[isThemeName(name) ? name : DEFAULT_THEME.name] };

  return {
    name: isThemeName(name) ? name : resolved.name,
    mode,
    linkStyle,
    ...(font ? { font } : { font: resolved.font }),
    ...(accent !== undefined ? { accent } : {}),
    ...(background !== undefined ? { background } : {}),
  };
}

function validateLinks(value: unknown, path: string, errors: string[]): LinkConfig[] {
  if (!Array.isArray(value)) {
    errors.push(`${path} is required and must be an array`);
    return [];
  }

  const links: LinkConfig[] = [];
  value.forEach((entry, index) => {
    const p = `${path}[${index}]`;
    if (!isRecord(entry)) {
      errors.push(`${p} must be an object`);
      return;
    }
    const title = validateRequiredString(entry.title, `${p}.title`, errors);
    const url = validateUrl(entry.url, `${p}.url`, errors);
    const icon = validateOptionalString(entry.icon, `${p}.icon`, errors);
    const description = validateOptionalString(entry.description, `${p}.description`, errors);
    const badge = validateOptionalString(entry.badge, `${p}.badge`, errors);
    const featured =
      entry.featured === undefined ? undefined : Boolean(entry.featured);
    if (entry.featured !== undefined && typeof entry.featured !== "boolean") {
      errors.push(`${p}.featured must be a boolean`);
    }

    links.push({
      title,
      url,
      ...(icon !== undefined ? { icon } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(badge !== undefined ? { badge } : {}),
      ...(featured !== undefined ? { featured } : {}),
    });
  });

  return links;
}

function validateSocials(value: unknown, path: string, errors: string[]): SocialConfig[] {
  if (!Array.isArray(value)) {
    errors.push(`${path} is required and must be an array`);
    return [];
  }

  const socials: SocialConfig[] = [];
  value.forEach((entry, index) => {
    const p = `${path}[${index}]`;
    if (!isRecord(entry)) {
      errors.push(`${p} must be an object`);
      return;
    }
    const platform = entry.platform;
    if (!isSocialPlatform(platform)) {
      errors.push(
        `${p}.platform must be one of: ${SOCIAL_PLATFORMS.join(", ")}`
      );
    }
    const url = validateUrl(entry.url, `${p}.url`, errors);

    socials.push({
      platform: isSocialPlatform(platform) ? platform : "website",
      url,
    });
  });

  return socials;
}

function validateSeo(value: unknown, path: string, errors: string[]): PtreeConfig["seo"] {
  if (value === undefined) return undefined;
  if (!isRecord(value)) {
    errors.push(`${path} must be an object`);
    return undefined;
  }
  const seo: NonNullable<PtreeConfig["seo"]> = {};
  const title = validateOptionalString(value.title, `${path}.title`, errors);
  const description = validateOptionalString(value.description, `${path}.description`, errors);
  const image = validateOptionalString(value.image, `${path}.image`, errors);
  const twitterHandle = validateOptionalString(value.twitterHandle, `${path}.twitterHandle`, errors);
  if (title !== undefined) seo.title = title;
  if (description !== undefined) seo.description = description;
  if (image !== undefined) seo.image = image;
  if (twitterHandle !== undefined) seo.twitterHandle = twitterHandle;
  return Object.keys(seo).length > 0 ? seo : undefined;
}

function validateFooter(value: unknown, path: string, errors: string[]): PtreeConfig["footer"] {
  if (value === undefined) return undefined;
  if (!isRecord(value)) {
    errors.push(`${path} must be an object`);
    return undefined;
  }
  const footer: NonNullable<PtreeConfig["footer"]> = {};
  const showPoweredBy = value.showPoweredBy;
  if (showPoweredBy !== undefined && typeof showPoweredBy !== "boolean") {
    errors.push(`${path}.showPoweredBy must be a boolean`);
  }
  if (typeof showPoweredBy === "boolean") footer.showPoweredBy = showPoweredBy;
  const text = validateOptionalString(value.text, `${path}.text`, errors);
  const url = validateOptionalString(value.url, `${path}.url`, errors);
  if (text !== undefined) footer.text = text;
  if (url !== undefined) footer.url = url;
  return Object.keys(footer).length > 0 ? footer : undefined;
}

function validateRequiredString(value: unknown, path: string, errors: string[]): string {
  if (!isPlainString(value) || value.trim() === "") {
    errors.push(`${path} is required`);
    return "";
  }
  return value.trim();
}

function validateOptionalString(value: unknown, path: string, errors: string[]): string | undefined {
  if (value === undefined) return undefined;
  if (!isPlainString(value)) {
    errors.push(`${path} must be a string`);
    return undefined;
  }
  return value.trim();
}
