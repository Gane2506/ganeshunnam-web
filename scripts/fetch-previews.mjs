// One-off: copy the project preview images from the current live site into public/previews/
// so they keep working after the new build replaces it. Run before the first deploy:
//   npm run fetch:previews
import { writeFile, mkdir } from 'node:fs/promises';

const SOURCE = process.env.PREVIEW_SOURCE || 'https://ganeshunnam.com/previews';
const NAMES = ['flooring', 'vinyl', 'talent', 'auto', 'floorstoday', 'reno', 'tvparts', 'installmart', 'nas'];
const out = new URL('../public/previews/', import.meta.url);
await mkdir(out, { recursive: true });

for (const name of NAMES) {
  const res = await fetch(`${SOURCE}/${name}.webp`);
  if (!res.ok) {
    console.warn(`skip ${name}: ${res.status}`);
    continue;
  }
  await writeFile(new URL(`${name}.webp`, out), Buffer.from(await res.arrayBuffer()));
  console.log(`saved ${name}.webp`);
}
