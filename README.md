# ganeshunnam.com

Portfolio for Ganesh Unnam: full stack engineer and product owner, Toronto. A static Vite site built from the
[Ganesh Unnam design system](https://claude.ai/artifact/6TA2E4svSPU4C9Prmenfuc), with one persistent Three.js
particle field, GSAP scroll choreography, light and dark themes, and case studies written in a headless WordPress.

```
WordPress (cms.ganeshunnam.com)  ──publish──▶  GitHub Actions  ──rsync──▶  Nginx (static) ◀── Cloudflare ◀── visitors
  "casestudy" posts + fields       dispatch     build + prerender         /var/www/ganeshunnam/current
```

Visitors never talk to WordPress, and no framework ships to the browser: every page is rendered to static HTML
at build time from the design system's components.

## Where things live

| Path                                    | What                                                                                         |
| --------------------------------------- | -------------------------------------------------------------------------------------------- |
| `design/tokens.json`                    | Design system tokens (both themes). `npm run tokens` regenerates `src/styles/tokens.css`     |
| `src/styles/components.css`, `page.css` | Design system component and layout CSS, unchanged                                            |
| `src/styles/site.css`                   | Site layer: fonts, fixed stage, curtain, cursor, full-screen menu, reveals                   |
| `src/ui/components.js`                  | Design system components as HTML templates (same markup and classes as its React bundle)     |
| `src/content/*.js`                      | All copy: positioning, work, capabilities, toolkit, experience, lifecycle, architectures     |
| `src/pages/index.js`                    | Page bodies (home, archive, case study, 404, privacy)                                        |
| `src/three/`                            | The design system's particle field and 13 shape generators                                   |
| `src/modules/stage.js`                  | Scene map: shape, position, colour and opacity per page and section                          |
| `src/modules/*.js`                      | Behaviour: theme, header + menu, lifecycle, diagrams, marquee, count-up, cursor, transitions |
| `content/casestudies/*.json`            | Seed case studies, used when WordPress isn't connected                                       |
| `scripts/build-casestudies.mjs`         | Post-build: one page + social image per case study, sitemap                                  |

## Commands

```bash
npm ci
npm run dev       # http://localhost:5173
npm run build     # vite build + case study pages, social images and sitemap → dist/
npm run preview   # serve dist/ on :4173
npm run lint      # eslint + prettier
npm run tokens    # regenerate tokens.css after editing design/tokens.json
```

`npm run build` uses `WP_API_URL` when it is set, and the seed JSON in `content/casestudies/` when it isn't.
Add `?forcegl` to a URL to force the WebGL field on machines with software GL (QA only).

## Themes

Dark is the default; light is the design system's warm paper theme. An inline script in `<head>` sets
`data-theme` before any CSS (saved choice, else the OS setting), so there is no flash. Toggles in the header,
menu and footer cross-fade with a View Transition and stay in sync; the particles switch from additive glow to
ink dots. The script's hash is in the CSP (`deploy/nginx/ganeshunnam.conf`); `npm run build` prints it.

## Motion and scene map

| Section                          | DOM                                                     | Particle field                                                         |
| -------------------------------- | ------------------------------------------------------- | ---------------------------------------------------------------------- |
| Hero                             | CSS line reveal (LCP paints before JS), magnetic CTAs   | sphere at the right (own band above the name on phones)                |
| About (pinned +50vh)             | masked line reveals, count-up stats                     | sphere explodes, scrubbed by scroll                                    |
| How I work (pinned +200vh)       | lifecycle tabs; scroll picks the phase                  | morphs per phase: constellation, agents, packages, helix, ring, ribbon |
| Featured build                   | architecture diagram with travelling pulses             | dims to 0.2                                                            |
| Work                             | bento with `data-speed` parallax, cursor-following glow | torus knot, retints to the hovered project's hue                       |
| Capabilities                     | hover or focus a row                                    | morphs to that capability's shape                                      |
| Experience, case studies, engage | rises, cards                                            | knot, then constellation                                               |
| Contact                          | velocity-reactive marquee, click-to-copy                | orbit ring around "Start a project"                                    |
| Case study                       | hero in the project's hue                               | the project's shape, base colour pulled 60% toward its hue             |
| 404                              |                                                         | sphere falling apart                                                   |

Reduced motion: no smooth scroll, pins, reveals, cursor or WebGL; the static mesh poster stays.

## Performance guardrails

- Hero text is HTML + CSS animation, so it is the LCP element. Fonts are self-hosted latin subsets, preloaded.
- Generated project art is cached SVG files applied as CSS masks (tinted with `currentColor`), not inline SVG.
- `three` (≈130 kB gz) is its own chunk, imported on idle after `load`, only with WebGL2 on a hardware GPU,
  no reduced motion and no Save-Data. DPR is capped at 2; rendering pauses while the tab is hidden;
  `pagehide` disposes geometry, materials, render lists, the renderer and the GL context.
- Lighthouse CI budgets (mobile): performance ≥ 0.9, accessibility = 1, SEO ≥ 0.95, CLS ≤ 0.05.

## WordPress setup (cms.ganeshunnam.com)

1. Install WordPress on the server (Nginx block included in `deploy/nginx/ganeshunnam.conf`).
2. Upload `wordpress/ganesh-casestudy/` to `wp-content/plugins/` and activate it.
3. Create a fine-grained GitHub token for this repo only with **Contents: read and write**, then add to `wp-config.php`:
   ```php
   define( 'GCS_GITHUB_REPO',  'Gane2506/ganeshunnam-web' );
   define( 'GCS_GITHUB_TOKEN', 'github_pat_…' );
   define( 'GCS_FRONTEND_URL', 'https://ganeshunnam.com' );
   ```
4. Write case studies under **Case Studies**. Fill in short name, client, year, role, type, status, stack, live
   URL, colour (one of the six design system hues), art and 3D shape, and metrics (`value | label | caption` per
   line). Use a paragraph with the class `gu-meta cs-kicker` for phase kickers ("01 · Discover"), and a Custom HTML
   block with `<!--gu:arch:sarah-->`, `<!--gu:arch:bedrock-->` or `<!--gu:log:sarah-->` to embed a diagram or
   change log. Publishing, editing or unpublishing triggers a deploy within about 2 minutes.

## Deployment

GitHub → Settings → Environments → `production`:

| Kind     | Name                   | Value                                                |
| -------- | ---------------------- | ---------------------------------------------------- |
| Variable | `WP_API_URL`           | `https://cms.ganeshunnam.com/wp-json`                |
| Secret   | `DEPLOY_HOST`          | `ssh.ganeshunnam.com` (DNS-only record) or server IP |
| Secret   | `DEPLOY_USER`          | deploy user (owns `DEPLOY_PATH`)                     |
| Secret   | `DEPLOY_PATH`          | `/var/www/ganeshunnam`                               |
| Secret   | `DEPLOY_SSH_KEY`       | private key for that user (ed25519, deploy-only)     |
| Secret   | `DEPLOY_KNOWN_HOSTS`   | output of `ssh-keyscan -t ed25519 <host>`            |
| Secret   | `CLOUDFLARE_ZONE_ID`   | zone overview page                                   |
| Secret   | `CLOUDFLARE_API_TOKEN` | token with Zone → Cache Purge on this zone only      |

Deploys run on push to `main`, on `cms-publish` dispatches from WordPress, nightly, and by hand. Each run
uploads to `releases/<sha>-<run>/`, swaps the `current` symlink atomically and keeps the last five releases.
Roll back with `ln -sfn releases/<older> current` on the server.

Cloudflare setup (DNS, Origin CA certificate, origin lock, cache rule, Access): **[deploy/cloudflare/README.md](deploy/cloudflare/README.md)**.

Server, once:

```bash
sudo mkdir -p /var/www/ganeshunnam/releases && sudo chown -R deploy: /var/www/ganeshunnam
sudo cp deploy/nginx/ganeshunnam.conf /etc/nginx/sites-available/ && sudo ln -s ../sites-available/ganeshunnam.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```
