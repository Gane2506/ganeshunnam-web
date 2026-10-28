// Everything the pages say, in one place. Copy follows the design system's copy deck; history comes from
// Ganesh's resume. Change words here, not in the page templates.
export const SITE = {
  url: 'https://ganeshunnam.com',
  name: 'Ganesh Unnam',
  title: 'Ganesh Unnam · Full stack engineer and product owner, Toronto',
  description:
    'I build custom products for businesses end to end: requirements, architecture, build, launch, maintenance and change. Toronto.',
  email: 'gane2506@gmail.com',
  github: 'https://github.com/Gane2506',
  role: 'Full stack engineer · Product owner · Toronto',
};

export const HERO = {
  lead: 'I build custom products for businesses, end to end: from the first requirements call to the architecture, the build, the launch and every change after it.',
};

export const MARQUEE = [
  'SEO',
  'AEO',
  'WooCommerce',
  'AI agents',
  'MCP servers',
  'Next.js',
  'React',
  'TypeScript',
  'Node.js',
  'Shopify',
  'WordPress',
  'Webflow',
  'Sanity',
  'Contentful',
  'n8n',
];

export const ABOUT = {
  title: 'One person who owns the whole product, not one slice of it',
  paragraphs: [
    'I started in web development and Shopify themes, moved into React, Next.js and TypeScript on WordPress, Webflow, Sanity and Contentful, worked across IT infrastructure and cloud, and now spend most of my time on <strong>AI agent systems</strong>: orchestration, retrieval and MCP servers that connect models to the tools a team already uses.',
    'Clients get one person from the first requirements call to the release after launch: I write the scope, design the system, build it, ship it and keep changing it as the business changes. AI is one of the things I build, not the whole story.',
  ],
  stats: [
    { value: 9, suffix: '+', label: 'years across web, cloud and automation' },
    { value: 6, label: 'lifecycle phases owned, from requirements to change management' },
    { value: 6, label: 'platforms: WordPress, Webflow, Shopify, WooCommerce, Sanity, Contentful' },
  ],
};

// hue: the project's one colour ("1"–"6"); art: the generated drawing; shape: its particle-field target
export const WORK = [
  {
    title: 'Document OCR and RAG on Amazon Bedrock',
    type: 'AI · Data',
    year: '2026',
    hue: '3',
    art: 'helix',
    tags: ['Bedrock', 'Textract', 'pgvector'],
    href: '/casestudy/document-ocr-rag-bedrock/',
  },
  {
    title: 'Sarah, a voice agent that answers and books calls',
    type: 'Voice agents · In build',
    year: '2026',
    hue: '1',
    art: 'ribbon',
    tags: ['Vapi', 'Twilio', 'Workers'],
    href: '/casestudy/sarah-voice-agent/',
  },
  {
    title: 'Baton, an orchestrator for coding agents',
    type: 'AI agents',
    year: '2026',
    hue: '4',
    art: 'orbit',
    tags: ['MCP', 'OpenRouter'],
    href: '/casestudy/baton-agent-orchestrator/',
  },
  {
    title: 'RDPV Solutions, headless WordPress on Next.js',
    type: 'Web',
    year: '2026',
    hue: '2',
    art: 'stack',
    tags: ['Next.js', 'WPGraphQL', 'Docker'],
    href: '/casestudy/rdpv-solutions-website/',
  },
  {
    title: 'talentsear.ch, x-ray search for recruiters',
    type: 'Web',
    year: '2026',
    hue: '5',
    art: 'grid',
    tags: ['Search', 'API'],
    href: '/casestudy/talentsearch/',
  },
  {
    title: 'floorstoday.ca, a headless storefront site',
    type: 'Web',
    year: '2026',
    hue: '6',
    art: 'constellation',
    seed: 4,
    tags: ['Headless', 'Next.js'],
    href: 'https://floorstoday.ca/',
  },
];

// Client sites from ganeshunnam.com, shown as a compact list under the bento
export const MORE_WORK = [
  ['Flooring Liquidators', 'WooCommerce', 'https://flooringliquidators.ca/'],
  ['Vinyl Sound', 'Shopify', 'https://vinylsound.ca/'],
  ['A1 Mississauga Auto', 'Automotive', 'https://a1mississaugaauto.com/'],
  ['Reno Liquidators', 'E-commerce', 'https://renoliquidators.ca/'],
  ['TV Parts Canada', 'WooCommerce', 'https://tvpartscanada.ca/'],
  ['Installmart', 'Shopify', 'https://installmart.ca/'],
  ['NAS Solutions', 'Technology', 'https://nassolutions.ca/'],
  ['Bound India', 'Website', 'https://www.boundindia.com/'],
  ['Willow International', 'Website', 'https://willowinter.com/'],
  ['Godavari Abroad', 'Website', 'https://godavariabroad.com/'],
  ['Informed Technologies', 'Website', 'https://informed-tech.com/'],
  ['Protech Industries', 'Website', 'https://protechindustries.com/'],
  ['Equisential', 'WooCommerce', 'https://equisential.in/'],
  ['Cheshire Clear Vision', 'Healthcare', 'https://cheshireclearvision.com/'],
  ['Dr. Priti Challa', 'Healthcare', 'https://drpritichalla.com/'],
  ['Padma Skin Clinic', 'Healthcare', 'https://padmaskinclinic.com/'],
];

export const CAPABILITIES = [
  {
    icon: 'ai-agents',
    shape: 'agents',
    title: 'AI and voice agents',
    body: 'Voice agents that answer, qualify and book calls, document pipelines that read and retrieve on Amazon Bedrock, and MCP servers that connect models to your tools.',
    tags: ['Vapi', 'Twilio', 'Bedrock', 'Textract', 'MCP'],
  },
  {
    icon: 'web',
    shape: 'web',
    title: 'Websites and custom apps',
    body: 'Next.js and React front ends in TypeScript on WordPress, Webflow, Sanity or Contentful, and custom web applications with their own APIs and data when off-the-shelf software doesn’t fit.',
    tags: ['Next.js', 'React', 'TypeScript', 'Webflow', 'Sanity', 'Contentful'],
  },
  {
    icon: 'ecommerce',
    shape: 'commerce',
    title: 'E-commerce',
    body: 'WooCommerce and Shopify stores: large catalogues, clean product data, checkout fixes, and the speed and search work that turns visits into orders.',
    tags: ['WooCommerce', 'Shopify', 'Liquid', 'Klaviyo'],
  },
  {
    icon: 'seo-growth',
    shape: 'seo',
    title: 'SEO and AEO',
    body: 'Technical, on-page and local SEO, plus structured data and answer-ready content, so search engines rank you and AI answers quote you.',
    tags: ['Ahrefs', 'Screaming Frog', 'Schema', 'GA4'],
  },
  {
    icon: 'automation',
    shape: 'automation',
    title: 'Automation and integrations',
    body: 'n8n workflows, webhooks and small Node.js services that connect your CRM, store, inbox and phones, so data moves on its own and people only step in where a decision matters.',
    tags: ['n8n', 'Node.js', 'Webhooks', 'Twilio'],
  },
  {
    icon: 'cloud-devops',
    shape: 'cloud',
    title: 'Cloud and hosting',
    body: 'Sensible hosting, deploys and monitoring for the things above.',
    tags: ['AWS', 'GCP', 'Docker', 'GitHub Actions'],
  },
];

// Detail cards for the "Automation and custom builds" section; same shape as EXPERTISE.
export const BUILDS = [
  {
    when: 'Workflows and integrations',
    title: 'Automation',
    body: 'Workflows that move data between the tools a business already pays for, with a person kept in the loop wherever a decision matters.',
    items: [
      'n8n workflows and API integrations, self-hosted or in the cloud',
      'CRM, lead routing and data sync between forms, inboxes and sales tools',
      'Inventory, order and email workflows for online stores, including Klaviyo flows',
      'Call handling: voice agents that qualify, book and text back through Twilio',
      'Document intake: OCR on Amazon Textract, then structured fields into the next system',
      'Build and content pipelines: GitHub Actions tests and deploys on every change',
    ],
    proof:
      'At Flooring Liquidators, one CRM and review process runs across 15 locations’ Google Business Profiles. On this site, publishing a case study in WordPress rebuilds and deploys it in about two minutes.',
  },
  {
    when: 'Built to spec',
    title: 'Custom applications',
    body: 'When off-the-shelf software doesn’t fit the work, I build the application: scoped with the people who will use it, then shipped and maintained.',
    items: [
      'Web apps and dashboards in React, Next.js, TypeScript and Vue.js',
      'APIs and services in Node.js, Python and FastAPI, over REST or GraphQL',
      'Data in Postgres with pgvector, MySQL, MongoDB, Supabase and Firebase',
      'Edge apps on Cloudflare Workers and D1; containers on Docker and AWS',
      'LLM features: retrieval, multi-agent workflows and MCP servers',
      'Custom WordPress plugins and headless storefronts',
    ],
    proof:
      'Baton, a CLI and web dashboard that takes coding agents from plan to merged code; Sarah, a voice agent on Workers and D1; the Bedrock document pipeline; and talentsear.ch.',
  },
];

export const TOOLKIT = [
  {
    title: 'AI and agents',
    items: [
      'Claude Code',
      'Codex',
      'Cursor',
      'MCP',
      'OpenRouter',
      'LangChain',
      'RAG',
      'Amazon Bedrock',
      'Textract',
    ],
  },
  { title: 'Voice agents', items: ['Vapi', 'Twilio', 'Call qualification', 'Booking flows', 'SMS'] },
  {
    title: 'WordPress and WooCommerce',
    items: [
      'WordPress',
      'WooCommerce',
      'Custom themes and plugins',
      'ACF',
      'Custom post types',
      'Elementor',
      'Divi',
      'WPBakery',
      'WPGraphQL',
    ],
  },
  {
    title: 'SEO and AEO',
    items: [
      'Ahrefs',
      'SEMrush',
      'Screaming Frog',
      'Moz',
      'Google Search Console',
      'Rank Math',
      'Yoast SEO',
      'Schema.org JSON-LD',
      'Google Business Profile',
    ],
  },
  {
    title: 'Analytics and growth',
    items: ['GA4', 'Google Tag Manager', 'Google Ads', 'Meta Ads', 'Google Shopping', 'Klaviyo'],
  },
  {
    title: 'Front end',
    items: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Vue.js', 'Three.js', 'GSAP', 'Lenis', 'Vite'],
  },
  {
    title: 'Back end and data',
    items: [
      'Node.js',
      'Python',
      'FastAPI',
      'PHP',
      'GraphQL',
      'REST APIs',
      'Postgres and pgvector',
      'MySQL',
      'MongoDB',
      'Supabase',
      'Firebase',
    ],
  },
  {
    title: 'Automation and integrations',
    items: ['n8n', 'Webhooks', 'Twilio', 'Klaviyo flows', 'CRM sync', 'Scheduled jobs', 'GitHub Actions'],
  },
  { title: 'Other platforms', items: ['Shopify', 'Liquid', 'Webflow', 'Sanity', 'Contentful'] },
  {
    title: 'Cloud and delivery',
    items: [
      'AWS',
      'GCP',
      'DigitalOcean',
      'Cloudflare Workers',
      'D1',
      'Docker',
      'Kubernetes',
      'GitHub Actions',
    ],
  },
];

// The SEO, AEO and WordPress deep dive. "proof" lines are facts from real work only.
export const EXPERTISE = [
  {
    when: 'Since 2017',
    title: 'SEO',
    body: 'Technical, on-page and local SEO for online stores, service businesses and my own niche sites.',
    items: [
      'Technical audits with Screaming Frog and Search Console: crawl errors, redirects, canonicals, indexation and Core Web Vitals',
      'Programmatic SEO templates for large catalogues, so thousands of product and category pages get indexed',
      'Keyword research in Ahrefs and SEMrush, page titles, internal links and content briefs',
      'Local SEO for multi-location businesses: Google Business Profiles, reviews and location pages',
      'Link-building strategy for difficult keywords',
      'GA4 and Google Tag Manager tracking, so every change is measured',
    ],
    proof:
      'At Premier Electronic Parts, programmatic SEO across three WooCommerce stores lifted clicks and impressions 25% within two months.',
  },
  {
    when: 'Answer engines',
    title: 'AEO',
    body: 'Answer engine optimization: being the answer Google AI Overviews, ChatGPT, Perplexity and voice assistants quote.',
    items: [
      'Structured data in JSON-LD: Organization, LocalBusiness, Product, FAQ, Article and Person schema',
      'Entity-first content: the same clear facts about who you are, what you offer and where, on every page and profile',
      'Question-led pages and FAQ blocks written so one passage answers the question on its own',
      'Semantic, accessible HTML (WCAG and AODA) that crawlers and language models read cleanly',
      'Google Business Profile and review signals for local answers',
      'Fast, server-rendered pages, because answer engines skip what they can’t read',
    ],
    proof:
      'This site is built that way: static HTML, Person and Article schema, and one page per project with its stack, role and results.',
  },
  {
    when: 'Since 2017',
    title: 'WordPress and WooCommerce',
    body: 'From brochure sites to large WooCommerce catalogues and headless builds, and the care plans that keep them running.',
    items: [
      'Custom themes and plugins in PHP, with ACF and custom post types',
      'Page builders when the team needs them: Elementor, Divi and WPBakery',
      'WooCommerce catalogues with 15,000+ SKUs: product data, categories, filters and checkout',
      'Headless WordPress through WPGraphQL or the REST API, behind Next.js or static front ends',
      'Migrations and hosting: cPanel to AWS, DigitalOcean and GCP, with staging and backups',
      'Care plans: updates, security patches, speed work and content changes',
    ],
    proof:
      'Premier Electronic Parts’ three stores moved from cPanel to AWS; Flooring Liquidators, TV Parts Canada and Equisential run on WooCommerce; RDPV Solutions is headless WordPress on Next.js.',
  },
];

export const EXPERIENCE = [
  {
    years: 'Now',
    role: 'Gen AI Developer',
    org: 'RDPV Solutions',
    current: true,
    body: 'AI features and the website around them: LLM applications, retrieval, multi-agent workflows and MCP integrations.',
  },
  {
    years: '2024 — 2026',
    role: 'Web Developer',
    org: 'Flooring Liquidators Canada',
    body: 'WooCommerce storefront, catalogue and landing pages for a retailer with 15 independently run locations. Turned 600+ discontinued product pages that still drew search traffic into leads, brought Google and Meta ads in-house, and built one CRM and review process across every location’s Google Business Profile.',
  },
  {
    years: '2024',
    role: 'Web Developer · IT Support',
    org: 'AZTRA',
    body: 'Designed and launched aztra.ai, set up the cloud, Microsoft 365 and VoIP, and migrated email and the website with minimal downtime.',
  },
  {
    years: '2023 — now',
    role: 'Shopify Developer',
    org: 'Vinyl Sound',
    body: 'Custom Liquid landing pages built on staging, product uploads, SEO, Google Shopping, Google and Meta ads, and Klaviyo cross-sell emails.',
  },
  {
    years: '2023',
    role: 'Web Developer',
    org: 'Premier Electronic Parts',
    body: 'Built and ran three WooCommerce stores with 15,000+ SKUs and moved them from cPanel to AWS. Programmatic SEO templates across the catalogue lifted clicks and impressions 25% in two months. Also ran Amazon Seller Central and eBay for the US and Canada.',
  },
  {
    years: '2019 — 2022',
    role: 'Shopify Developer',
    org: 'Muse Wearables, Bangalore',
    body: 'Theme development and storefront work for a wearables brand.',
  },
  { years: '2018', role: 'Analyst, Talent Sourcing', org: 'Deloitte' },
  {
    years: '2017 — now',
    role: 'Web development and SEO',
    org: 'Freelance',
    body: 'WordPress, WooCommerce, Shopify, Wix and Squarespace builds and care plans for agencies and their clients, with Elementor, WPBakery, ACF and custom post types. SEO strategy and link building for difficult keywords, and my own micro-niche, event and long-term blogs.',
  },
];

export const EDUCATION =
  'Post-graduate certificate, Cloud Operations, York University · B.Com (Computer Applications), Osmania University';
