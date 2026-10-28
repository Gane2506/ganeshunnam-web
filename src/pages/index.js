// Page bodies, rendered to static HTML at build time (vite.config.js and scripts/build-casestudies.mjs).
// Layout classes (pg-*) come from the design system's page.css; components from src/ui/components.js.
import * as G from '../ui/components.js';
import {
  SITE,
  HERO,
  MARQUEE,
  ABOUT,
  WORK,
  MORE_WORK,
  CAPABILITIES,
  EXPERTISE,
  BUILDS,
  TOOLKIT,
  EXPERIENCE,
  EDUCATION,
} from '../content/site.js';
import { PHASES, BEDROCK_ARCH, ENGAGEMENTS } from '../content/lifecycle.js';

const chrome = ({ active, onHome } = {}) => `${G.SkipLink()}
<div class="pg-header">${G.Header({ active, onHome })}</div>
${G.MobileMenu({ onHome })}`;

const sec = (id, body, cls = '') =>
  `<section class="pg-sec ${cls}" id="${id}" data-section="${id}">${body}</section>`;

const caseStudyCards = (posts, level = 3) =>
  posts.length
    ? posts
        .map((p) =>
          G.CaseStudyCard({
            title: p.title,
            summary: p.excerpt,
            client: p.client,
            year: p.year,
            hue: p.hue,
            art: p.art,
            seed: p.seed,
            href: `/casestudy/${p.slug}/`,
            level,
          }),
        )
        .join('')
    : G.EmptyState({ title: 'Nothing here yet', body: 'New case studies are on the way.' });

export function home({ caseStudies = [] } = {}) {
  return `${chrome({ onHome: true })}
<main id="main" tabindex="-1">
  <section class="pg-hero" data-section="hero">
    <div class="pg-wrap">
      <div class="pg-hero-meta gu-meta hero-in" style="--d:.45s">${SITE.role}</div>
      <h1 class="pg-hero-name"><span class="hero-line"><span>Ganesh</span></span> <span class="hero-line"><span>Unnam<em>.</em></span></span></h1>
      <div class="pg-hero-row">
        <p class="pg-hero-lead hero-in" style="--d:.6s">${HERO.lead}</p>
        <div class="pg-hero-ctas hero-in" style="--d:.7s">${G.Button({ label: 'Start a project', size: 'l', iconEnd: 'arrow-up-right', href: '#contact', cursor: 'Say hi' })}${G.Button({ label: 'See the work', size: 'l', variant: 'ghost', href: '#work', cursor: 'View' })}</div>
      </div>
      <nav class="pg-hero-services hero-in" style="--d:.8s" aria-label="What I do"><span class="gu-meta">What I do</span><ul>${HERO.services.map(([label, href]) => `<li><a href="${href}" class="gu-focusable">${label}</a></li>`).join('')}</ul></nav>
    </div>
  </section>
  ${G.Marquee({ items: MARQUEE })}
  ${sec(
    'about',
    `<div class="pg-wrap pg-grid pg-pin" data-pin>
      <div class="pg-about-text">
        <div class="pg-head">${G.SectionHeader({ index: '01', eyebrow: 'About', title: ABOUT.title })}</div>
        ${ABOUT.paragraphs.map((p) => `<p data-rise>${p}</p>`).join('')}
      </div>
      <div class="pg-stats">${ABOUT.stats.map(G.StatTile).join('')}</div>
    </div>`,
  )}
  ${sec(
    'capabilities',
    `<div class="pg-wrap">
      <div class="pg-head">${G.SectionHeader({ index: '02', eyebrow: 'Services', title: 'What I can take off your plate' })}</div>
      <div data-caps>${CAPABILITIES.map((c, i) => G.CapabilityRow({ ...c, index: `0${i + 1}` })).join('')}</div>
    </div>`,
  )}
  ${sec(
    'work',
    `<div class="pg-wrap pg-grid">
      <div class="pg-head" style="grid-column:1 / -1">${G.SectionHeader({ index: '03', eyebrow: 'Selected work', title: 'Stores, search, agents and the glue between them' })}</div>
      <div class="pg-bento">${WORK.map((w, i) => G.ProjectCard({ ...w, size: 'wide', speed: [0.94, 1.06, 1.04, 0.96, 0.95, 1.05][i] })).join('')}</div>
      <div class="pg-more-work">
        <p class="gu-meta">More shipped client work</p>
        <ul>${MORE_WORK.map(([n, k, u]) => `<li><a href="${u}" rel="noopener" target="_blank" class="gu-focusable">${n}<span class="gu-meta">${k}</span></a></li>`).join('')}</ul>
      </div>
    </div>`,
  )}
  ${sec(
    'search',
    `<div class="pg-wrap">
      <div class="pg-head">${G.SectionHeader({ index: '04', eyebrow: 'Search and WordPress', title: 'Found on Google, quoted by AI, built on WordPress', lead: 'Nine years of SEO and WordPress work, and the answer engine optimization that now sits on top of it.' })}</div>
      <div class="pg-eng">${EXPERTISE.map(G.ExpertiseCard).join('')}</div>
    </div>`,
  )}
  ${sec(
    'builds',
    `<div class="pg-wrap">
      <div class="pg-head">${G.SectionHeader({ index: '05', eyebrow: 'Automation and custom builds', title: 'Less manual work, and software that fits', lead: 'Workflows that connect the tools you already use, and custom applications for the jobs those tools can’t do.' })}</div>
      <div class="pg-eng">${BUILDS.map(G.ExpertiseCard).join('')}</div>
    </div>`,
  )}
  ${sec(
    'how',
    `<div class="pg-wrap pg-pin" data-life-pin>
      <div class="pg-how-head"><div class="pg-head">${G.SectionHeader({ index: '06', eyebrow: 'How I work', title: 'From the first call to the next release', lead: 'One person across the whole lifecycle, so nothing gets lost between scoping, building and keeping it running.' })}</div><div class="pg-field-how" aria-hidden="true"></div></div>
      ${G.Lifecycle({ phases: PHASES })}
    </div>`,
    'pg-how',
  )}
  ${sec(
    'featured',
    `<div class="pg-wrap">
      <div class="pg-head">${G.SectionHeader({ index: '07', eyebrow: 'Featured build', title: 'Scanned documents in, structured answers out', lead: 'An OCR and retrieval pipeline on Amazon Bedrock: Textract reads the pages, pgvector finds the right passages, and the model answers in fields an app can use.' })}</div>
      ${G.ArchitectureDiagram(BEDROCK_ARCH)}
    </div>`,
  )}
  ${sec(
    'toolkit',
    `<div class="pg-wrap">
      <div class="pg-head">${G.SectionHeader({ index: '08', eyebrow: 'Toolkit', title: 'What I build with' })}</div>
      ${G.StackList({ groups: TOOLKIT })}
    </div>`,
  )}
  ${sec(
    'experience',
    `<div class="pg-wrap pg-grid">
      <div class="pg-head" style="grid-column:1 / -1">${G.SectionHeader({ index: '09', eyebrow: 'Experience', title: 'Where I have done it' })}</div>
      <div class="pg-tl">${EXPERIENCE.map(G.TimelineItem).join('')}<p class="pg-edu gu-meta" data-rise>${EDUCATION}</p></div>
    </div>`,
  )}
  ${sec(
    'case-studies',
    `<div class="pg-wrap">
      <div class="pg-head">${G.SectionHeader({ index: '10', eyebrow: 'Case studies', title: 'How the work actually went' })}</div>
      ${caseStudyCards(caseStudies.slice(0, 5))}
      <div class="pg-more">${G.Button({ label: 'All case studies', variant: 'text', href: '/casestudy/', attrs: { 'data-transition': '' } })}</div>
    </div>`,
  )}
  ${sec(
    'engage',
    `<div class="pg-wrap">
      <div class="pg-head">${G.SectionHeader({ index: '11', eyebrow: 'Work together', title: 'Three ways to start' })}</div>
      <div class="pg-eng">${ENGAGEMENTS.map((e) => G.Engagement({ ...e, email: SITE.email })).join('')}</div>
    </div>`,
  )}
</main>
<section class="pg-contact" id="contact" data-section="contact">
  ${G.Footer({ email: SITE.email, github: SITE.github, onHome: true })}
</section>
${G.Toast()}`;
}

export function archive({ caseStudies = [] } = {}) {
  return `${chrome({ active: 'Case studies' })}
<main id="main" tabindex="-1" class="pg-cs-top">
  <section class="pg-sec" data-section="archive">
    <div class="pg-wrap">
      <div class="pg-head">${G.SectionHeader({ index: '01', eyebrow: 'Case studies', title: 'How the work actually went', lead: 'Problems, decisions, stacks and results from client and open-source work, phase by phase.', level: 1 })}</div>
      <div class="pg-archive">${caseStudyCards(caseStudies, 2)}</div>
    </div>
  </section>
</main>
${G.Footer({ email: SITE.email, github: SITE.github })}
${G.Toast()}`;
}

// A case study post: fields from WordPress (or the seed JSON), body HTML already sanitised and expanded.
export function caseStudy(p, next) {
  const facts = [
    ['Client', p.client],
    ['Year', p.year],
    ['Role', p.role],
    ['Stack', p.stack?.join(' · ')],
    ['Status', p.status],
  ].filter(([, v]) => v);
  const metrics = p.metrics?.length
    ? `<div class="pg-metrics">${p.metrics.map((m) => G.MetricBlock({ value: m.value, delta: m.delta, label: m.label, hue: p.hue })).join('')}</div>`
    : '';
  return `${chrome({ active: 'Case studies' })}
<main id="main" tabindex="-1">
  <div class="pg-cs-top pg-cs-hero" data-section="cs-hero">
    <div class="pg-wrap">
      ${G.BackLink({ trail: [{ label: 'Case studies', href: '/casestudy/' }, { label: p.type || 'Project' }, { label: p.short || p.title }] })}
      ${G.CaseStudyHero({ type: p.type || 'Project', year: p.year, hue: p.hue, art: p.art, seed: p.seed, title: p.title, lead: p.excerpt, facts })}
      ${p.liveUrl ? `<p class="pg-cs-live">${G.Button({ label: 'View project', variant: 'ghost', iconEnd: 'arrow-up-right', href: p.liveUrl })}</p>` : ''}
    </div>
  </div>
  <div class="pg-wrap" data-section="cs-body">
    ${metrics}
    <div class="pg-grid"><div class="pg-article"><div class="gu-prose" style="--tint:var(--hue-${p.hue})">${p.content}</div></div></div>
  </div>
  ${next ? G.NextCaseStudy({ title: next.title, hue: next.hue, href: `/casestudy/${next.slug}/` }) : ''}
</main>
${G.Footer({ email: SITE.email, github: SITE.github })}
${G.Toast()}`;
}

export function notFound() {
  return `${chrome()}
<main id="main" class="pg-404" data-section="notfound">
  <div class="gu-dots" aria-hidden="true"></div>
  <div class="pg-wrap">
    <h1 class="pg-404-num" data-split>404</h1>
    <p data-rise>This page fell apart. The rest of the site is still in one piece.</p>
    <div class="pg-404-ctas">${G.Button({ label: 'Back to home', iconEnd: 'arrow-right', href: '/', attrs: { 'data-transition': '' } })}${G.Button({ label: 'See the work', variant: 'ghost', href: '/#work', attrs: { 'data-transition': '' } })}</div>
  </div>
</main>`;
}

export function privacy() {
  return `${chrome()}
<main id="main" tabindex="-1" class="pg-cs-top" data-section="legal">
  <div class="pg-wrap pg-grid">
    <div class="pg-article">
      <div class="pg-head">${G.SectionHeader({ index: '—', eyebrow: 'Legal', title: 'Privacy', level: 1 })}</div>
      <div class="gu-prose">
        <p>This website uses no cookies, analytics or third-party trackers. Fonts, scripts and images are served from this domain.</p>
        <p>If you email me, I use your message and address only to reply and to deliver any work we agree on. I don’t sell or share it. Ask me at any time to delete our correspondence: <a href="mailto:${SITE.email}">${SITE.email}</a>.</p>
        <p>Your light or dark theme choice is saved in your browser’s local storage so the site remembers it. It never leaves your device.</p>
        <p>This policy follows Canada’s Personal Information Protection and Electronic Documents Act (PIPEDA).</p>
      </div>
    </div>
  </div>
</main>
${G.Footer({ email: SITE.email, github: SITE.github })}
${G.Toast()}`;
}
