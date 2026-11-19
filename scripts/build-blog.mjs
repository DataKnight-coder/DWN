import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
const turnstileMeta = /^[A-Za-z0-9_-]{10,}$/.test(process.env.VITE_TURNSTILE_SITE_KEY || '') ? `<meta name="dwn-turnstile-site-key" content="${process.env.VITE_TURNSTILE_SITE_KEY}">` : '';

const root = process.cwd();
const site = 'https://drhauwaphd.ca';
const slug = 'build-wealth-as-an-immigrant-in-canada';
const articlePath = `/blog/${slug}/`;
const articleUrl = `${site}${articlePath}`;
const title = 'How to Build Wealth as an Immigrant in Canada: A Practical Guide to Financial Independence';
const seoTitle = 'How to Build Wealth as an Immigrant in Canada | Dr. Hauwa';
const description = 'Discover practical ways to build wealth as an immigrant in Canada through career growth, saving, investing, entrepreneurship and multiple income streams.';
const author = 'Dr. Hauwa Christiana Amiebenomo, PhD';
const published = '2026-11-14';
const image = `${site}/immigrant-professional-financial-planning-canada.webp`;
const markdown = await readFile(join(root, 'content', `${slug}.md`), 'utf8');
const articleDir = join(root, 'public', 'blog', slug);
await mkdir(articleDir, { recursive: true });

function escapeHtml(value) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

function inline(value) {
  const escaped = escapeHtml(value);
  return escaped.replace(/\*\*\[([^\]]+)\]\((https?:\/\/[^)]+|\/[^)]+)\)\*\*/g, (_m, label, href) => `<strong><a href="${href}">${label}</a></strong>`)
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+|\/[^)]+)\)/g, (_m, label, href) => `<a href="${href}">${label}</a>`)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

function idFor(value) {
  return value.toLowerCase().replace(/^\d+\.\s*/, '').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
}

const sections = [];
let list = [];
let paragraph = [];
let articleHtml = '';
function flushParagraph() {
  if (paragraph.length) articleHtml += `<p>${inline(paragraph.join(' '))}</p>\n`;
  paragraph = [];
}
function flushList() {
  if (list.length) articleHtml += `<ul>${list.map(item => `<li>${inline(item)}</li>`).join('')}</ul>\n`;
  list = [];
}
for (const raw of markdown.replaceAll('\r\n', '\n').split('\n')) {
  const line = raw.trim();
  if (!line) { flushParagraph(); flushList(); continue; }
  if (line.startsWith('# ')) continue; // The page template owns the sole H1.
  if (line === '---') { flushParagraph(); flushList(); articleHtml += '<hr>\n'; continue; }
  if (line.startsWith('## ') || line.startsWith('### ')) {
    flushParagraph(); flushList();
    const level = line.startsWith('### ') ? 3 : 2;
    const heading = line.slice(level + 1);
    const id = idFor(heading);
    if (level === 2) sections.push({ heading, id });
    articleHtml += `<h${level} id="${id}">${inline(heading)}</h${level}>\n`;
    continue;
  }
  if (line.startsWith('- ')) { flushParagraph(); list.push(line.slice(2)); continue; }
  flushList();
  paragraph.push(line);
}
flushParagraph(); flushList();

// Insert the requested CTA after the income streams section, keeping approved copy intact.
const midCta = `<aside class="callout" aria-labelledby="mid-cta"><p class="eyebrow">Diaspora Wealth Network</p><h2 id="mid-cta">Ready to Explore More Opportunities?</h2><p>Building wealth requires more than earning a salary. It requires knowledge, connections and the right opportunities. Explore how Diaspora Wealth Network helps immigrants develop their professional and entrepreneurial potential.</p><a class="button" href="/diaspora-wealth-network/">Explore Diaspora Wealth Network</a></aside>`;
articleHtml = articleHtml.replace(/(<h2 id="learn-how-to-invest-and-build-long-term-assets">)/, `${midCta}\n$1`);

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'Organization', '@id': `${site}/#organization`, name: 'Diaspora Wealth Network', url: `${site}/`, founder: { '@id': `${site}/#dr-hauwa` } },
    { '@type': 'Person', '@id': `${site}/#dr-hauwa`, name: author, url: `${site}/#about`, image: `${site}/dr-hauwa.jpg`, worksFor: { '@id': `${site}/#organization` } },
    { '@type': 'BlogPosting', '@id': `${articleUrl}#article`, headline: title, description, image: { '@type': 'ImageObject', url: image, width: 1672, height: 941 }, author: { '@id': `${site}/#dr-hauwa` }, publisher: { '@id': `${site}/#organization` }, datePublished: published, dateModified: published, mainEntityOfPage: { '@type': 'WebPage', '@id': articleUrl }, url: articleUrl },
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${site}/` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${site}/blog/` },
      { '@type': 'ListItem', position: 3, name: title, item: articleUrl }
    ] }
  ]
};

function page({ pageTitle, pageDescription, canonical, type, body, jsonLd = null, socialImage = image }) {
  return `<!doctype html>
<html lang="en-CA"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" href="/favicon.ico" sizes="any"><link rel="icon" href="/favicon-48.png" type="image/png" sizes="48x48"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><link rel="stylesheet" href="/blog.css"><link rel="stylesheet" href="/growth.css"><link rel="stylesheet" href="/free-guide-popup.css"><link rel="canonical" href="${canonical}"><title>${escapeHtml(pageTitle)}</title><meta name="description" content="${escapeHtml(pageDescription)}"><meta property="og:type" content="${type}"><meta property="og:site_name" content="Dr. Hauwa"><meta property="og:locale" content="en_CA"><meta property="og:url" content="${canonical}"><meta property="og:title" content="${escapeHtml(pageTitle)}"><meta property="og:description" content="${escapeHtml(pageDescription)}"><meta property="og:image" content="${socialImage}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escapeHtml(pageTitle)}"><meta name="twitter:description" content="${escapeHtml(pageDescription)}"><meta name="twitter:image" content="${socialImage}"><script src="/site-tracking.js" defer></script>${turnstileMeta}<script src="/free-guide-popup.js" defer></script>${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd).replaceAll('<', '\\u003c')}</script>` : ''}</head>
<body><a class="skip-link" href="#main">Skip to content</a><header class="site-header"><div class="header-inner"><a class="wordmark" href="/" aria-label="Dr. Hauwa home">DR. HAUWA</a><nav aria-label="Primary navigation"><a href="/opportunities/">Opportunities</a><a href="/diaspora-wealth-network/">DWN</a><a href="/ai-training/">AI training</a><a href="/blog/">Blog</a></nav><a class="header-cta" href="/diaspora-wealth-network/">Explore DWN</a></div></header><main id="main">${body}</main><footer class="site-footer"><div><strong>DR. HAUWA</strong><p>Building careers, brands, businesses, assets, and long-term wealth for the global diaspora.</p></div><nav aria-label="Footer navigation"><a href="/">Home</a><a href="/opportunities/">Opportunities</a><a href="/diaspora-wealth-network/">Diaspora Wealth Network</a><a href="/blog/">Blog</a><button type="button" data-open-tracking-choice>Tracking choices</button></nav><p>© ${new Date().getFullYear()} Dr. Hauwa</p></footer></body></html>`;
}

const toc = sections.filter(({ heading }) => heading !== 'Frequently Asked Questions').map(({ heading, id }) => `<li><a href="#${id}">${escapeHtml(heading)}</a></li>`).join('');
const articleBody = `<div class="article-shell"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><a href="/blog/">Blog</a><span aria-hidden="true">/</span><span aria-current="page">Building wealth in Canada</span></nav><article><header class="article-header"><p class="eyebrow">Financial independence</p><h1>${escapeHtml(title)}</h1><p class="dek">A practical guide to building income, financial resilience and long-term assets in Canada.</p><div class="byline"><img src="/dr-hauwa.jpg" alt="Portrait of Dr. Hauwa Christiana Amiebenomo" width="48" height="48"><div><a href="/#about">${author}</a><span><time datetime="${published}">14 November 2026</time> · Financial planning for newcomers</span></div></div></header><figure class="hero-image"><picture><source media="(max-width: 700px)" srcset="/immigrant-professional-financial-planning-canada-840.webp"><img src="/immigrant-professional-financial-planning-canada.webp" width="1672" height="941" alt="Immigrant professional reviewing a financial plan at a Canadian city workspace" fetchpriority="high"></picture></figure><div class="article-grid"><aside class="toc" aria-label="On this page"><h2>On this page</h2><ol>${toc}</ol></aside><div class="article-content">${articleHtml}<aside class="resources"><h2>Official resources</h2><p>Check current eligibility, limits and rules directly with Canadian government sources:</p><ul><li><a href="https://www.canada.ca/en/financial-consumer-agency/services/credit-reports-score/order-credit-report.html">Get your credit report and score</a></li><li><a href="https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/tax-free-savings-account/opening.html">Tax-Free Savings Account eligibility</a></li><li><a href="https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/rrsps-related-plans/registered-retirement-savings-plan-rrsp.html">Registered Retirement Savings Plans</a></li><li><a href="https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/first-home-savings-account/opening-your-fhsas.html">First Home Savings Account eligibility</a></li></ul></aside><aside class="author-box" aria-labelledby="author-heading"><img src="/dr-hauwa.jpg" alt="Dr. Hauwa Christiana Amiebenomo" width="120" height="120" loading="lazy"><div><p class="eyebrow">About the author</p><h2 id="author-heading">${author}</h2><p>Entrepreneur, technology professional and founder of Diaspora Wealth Network.</p><a href="/#about">Read Dr. Hauwa’s biography</a></div></aside><nav class="related" aria-label="Explore related topics"><h2>Explore related topics</h2><ul><li><a href="/blog/online-side-hustles-canada/">Online side hustles in Canada</a></li><li><a href="/blog/affiliate-marketing-canada/">Affiliate marketing in Canada</a></li><li><a href="/blog/cybersecurity-career-canada/">Technology and cybersecurity careers</a></li></ul></nav><aside class="callout final-callout" aria-labelledby="final-cta"><p class="eyebrow">Diaspora Wealth Network</p><h2 id="final-cta">Your Next Chapter Should Be About Building Wealth.</h2><p>Join a community of immigrants, professionals and entrepreneurs committed to learning, connecting and exploring opportunities for long-term growth.</p><a class="button" href="/diaspora-wealth-network/">Discover DWN</a></aside></div></div></article></div>`;

const blogBody = `<section class="blog-intro"><div class="breadcrumbs"><a href="/">Home</a><span aria-hidden="true">/</span><span aria-current="page">Blog</span></div><p class="eyebrow">Insights from Dr. Hauwa</p><h1>Practical ideas for building more than a career.</h1><p>Explore career growth, financial education, entrepreneurship and long-term opportunity for immigrants and diaspora professionals.</p></section><section class="blog-list" aria-labelledby="latest"><h2 id="latest">Latest article</h2><a class="article-card" href="${articlePath}"><img src="/immigrant-professional-financial-planning-canada-840.webp" width="840" height="473" alt="Immigrant professional reviewing a financial plan in Canada" loading="lazy"><span><span class="eyebrow">Financial independence · <time datetime="${published}">14 November 2026</time></span><strong>${escapeHtml(title)}</strong><span class="card-summary">Learn how to connect career growth, careful saving, investing and entrepreneurship into a long-term wealth plan.</span><span class="read-more">Read the guide →</span></span></a></section>`;

await writeFile(join(root, 'public', 'blog', 'index.html'), page({ pageTitle: 'Blog | Dr. Hauwa', pageDescription: 'Insights on career growth, financial education, entrepreneurship and long-term opportunity for immigrants and diaspora professionals.', canonical: `${site}/blog/`, type: 'website', body: blogBody }));
await writeFile(join(articleDir, 'index.html'), page({ pageTitle: seoTitle, pageDescription: description, canonical: articleUrl, type: 'article', body: articleBody, jsonLd: schema }));
await writeFile(join(root, 'public', 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${site}/</loc></url><url><loc>${site}/blog/</loc></url><url><loc>${articleUrl}</loc><lastmod>${published}</lastmod></url></urlset>\n`);
await writeFile(join(root, 'public', 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${site}/sitemap.xml\n`);
console.log('Generated static blog pages and sitemap.');
