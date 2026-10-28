// Everything the pages say, in one place. Copy follows the design system's copy deck; history comes from
// Ganesh's resume. Change words here, not in the page templates.
export const SITE = {
  url: 'https://ganeshunnam.com',
  name: 'Ganesh Unnam',
  title: 'Ganesh Unnam · Full stack engineer, SEO / AEO and product owner, Toronto',
  description:
    'Websites, WooCommerce and Shopify stores, SEO and AEO, automation and custom applications for businesses, built end to end. Toronto.',
  email: 'gane2506@gmail.com',
  github: 'https://github.com/Gane2506',
  role: 'Full stack engineer · SEO / AEO · Product owner · Toronto',
};

export const HERO = {
  lead: 'I build websites, online stores and custom software for businesses, get them found on Google and in AI answers, and automate the work around them, from the first call to every change after launch.',
  // Shown under the hero as links, so every service is visible before the first scroll.
  services: [
    ['SEO and AEO', '#search', 'Google Search Console'],
    ['WordPress and WooCommerce', '#search', 'WooCommerce'],
    ['Shopify', '#capabilities', 'Shopify'],
    ['Google and Meta ads', '#experience', 'Google Ads'],
    ['Automation', '#builds', 'n8n'],
    ['Custom applications', '#builds', 'React'],
    ['AI and voice agents', '#work', 'Claude'],
    ['Cloud and IT', '#capabilities', 'Cloudflare'],
  ],
};

export const MARQUEE = [
  'SEO',
  'AEO',
  'Google Ads',
  'Meta Ads',
  'ChatGPT',
  'Claude',
  'WordPress',
  'WooCommerce',
  'Shopify',
  'Node.js',
  'Next.js',
  'React',
  'n8n',
  'Google Analytics',
  'Google Search Console',
  'QuickBooks',
  'Cloudflare',
  'Python',
  'TypeScript',
  'PHP',
  'Vue.js',
  'Docker',
  'MongoDB',
  'Supabase',
  'Figma',
  'GitHub Actions',
  'Bootstrap',
  'AWS',
  'GCP',
  'On-prem',
];

export const ABOUT = {
  title: 'One person who owns the whole product, not one slice of it',
  paragraphs: [
    'I started in web development and Shopify themes, moved into React, Next.js and TypeScript on WordPress, Webflow, Sanity and Contentful, set up IT infrastructure and cloud for small companies (AWS networking, Microsoft 365, SharePoint and VoIP), and now spend most of my time on <strong>AI agent systems</strong>: orchestration, retrieval and MCP servers that connect models to the tools a team already uses.',
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
    site: 'https://github.com/Gane2506/baton',
  },
  {
    title: 'RDPV Solutions, headless WordPress on Next.js',
    type: 'Web',
    year: '2026',
    hue: '2',
    art: 'stack',
    tags: ['Next.js', 'WPGraphQL', 'Docker'],
    href: '/casestudy/rdpv-solutions-website/',
    site: 'https://rdpvsolutions.ca/',
  },
  {
    title: 'Flooring Liquidators: 600 dead product pages turned into leads',
    type: 'E-commerce · SEO',
    year: '2024–2026',
    hue: '5',
    art: 'constellation',
    tags: ['WooCommerce', 'Local SEO', 'CRM'],
    href: '/casestudy/flooring-liquidators-discontinued-pages/',
    site: 'https://flooringliquidators.ca/',
  },
  {
    title: 'Premier Electronic Parts: 15,000 SKUs, +25% search clicks',
    type: 'E-commerce · SEO',
    year: '2023',
    hue: '6',
    art: 'grid',
    tags: ['WooCommerce', 'Programmatic SEO', 'AWS'],
    href: '/casestudy/woocommerce-15k-skus-cpanel-to-aws/',
  },
];

// Client sites from ganeshunnam.com, shown as a compact list under the bento
export const MORE_WORK = [
  ['Flooring Liquidators', 'WooCommerce · SEO', 'https://flooringliquidators.ca/'],
  ['Vinyl Sound', 'Shopify · SEO', 'https://vinylsound.ca/'],
  ['floorstoday.ca', 'Headless', 'https://floorstoday.ca/'],
  ['talentsear.ch', 'Search tool', 'https://talentsear.ch/'],
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
    body: 'Next.js and React front ends in TypeScript on WordPress, Webflow, Sanity or Contentful, and custom web applications with their own APIs and data when off-the-shelf software doesn’t fit. Built to WCAG and AODA.',
    tags: ['Next.js', 'React', 'TypeScript', 'Webflow', 'Sanity', 'Contentful'],
  },
  {
    icon: 'ecommerce',
    shape: 'commerce',
    title: 'E-commerce',
    body: 'WooCommerce and Shopify stores: large catalogues, clean product data, checkout fixes, and the speed and search work that turns visits into orders.',
    tags: ['WooCommerce', 'Shopify', 'Liquid', 'Google Shopping', 'Klaviyo'],
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
    title: 'Cloud and IT',
    body: 'Hosting, deploys and monitoring for the things above, plus the office IT around them: AWS networking (VPCs, subnets, security groups), Microsoft 365, SharePoint and VoIP, and migrations with minimal downtime.',
    tags: ['AWS', 'GCP', 'Terraform', 'Docker', 'Microsoft 365'],
  },
];

// Detail cards for the "Automation and custom builds" section; same shape as EXPERTISE.
export const BUILDS = [
  {
    when: 'Workflows and integrations',
    title: 'Automation',
    tools: [
      'n8n',
      'Node.js',
      'QuickBooks',
      'Klaviyo',
      'Twilio',
      'Google Business Profile',
      'GitHub Actions',
      'Terraform',
    ],
    body: 'Workflows that move data between the tools a business already pays for, with a person kept in the loop wherever a decision matters.',
    items: [
      'n8n workflows and API integrations, self-hosted or in the cloud',
      'CRM, lead routing and data sync between forms, inboxes and sales tools',
      'Email segmentation and drip campaigns (welcome, follow-up, cross-sell, win-back), including Klaviyo flows',
      'Call handling: voice agents that qualify, book and text back through Twilio',
      'QuickBooks to CRM: customer and sales data from many accounts, consolidated and segmented',
      'Review management: automated requests and one inbox across every Google Business Profile',
      'Build and content pipelines: GitHub Actions tests and deploys on every change',
      'Infrastructure as code: Terraform provisions AWS, Ansible configures it, Jenkins ships it',
    ],
    proof:
      'At Flooring Liquidators, one CRM pulls customers from 15 locations’ QuickBooks accounts, segments them into email drip campaigns and runs review requests. On this site, publishing a case study in WordPress rebuilds and deploys it in about two minutes.',
  },
  {
    when: 'Built to spec',
    title: 'Custom applications',
    tools: [
      'React',
      'Next.js',
      'TypeScript',
      'Vue.js',
      'Node.js',
      'Python',
      'FastAPI',
      'Supabase',
      'Cloudflare Workers',
    ],
    body: 'When off-the-shelf software doesn’t fit the work, I build the application: scoped with the people who will use it, then shipped and maintained.',
    items: [
      'Web apps and dashboards in React, Next.js, TypeScript and Vue.js',
      'APIs and services in Node.js, Python and FastAPI, over REST or GraphQL',
      'Data in Postgres with pgvector, MySQL, MongoDB, Supabase and Firebase',
      'Edge apps on Cloudflare Workers and D1; containers on Docker and AWS',
      'LLM features: retrieval, multi-agent workflows and MCP servers',
      'Custom WordPress plugins and headless storefronts',
      'Accessible by default: WCAG 2.1 AA and AODA, keyboard and screen-reader friendly',
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
      'ChatGPT',
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
    items: [
      'GA4',
      'Google Tag Manager',
      'Google Ads',
      'Meta Ads',
      'Google Shopping',
      'Klaviyo',
      'QuickBooks',
    ],
  },
  {
    title: 'Front end',
    items: [
      'React',
      'Next.js',
      'TypeScript',
      'JavaScript',
      'Vue.js',
      'Bootstrap',
      'Three.js',
      'GSAP',
      'Lenis',
      'Vite',
    ],
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
    items: [
      'n8n',
      'Webhooks',
      'Twilio',
      'Email segmentation',
      'Drip campaigns',
      'Klaviyo flows',
      'CRM sync',
      'Scheduled jobs',
      'GitHub Actions',
    ],
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
      'Terraform',
      'Ansible',
      'Jenkins',
      'GitHub Actions',
      'On-prem servers',
    ],
  },
  {
    title: 'IT and workplace',
    items: [
      'Microsoft 365',
      'SharePoint',
      'Google Workspace',
      'Email migrations',
      'Amazon Chime VoIP',
      'AWS VPC networking',
    ],
  },
  {
    title: 'Accessibility and privacy',
    items: [
      'WCAG 2.1 AA',
      'AODA',
      'Semantic markup',
      'Accessible navigation',
      'PIPEDA',
      'Cookie and terms policies',
    ],
  },
];

// The SEO, AEO and WordPress deep dive. "proof" lines are facts from real work only.
export const EXPERTISE = [
  {
    when: 'Since 2017',
    title: 'SEO',
    tools: [
      'Google Search Console',
      'GA4',
      'Google Tag Manager',
      'SEMrush',
      'Ahrefs',
      'Screaming Frog',
      'Yoast SEO',
      'Rank Math',
    ],
    body: 'Technical, on-page and local SEO for online stores, multi-location retailers, service businesses and my own niche sites.',
    items: [
      'Technical audits with Screaming Frog and Search Console: crawl errors, redirects, canonicals, indexation and Core Web Vitals',
      'Programmatic SEO templates for large catalogues, so thousands of product and category pages get indexed',
      'Keyword research in Ahrefs and SEMrush, page titles, internal links and content briefs',
      'Local SEO for multi-location businesses: Google Business Profiles, reviews and location pages',
      'Discontinued and out-of-stock pages kept ranking and turned into leads, not 404s',
      'Link-building strategy for difficult keywords',
      'GA4 and Google Tag Manager tracking, so every change is measured',
    ],
    proof:
      'Programmatic SEO across Premier Electronic Parts’ three WooCommerce stores lifted clicks and impressions 25% within two months. At Flooring Liquidators: local SEO for 15 locations, and 600+ discontinued pages kept as entry points.',
  },
  {
    when: 'Answer engines',
    title: 'AEO',
    tools: ['ChatGPT', 'Gemini', 'Perplexity', 'Claude', 'Schema.org JSON-LD', 'Google Business Profile'],
    body: 'Answer engine optimization: being the answer Google AI Overviews, ChatGPT, Perplexity and voice assistants quote.',
    items: [
      'Structured data in JSON-LD: Organization, LocalBusiness, Product, FAQ, Article and Person schema',
      'Entity-first content: the same clear facts about who you are, what you offer and where, on every page and profile',
      'Question-led pages and FAQ blocks written so one passage answers the question on its own',
      'Semantic, accessible HTML to WCAG 2.1 AA and Ontario’s AODA, which crawlers and language models also read cleanly',
      'Google Business Profile and review signals for local answers',
      'Fast, server-rendered pages, because answer engines skip what they can’t read',
    ],
    proof:
      'This site is built that way: static HTML, Person and Article schema, and one page per project with its stack, role and results.',
  },
  {
    when: 'Since 2017',
    title: 'WordPress and WooCommerce',
    tools: ['WordPress', 'WooCommerce', 'Elementor', 'Divi', 'WPGraphQL', 'PHP', 'AWS', 'DigitalOcean'],
    body: 'From brochure sites to large WooCommerce catalogues and headless builds, and the care plans that keep them running.',
    items: [
      'Custom themes and plugins in PHP, with ACF and custom post types',
      'Page builders when the team needs them: Elementor, Divi and WPBakery',
      'WooCommerce catalogues with 15,000+ SKUs: product data, categories, filters and checkout',
      'Headless WordPress through WPGraphQL or the REST API, behind Next.js or static front ends',
      'Migrations and hosting: cPanel to AWS, DigitalOcean and GCP, with staging and backups',
      'Care plans: updates, security patches, uptime, speed work and content changes',
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
    site: 'https://rdpvsolutions.ca/',
    current: true,
    body: 'AI features and the website around them: LLM applications, retrieval and semantic caching, multi-agent workflows and MCP integrations, on a headless WordPress and Next.js site built to WCAG and AODA, with privacy, cookie and terms policies aligned with PIPEDA.',
  },
  {
    years: '2024 — 2026',
    role: 'Web Developer · IT Director · SEO',
    org: 'Flooring Liquidators Canada',
    site: 'https://flooringliquidators.ca/',
    body: 'Ran the WooCommerce storefront, catalogue, merchandising and SEO for a retailer with 15 independently run locations, each with its own QuickBooks account, customer data and Google Business Profile. Local SEO across all 15 profiles and their location pages; turned 600+ discontinued product pages that still drew search traffic into leads with email capture, related products, back-in-stock alerts and segmented email drip campaigns; brought Google and Meta ads in-house; and built one CRM that consolidates customers from every store’s QuickBooks, segments them for email drip campaigns and runs review requests for every location.',
  },
  {
    years: '2024',
    role: 'Web Developer · IT Specialist',
    org: 'AZTRA',
    site: 'https://aztra.ai/',
    body: 'Designed and launched aztra.ai from scratch and set up the company’s IT: an AWS VPC, Microsoft 365, SharePoint and VoIP on Amazon Chime. Moved the website and every mailbox over from the previous provider with no lost data and minimal downtime, then handled shared mailboxes, support and troubleshooting.',
  },
  {
    years: '2023 — now',
    role: 'Shopify Developer · SEO',
    org: 'Vinyl Sound',
    site: 'https://vinylsound.ca/',
    body: 'Theme development and storefront work on Shopify: responsive Liquid, HTML and CSS themes maintained with Shopify CLI, custom landing pages built on staging and pushed live, product uploads and custom code. SEO strategy for organic traffic, Google Shopping, Google, Facebook and Instagram ads, GA4 and Tag Manager analytics behind every change, CRM lead updates, and Klaviyo email and cross-sell campaigns for existing customers.',
  },
  {
    years: '2023',
    role: 'Web Developer · SEO Specialist',
    org: 'Premier Electronic Parts',
    body: 'Built and ran three WooCommerce stores with 15,000+ SKUs and moved them from cPanel to AWS for speed and headroom, with VPCs for internal and external apps. Programmatic SEO templates across the catalogue lifted clicks and impressions 25% in two months, and conversion work followed the data. Also ran Amazon Seller Central and eBay for the US and Canada, Microsoft 365 and SharePoint, and the office network.',
  },
  {
    years: '2018 — 2022',
    role: 'Analyst, Talent Sourcing',
    org: 'Deloitte',
    site: 'https://www.deloitte.com/',
  },
  {
    years: '2017 — now',
    role: 'Web development and SEO',
    org: 'Freelance',
    body: 'WordPress, WooCommerce, Shopify, Wix, Squarespace and Bootstrap builds and annual care plans for agencies and their clients: designs turned into working themes and plugins, Elementor, WPBakery, ACF, form builders and custom post types, hosting on cPanel, DigitalOcean, GCP and AWS. SEO strategy and link building for difficult keywords, and my own micro-niche, event and long-term blogs.',
  },
];

export const EDUCATION =
  'Post-graduate certificate, Cloud Operations, York University · B.Com (Computer Applications), Osmania University';
