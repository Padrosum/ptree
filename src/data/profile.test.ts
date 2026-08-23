import { describe, it, expect } from "vitest";
import { initials, isExternal } from "./profile";

describe("initials", () => {
  it("returns initials for a single name", () => {
    expect(initials("Ada")).toBe("A");
  });

  it("returns two initials for a full name", () => {
    expect(initials("Ada Lovelace")).toBe("AL");
  });

  it("handles extra whitespace", () => {
    expect(initials("  ada   lovelace ")).toBe("AL");
  });

  it("ignores empty input", () => {
    expect(initials("")).toBe("");
    expect(initials("   ")).toBe("");
  });
});

describe("isExternal", () => {
  it("detects http(s) links", () => {
    expect(isExternal("https://example.com")).toBe(true);
    expect(isExternal("http://example.com")).toBe(true);
  });

  it("returns false for relative and protocol links", () => {
    expect(isExternal("/about")).toBe(false);
    expect(isExternal("mailto:a@b.c")).toBe(false);
    expect(isExternal("#top")).toBe(false);
  });
});