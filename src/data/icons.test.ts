import { describe, it, expect } from "vitest";
import {
  resolveIcon,
  LINK_ICON_MAP,
  SOCIAL_ICON_MAP,
  FALLBACK_ICON,
} from "./icons";
import { SOCIAL_PLATFORMS } from "../config/schema";

describe("resolveIcon", () => {
  it("maps friendly keys to iconify names", () => {
    expect(resolveIcon("globe")).toBe("lucide:globe");
    expect(resolveIcon("github")).toBe("simple-icons:github");
  });

  it("is case-insensitive", () => {
    expect(resolveIcon("Globe")).toBe("lucide:globe");
  });

  it("passes through explicit iconify names", () => {
    expect(resolveIcon("lucide:rocket")).toBe("lucide:rocket");
    expect(resolveIcon("simple-icons:x")).toBe("simple-icons:x");
  });

  it("falls back for unknown keys and undefined", () => {
    expect(resolveIcon("nonsense-key")).toBe(FALLBACK_ICON);
    expect(resolveIcon(undefined)).toBe(FALLBACK_ICON);
    expect(resolveIcon("")).toBe(FALLBACK_ICON);
  });
});

describe("social icon map", () => {
  it("covers every supported platform", () => {
    for (const platform of SOCIAL_PLATFORMS) {
      expect(SOCIAL_ICON_MAP[platform], platform).toBeTruthy();
    }
  });

  it("never resolves social names to the fallback", () => {
    for (const name of Object.values(SOCIAL_ICON_MAP)) {
      expect(name).not.toBe(FALLBACK_ICON);
    }
  });

  it("link icon map contains no empty values", () => {
    for (const [key, value] of Object.entries(LINK_ICON_MAP)) {
      expect(value, key).toBeTruthy();
    }
  });
});