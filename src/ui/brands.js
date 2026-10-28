// Brand marks for tools and platforms, from Simple Icons (CC0), rendered inline at build time in each brand's
// colour. Brands that asked Simple Icons to remove their logos (OpenAI, AWS, Klaviyo, Twilio, Microsoft and a
// few others) get a monogram badge instead of a redrawn logo. Labels without a mapping render as plain text.
import * as si from 'simple-icons';

const SLUG = {
  // AI
  Claude: 'claude',
  'Claude Code': 'claude',
  Anthropic: 'anthropic',
  Cursor: 'cursor',
  MCP: 'modelcontextprotocol',
  'MCP servers': 'modelcontextprotocol',
  OpenRouter: 'openrouter',
  LangChain: 'langchain',
  Gemini: 'googlegemini',
  Perplexity: 'perplexity',
  'GitHub Copilot': 'githubcopilot',
  // WordPress and commerce
  WordPress: 'wordpress',
  Elementor: 'elementor',
  WPGraphQL: 'graphql',
  Shopify: 'shopify',
  Webflow: 'webflow',
  Sanity: 'sanity',
  Contentful: 'contentful',
  Wix: 'wix',
  Squarespace: 'squarespace',
  Bootstrap: 'bootstrap',
  // search and growth
  SEMrush: 'semrush',
  'Google Search Console': 'googlesearchconsole',
  'Yoast SEO': 'yoast',
  GA4: 'googleanalytics',
  'Google Analytics': 'googleanalytics',
  'Google Tag Manager': 'googletagmanager',
  'Google Ads': 'googleads',
  'Meta Ads': 'meta',
  Meta: 'meta',
  'Google Workspace': 'google',
  Mailchimp: 'mailchimp',
  HubSpot: 'hubspot',
  QuickBooks: 'quickbooks',
  eBay: 'ebay',
  // code
  React: 'react',
  'Next.js': 'nextdotjs',
  TypeScript: 'typescript',
  JavaScript: 'javascript',
  'Vue.js': 'vuedotjs',
  'Three.js': 'threedotjs',
  GSAP: 'greensock',
  Vite: 'vite',
  'Node.js': 'nodedotjs',
  Python: 'python',
  FastAPI: 'fastapi',
  PHP: 'php',
  GraphQL: 'graphql',
  'Postgres and pgvector': 'postgresql',
  pgvector: 'postgresql',
  Postgres: 'postgresql',
  MySQL: 'mysql',
  MongoDB: 'mongodb',
  Supabase: 'supabase',
  Firebase: 'firebase',
  n8n: 'n8n',
  Zapier: 'zapier',
  // cloud
  GCP: 'googlecloud',
  DigitalOcean: 'digitalocean',
  Cloudflare: 'cloudflare',
  'Cloudflare Workers': 'cloudflareworkers',
  Workers: 'cloudflareworkers',
  D1: 'cloudflare',
  Docker: 'docker',
  Kubernetes: 'kubernetes',
  Terraform: 'terraform',
  Ansible: 'ansible',
  Jenkins: 'jenkins',
  'GitHub Actions': 'githubactions',
  GitHub: 'github',
  Vercel: 'vercel',
  Figma: 'figma',
  'PageSpeed Insights': 'pagespeedinsights',
  Lighthouse: 'lighthouse',
  'Cloudflare WAF': 'cloudflare',
  'Cloudflare Zaraz': 'cloudflare',
  Nginx: 'nginx',
  Redis: 'redis',
  'Google Custom Search': 'google',
  'Core Web Vitals': 'pagespeedinsights',
};

// no Simple Icons mark: a two-letter badge in the brand's own colour
const MONO = {
  'Agent orchestration': ['AO', '#B3A0FF'],
  'AI agents': ['AI', '#C6F432'],
  'On-prem': ['srv', '#6A6974'],
  'On-prem servers': ['srv', '#6A6974'],
  WooCommerce: ['Woo', '#7F54B3'], // the official mark is a wide speech bubble that turns into a line at 14px
  ChatGPT: ['GPT', '#10A37F'],
  Codex: ['Cx', '#10A37F'],
  OpenAI: ['AI', '#10A37F'],
  AWS: ['aws', '#FF9900'],
  'Amazon Bedrock': ['aws', '#FF9900'],
  Bedrock: ['aws', '#FF9900'],
  Textract: ['aws', '#FF9900'],
  'Amazon Chime VoIP': ['aws', '#FF9900'],
  'AWS VPC networking': ['aws', '#FF9900'],
  Klaviyo: ['K', '#232426'],
  'Klaviyo flows': ['K', '#232426'],
  Twilio: ['Tw', '#F22F46'],
  Vapi: ['V', '#5DFECA'],
  'Microsoft 365': ['M', '#D83B01'],
  SharePoint: ['S', '#038387'],
  Ahrefs: ['ah', '#FF8800'],
  'Screaming Frog': ['SF', '#6CC24A'],
  Moz: ['M', '#1B9FE3'],
  'Rank Math': ['RM', '#7B4BF0'],
  'Google Shopping': ['G', '#4285F4'],
  'Google Business Profile': ['G', '#4285F4'],
  'Schema.org JSON-LD': ['{ }', '#B12C2A'],
  Divi: ['D', '#8C4DE8'],
  WPBakery: ['WB', '#0473AA'],
  ACF: ['ACF', '#00D3AE'],
  'Amazon Seller Central': ['a', '#FF9900'],
};

const lum = (hex) => {
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const icon = (slug) => si[`si${slug[0].toUpperCase()}${slug.slice(1)}`];

export const hasBrand = (label) => Boolean(MONO[label] || (SLUG[label] && icon(SLUG[label])));

// near-black and near-white marks (Next.js, Cursor, GitHub…) follow the text colour so they read in both themes
export function Brand({ label, size = 16 }) {
  const i = SLUG[label] && icon(SLUG[label]);
  if (i) {
    const l = lum(i.hex);
    const style = l < 0.12 || l > 0.9 ? '' : ` style="--brand:#${i.hex}"`;
    return `<svg class="gu-brand" viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true"${style}><path d="${i.path}"/></svg>`;
  }
  const m = MONO[label];
  if (!m) return '';
  const ink = lum(m[1].slice(1)) > 0.6 ? ';color:#0b0b0f' : ''; // dark letters on light badges
  return `<span class="gu-brand gu-brand-mono" style="--brand:${m[1]};--s:${size}px${ink}" aria-hidden="true">${m[0]}</span>`;
}
