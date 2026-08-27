// @ts-check
import { existsSync, readFileSync } from "node:fs";
import { defineConfig } from "astro/config";
import icon from "astro-icon";

const [owner, repo] = process.env.GITHUB_REPOSITORY?.split("/") ?? [];
const isUserPage = repo?.endsWith(".github.io");
const cnamePath = new URL("./public/CNAME", import.meta.url);
const customDomain = existsSync(cnamePath)
  ? readFileSync(cnamePath, "utf8").trim()
  : "";

let base = process.env.PTREE_BASE ?? (customDomain ? "/" : "");
if (!base && repo && !isUserPage) {
  // GitHub Pages *project* site -> served under /<repo>/.
  base = `/${repo}`;
}

const site =
  process.env.PTREE_SITE ??
  (customDomain
    ? `https://${customDomain}`
    : repo
      ? (isUserPage ? `https://${repo}` : `https://${owner}.github.io`)
      : "https://example.com");

export default defineConfig({
  site,
  base,
  integrations: [
    icon({
      include: {
        lucide: [
          "arrow-right",
          "book-open",
          "briefcase",
          "camera",
          "code",
          "coffee",
          "download",
          "external-link",
          "file-text",
          "globe",
          "heart",
          "link",
          "mail",
          "map-pin",
          "music",
          "play",
          "puzzle",
          "rocket",
          "rss",
          "sparkles",
          "star",
          "terminal",
          "zap",
        ],
        "simple-icons": [
          "discord",
          "github",
          "instagram",
          "linkedin",
          "mastodon",
          "medium",
          "reddit",
          "spotify",
          "telegram",
          "threads",
          "tiktok",
          "twitch",
          "x",
          "youtube",
        ],
      },
    }),
  ],
});
