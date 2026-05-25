import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const failures = [];

function read(relativePath) {
  return readFileSync(join(root, relativePath), 'utf8');
}

function readIfExists(relativePath) {
  const absolutePath = join(root, relativePath);
  return existsSync(absolutePath) ? readFileSync(absolutePath, 'utf8') : '';
}

function assert(condition, message) {
  if (!condition) {
    failures.push(message);
  }
}

const indexHtml = read('index.html');
const redirects = read('public/_redirects');
const seoSource = readIfExists('src/lib/seo.ts');

assert(
  !/<link\s+rel=["']canonical["']\s+href=["']https:\/\/mainspiedsjosee\.ca\/["']\s*\/?>/.test(indexHtml),
  'index.html must not hard-code the home canonical because it is served for every SPA route.'
);

assert(
  /path:\s*['"]\/rendez-vous['"][\s\S]*canonical:\s*['"]https:\/\/mainspiedsjosee\.ca\/rendez-vous['"]/.test(seoSource),
  'SEO route metadata must declare https://mainspiedsjosee.ca/rendez-vous as the canonical URL for /rendez-vous.'
);

assert(
  /https:\/\/www\.mainspiedsjosee\.ca\/\*\s+https:\/\/mainspiedsjosee\.ca\/:splat\s+301/.test(redirects),
  'public/_redirects must redirect https://www.mainspiedsjosee.ca/* to the canonical non-www domain.'
);

if (failures.length > 0) {
  console.error('SEO check failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('SEO check passed.');
