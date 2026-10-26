// Generates src/styles/tokens.css from design/tokens.json (the design system's single source of truth).
// Dark is the first theme and the default; light overrides only the values that differ.
//   npm run tokens
import { readFile, writeFile } from 'node:fs/promises';

const root = new URL('..', import.meta.url);
const t = JSON.parse(await readFile(new URL('design/tokens.json', root), 'utf8'));
const [first, ...others] = t.color.themes.map((x) => x.id);

const themed = { [first]: [] };
others.forEach((id) => (themed[id] = []));
const plain = [];

const push = (name, value) => {
  if (value && typeof value === 'object') {
    themed[first].push(`--${name}: ${value[first]};`);
    for (const id of others)
      if (value[id] !== undefined && value[id] !== value[first]) themed[id].push(`--${name}: ${value[id]};`);
  } else plain.push(`--${name}: ${value};`);
};

for (const [family, def] of Object.entries(t)) {
  if (family === 'type' || !def || !Array.isArray(def.tokens)) continue;
  for (const tok of def.tokens) push(tok.name, tok.value);
}
for (const [k, v] of Object.entries(t.type.families)) plain.push(`--font-${k}: ${v};`);

const block = (sel, lines) => `${sel} {\n  ${lines.join('\n  ')}\n}\n`;
let css = `/* ${t.name} — generated from design/tokens.json by scripts/tokens-css.mjs. Do not edit by hand. */\n`;
css += block(':root', plain);
css += block(`:root,\n[data-theme='${first}']`, [`color-scheme: ${first};`, ...themed[first]]);
for (const id of others) css += block(`[data-theme='${id}']`, [`color-scheme: ${id};`, ...themed[id]]);
await writeFile(new URL('src/styles/tokens.css', root), css);
console.log(`tokens.css: ${plain.length} shared, ${themed[first].length} themed`);
