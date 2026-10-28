// Design system components as HTML string templates.
// Same markup and class names as the design system's React bundle (window.GU), so components.css styles
// them unchanged, but rendered at build time: no framework ships to the browser. Behaviour lives in src/modules.
import { ICONS, GLYPHS } from './glyphs.js';

export const esc = (s = '') =>
  String(s).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );
const cx = (...c) => c.filter(Boolean).join(' ');
const attrs = (o) =>
  Object.entries(o)
    .filter(([, v]) => v !== null && v !== undefined && v !== false)
    .map(([k, v]) => (v === true ? ` ${k}` : ` ${k}="${esc(v)}"`))
    .join('');
const isExternal = (href = '') => /^https?:\/\//.test(href);

export function Icon({ name, label, className, size }) {
  return `<svg${attrs({
    class: cx('gu-icon', className),
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': 1.5,
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'aria-hidden': label ? null : 'true',
    role: label ? 'img' : null,
    'aria-label': label,
    style: size ? `width:${size}px;height:${size}px` : null,
  })}>${ICONS[name] || ''}</svg>`;
}

export function Logo({ variant = 'mark', className } = {}) {
  const v = variant === 'wordmark' ? GLYPHS.word : GLYPHS.mark;
  return `<span class="${cx('gu-logo', className)}"><svg viewBox="${v.box}" role="img" aria-label="Ganesh Unnam"><path fill="currentColor" d="${v.d}"/><circle class="gu-logo-dot" cx="${v.cx}" cy="${v.cy}" r="${v.r}"/></svg></span>`;
}

export function Button({
  label,
  variant = 'solid',
  size = 'm',
  icon,
  iconEnd,
  href,
  className,
  magnetic = true,
  cursor,
  attrs: extra = {},
}) {
  const end = iconEnd || (variant === 'text' ? 'arrow-right' : null);
  const kids = [
    icon ? Icon({ name: icon }) : '',
    `<span class="gu-btn-label">${esc(label)}</span>`,
    end ? Icon({ name: end, className: end === 'arrow-up-right' ? 'gu-icon-diag' : 'gu-icon-end' }) : '',
  ].join('');
  const a = {
    class: cx('gu-btn', `gu-btn-${variant}`, `gu-btn-${size}`, className),
    'data-magnetic': magnetic && variant !== 'text' ? '' : null,
    'data-cursor': cursor,
    ...extra,
  };
  if (href) {
    const ext = isExternal(href);
    return `<a${attrs({ ...a, href, target: ext ? '_blank' : null, rel: ext ? 'noopener' : null })}>${kids}</a>`;
  }
  return `<button${attrs({ ...a, type: 'button' })}>${kids}</button>`;
}

export function IconButton({ icon, label, variant, href, className, magnetic, attrs: extra = {} }) {
  const tag = href ? 'a' : 'button';
  const ext = isExternal(href);
  return `<${tag}${attrs({
    href,
    type: href ? null : 'button',
    target: ext ? '_blank' : null,
    rel: ext ? 'noopener' : null,
    class: cx('gu-iconbtn', variant && `gu-iconbtn-${variant}`, className),
    'aria-label': label,
    title: label,
    'data-magnetic': magnetic ? '0.4' : null,
    ...extra,
  })}>${Icon({ name: icon })}</${tag}>`;
}

// aria-checked is corrected on load by the theme module, so the static default doesn't matter.
export function ThemeToggle() {
  return `<button type="button" role="switch" aria-checked="false" aria-label="Light theme" class="gu-toggle" data-theme-toggle><span class="gu-toggle-thumb" aria-hidden="true"></span><span class="gu-toggle-ico gu-toggle-moon">${Icon({ name: 'moon' })}</span><span class="gu-toggle-ico gu-toggle-sun">${Icon({ name: 'sun' })}</span></button>`;
}

export const NAV = [
  { label: 'About', href: '/#about' },
  { label: 'Services', href: '/#capabilities' },
  { label: 'Work', href: '/#work' },
  { label: 'Experience', href: '/#experience' },
  { label: 'Case studies', href: '/casestudy/' },
];
const navHref = (href, onHome) => (onHome && href.startsWith('/#') ? href.slice(1) : href);

export function Header({ active, onHome = false } = {}) {
  return `<header class="gu-header" data-state="top" data-header>
  <a href="/" aria-label="Home" class="gu-focusable gu-header-home" data-transition>${Logo({ variant: 'mark' })}</a>
  <nav class="gu-header-nav" aria-label="Primary"><ul class="gu-nav">${NAV.map(
    (n) =>
      `<li><a href="${navHref(n.href, onHome)}" class="gu-navlink"${n.label === active ? ' aria-current="page"' : ''}${n.href.startsWith('/#') && onHome ? '' : ' data-transition'}>${n.label}</a></li>`,
  ).join('')}</ul></nav>
  <div class="gu-header-tools">${ThemeToggle()}${Button({ label: 'Start a project', size: 's', iconEnd: 'arrow-up-right', href: onHome ? '#contact' : '/#contact', className: 'gu-header-cta' })}${IconButton({ icon: 'menu', label: 'Open menu', variant: 'quiet', className: 'gu-header-menu', attrs: { 'aria-expanded': 'false', 'aria-controls': 'mmenu', 'data-menu-open': '' } })}</div>
</header>`;
}

export function MobileMenu({ onHome = false } = {}) {
  const items = [...NAV, { label: 'Contact', href: '/#contact' }];
  return `<div class="gu-mmenu" id="mmenu" role="dialog" aria-modal="true" aria-label="Menu" hidden data-menu>
  <div class="gu-mmenu-top">${Logo()}${IconButton({ icon: 'close', label: 'Close menu', attrs: { 'data-menu-close': '' } })}</div>
  <ul class="gu-mmenu-links">${items
    .map(
      (n, i) =>
        `<li><a href="${navHref(n.href, onHome)}" style="animation-delay:${120 + i * 60}ms" data-menu-link><span>0${i + 1}</span>${n.label}</a></li>`,
    )
    .join('')}</ul>
  <div class="gu-mmenu-foot">${Button({ label: 'Start a project', size: 'l', iconEnd: 'arrow-up-right', href: onHome ? '#contact' : '/#contact', attrs: { 'data-menu-link': '' } })}<div style="display:flex;justify-content:space-between;align-items:center"><span class="gu-meta">Toronto, Canada</span>${ThemeToggle()}</div></div>
</div>`;
}

export function CopyEmail({ email }) {
  return `<span style="position:relative;display:inline-flex"><button type="button" class="gu-copy" data-copy="${esc(email)}" data-cursor="Copy" aria-label="Copy email address ${esc(email)}">${esc(email)}${Icon({ name: 'copy' })}</button><span role="status" aria-live="polite" class="gu-sr" data-copy-status></span></span>`;
}

export function Footer({ email, github, onHome = false }) {
  return `<footer class="gu-footer">
  <div class="gu-footer-row">
    <h2 class="gu-footer-big" data-split>Let’s build<br>something <em>fast.</em></h2>
    ${Button({ label: 'Start a project', size: 'l', iconEnd: 'arrow-up-right', href: `mailto:${email}`, cursor: 'Say hi' })}
  </div>
  <div class="gu-footer-row">
    <div style="display:grid;gap:8px"><span class="gu-meta">Email</span>${CopyEmail({ email })}</div>
    <nav class="gu-footer-map" aria-label="Footer">
      <ul>${NAV.map((n) => `<li><a href="${navHref(n.href, onHome)}" class="gu-navlink">${n.label}</a></li>`).join('')}</ul>
      <ul><li><a href="/privacy/" class="gu-navlink" data-transition>Privacy</a></li><li><a href="https://rdpvsolutions.ca/" class="gu-navlink" rel="noopener">RDPV Solutions</a></li></ul>
    </nav>
  </div>
  <div class="gu-footer-base">
    <span class="gu-meta">© <span data-year>2026</span> Ganesh Unnam · Toronto</span>
    <div class="gu-socials">${IconButton({ icon: 'github', label: 'GitHub', href: github })}${IconButton({ icon: 'mail', label: 'Email', href: `mailto:${email}` })}</div>
    <div style="display:flex;gap:8px;align-items:center">${ThemeToggle()}${IconButton({ icon: 'arrow-up', label: 'Back to top', variant: 'solid', attrs: { 'data-top': '' } })}</div>
  </div>
</footer>`;
}

export function Tag({ label, hue, dot }) {
  return `<span class="gu-tag"${hue ? ` data-hue="${hue}"` : ''}>${dot ? '<span class="gu-tag-dot" aria-hidden="true"></span>' : ''}${esc(label)}</span>`;
}

export function SectionHeader({ index, eyebrow, title, lead, level = 2, id }) {
  return `<div class="gu-sh">
  <div class="gu-sh-top"><span class="gu-sh-idx">${esc(index)} /</span><span class="gu-meta">${esc(eyebrow)}</span><span class="gu-sh-rule" aria-hidden="true"></span></div>
  <h${level} class="gu-sh-title"${id ? ` id="${id}"` : ''} data-split>${title}</h${level}>
  ${lead ? `<p class="gu-sh-lead" data-rise>${esc(lead)}</p>` : ''}
</div>`;
}

// ---- generated art: same seeded drawings as the design system (no stock imagery) ----
function rng(seed) {
  let s = seed >>> 0 || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
// The drawings are thousands of dots, so each one is a cached file (/art/<kind>-<seed>.svg) applied as a CSS
// mask: it still takes the card's tint through currentColor, without weighing down the HTML.
export const ART_KINDS = ['orbit', 'grid', 'stack', 'helix', 'ribbon', 'cloud', 'constellation'];
export const usedArt = new Set();
export function GenArt({ kind = 'orbit', seed = 7 } = {}) {
  const k = ART_KINDS.includes(kind) ? kind : 'orbit';
  const file = `${k}-${seed || 7}.svg`;
  usedArt.add(file);
  return `<i class="gu-art" style="--art:url(/art/${file})" aria-hidden="true"></i>`;
}
export function genArtSvg(file) {
  const m = /^([a-z]+)-(\d+)\.svg$/.exec(file);
  if (!m || !ART_KINDS.includes(m[1])) return null;
  const kind = m[1];
  const seed = Number(m[2]);
  const R = rng(seed);
  const el = [];
  const dot = (x, y, r, o) =>
    el.push(
      `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(2)}" fill="currentColor" opacity="${o.toFixed(2)}"/>`,
    );
  let i;
  if (kind === 'orbit') {
    for (i = 0; i < 3; i++)
      el.push(
        `<ellipse cx="200" cy="150" rx="${150 - i * 34}" ry="${54 - i * 8}" transform="rotate(${-18 + i * 22} 200 150)" fill="none" stroke="currentColor" stroke-opacity=".35" stroke-width="1"/>`,
      );
    for (i = 0; i < 260; i++) {
      const a = R() * Math.PI * 2;
      const rr = Math.pow(R(), 0.5) * 34;
      dot(200 + Math.cos(a) * rr, 150 + Math.sin(a) * rr, 0.8 + R() * 1.6, 0.4 + R() * 0.6);
    }
    [
      [60, 110],
      [330, 120],
      [120, 220],
      [300, 205],
    ].forEach((n) => dot(n[0], n[1], 6, 1));
  } else if (kind === 'grid') {
    for (let gx = 0; gx < 26; gx++)
      for (let gy = 0; gy < 16; gy++) {
        const z = Math.sin(gx * 0.45 + gy * 0.3) * 0.5 + 0.5;
        dot(20 + gx * 14.4, 40 + gy * 14 + Math.sin(gx * 0.5) * 16, 0.6 + z * 1.8, 0.25 + z * 0.75);
      }
  } else if (kind === 'stack') {
    [
      [140, 214, 64],
      [244, 196, 54],
      [196, 128, 58],
    ].forEach((c) => {
      const a = c[2];
      const T = [c[0], c[1] - a];
      const Rv = [c[0] + 0.866 * a, c[1] - 0.5 * a];
      const B = [c[0], c[1]];
      const L = [c[0] - 0.866 * a, c[1] - 0.5 * a];
      const pts = (q) => q.map((v) => `${v[0].toFixed(1)},${v[1].toFixed(1)}`).join(' ');
      const poly = (q, fo) =>
        el.push(
          `<polygon points="${pts(q)}" fill="${fo ? 'currentColor' : 'none'}"${fo ? ` fill-opacity="${fo}"` : ''} stroke="currentColor" stroke-opacity="${fo ? 0.5 : 0.6}" stroke-width="1" stroke-linejoin="round"/>`,
        );
      poly([L, B, [B[0], B[1] + a], [L[0], L[1] + a]], 0.18);
      poly([B, Rv, [Rv[0], Rv[1] + a], [B[0], B[1] + a]], 0.32);
      poly([T, Rv, B, L], 0);
      for (let gx = 1; gx < 8; gx++)
        for (let gy = 1; gy < 8; gy++) {
          const u = gx / 8;
          const v = gy / 8;
          dot(
            T[0] + u * (Rv[0] - T[0]) + v * (L[0] - T[0]),
            T[1] + u * (Rv[1] - T[1]) + v * (L[1] - T[1]),
            1.3,
            0.9,
          );
        }
    });
  } else if (kind === 'helix') {
    for (i = 0; i < 360; i++) {
      const t = i / 360;
      const ang = t * Math.PI * 6;
      const sd = i % 2 ? Math.PI : 0;
      const d = (Math.cos(ang + sd) + 1) / 2;
      dot(80 + t * 240, 250 - t * 200 + Math.sin(ang + sd) * (20 + t * 30), 0.8 + d * 2, 0.25 + d * 0.75);
    }
  } else if (kind === 'ribbon') {
    for (i = 0; i < 520; i++) {
      const t = R() * Math.PI * 2;
      const w = (R() - 0.5) * 26;
      const sx = Math.sin(t);
      const c = Math.cos(t);
      const den = 1 + sx * sx;
      dot(200 + (150 * c) / den + w * 0.3, 150 + (90 * sx * c) / den + w, 0.7 + R() * 1.3, 0.3 + R() * 0.7);
    }
  } else if (kind === 'cloud') {
    [
      [170, 160, 60],
      [230, 140, 70],
      [270, 175, 45],
      [130, 180, 40],
    ].forEach((b) => {
      for (i = 0; i < 140; i++) {
        const a = R() * 6.283;
        const r = Math.sqrt(-2 * Math.log(R() + 1e-6)) * b[2] * 0.45;
        dot(b[0] + Math.cos(a) * r, b[1] + Math.sin(a) * r * 0.7, 0.7 + R() * 1.4, 0.2 + R() * 0.7);
      }
    });
  } else {
    const pts = [];
    for (i = 0; i < 90; i++) pts.push([20 + R() * 360, 20 + R() * 260]);
    for (i = 0; i < 28; i++)
      el.push(
        `<line x1="${pts[i][0].toFixed(1)}" y1="${pts[i][1].toFixed(1)}" x2="${pts[i + 1][0].toFixed(1)}" y2="${pts[i + 1][1].toFixed(1)}" stroke="currentColor" stroke-opacity=".25"/>`,
      );
    pts.forEach((q) => dot(q[0], q[1], 1 + R() * 2.4, 0.4 + R() * 0.6));
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">${el.join('')}</svg>`;
}

export function ProjectCard({ title, type, year, hue = '3', art, seed, tags, href, size, speed }) {
  const ext = isExternal(href);
  return `<a${attrs({
    href: href || '#',
    class: 'gu-pcard',
    'data-tint': hue,
    'data-size': size,
    'data-cursor': ext ? 'Visit ↗' : 'View',
    'data-speed': speed,
    target: ext ? '_blank' : null,
    rel: ext ? 'noopener' : null,
    'data-transition': ext ? null : '',
  })}>
  <div class="gu-pcard-art">${GenArt({ kind: art, seed })}</div>
  <div class="gu-pcard-body">
    <div class="gu-pcard-top"><span class="gu-meta">${esc(type)} · ${esc(year)}</span><span class="gu-pcard-go" aria-hidden="true">${Icon({ name: 'arrow-up-right' })}</span></div>
    <h3 class="gu-pcard-title">${esc(title)}</h3>
    ${tags ? `<div class="gu-pcard-tags">${tags.map((t) => Tag({ label: t })).join('')}</div>` : ''}
  </div>
</a>`;
}

export function CaseStudyCard({ title, summary, client, year, hue = '3', art, seed, href, level = 3 }) {
  return `<a href="${esc(href || '#')}" class="gu-cscard" data-tint="${hue}" data-cursor="Read" data-transition>
  <div class="gu-cscard-thumb">${GenArt({ kind: art, seed })}</div>
  <div><h${level} class="gu-cscard-title">${esc(title)}</h${level}><p class="gu-cscard-sum">${esc(summary)}</p></div>
  <div class="gu-cscard-meta"><span class="gu-meta">${esc(client)}</span><span class="gu-meta">${esc(year)}</span></div>
</a>`;
}

// The final value is in the HTML; the count-up module animates from 0 only when motion is allowed.
export function StatTile({ value, suffix = '', label }) {
  // the design system put aria-label on a plain div (not allowed); a visually hidden copy carries the value instead
  return `<div class="gu-stat"><div class="gu-stat-num"><span class="gu-sr">${value}${esc(suffix)}</span><span aria-hidden="true" data-count="${value}">${value}</span>${suffix ? `<sup aria-hidden="true">${esc(suffix)}</sup>` : ''}</div><div class="gu-stat-label">${esc(label)}</div></div>`;
}

export function MetricBlock({ value, label, delta, hue }) {
  return `<div class="gu-metric"${hue ? ` data-tint="${hue}"` : ''}><div class="gu-metric-val">${esc(value)}</div>${delta ? `<div class="gu-metric-delta">${Icon({ name: 'arrow-up-right' })}${esc(delta)}</div>` : ''}<div class="gu-metric-label">${esc(label)}</div></div>`;
}

export function CapabilityRow({ index, icon, title, body, tags, shape }) {
  return `<div class="gu-cap" tabindex="0" data-shape="${shape}"><span class="gu-cap-idx gu-meta">${index}</span><span class="gu-cap-ico" aria-hidden="true">${Icon({ name: icon })}</span><h3 class="gu-cap-title">${esc(title)}</h3><div><p class="gu-cap-body">${esc(body)}</p>${tags ? `<div class="gu-cap-tags">${tags.map((t) => Tag({ label: t })).join('')}</div>` : ''}</div></div>`;
}

export function TimelineItem({ years, role, org, body, current }) {
  return `<div class="gu-tl" data-current="${current ? 'true' : 'false'}" data-rise><div class="gu-tl-when gu-meta">${esc(years)}</div><div class="gu-tl-rail" aria-hidden="true"><span class="gu-tl-dot"></span></div><div class="gu-tl-body"><h3 class="gu-tl-role">${esc(role)}</h3><p class="gu-tl-org">${esc(org)}${current ? ' · now' : ''}</p>${body ? `<p class="gu-tl-text">${esc(body)}</p>` : ''}</div></div>`;
}

export function FactsBar({ items }) {
  return `<dl class="gu-facts">${items.map(([k, v]) => `<div><dt class="gu-meta">${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>`;
}

export function CaseStudyHero({ type, year, hue = '3', title, lead, facts, art, seed }) {
  return `<section class="gu-cshero" data-tint="${hue}">
  <div class="gu-cshero-top">${Tag({ label: type, hue, dot: true })}<span class="gu-meta">${esc(year)}</span></div>
  <h1 class="gu-cshero-title" data-split>${esc(title)}</h1>
  <p class="gu-cshero-lead" data-rise>${esc(lead)}</p>
  ${facts ? FactsBar({ items: facts }) : ''}
  <div class="gu-cshero-media">${GenArt({ kind: art || 'orbit', seed })}</div>
</section>`;
}

export function NextCaseStudy({ title, hue = '3', href }) {
  return `<a href="${esc(href)}" class="gu-next" data-tint="${hue}" data-cursor="Next" data-transition><span class="gu-meta">Next case study</span><h2 class="gu-next-title">${esc(title)}${Icon({ name: 'arrow-right' })}</h2></a>`;
}

export function Marquee({ items }) {
  const row = (hidden) =>
    items
      .map(
        (t) => `<span class="gu-marquee-item"${hidden ? ' aria-hidden="true"' : ''}>${esc(t)}<i></i></span>`,
      )
      .join('');
  return `<div class="gu-marquee" role="marquee" aria-label="${esc(items.join(', '))}"><div class="gu-marquee-track" data-marquee>${row(false)}${row(true)}</div></div>`;
}

export const ScrollIndicator = () =>
  `<div class="gu-scroll" aria-hidden="true"><span class="gu-meta">Scroll</span><span class="gu-scroll-line"></span></div>`;

export const SkipLink = () => `<a class="gu-skip" href="#main">Skip to content</a>`;

export function BackLink({ label = 'All case studies', href = '/casestudy/', trail }) {
  return `<nav class="gu-crumbs" aria-label="Breadcrumb"><a class="gu-back" href="${esc(href)}" data-transition>${Icon({ name: 'arrow-right', className: 'gu-back-ico' })}${esc(label)}</a>${
    trail
      ? `<ol>${trail.map((t, i) => (i === trail.length - 1 ? `<li><span aria-current="page">${esc(t.label)}</span></li>` : `<li><a href="${esc(t.href)}" data-transition>${esc(t.label)}</a></li>`)).join('')}</ol>`
      : ''
  }</nav>`;
}

export function StackList({ groups }) {
  return `<div class="gu-stack">${groups
    .map(
      (g, i) =>
        `<div class="gu-stack-row" data-rise><span class="gu-stack-idx gu-meta">${String(i + 1).padStart(2, '0')}</span><h3 class="gu-stack-title">${esc(g.title)}</h3><ul class="gu-stack-items">${g.items.map((t) => `<li>${Tag({ label: t })}</li>`).join('')}</ul></div>`,
    )
    .join('')}</div>`;
}

// Every phase panel is in the HTML (readable without JS); the lifecycle module turns them into tabs.
export function Lifecycle({ phases }) {
  const n = phases.length;
  const tabs = phases
    .map(
      (x, i) =>
        `<button role="tab" type="button" id="life-tab-${i}" aria-selected="${i === 0}" aria-controls="life-panel-${i}" tabindex="${i === 0 ? 0 : -1}" class="gu-life-tab" data-shape="${x.shape}"><span class="gu-life-num">0${i + 1}</span><span class="gu-life-name">${esc(x.title)}</span><span class="gu-life-verb gu-meta">${esc(x.verb)}</span></button>`,
    )
    .join('');
  const panels = phases
    .map(
      (
        ph,
        i,
      ) => `<div class="gu-life-panel" role="tabpanel" id="life-panel-${i}" aria-labelledby="life-tab-${i}"${i ? ' hidden' : ''}>
    <p class="gu-life-kicker gu-meta">Phase 0${i + 1} / 0${n}</p>
    <h3 class="gu-life-title">${esc(ph.headline || ph.title)}</h3>
    <p class="gu-life-body">${esc(ph.body)}</p>
    <div class="gu-life-cols">
      <div><p class="gu-meta">You get</p><ul class="gu-life-list">${ph.deliverables.map((d) => `<li>${Icon({ name: 'check' })}${esc(d)}</li>`).join('')}</ul></div>
      ${ph.example ? `<div class="gu-life-example"><p class="gu-meta">From real work</p><p>${esc(ph.example)}</p></div>` : ''}
    </div>
  </div>`,
    )
    .join('');
  return `<div class="gu-life" data-lifecycle>
  <div class="gu-life-rail" role="tablist" aria-label="Product lifecycle" aria-orientation="vertical">${tabs}<span class="gu-life-bar" aria-hidden="true"><i style="transform:scaleY(${1 / n})"></i></span></div>
  ${panels}
</div>`;
}

export function ArchitectureDiagram({ id = 'arch', nodes, edges, lanes = [], hue, title, caption }) {
  const W = 184;
  const H = 76;
  const GX = 52;
  const GY = 64;
  const pad = 16;
  const cols = 1 + Math.max(...nodes.map((n) => n.col));
  const rows = 1 + Math.max(...nodes.map((n) => n.row));
  const VW = pad * 2 + cols * W + (cols - 1) * GX;
  const VH = pad * 2 + rows * H + (rows - 1) * GY + 24;
  const pos = {};
  nodes.forEach((n) => (pos[n.id] = { x: pad + n.col * (W + GX), y: pad + 24 + n.row * (H + GY), n }));
  const paths = edges
    .map((e, i) => {
      const a = pos[e[0]];
      const b = pos[e[1]];
      if (!a || !b) return '';
      let d;
      if (a.n.row === b.n.row) {
        const x1 = a.x + W;
        const y1 = a.y + H / 2;
        const x2 = b.x;
        const y2 = b.y + H / 2;
        d = `M${x1} ${y1} C${x1 + GX / 2} ${y1} ${x2 - GX / 2} ${y2} ${x2} ${y2}`;
      } else {
        const sx = a.x + W / 2;
        const sy = a.y + (b.y > a.y ? H : 0);
        const ex = b.x + W / 2;
        const ey = b.y + (b.y > a.y ? 0 : H);
        const my = (sy + ey) / 2;
        d = `M${sx} ${sy} C${sx} ${my} ${ex} ${my} ${ex} ${ey}`;
      }
      const pid = `${id}-p${i}`;
      return `<g class="gu-arch-edge" data-from="${e[0]}" data-to="${e[1]}"><path id="${pid}" d="${d}" fill="none" marker-end="url(#${id}-arrow)"/>${
        e[2]
          ? `<text class="gu-arch-elabel" dy="-6"><textPath href="#${pid}" startOffset="50%" text-anchor="middle">${esc(e[2])}</textPath></text>`
          : ''
      }<circle r="3.5" class="gu-arch-pulse" data-pulse><animateMotion dur="${(2.4 + (i % 3) * 0.3).toFixed(1)}s" begin="-${(i * 0.35).toFixed(2)}s" repeatCount="indefinite" rotate="auto"><mpath href="#${pid}"/></animateMotion></circle></g>`;
    })
    .join('');
  const laneEls = lanes
    .map((l, i) => `<text class="gu-arch-lane" x="${pad}" y="${pad + 12 + i * (H + GY)}">${esc(l)}</text>`)
    .join('');
  const boxes = nodes
    .map((n) => {
      const q = pos[n.id];
      return `<g class="${cx('gu-arch-node', n.accent && 'is-accent')}" data-node="${n.id}" transform="translate(${q.x} ${q.y})" tabindex="0" role="img" aria-label="${esc(n.label + (n.sub ? ', ' + n.sub : ''))}"><rect width="${W}" height="${H}" rx="14"/><text class="gu-arch-label" x="16" y="32">${esc(n.label)}</text>${
        n.sub ? `<text class="gu-arch-sub" x="16" y="54">${esc(n.sub)}</text>` : ''
      }</g>`;
    })
    .join('');
  return `<figure class="gu-arch"${hue ? ` data-tint="${hue}"` : ''} data-arch>
  <div class="gu-arch-scroll"><svg viewBox="0 0 ${VW} ${VH}" style="min-width:${Math.min(VW, 860)}px" role="group" aria-label="${esc(title || 'Architecture diagram')}"><defs><marker id="${id}-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 1 L9 5 L0 9" class="gu-arch-arrow"/></marker></defs>${laneEls}${paths}${boxes}</svg></div>
  ${caption ? `<figcaption>${esc(caption)}</figcaption>` : ''}
</figure>`;
}

export function ChangeLog({ entries }) {
  const TYPE = { added: 'Added', changed: 'Changed', fixed: 'Fixed', planned: 'Planned', decided: 'Decided' };
  return `<ol class="gu-log">${entries
    .map(
      (e) =>
        `<li class="gu-log-item" data-type="${e.type}"><div class="gu-log-when"><span class="gu-log-ver">${esc(e.version)}</span><span class="gu-meta">${esc(e.date)}</span></div><div class="gu-log-body"><span class="gu-log-type">${TYPE[e.type] || esc(e.type)}</span><h4 class="gu-log-title">${esc(e.title)}</h4>${
          e.items ? `<ul>${e.items.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>` : ''
        }</div></li>`,
    )
    .join('')}</ol>`;
}

export function Engagement({ when, title, body, includes, cta, featured, email }) {
  const subject = encodeURIComponent(`Project enquiry: ${title}`);
  return `<div class="${cx('gu-eng', featured && 'is-featured')}">
  <div class="gu-eng-top"><span class="gu-meta">${esc(when)}</span>${featured ? Tag({ label: 'Start here', hue: 'accent' }) : ''}</div>
  <h3 class="gu-eng-title">${esc(title)}</h3>
  <p class="gu-eng-body">${esc(body)}</p>
  <ul class="gu-life-list">${includes.map((d) => `<li>${Icon({ name: 'check' })}${esc(d)}</li>`).join('')}</ul>
  ${Button({ label: cta || 'Talk about this', variant: featured ? 'solid' : 'ghost', iconEnd: 'arrow-right', href: `mailto:${email}?subject=${subject}` })}
</div>`;
}

// A deep-dive card in the Engagement card's style: what I do, the checklist, and one line of proof from real work.
export function ExpertiseCard({ when, title, body, items, proof }) {
  return `<div class="gu-eng gu-expertise">
  <div class="gu-eng-top"><span class="gu-meta">${esc(when)}</span></div>
  <h3 class="gu-eng-title">${esc(title)}</h3>
  <p class="gu-eng-body">${esc(body)}</p>
  <ul class="gu-life-list">${items.map((d) => `<li>${Icon({ name: 'check' })}${esc(d)}</li>`).join('')}</ul>
  ${proof ? `<div class="gu-life-example"><p class="gu-meta">From real work</p><p>${esc(proof)}</p></div>` : ''}
</div>`;
}

export function Toast() {
  return `<div class="gu-toast" data-tone="success" role="status" hidden data-toast><span class="gu-toast-ico" aria-hidden="true">${Icon({ name: 'check' })}</span><span data-toast-text>Email copied</span></div>`;
}

export function EmptyState({ title, body }) {
  const pts = [
    [20, 50],
    [44, 22],
    [70, 40],
    [96, 16],
    [104, 56],
    [58, 62],
  ];
  return `<div class="gu-empty"><svg class="gu-empty-art" viewBox="0 0 120 72" aria-hidden="true">${pts
    .map(
      (q, i) =>
        `<g>${i ? `<line x1="${pts[i - 1][0]}" y1="${pts[i - 1][1]}" x2="${q[0]}" y2="${q[1]}" stroke="currentColor" stroke-opacity=".4" stroke-dasharray="2 4"/>` : ''}<circle cx="${q[0]}" cy="${q[1]}" r="3" fill="currentColor"/></g>`,
    )
    .join('')}</svg><h3>${esc(title)}</h3><p>${esc(body)}</p></div>`;
}
