# ganeshunnam.com v2: Portfolio Rebuild Plan

Status: **VALIDATED 2026-10-26.**

Decisions:

- Repo: new `Gane2506/ganeshunnam-web`
- Speed first, blog second: fully static build. Case studies are prerendered at build time and rebuilt when you publish in WordPress. Visitors' browsers never call WordPress, and the case-study pipeline is isolated so it can't slow the home page.
- WordPress: new headless install at `cms.ganeshunnam.com`
- Design: dark editorial + lime accent

---

## 1. What I gathered (source content)

| Source                             | What it gives us                                                                                                                                                                                                                                                                                                                                                            |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **ganeshunnam.com** (live)         | Positioning ("Build better. Grow smarter."), 6 service lines, 20 projects with preview images (`/previews/*.webp`), about copy, Toronto/GTA service areas, multi-step brief form, privacy/terms pages                                                                                                                                                                       |
| **rdpvsolutions.ca**               | Current role: Gen AI Developer / Full-Stack AI Engineer at RDPV Solutions (May 2026 to now). Three divisions (IT, Design, Talent), work pieces (RDPV site + delivery pipeline, invoice-intake workflow, design system), insights articles. The footer says "Built by connectxmedia.com"                                                                                     |
| **Resume** (Indeed, newest)        | RDPV Solutions, Flooring Liquidators (Web Dev / IT Director, Nov 2024), AZTRA (Mar 2024), Vinyl Sound (May 2023), Premier Electronic Parts (Feb 2023), Deloitte Talent Sourcing (Oct 2018). York U PG cert, Osmania B.Com. About 60 skills (LLM apps, RAG, MCP, LangChain, FastAPI, Next.js, headless WP, WPGraphQL, Shopify, n8n, Docker, AWS Bedrock, WCAG/AODA, PIPEDA…) |
| **Resume** (Drive, Aug 2024)       | Detailed bullets: 15,000+ SKU WooCommerce migration to AWS, +25% clicks in 2 months, Aztra IT setup, Vinyl Sound Klaviyo/Shopping, Muse Wearables 2019–22, freelance since 2017, Jenkins/Ansible/Terraform CI/CD project                                                                                                                                                    |
| **Cover letter** (Drive, Sep 2026) | Flooring Liquidators: about $9k/mo Google+Meta brought in-house, **+30% sales**, 600+ discontinued product pages recovered                                                                                                                                                                                                                                                  |
| **GitHub** `Gane2506`              | Bio: "I build AI agent systems, custom applications and websites. Creator of Baton." Public flagship repos: **baton** (agent orchestrator, Python), **rust-crm** (Axum/SQLx/Leptos), **ai-business-os**, plus infra repos (Terraform control/managed nodes)                                                                                                                 |

**Positioning I propose:** _Ganesh Unnam: AI Engineer & Creative Developer._ "I build AI agent systems, fast websites, and the automation that connects them." This combines the agency-style services from ganeshunnam.com with the AI/engineering depth from RDPV and GitHub.

---

## 2. Skills selected (from skill discovery)

| Phase   | Skill                                                          | Why                                                                         |
| ------- | -------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Design  | `anthropic-skills:emil-design-eng`                             | Design-engineering craft: motion taste, interaction polish                  |
| Design  | `design:design-system`                                         | Tokens (color, type, spacing, motion) before any UI                         |
| Design  | `design:ux-copy`                                               | Tighten headlines, CTAs, microcopy                                          |
| Design  | `anthropic-skills:impeccable-design-audit`                     | Visual QA pass before launch                                                |
| Build   | `anthropic-skills:three-js`                                    | Particle/morph scene, disposal, performance                                 |
| Build   | `anthropic-skills:gsap`                                        | ScrollTrigger, SplitText, pinning, scrub (GSAP + all plugins are free now)  |
| Build   | `engineering:architecture`                                     | Static and headless WP boundary, ADR                                        |
| Quality | `design:accessibility-review`                                  | WCAG 2.2 AA / AODA (you list it on your resume, so the site has to pass it) |
| Quality | `searchfit-seo:technical-seo`, `schema-markup`, `on-page-seo`  | Person/ProfessionalService/Article JSON-LD, sitemap, OG                     |
| Quality | `code-review`, `simplify`, `security-review`                   | Pre-merge gates                                                             |
| Ship    | `engineering:deploy-checklist`, `engineering:testing-strategy` | CI/CD and Nginx rollout                                                     |
| Content | `github-portfolio-builder`                                     | Turn Baton / rust-crm into credible case studies                            |

---

## 3. Architecture

```
 WordPress (cms.ganeshunnam.com)         GitHub repo: ganeshunnam-web
 ├─ CPT "casestudy" (+ ACF fields)       ├─ Vite + vanilla JS
 ├─ REST /wp-json/wp/v2/casestudy        ├─ scripts/fetch-cms.mjs   (build-time pull)
 └─ mu-plugin: on publish/update ──────► ├─ scripts/prerender.mjs   (static HTML per case study)
        repository_dispatch               └─ .github/workflows/
                                              ci.yml      lint · build · Lighthouse CI · a11y
                                              deploy.yml  build → rsync dist/ → your server
                                                          (triggers: push to main, cms-publish, nightly)
                                                    │
                                                    ▼
                                    Your server: Nginx serves /var/www/ganeshunnam/dist
```

**Key decision: static prerender, not runtime fetch.** When you publish a case study in WordPress, a GitHub Action rebuilds and deploys the site in about 1–2 minutes. Every case study ships as real HTML, which gives the best SEO, no WP load on visitors, and no CORS. A client-side fallback fetch shows posts newer than the last build if a deploy fails.

**WordPress side** (shipped in repo `/wordpress`):

- `ganesh-casestudy` plugin: registers CPT `casestudy` (archive `/casestudy`), fields: client, year, role, stack[], palette (primary/secondary hex for the Three.js tint), hero image, live URL, metrics[], `show_in_rest`
- Publish hook → `POST /repos/{owner}/ganeshunnam-web/dispatches` (fine-grained PAT stored in `wp-config.php`)
- WP stays headless: front-end theme redirects to ganeshunnam.com, `noindex` on cms subdomain

---

## 4. Site map and sections

| Route                          | Content                                                                                                   |
| ------------------------------ | --------------------------------------------------------------------------------------------------------- |
| `/`                            | Hero → About/Capabilities (pinned) → Selected Work → Experience timeline → Open source (GitHub) → Contact |
| `/casestudy/`                  | Archive grid, filter by type (AI · Web · E-com · Automation · Infra)                                      |
| `/casestudy/<slug>/`           | Prerendered article: hero in palette color, problem → approach → stack → results → next case study        |
| `/privacy/`, `/terms/`, `/404` | Ported from current site (PIPEDA-aligned)                                                                 |

**Home sections (mapped to your brief):**

1. **Hero (100vh).** SplitText reveal: "Ganesh Unnam — AI Engineer & Creative Developer". Two magnetic CTAs ("View case studies", "Start a project"). Centered interactive 3D object: an icosahedron of about 40k particles with simplex-noise displacement that responds to the cursor.
2. **About / Capabilities (150vh pin).** As you scroll, the shape explodes into a particle cloud (scrubbed `uProgress` uniform). Paragraphs slide and fade in. Copy: 9+ years, Toronto, "developer's detail, owner's big picture". Six capability rows (AI agents & RAG · Web & headless CMS · E-commerce · SEO & growth · Automation (n8n/MCP) · Cloud & DevOps).
3. **Showcase.** Bento grid with `data-speed` parallax per card. On hover, the particle material lerps to that project's palette. First 6 cards are featured: **Baton**, **RDPV Solutions platform**, **Flooring Liquidators** (+30% sales), **Vinyl Sound**, **Talent Search**, **rust-crm**. Then a "more work" strip with the other 14 sites.
4. **Experience.** Compact timeline from the resume (RDPV → Flooring Liquidators → AZTRA → Vinyl Sound → Premier → Muse → Deloitte → Freelance 2017).
5. **Contact / footer.** Kinetic marquee "Available for Freelance • Let's Build • AI Agents • Websites •". Click-to-copy email with a toast. Links to GitHub, LinkedIn, and the RDPV brief form.

**Transitions:** View Transitions API for same-document and cross-page navigation, with a GSAP curtain-wipe fallback when the API isn't supported.

---

## 5. Design direction (to validate)

- **Mood:** dark editorial ("ink" #0B0B0F), off-white type, a single electric accent per context (default signal lime `#C6F432`). Project palettes take over on hover.
- **Type:** display _Clash Display_ or _PP Neue Montreal_ style (self-hosted, free alternative: **Space Grotesk** + **Inter Tight**), mono for meta (JetBrains Mono).
- **Grid:** 12-col, generous negative space, oversized numerals (01 / 02…) carried over from the current site's language.
- **UX principles:** content first (motion never blocks reading), one primary CTA per viewport, 44px targets, visible focus, `prefers-reduced-motion` serves a static poster frame and plain fades, keyboard parity for magnetic/hover effects.

---

## 5b. Motion system (non-negotiable core)

| Layer                    | Tech                                                                                                                  | Where                                         |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| **3D / motion graphics** | Three.js custom `ShaderMaterial` points (GPU-animated: noise morph, explode, palette lerp, cursor repel)              | Fixed full-screen canvas behind every section |
| **Scroll choreography**  | GSAP ScrollTrigger: one master timeline scrubs scene uniforms + camera path per section, `pin` on About (150vh)       | All sections                                  |
| **Text**                 | GSAP SplitText: char/line masks for headlines, line reveals for paragraphs                                            | Hero, section titles, case studies            |
| **Smooth scroll**        | Lenis driven by `gsap.ticker` (single RAF for scroll, GSAP and WebGL)                                                 | Global                                        |
| **Parallax**             | `data-speed` / `data-lag` on cards, images, numerals (transform-only, GPU-composited)                                 | Bento grid, case study heroes                 |
| **Page transitions**     | View Transitions API + lime curtain wipe (GSAP clip-path) fallback; WebGL scene persists and re-targets between pages | Home ↔ case studies                           |
| **Micro-interactions**   | Magnetic CTAs, custom cursor with context labels, marquee with scroll-velocity skew, click-to-copy toast              | Global                                        |

Speed guardrails: one shared RAF; Three.js is lazy-imported after first paint; all animation uses transform/opacity only; the loop pauses off-screen and when the tab is hidden; reduced-motion users get a static poster and plain fades.

## 6. File structure

```
ganeshunnam-web/
├─ index.html
├─ casestudy/index.html                # archive shell (prerendered)
├─ src/
│  ├─ main.js                          # boot, Lenis smooth scroll, GSAP wiring, transitions
│  ├─ scene.js                         # Three.js: renderer, particles, uniforms, dispose()
│  ├─ shaders/particles.vert|frag.glsl
│  ├─ modules/ split-reveal.js · magnetic.js · parallax.js · marquee.js · copy-email.js · transitions.js · cursor.js
│  ├─ data/ profile.json · projects.json · experience.json   # from your resume and sites
│  ├─ lib/cms.js                       # WP REST client (runtime fallback)
│  └─ styles/ tokens.css · base.css · sections.css
├─ public/ previews/*.webp · fonts/ · og/ · favicon.svg · robots.txt
├─ scripts/ fetch-cms.mjs · prerender.mjs · sitemap.mjs
├─ wordpress/ganesh-casestudy/ganesh-casestudy.php
├─ deploy/nginx/ganeshunnam.conf
├─ .github/workflows/ ci.yml · deploy.yml
├─ vite.config.js · package.json · .eslintrc · .prettierrc · lighthouserc.json · README.md
```

---

## 7. Performance and production requirements

- `renderer.setPixelRatio(Math.min(devicePixelRatio, 2))`, `powerPreference: 'high-performance'`, antialias off above DPR 1.5
- Frustum culling on, with a correct bounding sphere for the shader-displaced points; render loop **pauses** when the hero/canvas is off-screen (IntersectionObserver) or the tab is hidden
- `dispose()` tears down geometry, material, textures, `renderer.dispose()`, `forceContextLoss()`, and removes listeners and the ScrollTrigger; called on page transition / `pagehide`
- Particle count adapts: 40k desktop, 12k mobile; `Save-Data`/no-WebGL2 gets a static WebP poster
- Three.js is lazy-loaded (dynamic `import()` after first paint), so LCP stays HTML text
- **Budgets enforced in CI (Lighthouse CI):** Perf ≥ 90 mobile, A11y = 100, SEO = 100, JS ≤ 180 kB gz initial, LCP < 2.0s, CLS < 0.05
- Nginx: gzip + brotli (if module present), `immutable` 1-year cache on hashed `/assets/`, `no-cache` on HTML, security headers (CSP, HSTS, Referrer-Policy, Permissions-Policy), HTTP/2, 404 fallback

---

## 8. CI/CD

- **ci.yml** (PRs): `npm ci` → ESLint/Prettier → `vite build` (with CMS fixtures) → Lighthouse CI + axe → upload `dist` artifact
- **deploy.yml** (push to `main`, `repository_dispatch: cms-publish`, nightly cron): fetch CMS → build → prerender → `rsync --delete` over SSH to the server → atomic symlink swap (`releases/<sha>` → `current`) → keep the last 5 releases for instant rollback
- **Secrets you'll add:** `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_SSH_KEY`, `DEPLOY_PATH`, `WP_API_URL`

---

## 9. Phases

| #   | Phase                      | Output                                                               | Validation gate                                 |
| --- | -------------------------- | -------------------------------------------------------------------- | ----------------------------------------------- |
| 0   | **This plan**              | This doc                                                             | Your approval and answers to the open questions |
| 1   | Content and design system  | `profile/projects/experience.json`, tokens, type, homepage wireframe | You approve the copy and the look               |
| 2   | Scaffold and core          | Vite repo, CI, scene.js, main.js, hero                               | Builds green, Lighthouse budget passes          |
| 3   | Sections and motion        | About pin, explode, bento, marquee, transitions                      | Reduced-motion and keyboard checks              |
| 4   | WordPress and case studies | Plugin, fetch/prerender, `/casestudy`                                | Publish test post → auto deploy                 |
| 5   | Deploy                     | Nginx conf, deploy.yml, release dirs                                 | Staging URL review                              |
| 6   | QA and launch              | A11y/SEO/design audit, code review, security review                  | Go-live sign-off, DNS cutover                   |

---

## 10. Open questions and risks

1. **Repo:** this session can only write to `cxm-web` (Connect X Media). I can create the new repo `Gane2506/ganeshunnam-web` and attach it, or build in a folder of `cxm-web`.
2. **Stack conflict:** the brief says _vanilla JS + Vite_, but your other sites use Next.js + headless WP. Vanilla + Vite + prerender meets the brief and is the fastest option. Confirm.
3. **WordPress host:** new `cms.ganeshunnam.com` on your server, or an existing WP install?
4. **Resume conflicts to confirm:** Muse Wearables (2019–22) appears in the 2024 resume but not on Indeed; the Flooring Liquidators title differs (IT Director vs Web Developer); Deloitte dates. I'll use the Indeed version as the source of truth unless you say otherwise.
5. **Client logos/metrics:** OK to name Flooring Liquidators (+30% sales, $9k ad spend) publicly? NDA exists with them (Sep 2025).
6. **Contact details:** show email only (`gane2506@gmail.com` or a domain address?). No phone or street address on the public site.
7. Sites ganeshunnam.com / rdpvsolutions.ca are blocked from direct fetch here, so I pulled them through a scraper. Preview images will be re-downloaded at build time from your current site or uploaded by you.
