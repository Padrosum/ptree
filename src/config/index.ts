/**
 * Loads and validates the user configuration (`config/profile.ts`).
 *
 * This runs at build time. Any invalid configuration aborts the build with a
 * readable message instead of silently producing a broken page.
 */
import userConfig from "../../config/profile";
import { validateConfig, ConfigError } from "./validate";
import type { PtreeConfig } from "./schema";

export type { PtreeConfig };
export { ConfigError };
export { THEME_NAMES, SOCIAL_PLATFORMS, THEME_DEFAULTS } from "./schema";
export type {
  ThemeName,
  ThemeMode,
  FontPreference,
  LinkStyle,
  ProfileConfig,
  LinkConfig,
  SocialConfig,
  SocialPlatform,
  SeoConfig,
  FooterConfig,
  ThemeConfig,
} from "./schema";

function load(): PtreeConfig {
  try {
    return validateConfig(userConfig);
  } catch (error) {
    if (error instanceof ConfigError) {
      // Fail loudly at build time so mistakes never reach production.
      throw error;
    }
    throw error;
  }
}

/** The validated configuration for the current build. */
export const config: PtreeConfig = load();
