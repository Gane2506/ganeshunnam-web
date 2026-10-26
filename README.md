# ganeshunnam.com

Portfolio for Ganesh Unnam: AI Engineer & Creative Developer. Static Vite site with a Three.js particle
stage, GSAP scroll choreography and case studies written in a headless WordPress.

```
WordPress (cms.ganeshunnam.com)  ──publish──▶  GitHub Actions  ──rsync──▶  Nginx (static) ◀── Cloudflare ◀── visitors
  "casestudy" posts + fields       dispatch     build + prerender         /var/www/ganeshunnam/current
```

Visitors never talk to WordPress. Case studies are fetched at build time and shipped as plain HTML.

## Stack

| Concern     | Choice                                                                      |
| ----------- | --------------------------------------------------------------------------- |
| Build       | Vite 8, vanilla ES modules                                                  |
| 3D          | Three.js `ShaderMaterial` points (`src/scene.js`, `src/shaders/`)           |
| Motion      | GSAP 3 + ScrollTrigger + SplitText, Lenis smooth scroll on the GSAP ticker  |
| Transitions | Cross-document View Transitions (CSS) with a GSAP curtain fallback          |
| CMS         | WordPress plugin `wordpress/ganesh-casestudy` (CPT + REST fields + rebuild) |
| Hosting     | Nginx, atomic release symlinks, `deploy/nginx/ganeshunnam.conf`             |

## Commands

```bash
npm ci
npm run dev             # http://localhost:5173
npm run build           # vite build + prerender case studies → dist/
npm run preview         # serve dist/ on :4173
npm run lint            # eslint + prettier
npm run fetch:previews  # one-off: copy project screenshots from the current live site into public/previews
```

`npm run build` uses `WP_API_URL` when it is set, and the seed JSON in `content/casestudies/` when it isn't.
Add `?forcegl` to a URL to force the WebGL stage on machines with software GL (QA only).

## Motion map

| Section             | DOM                                      | Particles (`stage` state in `main.js`)         |
| ------------------- | ---------------------------------------- | ---------------------------------------------- |
| Hero (100vh)        | CSS line reveal, magnetic CTAs           | cloud condenses into a noisy sphere            |
| About (≈150vh, pin) | SplitText headline, paragraphs rise      | sphere explodes into a drifting cloud          |
| Work (bento)        | `data-speed` parallax, palette hover     | cloud reforms as a torus knot, tinted per card |
| Experience          | timeline rises                           | knot loosens and dims                          |
| Contact             | velocity-reactive marquee, click-to-copy | flattens into an orbit ring                    |

## Performance guardrails

- Hero text is HTML + CSS animation, so it is the LCP element and paints before any JS.
- Fonts are self-hosted latin subsets (`public/fonts`, OFL) and preloaded; no third-party requests.
- `three` is its own chunk, imported on `requestIdleCallback` after `load`, and only with WebGL2 on a
  hardware GPU, no `prefers-reduced-motion` and no Save-Data. Everyone else gets the CSS poster.
- `setPixelRatio(min(dpr, 2))`, one `gsap.ticker` RAF for scroll, tweens and WebGL, rendering paused
  while the tab is hidden, an explicit bounding sphere so frustum culling stays correct with GPU displacement.
- `pagehide` disposes geometry, material, render lists, the renderer and the GL context.
- Lighthouse CI budgets (mobile): performance ≥ 0.9, accessibility = 1, SEO ≥ 0.95, CLS ≤ 0.05.
  Last local run: 99 / 100 / 100 / 100, LCP 1.9 s, TBT ≤ 40 ms.

## WordPress setup (cms.ganeshunnam.com)

1. Install WordPress on the server (Nginx block included in `deploy/nginx/ganeshunnam.conf`).
2. Upload `wordpress/ganesh-casestudy/` to `wp-content/plugins/` and activate it.
3. Create a fine-grained GitHub token for this repo only with **Contents: read and write**, then add to `wp-config.php`:
   ```php
   define( 'GCS_GITHUB_REPO',  'Gane2506/ganeshunnam-web' );
   define( 'GCS_GITHUB_TOKEN', 'github_pat_…' );
   define( 'GCS_FRONTEND_URL', 'https://ganeshunnam.com' );
   ```
4. Write case studies under **Case Studies**. Fill in client, year, role, type, stack, live URL, colours and metrics
   (`value | label` per line). Publishing, editing or unpublishing triggers a deploy within about 2 minutes.

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

Before cutting DNS over, run `npm run fetch:previews` and commit `public/previews/` so the project cards keep their screenshots.
