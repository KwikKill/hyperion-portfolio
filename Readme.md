# Hyperion

Hyperion is my portfolio project. The goal of this project is to create a simple and easy to use portfolio website that showcases my work and skills. The website is built using Vue.js, Tailwind and pinia and is designed to be responsive and mobile-friendly.

Two versions of the website are available: a classic version and a cyberpunk version. The classic version is designed to be simple and elegant, while the cyberpunk version is designed to be more colorful and futuristic (and a bit more fun to work on). The website is also available in both English and French.

## cyberpunk version

![Cyberpunk version](doc/cyberpunk.png)


## classic version

![classic version](doc/classic.png)

## Technical overview

### Stack

| | |
|---|---|
| Framework | [Nuxt 4](https://nuxt.com) (Vue 3, Vue Router), fully prerendered with `nuxt generate` |
| State | [Pinia](https://pinia.vuejs.org) |
| Styles | [Tailwind CSS 3](https://tailwindcss.com) through `@nuxtjs/tailwindcss`, theme colours as CSS variables |
| Language | TypeScript |
| Animated backgrounds | Canvas 2D, no library |
| Hosting | Static files served by [Caddy](https://caddyserver.com), built in Docker (Node 20) |

### Getting started

```sh
npm install
npm run dev        # development server on http://localhost:3000
npm run generate   # static site in .output/public
npm run preview    # serves the generated site
```

### Routes

Every portfolio page carries its language in the path and is prerendered in that language.

| Path | Page |
|---|---|
| `/` | Language and version picker |
| `/fr/cyberpunk`, `/en/cyberpunk` | Cyberpunk version |
| `/fr/classic`, `/en/classic` | Classic version |
| `/cyberpunk`, `/classic` | Redirect to the French page (or to the language of an older `?lang=` link) |
| `/fr`, `/en` | Redirect to the cyberpunk page in that language |
| `/version` | Redirect to `/` |
| `/sitemap.xml` | Generated at build time with the build date (`server/routes/sitemap.xml.ts`) |

- The language comes from the `[lang]` route parameter. `middleware/language.ts` sets it before rendering, so the prerendered HTML is already in the right language.
- The cyberpunk theme is in the query (`?theme=ghost`, `matrix` or `solarpunk`). The last theme picked is stored in `localStorage`. An inline script in `nuxt.config.ts` applies it before the first paint, so the default theme never flashes.
- Redirects use a full page load (`utils/routes.ts`): an in-app redirect during hydration would reuse the empty redirect page as the portfolio's root.

### Project structure

```
app/
├── pages/            index (picker), [lang]/cyberpunk, [lang]/classic, legacy redirects
├── components/
│   ├── Cyberpunk/    sections of the cyberpunk version (hero, about, experience, projects, interests…)
│   └── Classic/      sections of the classic version
├── stores/
│   ├── projects.ts   all the content: projects, experiences, education, skills, films, games
│   └── preferences.ts  language, cyberpunk theme, full screen state
├── models/           types of the content (project, experience, skill…)
├── composables/      share meta tags, opening a project from anywhere
├── directives/       v-reveal (blocks rising into view)
├── middleware/       language from the path
├── utils/
│   ├── backgrounds/  animated section backgrounds (see below)
│   └── …             routes, scrolling, theme sweep, reduced motion
└── assets/           CSS, fonts, project screenshots, posters
server/routes/        sitemap.xml
public/               CV, share images, logo, robots.txt
```

### Content

All the content lives in `app/stores/projects.ts`, in French and English. Each text field has an `en` and an `fr` value.

To add a project, add an entry to `projects` with its name, description, file name (shown in the terminal and the project explorer), date, category, status and technologies. Its screenshots go in `app/assets/projects/` and are imported at the top of the store. A technology also listed in `skills` counts towards that skill's usage in the htop view.

### Cyberpunk version

- **Four themes**: Cyberpunk, Ghost in the Shell, Matrix and Solarpunk. They are defined as CSS variables in `app/assets/css/tailwind.css`. Every text colour reaches a 4.5:1 contrast on its theme's background (WCAG AA). Switching theme plays a "channel change" sweep (`utils/themeSweep.ts`).
- **Interactive terminal** in the hero: `help`, `whoami`, `ls`, `open`, `skills`, `contact`, `cv`, `theme`, `history`, `clear` and `sudo`. It has tab completion and command history. Clickable suggestions let touch users run commands without typing.
- **htop view** of the skills: each skill is a process, linked to the projects, jobs and education that use it, with category meters that filter the list.
- **Project explorer**: search, technology filter and a detail window for each project.
- **Animated background** per section.

### Animated backgrounds

Each section draws its own background on a canvas:

| Section | Background | Scene |
|---|---|---|
| Home | Wireframe relief scrolling towards the viewer | `gridTerrain` |
| About | Planetary hologram with links from Rennes | `hologram` |
| Experience | Digital skyline (CSS) | — |
| Projects | Printed circuit board that routes itself | `pcbRoute` |
| Interests | Holographic grid with interference fringes | `holoGrid` |

A section uses `<CyberpunkBackground scene="…"/>`. The code is in `app/utils/backgrounds/`:

- `engine.ts` runs the backgrounds:
  - one animation loop for all of them, paused when the tab is hidden;
  - a scene is only set up when its section comes within 300 px of the screen, so the sections further down cost nothing at load time;
  - colours are read from the theme variables and follow theme changes;
  - with reduced motion, a background shows one still image.
- `scenes.ts` holds the scenes. A scene is an object with `init(stage)` and `frame(stage, dt)`.
- `board.ts` generates and routes the printed circuit board (Lee algorithm on two copper layers with vias). `globe.ts` holds the continent outlines and cities of the hologram. `core.ts` holds the shared types and drawing helpers.

The canvas is the height of the screen and stays stuck to the top of its section while it scrolls by, so a long section costs no more than a short one. A section can free one side of the screen for its background: `wide-focus` then centres the scene in that free area from 1024 px, as in the About section.

To add a background, write a scene in `scenes.ts`, add it to `SCENES`, and use its name in a section.

### Accessibility and performance

- `prefers-reduced-motion` is respected everywhere: no rising blocks, no theme sweep, still backgrounds.
- Images are WebP and loaded lazily. A `build:manifest` hook in `nuxt.config.ts` stops Nuxt from prefetching every imported image.
- CSS is served as a file, not inlined in each page (`features.inlineStyles: false`).
- Caddy compresses text responses (zstd, gzip). It caches the hashed `/_nuxt/` files for a year and has pages revalidated on every visit.

### SEO and sharing

- Title, description and link preview tags in the page's language (`composables/useShareMeta.ts`), with a share image per language (`public/og-fr.png`, `public/og-en.png`).
- Canonical and `hreflang` links between the French and English pages.
- `Person` structured data (JSON-LD) in `nuxt.config.ts`.
- Generated sitemap.

### Deployment

The production image (`Dockerfile`, `entrypoint.sh`) installs the dependencies, runs `nuxt generate` and copies `.output/public` into `/build`. That folder is a volume served by Caddy (`Caddyfile.site`). Prerendered pages are found with `try_files {path} {path}/index.html /200.html`; any other path falls back to Nuxt's client-side shell.

For development, `Dockerfile.dev` and `entrypoint-dev.sh` run `npm run dev` with the sources mounted as a volume (`site-compose.beta.yml`).

