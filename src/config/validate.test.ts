import { describe, it, expect } from "vitest";
import { validateConfig, ConfigError } from "./validate";
import { THEME_NAMES, SOCIAL_PLATFORMS } from "./schema";

function validInput() {
  return {
    profile: { name: "Ada", username: "ada" },
    theme: "void",
    links: [{ title: "Site", url: "https://example.com" }],
    socials: [],
  };
}

describe("validateConfig", () => {
  it("accepts a minimal valid config", () => {
    const config = validateConfig(validInput());
    expect(config.profile.name).toBe("Ada");
    expect(config.theme.name).toBe("void");
    expect(config.theme.font).toBe("system");
    expect(config.links[0]!.url).toBe("https://example.com");
  });

  it("normalizes theme shorthand to full config", () => {
    const config = validateConfig({ ...validInput(), theme: "terminal" });
    expect(config.theme).toMatchObject({ name: "terminal", mode: "auto", font: "mono" });
  });

  it("applies theme defaults for object form", () => {
    const config = validateConfig({ ...validInput(), theme: { name: "glass" } });
    expect(config.theme.name).toBe("glass");
    expect(config.theme.mode).toBe("auto");
    expect(config.theme.linkStyle).toBe("card");
  });

  it("rejects config that is not an object", () => {
    expect(() => validateConfig(null)).toThrow(ConfigError);
    expect(() => validateConfig([])).toThrow(ConfigError);
  });

  it("reports missing required profile fields with paths", () => {
    try {
      validateConfig({ profile: {}, theme: "void", links: [], socials: [] });
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(ConfigError);
      expect(String(error)).toContain("profile.name is required");
      expect(String(error)).toContain("profile.username is required");
    }
  });

  it("reports nested link errors with array indices", () => {
    try {
      validateConfig({
        profile: { name: "Ada", username: "ada" },
        theme: "void",
        links: [
          { title: "ok", url: "https://example.com" },
          { title: "bad" },
        ],
        socials: [],
      });
      expect.unreachable();
    } catch (error) {
      expect(String(error)).toContain("links[1].url is required");
    }
  });

  it("rejects invalid URLs", () => {
    expect(() =>
      validateConfig({
        ...validInput(),
        links: [{ title: "x", url: "not-a-url" }],
      })
    ).toThrow(/links\[0\]\.url must be a valid URL/);
  });

  it("rejects unknown theme names", () => {
    expect(() =>
      validateConfig({ ...validInput(), theme: "neon" })
    ).toThrow(/theme must be one of/);
  });

  it("rejects unknown social platforms", () => {
    expect(() =>
      validateConfig({
        ...validInput(),
        socials: [{ platform: "myspace", url: "https://example.com" }],
      })
    ).toThrow(/socials\[0\]\.platform must be one of/);
  });

  it("accepts all supported themes and platforms", () => {
    const socials = SOCIAL_PLATFORMS.map((platform) => ({
      platform,
      url: "https://example.com",
    }));
    for (const name of THEME_NAMES) {
      expect(() =>
        validateConfig({ ...validInput(), theme: name, socials })
      ).not.toThrow();
    }
  });

  it("keeps optional fields when provided", () => {
    const config = validateConfig({
      ...validInput(),
      profile: { ...validInput().profile, bio: "hi", avatar: "/a.webp", location: "Paris" },
      links: [
        {
          title: "x",
          url: "https://example.com",
          icon: "globe",
          description: "desc",
          badge: "New",
          featured: true,
        },
      ],
      seo: { title: "T", twitterHandle: "@t" },
      footer: { showPoweredBy: false },
    });
    expect(config.profile.bio).toBe("hi");
    expect(config.links[0]!.featured).toBe(true);
    expect(config.seo?.title).toBe("T");
    expect(config.footer?.showPoweredBy).toBe(false);
  });
});