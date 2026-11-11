// Everything the pages say, in one place. Copy follows the design system's copy deck; history comes from
// Ganesh's resume. Change words here, not in the page templates.
export const SITE = {
  url: 'https://ganeshunnam.com',
  name: 'Ganesh Unnam',
  title: 'Ganesh Unnam · Full-stack AI engineer, agentic systems and SEO / AEO, Toronto',
  description:
    'Full-stack AI engineer in the Greater Toronto Area: React and Next.js front ends, Python and FastAPI back ends, agentic AI systems, and websites and stores built to rank and convert.',
  email: 'gane2506@gmail.com',
  github: 'https://github.com/Gane2506',
  linkedin: 'https://www.linkedin.com/in/ganeshunnam/',
  role: 'Full-stack AI engineer · Agentic systems · SEO / AEO · Toronto',
};

export const HERO = {
  lead: 'I build production web apps and the backend systems behind them, with generative AI built in: AI agents, RAG pipelines and MCP integrations, plus websites and online stores that get found on Google and in AI answers.',
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
  'AI agents',
  'MCP servers',
  'Agent orchestration',
  'AWS',
  'LangChain',
  'FastAPI',
  'GraphQL',
  'Docker',
  'Kubernetes',
  'Vercel',
  'SEO',
  'AEO',
  'Core Web Vitals',
  'Cloudflare',
  'Google Ads',
  'Meta Ads',
  'ChatGPT',
  'Claude',
  'GCP',
  'On-prem',
  'WordPress',
  'WooCommerce',
  'Shopify',
  'Node.js',
  'Python',
  'React',
  'Next.js',
  'TypeScript',
  'n8n',
  'Google Analytics',
  'Google Search Console',
  'PHP',
  'Vue.js',
  'Bootstrap',
  'MongoDB',
  'Supabase',
  'Figma',
  'GitHub Actions',
];

export const ABOUT = {
  title: 'One person who owns the whole product, not one slice of it',
  paragraphs: [
    'I’m a full-stack product engineer who ships production web applications and the backend systems behind them first, with <strong>applied generative AI</strong> built in. I build React and Next.js front ends in TypeScript, Python and FastAPI back ends with REST and GraphQL APIs, and deploy them on AWS, Cloudflare Workers and Vercel with Docker, Kubernetes and GitHub Actions.',
    'I created Baton, an open-source agentic CLI platform where every stage transition triggers the next agent and every decision is cached, budget-limited and logged with its cost. In client work I bring AI into production: RAG pipelines with LangChain and AWS Bedrock, structured LLM outputs from a Textract OCR pipeline, and MCP tool integrations, shipped behind automated tests and CI quality gates.',
    'Clients get one person from the first requirements call to the release after launch, who explains the technical tradeoffs clearly to technical and non-technical teams alike.',
  ],
  stats: [
    { value: 10, suffix: '+', label: 'years across cloud, web and AI, since 2016' },
    { value: 6, label: 'lifecycle phases owned, from requirements to change management' },
    { value: 3000, suffix: '+', label: 'automated tests behind Baton, my open-source agent platform' },
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
    title: 'Baton, an open-source agentic CLI platform',
    type: 'AI agents',
    year: '2026',
    hue: '4',
    art: 'orbit',
    tags: ['Python', 'Claude Code', 'MCP', 'OpenRouter'],
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
    title: 'A role-based RAG chatbot for company documents',
    type: 'AI · RAG',
    year: '2026',
    hue: '6',
    art: 'grid',
    tags: ['LangChain', 'FastAPI', 'ChromaDB'],
    href: '/casestudy/role-based-rag-chatbot/',
  },
  {
    title: 'talentsear.ch, x-ray search for recruiters',
    type: 'Side project',
    year: '2020–now',
    hue: '5',
    art: 'cloud',
    tags: ['Google Programmable Search', 'WordPress'],
    href: '/casestudy/talentsearch/',
    site: 'https://talentsear.ch/',
  },
];

// Client sites from ganeshunnam.com, shown as a compact list under the bento
// More shipped client work: name, kind, live URL, a two-line description and tags. The client list adds the
// platform and Cloudflare tags detected by scripts/capture-sites.mjs (public/shots/sites.json).
export const MORE_WORK = [
  {
    name: 'Vinyl Sound',
    kind: 'Shopify · SEO',
    url: 'https://vinylsound.ca/',
    about:
      'Hi-fi and turntable specialist in Richmond Hill. Custom Liquid landing pages, product SEO, Google Shopping and Klaviyo campaigns.',
    tags: ['Shopify', 'SEO', 'Klaviyo'],
  },
  {
    name: 'A1 Mississauga Auto',
    kind: 'Automotive',
    url: 'https://a1mississaugaauto.com/',
    about:
      'Collision and auto repair shop in Mississauga since 1989. Service pages, appointment booking and local search.',
    tags: ['Local SEO'],
  },
  {
    name: 'TV Parts Canada',
    kind: 'WooCommerce',
    url: 'https://tvpartscanada.ca/',
    about:
      "Canada's one-stop shop for TV parts and DLP lamps. A large WooCommerce parts catalogue with search and filters.",
    tags: ['WooCommerce', 'SEO'],
  },
  {
    name: 'Installmart',
    kind: 'Shopify',
    url: 'https://installmart.ca/',
    about:
      'Air conditioning and HVAC installers. Service pages and a quote request form that turns visits into jobs.',
    tags: ['Shopify', 'Lead forms'],
  },
  {
    name: 'NAS Solutions',
    kind: 'Technology',
    url: 'https://nassolutions.ca/',
    about:
      'Network and security solutions for businesses. A services site with free quotes and appointment booking.',
    tags: ['Lead forms'],
  },
  {
    name: 'Willow International',
    kind: 'Website',
    url: 'https://willowinter.com/',
    about:
      "An international supplier's product showcase, built around large galleries and clear product pages.",
    tags: [],
  },
  {
    name: 'Informed Technologies',
    kind: 'Website',
    url: 'https://informed-tech.com/',
    about: 'Software testing and IT services. A services site with clear paths to a conversation.',
    tags: [],
  },
  {
    name: 'Protech Industries',
    kind: 'Website',
    url: 'https://protechindustries.com/',
    about: 'Industrial manufacturer established in 1981. A company and capabilities site for a B2B audience.',
    tags: [],
  },
  {
    name: 'Equisential',
    kind: 'Headless WooCommerce',
    url: 'https://equisential.in/',
    about:
      'Postpartum nutrition brand. A headless WooCommerce store on Next.js for traditional recipes made from real ingredients.',
    tags: ['WooCommerce', 'Next.js', 'Headless'],
  },
  {
    name: 'Cheshire Clear Vision',
    kind: 'Healthcare',
    url: 'https://cheshireclearvision.com/',
    about: 'Eye care clinic. Services, conditions treated and online appointment booking.',
    tags: ['Booking'],
  },
  {
    name: 'Dr. Priti Challa',
    kind: 'Healthcare',
    url: 'https://drpritichalla.com/',
    about: "Women's health specialist. A practice site with services, media mentions and appointments.",
    tags: ['Booking'],
  },
  {
    name: 'Padma Skin Clinic',
    kind: 'Healthcare',
    url: 'https://padmaskinclinic.com/',
    about:
      'Skin clinic led by specialists with 15 years of experience. Treatments, gallery and consultation booking.',
    tags: ['Booking'],
  },
];

export const CAPABILITIES = [
  {
    icon: 'ai-agents',
    shape: 'agents',
    title: 'AI agents and RAG',
    body: 'Multi-agent workflows with tool calling and structured outputs, RAG pipelines with LangChain on AWS Bedrock, document OCR, voice agents that book calls, and MCP servers that connect models to your tools.',
    tags: ['LangChain', 'LangGraph', 'Bedrock', 'MCP', 'Claude'],
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
    body: 'On-page, technical and local SEO, fast pages that pass Core Web Vitals, and structured, answer-ready content, so search engines rank you and AI answers quote you.',
    tags: ['Google Search Console', 'PageSpeed Insights', 'Cloudflare', 'Ahrefs', 'Schema'],
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
      'QuickBooks automation: customer and sales data from many accounts, consolidated and segmented',
      'Review management: automated requests and one inbox across every Google Business Profile',
      'Build and content pipelines: GitHub Actions tests and deploys on every change',
      'Infrastructure as code: Terraform provisions AWS, Ansible configures it, Jenkins ships it',
    ],
    proof:
      'Sarah answers, qualifies and books calls through Twilio and texts back the details. On this site, publishing a case study in WordPress rebuilds and deploys it in about two minutes.',
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
      'Baton, an agentic CLI platform with a web dashboard and 3,000+ automated tests; a role-based RAG chatbot on FastAPI and ChromaDB; Sarah, a voice agent on Workers and D1; and the Bedrock document pipeline.',
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
      'LangGraph',
      'RAG',
      'Amazon Bedrock',
      'Textract',
      'Hugging Face',
      'Mistral',
      'Streamlit',
    ],
  },
  {
    title: 'Agentic systems',
    items: [
      'Event-driven pipelines',
      'State machines',
      'Work queues',
      'Git worktree isolation',
      'Human-in-the-loop approvals',
      'Cost and token tracking',
      'Confidence scoring',
      'Shadow-mode evaluation',
      'Exact-match and semantic caching',
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
    title: 'Speed and edge',
    items: [
      'Core Web Vitals',
      'PageSpeed Insights',
      'Lighthouse',
      'Cloudflare',
      'Cloudflare WAF',
      'Cloudflare Zaraz',
      'Server-side caching',
      'Nginx',
      'WebP and AVIF',
      'Font subsetting',
    ],
  },
  {
    title: 'Analytics and growth',
    items: ['GA4', 'Google Tag Manager', 'Google Ads', 'Meta Ads', 'Google Shopping', 'Klaviyo'],
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
      'ChromaDB',
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
      'GitOps',
      'Portainer',
      'Vercel',
      'AWS Lambda',
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
      'Programmatic SEO across Premier Electronic Parts’ three WooCommerce stores lifted clicks and impressions 25% within two months.',
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
      'Premier Electronic Parts’ three stores moved from cPanel to AWS; TV Parts Canada runs on WooCommerce and Equisential on headless WooCommerce with Next.js; RDPV Solutions is headless WordPress on Next.js.',
  },
  {
    when: 'On 90% of my sites',
    title: 'Speed, Core Web Vitals and the edge',
    tools: ['PageSpeed Insights', 'Lighthouse', 'Cloudflare', 'Cloudflare WAF', 'Cloudflare Zaraz', 'Nginx'],
    body: 'Most sites I build or take over also get the performance work that rankings and conversions depend on: fast first paint, stable layout and a server that answers quickly.',
    items: [
      'Core Web Vitals: LCP, CLS and INP measured in the field and fixed at the cause',
      'Images in WebP and AVIF at the right sizes, lazy-loaded below the fold',
      'Fonts subset, preloaded and swapped, so text paints immediately',
      'Server tuning and server-side page caching, so HTML comes back fast',
      'Cloudflare CDN and WAF in front: cached at the edge, attacks and bots stopped before the server',
      'Cloudflare Zaraz runs analytics and pixels at the edge instead of in the browser',
    ],
    proof:
      'This site: static HTML on Cloudflare, Lighthouse 99 for performance and 100 for accessibility, best practices and SEO.',
  },
];

export const EXPERIENCE = [
  {
    years: 'Nov 2024 — now',
    role: 'Full-Stack AI Engineer · Gen AI Developer',
    org: 'RDPV Solutions · Remote, Greater Toronto Area',
    site: 'https://rdpvsolutions.ca/',
    current: true,
    body: 'Production web apps, PWAs and backend services across the full SDLC: React, Next.js and TypeScript front ends, Python and FastAPI back ends with REST and GraphQL. Built a document pipeline with Amazon Textract OCR, embeddings and PostgreSQL with pgvector feeding a Bedrock LLM that returns structured, validated output; RAG pipelines with LangChain and Bedrock; and AI agents with tool calling, structured outputs and MCP integrations using Claude Code, Codex and OpenRouter. Event-driven serverless and edge apps on AWS Lambda, Cloudflare Workers and Vercel, containers deployed to Kubernetes with GitOps, and GitHub Actions pipelines with security scanning and quality gates.',
  },
  {
    years: 'Mar 2024 — Nov 2024',
    role: 'Web Developer · IT Support',
    org: 'AZTRA · Remote, Greater Toronto Area',
    site: 'https://aztra.ai/',
    body: 'Designed, built and launched aztra.ai as a headless WordPress build with a React front end, and deployed the cloud environments behind each project. Containerized the app with Docker and managed deployments through Portainer, set up GA4 and Google Tag Manager, and built the IT: VPC, Office 365, SharePoint and VoIP on AWS Chime. Led the website and email migration from Axium Systems with data intact and minimal downtime, and ran Office 365 and day-to-day IT support.',
  },
  {
    years: 'Mar 2023 — Mar 2024',
    role: 'Shopify Developer',
    org: 'Vinyl Sound · Remote, Greater Toronto Area',
    site: 'https://vinylsound.ca/',
    body: 'Built and refactored custom Liquid landing pages and theme sections with Shopify CLI, developed locally and tested on staging before going live, and built React components for the storefront. Used AI coding assistants (ChatGPT, GitHub Copilot) for theme work and AI tools to generate meta titles, descriptions and product content at scale. Ran SEO tracked in GA4, set up Klaviyo with Shopify for email and cross-sell campaigns, and maintained the store.',
  },
  {
    years: '2020 — now',
    role: 'Creator · Web Developer and SEO',
    org: 'talentsear.ch',
    site: 'https://talentsear.ch/',
    body: 'X-ray search engines for recruiters and head hunters, built on Google Programmable Search and a custom WordPress site. Each one is scoped to a country and a platform (LinkedIn, GitHub, Behance, Dribbble and more), so passive sourcing no longer needs long hand-written search strings. Free to use at talentsear.ch and talentsearch.in.',
  },
  {
    years: 'Oct 2018 — Dec 2022',
    role: 'Analyst',
    org: 'Deloitte · Hyderabad, India',
    site: 'https://www.deloitte.com/',
    body: 'Monitored AWS infrastructure for availability, performance and health, and handled incident and problem management through to root cause. Managed AWS IAM roles and policies to least privilege and maintained network ACLs, wrote Bash and Python scripts to automate routine operations, tuned network and server performance, and reported on system health and incidents to stakeholders.',
  },
  {
    years: '2017 — now',
    role: 'Web development and SEO',
    org: 'Freelance',
    body: 'WordPress, WooCommerce, Shopify, Wix, Squarespace and Bootstrap builds and annual care plans for agencies and their clients: designs turned into working themes and plugins, Elementor, WPBakery, ACF, form builders and custom post types, hosting on cPanel, DigitalOcean, GCP and AWS. SEO strategy and link building for difficult keywords, and my own micro-niche, event and long-term blogs.',
  },
  {
    years: 'Jun 2016 — Aug 2018',
    role: 'Analyst',
    org: 'US Tech Solutions · Hyderabad, India',
    body: 'Managed cloud environments for client systems, handling AWS, networking and server management to keep them secure, scalable and running reliably. Streamlined deployments, troubleshot complex issues to lasting fixes, and worked closely with cross-functional teams.',
  },
];

export const EDUCATION =
  'Postgraduate certificate, Cloud Operations and DevSecOps, York University (2024) · Bachelor’s degree, Osmania University (2013–2016) · ISC2 Candidate (2024) · Google AdWords Search and Fundamentals (2018) · English, Telugu and Hindi';
