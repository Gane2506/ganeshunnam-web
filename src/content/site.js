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
    title: 'Fast websites',
    body: 'Next.js and React front ends in TypeScript, on WordPress, Webflow, Sanity or Contentful, that load quickly and stay easy for your team to edit.',
    tags: ['Next.js', 'React', 'TypeScript', 'Webflow', 'Sanity', 'Contentful'],
  },
  {
    icon: 'ecommerce',
    shape: 'commerce',
    title: 'E-commerce',
    body: 'Shopify and WooCommerce themes, apps and checkout tweaks.',
    tags: ['Shopify', 'WooCommerce'],
  },
  {
    icon: 'seo-growth',
    shape: 'seo',
    title: 'SEO and growth',
    body: 'Technical SEO, structured data and the speed work that search rewards.',
    tags: ['Core Web Vitals', 'Schema'],
  },
  {
    icon: 'automation',
    shape: 'automation',
    title: 'Automation',
    body: 'n8n workflows and small Node.js services that remove the copy-and-paste from your week.',
    tags: ['n8n', 'Node.js', 'APIs'],
  },
  {
    icon: 'cloud-devops',
    shape: 'cloud',
    title: 'Cloud and hosting',
    body: 'Sensible hosting, deploys and monitoring for the things above.',
    tags: ['AWS', 'GCP', 'Docker', 'GitHub Actions'],
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
    title: 'Front end',
    items: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Three.js', 'GSAP', 'Lenis', 'Vite'],
  },
  { title: 'Back end and data', items: ['Node.js', 'PHP', 'WPGraphQL', 'pgvector', 'Firebase'] },
  {
    title: 'CMS and commerce',
    items: ['WordPress', 'Webflow', 'Sanity', 'Contentful', 'Shopify', 'WooCommerce'],
  },
  {
    title: 'Cloud and delivery',
    items: ['AWS', 'GCP', 'Cloudflare Workers', 'D1', 'Docker', 'Kubernetes', 'GitHub Actions'],
  },
  { title: 'Automation and growth', items: ['n8n', 'Google Analytics', 'Klaviyo', 'SEO'] },
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
    body: 'Storefront development and site maintenance for a multi-location retailer.',
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
    body: 'Custom Liquid landing pages, Google Shopping, SEO and Klaviyo flows.',
  },
  {
    years: '2023',
    role: 'Web Developer',
    org: 'Premier Electronic Parts',
    body: 'Three WooCommerce stores with 15,000+ SKUs moved from cPanel to AWS, and a 25% lift in clicks and impressions in two months.',
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
    body: 'WordPress, WooCommerce and Shopify builds and care plans for agencies and their clients.',
  },
];

export const EDUCATION =
  'Post-graduate certificate, Cloud Operations, York University · B.Com (Computer Applications), Osmania University';
