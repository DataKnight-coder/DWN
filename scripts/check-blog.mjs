import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

const dist = join(process.cwd(), 'dist');
const slug = 'build-wealth-as-an-immigrant-in-canada';
const article = await readFile(join(dist, 'blog', slug, 'index.html'), 'utf8');
const landing = await readFile(join(dist, 'blog', 'index.html'), 'utf8');
const sitemap = await readFile(join(dist, 'sitemap.xml'), 'utf8');
const robots = await readFile(join(dist, 'robots.txt'), 'utf8');
const source = await readFile(join(process.cwd(), 'content', `${slug}.md`), 'utf8');
const canonical = `https://drhauwaphd.ca/blog/${slug}/`;

assert.equal((article.match(/<h1\b/g) || []).length, 1);
assert.match(article, new RegExp(`<link rel="canonical" href="${canonical}"`));
assert.match(article, /<meta name="description"/);
assert.match(article, /<meta property="og:image"/);
assert.match(article, /<meta name="twitter:card" content="summary_large_image"/);
assert.match(article, /Important note:/);
assert.match(article, /Frequently Asked Questions/);
assert.match(article, /About the Author/);
assert.match(article, /Ready to Explore More Opportunities/);
assert.match(article, /Your Next Chapter Should Be About Building Wealth/);
assert.match(landing, new RegExp(`/blog/${slug}/`));
assert.match(sitemap, new RegExp(canonical));
assert.match(robots, /Sitemap: https:\/\/drhauwaphd.ca\/sitemap.xml/);

const schemaText = article.match(/<script type="application\/ld\+json">([^<]+)<\/script>/)?.[1];
assert.ok(schemaText, 'Article JSON-LD exists');
const schema = JSON.parse(schemaText);
for (const type of ['BlogPosting', 'Person', 'Organization', 'BreadcrumbList']) {
  assert.ok(schema['@graph'].some(item => item['@type'] === type), `${type} schema exists`);
}
const post = schema['@graph'].find(item => item['@type'] === 'BlogPosting');
assert.equal(post.url, canonical);
assert.ok(post.datePublished && post.dateModified);

const ids = new Set([...article.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]));
for (const [, target] of article.matchAll(/href="#([^"]+)"/g)) {
  assert.ok(ids.has(target), `In-page link #${target} exists`);
}
for (const [, file] of article.matchAll(/(?:src|href)="\/(?!#|blog\/)([^"#]+)"/g)) {
  await stat(join(dist, file));
}

// Ensure every line of the approved source survives static rendering.
const plainHtml = article.replace(/<script[^>]*>[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ')
  .replaceAll('&amp;', '&').replaceAll('&#39;', "'").replaceAll('&quot;', '"')
  .replace(/\s+/g, ' ');
for (const raw of source.split(/\r?\n/)) {
  const line = raw.trim();
  if (!line || line === '---') continue;
  const text = line.replace(/^#{1,3}\s+|^-\s+|\*\*/g, '')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1').replace(/\s+/g, ' ');
  assert.ok(plainHtml.includes(text), `Missing approved copy: ${text.slice(0, 80)}`);
}

console.log('Blog content, metadata, structured data, local assets, and sitemap checks passed.');

const offers = JSON.parse(await readFile(join(process.cwd(), 'content', 'offers.json'), 'utf8'));
assert.equal(offers.length, 6);
assert.equal(new Set(offers.map(offer => offer.id)).size, 6);
const staticPaths = ['/opportunities/', '/diaspora-wealth-network/', '/ai-training/', '/privacy-policy/',
  ...JSON.parse(await readFile(join(process.cwd(), 'content', 'guides.json'), 'utf8'))
    .map(guide => `/blog/${guide.slug}/`)];
for (const path of staticPaths) {
  const html = await readFile(join(dist, path.slice(1), 'index.html'), 'utf8');
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `${path} has one H1`);
  assert.match(html, new RegExp(`https://drhauwaphd.ca${path}`));
  assert.match(html, /<meta name="description"/);
  assert.match(html, /<script type="application\/ld\+json">/);
  assert.match(html, /\/favicon.ico/);
  assert.match(html, /\/free-guide-popup.js/);
  assert.match(sitemap, new RegExp(`https://drhauwaphd.ca${path}`));
}
const opportunities = await readFile(join(dist, 'opportunities', 'index.html'), 'utf8');
for (const offer of offers) {
  assert.ok(opportunities.includes(`data-offer-id="${offer.id}"`), `${offer.id} is linked`);
  assert.ok(opportunities.includes(`href="${offer.url}"`), `${offer.id} uses the verified destination`);
}
const ai = await readFile(join(dist, 'ai-training', 'index.html'), 'utf8');
assert.match(ai, /href="\/#ai-training"/);
const tracking = await readFile(join(dist, 'site-tracking.js'), 'utf8');
assert.doesNotMatch(tracking, /connect\.facebook\.net|fbq\(/);
const popup = await readFile(join(dist, 'free-guide-popup.js'), 'utf8');
assert.match(popup, /free_guide_popup/);
assert.match(popup, /\/api\/health/);
assert.match(popup, /\/api\/leads/);
assert.match(popup, /\/api\/engagement/);
assert.match(await readFile(join(dist, 'index.html'), 'utf8'), /\/free-guide-popup.js/);
console.log('Offers, AI training, privacy, new guides, metadata, sitemap and inactive Meta Pixel checks passed.');
