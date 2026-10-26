// Site content. Lifecycle, architectures, change log and engagements come verbatim from the design system's
// pages/content.js; the rest from its copy deck, Ganesh's resume and ganeshunnam.com. Facts only.
export const PHASES = [
  { title: 'Discover', verb: 'Requirements', shape: 'constellation',
    headline: 'Find the real problem before writing a line of code',
    body: 'I sit with the people who will use the product, map how the work happens today and agree what success looks like in numbers. Scope is cut to the smallest version that proves the idea.',
    deliverables: ['Requirements and user stories', 'Scope for a first release', 'Estimate and timeline', 'Long-lead risks flagged early'],
    example: 'For Sarah, the voice agent, platform approvals with long review times (Google Business Profile API, Meta app review) were flagged on day one so they would not block launch.' },
  { title: 'Architect', verb: 'System design', shape: 'agents',
    headline: 'Design the system, the data and the cost before building it',
    body: 'Data model, integrations, hosting, security and running cost, written down with the trade-offs so you can see why each choice was made.',
    deliverables: ['Architecture diagram', 'Data model and integrations', 'Hosting and security plan', 'Running-cost model'],
    example: 'Sarah runs on Cloudflare Workers, D1 and KV with a 16-table multi-tenant schema. Modelling per-call voice costs early showed them closer to $0.50 to $1.40 a call than the first $0.05 guess, which reshaped pricing.' },
  { title: 'Build', verb: 'Implementation', shape: 'commerce',
    headline: 'Ship working software every week, not a big reveal at the end',
    body: 'Short iterations with a demo you can click, CI/CD from the first commit and a staging site that always matches what is coming next.',
    deliverables: ['Weekly working demos', 'Staging environment', 'Automated tests and CI/CD', 'Clean, documented code'],
    example: 'The document pipeline was built stage by stage: OCR first, then chunking and embeddings, then retrieval and structured output, each one testable on its own.' },
  { title: 'Launch', verb: 'Release', shape: 'seo',
    headline: 'Launch quietly, measure loudly',
    body: 'Production deploy, data migration, analytics and monitoring in place before the announcement, and a handover so your team knows how everything works.',
    deliverables: ['Production release', 'Monitoring and analytics', 'Runbook and handover', 'Team walkthrough'],
    example: 'RDPV Solutions went live as headless WordPress with a Next.js front end in Docker, DNS on Cloudflare and Google Analytics collecting only what is needed.' },
  { title: 'Maintain', verb: 'Operations', shape: 'ring',
    headline: 'Keep it fast, patched and boring',
    body: 'Updates, security patches, uptime and performance checks on a schedule, with a short monthly note on what changed and why.',
    deliverables: ['Dependency and security updates', 'Uptime and performance checks', 'Backups verified', 'Monthly health note'],
    example: null },
  { title: 'Evolve', verb: 'Change management', shape: 'automation',
    headline: 'Change without breaking what already works',
    body: 'New requests go through one list: impact assessed, prioritised against the roadmap, built behind a release, and written up in the change log so everyone can see what moved.',
    deliverables: ['Prioritised roadmap', 'Impact assessment per change', 'Versioned releases', 'Public change log'],
    example: 'Sarah’s roadmap is staged: V1 review and lead modules, V2 in months 4 to 6, V3 in months 7 to 12, each release scoped against what the last one taught.' }
];

export const BEDROCK_ARCH = {
  id: 'bedrock', hue: '3', title: 'Document OCR and RAG on Amazon Bedrock',
  lanes: ['Ingest', 'Answer'],
  nodes: [
    { id: 'docs', label: 'Documents', sub: 'PDFs and scans', col: 0, row: 0 },
    { id: 'ocr', label: 'Amazon Textract', sub: 'OCR', col: 1, row: 0, accent: true },
    { id: 'chunk', label: 'Chunking', sub: 'clean and split', col: 2, row: 0 },
    { id: 'embed', label: 'Embeddings', sub: 'Amazon Bedrock', col: 3, row: 0, accent: true },
    { id: 'vec', label: 'pgvector', sub: 'Postgres', col: 4, row: 0 },
    { id: 'q', label: 'Question', sub: 'user or app', col: 0, row: 1 },
    { id: 'qe', label: 'Embed query', sub: 'Amazon Bedrock', col: 1, row: 1 },
    { id: 'ret', label: 'Retrieve', sub: 'top matches', col: 2, row: 1 },
    { id: 'llm', label: 'Generate', sub: 'LLM on Bedrock', col: 3, row: 1, accent: true },
    { id: 'out', label: 'Structured output', sub: 'JSON fields', col: 4, row: 1 }
  ],
  edges: [['docs', 'ocr'], ['ocr', 'chunk', 'text'], ['chunk', 'embed'], ['embed', 'vec', 'vectors'], ['q', 'qe'], ['qe', 'ret'], ['vec', 'ret'], ['ret', 'llm', 'context'], ['llm', 'out']],
  caption: 'Fig. 1 · Ingest and answer paths. Hover or tab through a node to trace its connections.'
};

export const SARAH_ARCH = {
  id: 'sarah', hue: '1', title: 'Sarah voice agent architecture',
  lanes: ['Channels', 'Core'],
  nodes: [
    { id: 'call', label: 'Phone call', sub: 'Twilio', col: 0, row: 0 },
    { id: 'voice', label: 'Voice agent', sub: 'Vapi', col: 1, row: 0, accent: true },
    { id: 'sms', label: 'SMS outreach', sub: 'Twilio', col: 2, row: 0 },
    { id: 'api', label: 'API', sub: 'Cloudflare Workers', col: 1, row: 1, accent: true },
    { id: 'db', label: 'Tenants and leads', sub: 'D1 · 16 tables', col: 0, row: 1 },
    { id: 'kv', label: 'Sessions', sub: 'KV', col: 2, row: 1 },
    { id: 'crm', label: 'Jobber', sub: 'OAuth', col: 3, row: 1 },
    { id: 'social', label: 'Google and Meta', sub: 'OAuth', col: 3, row: 0 }
  ],
  edges: [['call', 'voice'], ['voice', 'api', 'qualify'], ['api', 'db'], ['api', 'kv'], ['api', 'crm', 'book'], ['api', 'sms', 'follow-up'], ['api', 'social', 'reviews']],
  caption: 'Fig. 2 · Lead in by phone, qualified by the voice agent, booked into Jobber.'
};

export const SARAH_LOG = [
  { version: 'V3', date: 'Months 7 to 12', type: 'planned', title: 'Local SEO copilot and reputation intelligence', items: ['Local SEO copilot', 'Competitor tracking', 'Voice reviews', 'Deep reputation intelligence'] },
  { version: 'V2', date: 'Months 4 to 6', type: 'planned', title: 'Complaint interceptor and gallery', items: ['Complaint and sentiment interceptor', 'Before and after gallery generator'] },
  { version: 'V1', date: 'MVP', type: 'added', title: 'Module B · Leads', items: ['Instant SMS outreach', 'AI voice call lead qualification and booking'] },
  { version: 'V1', date: 'MVP', type: 'added', title: 'Module A · Reviews', items: ['Post-sale review collection', 'AI-drafted SEO review replies', 'Review-to-social content', 'Automated referral asks'] },
  { version: '0.2', date: 'Architecture', type: 'changed', title: 'Voice cost model corrected', items: ['All-in voice calls modelled at about $0.50 to $1.40+ per call, not $0.05 to $0.10', 'Module pricing and call limits revisited before build'] },
  { version: '0.1', date: 'Discovery', type: 'decided', title: 'Stack and long-lead risks', items: ['Cloudflare Workers, D1 and KV with a multi-tenant schema', 'Google Business Profile API allow-listing and Meta app review started immediately'] }
];

export const ENGAGEMENTS = [
  { when: 'Weeks 1 to 2', title: 'Discovery sprint', featured: true, body: 'Requirements, architecture and a costed plan, so you know exactly what you are buying before the build starts.', includes: ['Stakeholder sessions', 'Requirements and scope', 'Architecture and cost model', 'Fixed estimate for the build'], cta: 'Start with discovery' },
  { when: 'Weekly releases', title: 'Build and launch', body: 'Design, development and launch in short iterations with a demo every week.', includes: ['Weekly demos on staging', 'CI/CD and tests', 'Launch, monitoring, handover'], cta: 'Plan a build' },
  { when: 'Monthly', title: 'Keep and evolve', body: 'Maintenance, monitoring and a steady flow of changes against a shared roadmap.', includes: ['Updates and security patches', 'Change requests with impact notes', 'Roadmap and change log'], cta: 'Talk about support' }
];
