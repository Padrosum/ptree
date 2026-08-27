# ptree

**ptree** is a modern, GitHub-first alternative to Linktree. Configure a single TypeScript file, push to GitHub, and a GitHub Actions workflow builds a fast, static, privacy-friendly link page and deploys it to GitHub Pages.

> simple configuration → beautiful site → static build → GitHub Pages

No backend, no database, no SaaS account, no login. Your profile lives in your own repository, and your page is just static HTML + CSS + a few bytes of inline JavaScript.

## Features

- **Static-first** — the output is a handful of files; no server, no runtime API calls.
- **Zero-dependency runtime** — no analytics, no tracking, no external fonts, no third-party scripts. Your visitors stay yours.
- **Three built-in themes** — `void`, `glass` and `terminal`, implemented as a shared component system driven by design tokens.
- **Dark mode first-class** — follows the visitor's `prefers-color-scheme`, with an explicit `auto` / `light` / `dark` mode in the config.
- **Type-safe configuration** — validated at build time with readable errors (e.g. `links[2].url is required`).
- **Accessible** — semantic HTML, keyboard navigation, visible focus, `aria-label`s, `prefers-reduced-motion` support.
- **SEO / Open Graph / Twitter cards** — configurable per profile.
- **GitHub Pages native** — project sites (`/repo/` base path), user sites, and custom domains all handled automatically.
- **Lightweight icons** — SVGs from the Iconify ecosystem are inlined at build time (`astro-icon`), so there is no icon runtime.

## Requirements

- Node.js ≥ 20 and npm
- A GitHub account (for Pages deployment)

## Project structure

```
ptree/
├── .github/workflows/deploy.yml   # build + deploy to GitHub Pages
├── config/
│   └── profile.ts                 # ← your configuration (edit this)
├── public/                        # static assets (avatar, favicon, …)
│   ├── avatar.svg
│   ├── favicon.svg
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── Profile/               # avatar, name, bio, location
│   │   ├── Links/                 # link cards
│   │   ├── Socials/               # social icon row
│   │   ├── Footer/
│   │   └── UI/                    # Icon, Avatar
│   ├── config/                    # schema + build-time validation
│   ├── data/                      # icon maps, path/profile helpers
│   ├── layouts/BaseLayout.astro   # SEO metadata + head
│   ├── pages/index.astro          # the single page
│   ├── styles/global.css          # structural + component styles
│   └── themes/                    # void / glass / terminal tokens
└── astro.config.mjs
```

## Getting started

```bash
git clone <your-fork-of-ptree> && cd ptree
npm install
npm run dev
```

Open http://localhost:4321 — you should see the demo profile.

## Configuration

Everything you can change lives in `config/profile.ts`:

```ts
export default {
  lang: "en",

  profile: {
    name: "Padros",
    username: "padros",
    bio: "Archaeology student · Linux · Open Source",
    avatar: "/avatar.webp", // path relative to the site base
    location: "Ankara, Türkiye",
  },

  theme: "void", // or an object, see "Theme system" below

  links: [
    {
      title: "My Website",
      url: "https://example.com",
      icon: "globe",
      description: "Long-form writing and notes.",
      badge: "New",
      featured: true,
    },
  ],

  socials: [{ platform: "github", url: "https://github.com/example" }],

  seo: {
    title: "Padros — link page",
    description: "Find all my links in one place.",
    image: "/og.png",
    twitterHandle: "@padros",
  },

  footer: { showPoweredBy: true },

  customCss: `
    /* extra, owner-controlled CSS goes here */
  `,
};
```

### Profile

| Key        | Required | Description                                        |
| ---------- | -------- | -------------------------------------------------- |
| `name`     | yes      | Display name.                                       |
| `username` | yes      | Shown as `@username`.                               |
| `bio`      | no       | Short biography.                                    |
| `avatar`   | no       | Image path. A monogram fallback is used if omitted. |
| `location` | no       | Optional location line.                             |

If no avatar is set, ptree renders a generated monogram from the name.

### Links

Each link supports `title` (required), `url` (required), `icon`, `description`, `badge` and `featured`. `featured` links are promoted to the top of the list. Link cards are keyboard accessible, touch friendly and animate subtly on hover/focus.

For the `icon` field use any of the friendly keys below, or any Iconify name directly (e.g. `"lucide:rocket"`):

```
globe  link  book  file  code  terminal  rocket  map  pin  mail  heart
star   sparkles  zap  download  play  music  camera  briefcase  coffee
puzzle  rss  external  arrow  github  x  twitter  youtube  instagram
linkedin  discord  telegram  twitch  spotify
```

### Social links

`platform` must be one of: `github`, `x`, `instagram`, `youtube`, `linkedin`, `discord`, `mastodon`, `telegram`, `tiktok`, `twitch`, `reddit`, `spotify`, `threads`, `medium`, `website`, `email`. Each entry also takes a `url`. Only the platforms you list are rendered.

## Theme system

`theme` accepts a shorthand name or a full object:

```ts
theme: {
  name: "void",             // "void" | "glass" | "terminal"
  mode: "auto",             // "auto" | "light" | "dark"
  accent: "#e0a458",        // any CSS color
  background: "#0a0a0a",    // optional background override
  font: "system",           // "system" | "sans" | "serif" | "mono"
  linkStyle: "card",        // "card" | "minimal"
}
```

Themes are implemented as CSS custom-property tokens (`src/themes/*.css`). Components never hardcode colors — they consume semantic tokens (`--bg`, `--surface`, `--text`, `--accent`, …), so a theme is purely a token swap. Accent and background overrides are applied via inline CSS variables; fonts use the system stack (no external requests).

- **void** — minimal, near-black, typography-first.
- **glass** — translucent blurred surfaces over a soft gradient.
- **terminal** — monospace hacker aesthetic with hard edges and a phosphor accent.

## Backgrounds

The top-level `background` option adds a full-screen effect behind the page content:

```ts
    background: "voxel",
```

**voxel** renders an interactive Minecraft-like world on a fixed canvas. Visitors can drag to rotate the world, use the wheel to zoom, click to build, Shift-click to remove a block, and use `WASD` or the arrow keys to control the camera. Small cats wander through the world while the scene moves through a slow day/night cycle. It is:

- **opt-in** — omit `background` for a plain CSS-only page;
- **lightweight** — uses the 2D canvas API and no external assets or runtime dependencies;
- **responsive** — adapts its scale and controls to touch and pointer devices;
- **graceful** — if canvas is unavailable, the page content still renders normally.

It looks best with the `void` theme. The world is rendered behind the content, so the link cards remain readable while the scene stays interactive around them.

## Local development

```bash
npm run dev         # start the dev server with HMR
npm run build       # production build into dist/
npm run preview     # serve the production build locally
```

Editing `config/profile.ts` is picked up instantly by the dev server.

## Validation & errors

Configuration is validated at build time. A mistake produces a readable error and aborts the build:

```
Invalid ptree configuration:
links[2].url is required
```

## Tests, lint & types

```bash
npm run lint        # ESLint (flat config, TS + Astro)
npm run typecheck   # astro check / tsc --noEmit (strict mode)
npm run test        # Vitest unit tests (config validation, icon maps, helpers)
```

The GitHub Actions workflow runs `typecheck`, `lint`, `test` and `build`; a failure in any step prevents deployment.

## Deploying to GitHub Pages

1. Create a repository and push this project to `main`.
2. Open **Settings → Pages** and under *Build and deployment* select **GitHub Actions**.
3. The workflow in `.github/workflows/deploy.yml` runs on every push to `main`. It installs dependencies (with caching), typechecks, lints, tests, builds, then deploys via `actions/deploy-pages`.

The site's URL depends on the repository:

- **Project site** (`username/ptree`): served at `https://username.github.io/ptree/`.
- **User/org site** (`username.github.io`): served at `https://username.github.io/`.

ptree handles both automatically: `astro.config.mjs` reads `GITHUB_REPOSITORY` from the workflow environment to compute the correct `base` and `site`. If you ever need to override this, set the `PTREE_BASE` and `PTREE_SITE` environment variables.

## Custom domain

You can point a subdomain (e.g. `links.example.com`) or a bare domain at your page.

1. Add a `CNAME` file to the `public/` directory containing your domain, e.g. `links.example.com`.
2. In your DNS provider, create a `CNAME` record:
   - **Subdomain** — `links.example.com` → `username.github.io`.
   - **Apex domain** — use `A` records to `185.199.108.153`, `185.199.109.153`, `185.199.110.153` and `185.199.111.153`.
3. Under **Settings → Pages → Custom domain**, enter the domain. GitHub writes/verifies the `CNAME` automatically; keep the file in `public/` so it survives rebuilds.

When a custom domain is active, `base` resolves to `/` automatically (asset URLs stop being prefixed), so everything keeps working. Note that for custom domains, GitHub only supports serving over HTTPS.

## SEO

`seo.title`, `seo.description` and `seo.image` control the document title, description, Open Graph and Twitter cards. `twitterHandle` sets `twitter:site`. A `canonical` URL is generated from the configured `site`. The default Open Graph image is the profile avatar if `seo.image` is not set; for best results on social platforms, use a PNG/JPEG (e.g. `public/og.png`), since not all crawlers support SVG.

## Security

- Config values are rendered as text, never as raw HTML.
- External links get `rel="noopener noreferrer"`.
- `customCss` is owner-controlled by design — it is injected verbatim, so only put CSS you author there.

## Performance & privacy

- Zero runtime JavaScript on the default page except a small inline theme script that respects `prefers-color-scheme` (the optional `background: "voxel"` effect adds a small canvas renderer when enabled).
- Icons are inlined SVG at build time; fonts are the system stack.
- No analytics, no cookies, no external requests on the published page.

## Browser support

Modern evergreen browsers. The CSS uses `color-mix()` and `:focus-visible`, so a recent browser is expected.

## Contributing

- Open an issue for bugs or feature ideas before starting large changes.
- Keep the philosophy: static-first, minimal runtime JS, accessible, dependency-light.
- Run `npm run lint`, `npm run typecheck`, `npm run test` and `npm run build` before submitting a PR.

## License

[MIT](LICENSE)
