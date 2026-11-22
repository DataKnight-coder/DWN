import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
const turnstileMeta = /^[A-Za-z0-9_-]{10,}$/.test(process.env.VITE_TURNSTILE_SITE_KEY || '') ? `<meta name="dwn-turnstile-site-key" content="${process.env.VITE_TURNSTILE_SITE_KEY}">` : '';
const pixelMeta = /^\d{8,20}$/.test(process.env.VITE_META_PIXEL_ID || '') ? `<meta name="dwn-meta-pixel-id" content="${process.env.VITE_META_PIXEL_ID}">` : '';

const root = process.cwd();
const site = 'https://drhauwaphd.ca';
const offers = JSON.parse(await readFile(join(root, 'content', 'offers.json'), 'utf8'));
const guides = JSON.parse(await readFile(join(root, 'content', 'guides.json'), 'utf8'));
const testimonials = JSON.parse(await readFile(join(root, 'content', 'testimonials.json'), 'utf8'));
const offer = id => offers.find(item => item.id === id);
const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
const slugId = value => value.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
const offerLink = (item, placement, extra = '') => `<a class="button" href="${esc(item.url)}" data-offer-id="${esc(item.id)}" data-cta="${esc(placement)}" target="_blank" rel="noreferrer">${esc(item.cta)} <span aria-hidden="true">↗</span></a>${extra}`;

function page({ path, title, description, body, type = 'website', schema, image = `${site}/dr-hauwa.jpg` }) {
  const url = `${site}${path}`;
  const graph = schema || { '@context': 'https://schema.org', '@graph': [
    { '@type': 'WebPage', '@id': url, url, name: title, description },
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${site}/` },
      { '@type': 'ListItem', position: 2, name: title, item: url }
    ] }
  ] };
  return `<!doctype html><html lang="en-CA"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" href="/favicon.ico" sizes="any"><link rel="icon" href="/favicon-48.png" type="image/png" sizes="48x48"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><link rel="stylesheet" href="/blog.css"><link rel="stylesheet" href="/blog-premium.css"><link rel="stylesheet" href="/growth.css"><link rel="stylesheet" href="/free-guide-popup.css"><link rel="canonical" href="${url}"><title>${esc(title)} | Dr. Hauwa</title><meta name="description" content="${esc(description)}"><meta property="og:type" content="${type}"><meta property="og:site_name" content="Dr. Hauwa"><meta property="og:locale" content="en_CA"><meta property="og:url" content="${url}"><meta property="og:title" content="${esc(title)} | Dr. Hauwa"><meta property="og:description" content="${esc(description)}"><meta property="og:image" content="${image}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)} | Dr. Hauwa"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${image}"><script type="application/ld+json">${JSON.stringify(graph).replaceAll('<', '\\u003c')}</script><script src="/site-tracking.js" defer></script>${turnstileMeta}<script src="/blog-ui.js" defer></script><script src="/free-guide-popup.js" defer></script>${pixelMeta}<script src="/meta-pixel.js" defer></script></head><body><a class="skip-link" href="#main">Skip to content</a><header class="site-header"><div class="header-inner"><a class="wordmark" href="/" aria-label="Dr. Hauwa home">DR. HAUWA</a><nav aria-label="Primary navigation"><a href="/opportunities/">Opportunities</a><a href="/diaspora-wealth-network/">DWN</a><a href="/ai-training/">AI training</a><a href="/blog/">Blog</a></nav><a class="header-cta" href="${esc(offer('dwn-membership').url)}" data-offer-id="dwn-membership" data-cta="static_header_membership" target="_blank" rel="noreferrer">Become a member</a></div></header><main id="main">${body}</main><footer class="site-footer"><div><strong>DR. HAUWA</strong><p>Career, business and wealth education for immigrants and diaspora professionals.</p></div><nav aria-label="Footer navigation"><a href="/">Home</a><a href="/opportunities/">Opportunities</a><a href="/diaspora-wealth-network/">DWN membership</a><a href="/ai-training/">AI training</a><a href="/blog/">Guides</a><a href="/privacy-policy/">Privacy</a><a href="/#unsubscribe">Stop DWN emails</a><button type="button" data-open-tracking-choice>Tracking choices</button></nav><p>© ${new Date().getFullYear()} Dr. Hauwa</p></footer></body></html>`;
}

async function save(path, html) {
  const dir = join(root, 'public', path.replace(/^\//, ''));
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, 'index.html'), html);
}

function inline(text) {
  return esc(text).replace(/\[([^\]]+)\]\((https?:\/\/[^)]+|\/[^)]+)\)/g, (_m, label, href) => {
    const matchedOffer = offers.find(item => item.url === href);
    const tracking = matchedOffer ? ` data-offer-id="${matchedOffer.id}" data-cta="guide_inline_${matchedOffer.id}"` : '';
    return `<a href="${href}"${tracking}${href.startsWith('http') ? ' target="_blank" rel="noreferrer"' : ''}>${label}</a>`;
  })
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}
function markdownToHtml(markdown) {
  let html = '', paragraph = [], list = [], olist = [], table = [];
  const flushParagraph = () => { if (paragraph.length) html += `<p>${inline(paragraph.join(' '))}</p>`; paragraph = []; };
  const flushList = () => { if (list.length) html += `<ul>${list.map(line => `<li>${inline(line)}</li>`).join('')}</ul>`; list = []; };
  const flushOrdered = () => { if (olist.length) html += `<ol>${olist.map(line => `<li>${inline(line)}</li>`).join('')}</ol>`; olist = []; };
  const cells = row => row.replace(/^\|/, '').replace(/\|$/, '').split('|').map(cell => cell.trim());
  const flushTable = () => {
    if (table.length >= 2) {
      const [head, , ...body] = table;
      html += `<div class="table-wrap"><table><thead><tr>${cells(head).map(c => `<th scope="col">${inline(c)}</th>`).join('')}</tr></thead><tbody>${body.map(r => `<tr>${cells(r).map((c, i) => i === 0 ? `<th scope="row">${inline(c)}</th>` : `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    }
    table = [];
  };
  const flushAll = () => { flushParagraph(); flushList(); flushOrdered(); flushTable(); };
  for (const raw of markdown.replaceAll('\r\n', '\n').split('\n')) {
    const line = raw.trim();
    if (!line) { flushAll(); continue; }
    if (line.startsWith('# ')) continue;
    if (/^#{2,3} /.test(line)) {
      flushAll();
      const level = line.startsWith('### ') ? 3 : 2;
      const label = line.slice(level + 1);
      html += `<h${level} id="${slugId(label)}">${inline(label)}</h${level}>`;
      continue;
    }
    if (line.startsWith('|')) { flushParagraph(); flushList(); flushOrdered(); table.push(line); continue; }
    if (/^\d+\.\s/.test(line)) { flushParagraph(); flushList(); flushTable(); olist.push(line.replace(/^\d+\.\s+/, '')); continue; }
    if (line.startsWith('- ')) { flushParagraph(); flushOrdered(); flushTable(); list.push(line.slice(2)); continue; }
    flushList(); flushOrdered(); flushTable(); paragraph.push(line);
  }
  flushAll();
  return html;
}

const opportunitiesBody = `<div class="editorial-shell"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><span aria-current="page">Opportunities</span></nav><header class="editorial-hero"><p class="eyebrow">Explore your options</p><h1>Choose an opportunity that fits your next step.</h1><p>Begin with a free learning resource, explore ongoing community education, or book individual strategy support. These are distinct offers, delivered by the provider named on each link.</p></header><section aria-labelledby="offer-list-heading"><h2 id="offer-list-heading">Six current opportunities</h2><div class="offer-list">${offers.map((item, index) => `<article class="offer-row"><span class="offer-number" aria-hidden="true">0${index + 1}</span><div><p class="eyebrow">${esc(item.category)}</p><h3>${esc(item.title)}</h3><p>${esc(item.description)}</p>${item.id === 'dwn-membership' ? '<a href="/diaspora-wealth-network/">Learn what membership covers</a>' : ''}<small>Opens on ${esc(item.provider)}. Read its current terms before enrolling.</small></div>${offerLink(item, `opportunities_${item.id}`)}</article>`).join('')}</div></section><aside class="editorial-note"><h2>Choose with clarity</h2><p>The free guide and the free quarterly masterclass are introductory resources. DWN membership is ongoing community education and mentorship. The strategy session is a paid one-on-one session with Dr. Hauwa; the price is shown on Selfany before you pay. The Africa waiting room is an interest list; the housing blueprint is an educational resource hosted on Stan Store. None promises a specific income or financial outcome.</p><a href="/blog/">Read practical Canadian guides →</a></aside></div>`;
await save('/opportunities/', page({ path: '/opportunities/', title: 'Opportunities for Diaspora Professionals', description: 'Compare six current Dr. Hauwa learning, membership and strategy opportunities and follow verified provider links.', body: opportunitiesBody }));

const proofIds = ['dwn-pdf-05', 'dwn-pdf-18', 'dwn-pdf-24'];
const proof = proofIds.map(id => testimonials.find(item => item.id === id)).filter(Boolean);
const membershipBody = `<div class="editorial-shell"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><span aria-current="page">DWN membership</span></nav><header class="editorial-hero"><p class="eyebrow">Diaspora Wealth Network</p><h1>Build alongside people exploring new possibilities.</h1><p>DWN is for immigrants, diaspora professionals and entrepreneurs who want community education, mentorship and a place to explore 18 income pathways. Learn what this membership is for, then review enrollment on Selfany.</p>${offerLink(offer('dwn-membership'), 'membership_hero')}</header><section class="editorial-columns" aria-labelledby="member-for"><div><h2 id="member-for">Who it is for</h2><p>People who want to develop professional and entrepreneurial options, learn from others and assess opportunities with a longer-term view. You may be at the beginning of your journey or bringing existing experience to a new market.</p></div><div><h2>What the community offers</h2><p>The confirmed offer is annual community access with mentorship and education across 18 income pathways. DWN brings together learning about careers, digital opportunities, business, property awareness and networking. Check the Selfany offer page for the current enrollment terms and what is included today.</p></div></section><section aria-labelledby="member-experiences"><h2 id="member-experiences">Member experiences</h2><p>These are excerpts from the approved DWN member record. They describe individual experiences, not expected results.</p><div class="quote-list">${proof.map(item => `<blockquote><p>“${esc(item.quote)}”</p><footer>${esc(item.attribution)}</footer></blockquote>`).join('')}</div><a href="/#testimonials-title">Browse more approved member experiences →</a></section><section class="editorial-faq" aria-labelledby="member-faq"><h2 id="member-faq">Frequently asked questions</h2><h3>Is DWN a free resource?</h3><p>DWN membership is separate from the free guide and free masterclass. Review the current annual membership terms on Selfany before enrolling.</p><h3>Does membership guarantee income or a job?</h3><p>No. Education, mentorship and community can support decisions and action, but results depend on individual circumstances and effort.</p><h3>Where do I enroll and access membership?</h3><p>Selfany manages enrollment, payment and member access. This website provides information and links to the verified Selfany offer.</p><h3>Can I start with a free resource?</h3><p>Yes. <a href="/opportunities/">Compare the free guide and masterclass</a> with the membership and other opportunities.</p></section><aside class="editorial-cta"><h2>Explore the membership terms</h2><p>See the current offer and enrollment details directly on Selfany.</p>${offerLink(offer('dwn-membership'), 'membership_final')}</aside></div>`;
await save('/diaspora-wealth-network/', page({ path: '/diaspora-wealth-network/', title: 'Diaspora Wealth Network Membership', description: 'Explore who DWN is for, its confirmed community education and mentorship focus, member experiences and the verified Selfany enrollment link.', body: membershipBody }));


const defaultCallout = { eyebrow: 'Explore your next step', heading: 'Learn with a community.', text: 'See how DWN combines community education and mentorship, then check current membership terms on Selfany.', href: '/diaspora-wealth-network/', label: 'Explore DWN membership' };

const longDate = iso => new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const readMins = text => Math.max(2, Math.round(text.split(/\s+/).length / 200));
const minsBySlug = new Map();
for (const item of [{ slug: 'build-wealth-as-an-immigrant-in-canada' }, ...guides]) {
  try { minsBySlug.set(item.slug, readMins(await readFile(join(root, 'content', `${item.slug}.md`), 'utf8'))); } catch { minsBySlug.set(item.slug, 5); }
}
const cardHtml = item => `<a class="pb-card" href="/blog/${esc(item.slug)}/" data-category="${esc(item.category)}" data-text="${esc((item.title + ' ' + item.summary + ' ' + item.category).toLowerCase())}"><span class="pb-pill">${esc(item.category)}</span><strong>${esc(item.title)}</strong><p class="pb-sum">${esc(item.summary)}</p><span class="pb-meta"><span>${minsBySlug.get(item.slug)} min read</span><b>Read the guide →</b></span></a>`;
function relatedFor(guide) {
  const same = guides.filter(item => item.category === guide.category && item.slug !== guide.slug);
  const rest = guides.filter(item => item.category !== guide.category && item.slug !== guide.slug);
  return [...same, ...rest].slice(0, 3);
}

function guideToc(current) {
  const groups = new Map();
  for (const item of guides) { if (!groups.has(item.category)) groups.set(item.category, []); groups.get(item.category).push(item); }
  return [...groups.entries()].map(([category, items]) => `<h3>${esc(category)}</h3><ol>${items.map(item => item.slug === current ? `<li><span aria-current="page">${esc(item.title)}</span></li>` : `<li><a href="/blog/${item.slug}/">${esc(item.title)}</a></li>`).join('')}</ol>`).join('');
}

for (const guide of guides) {
  const url = `${site}/blog/${guide.slug}/`;
  const source = await readFile(join(root, 'content', `${guide.slug}.md`), 'utf8');
  const heads = source.replaceAll('\r\n', '\n').split('\n').filter(line => line.startsWith('## ')).map(line => line.slice(3).trim());
  const tocHtml = heads.map(label => `<li><a href="#${slugId(label)}">${esc(label)}</a></li>`).join('');
  const relatedHtml = relatedFor(guide).map(cardHtml).join('');
  const body = `<div class="pb-progress" aria-hidden="true"><span></span></div><div class="article-shell"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><a href="/blog/">Guides</a><span>/</span><span aria-current="page">${esc(guide.category)}</span></nav><article><header class="article-header"><span class="pb-pill">${esc(guide.category)}</span><h1>${esc(guide.title)}</h1><p class="dek">${esc(guide.summary)}</p><div class="byline"><img src="/dr-hauwa.jpg" alt="Diaspora Wealth Network" width="48" height="48"><div><strong>Diaspora Wealth Network</strong><span class="pb-byline-meta"><time datetime="${guide.published}">${longDate(guide.published)}</time><span>${minsBySlug.get(guide.slug)} min read</span><span>Educational guide</span></span></div></div></header><div class="article-grid"><aside class="toc" aria-label="On this page"><details class="pb-toc"><summary>On this page</summary><ol>${tocHtml}</ol></details></aside><div class="article-content">${markdownToHtml(source)}<aside class="callout"><p class="eyebrow">${esc((guide.callout||defaultCallout).eyebrow)}</p><h2>${esc((guide.callout||defaultCallout).heading)}</h2><p>${esc((guide.callout||defaultCallout).text)}</p><a class="button" href="${(guide.callout||defaultCallout).href}">${esc((guide.callout||defaultCallout).label)}</a></aside></div></div></article></div><section class="pb-related" aria-labelledby="keep-reading"><h2 id="keep-reading">Keep reading</h2><div class="pb-grid">${relatedHtml}</div></section><details class="pb-all"><summary>Browse all guides</summary>${guideToc(guide.slug)}</details>`;
  const schema = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Organization', '@id': `${site}/#dwn-organization`, name: 'Diaspora Wealth Network', url: `${site}/` },
    { '@type': 'BlogPosting', '@id': `${url}#article`, headline: guide.title, description: guide.description,
      datePublished: guide.published, dateModified: guide.published, author: { '@id': `${site}/#dwn-organization` },
      publisher: { '@id': `${site}/#dwn-organization` }, mainEntityOfPage: url, url },
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${site}/` },
      { '@type': 'ListItem', position: 2, name: 'Guides', item: `${site}/blog/` },
      { '@type': 'ListItem', position: 3, name: guide.title, item: url }
    ] }
  ] };
  await save(`/blog/${guide.slug}/`, page({ path: `/blog/${guide.slug}/`, title: guide.title, description: guide.description, body, type: 'article', schema }));
}

const allGuides = [
  { slug: 'build-wealth-as-an-immigrant-in-canada', title: 'How to Build Wealth as an Immigrant in Canada', category: 'Financial independence', summary: 'Connect career growth, saving, investing and entrepreneurship into a long-term plan.' },
  ...guides
];
const topicCounts = new Map();
for (const item of allGuides) topicCounts.set(item.category, (topicCounts.get(item.category) || 0) + 1);
const topics = [...topicCounts.entries()].sort((x, y) => y[1] - x[1]).map(([name]) => name);
const featuredGuide = allGuides.find(item => item.slug === 'ai-training-jobs-guide') || allGuides[0];
const chipsHtml = ['All', ...topics].map((name, index) => `<button type="button" class="pb-chip" data-topic="${esc(name)}" aria-pressed="${index === 0}">${esc(name)}</button>`).join('');
const blogBody = `<section class="pb-hero"><div class="pb-hero-inner"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><span aria-current="page">Guides</span></nav><p class="eyebrow">DWN educational guides</p><h1>Practical guides for your <em>next chapter.</em></h1><p class="lede">Clear, sourced answers on Canadian careers, online income, AI-training work, selling online and building long-term assets. They explain options and trade-offs; they do not promise a job, sale or investment result.</p><div class="pb-search" role="search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><input type="search" placeholder="Search guides, for example Mercor or TFSA" aria-label="Search guides" autocomplete="off"></div></div></section><div class="pb-main"><div class="pb-chips" role="group" aria-label="Filter guides by topic">${chipsHtml}</div><p class="pb-count" aria-live="polite">${allGuides.length} guides</p><a class="pb-featured" href="/blog/${esc(featuredGuide.slug)}/"><span class="pb-fx"><span class="pb-label">Start here</span><strong>${esc(featuredGuide.title)}</strong><span class="pb-sum">${esc(featuredGuide.summary)}</span><span class="pb-go">${minsBySlug.get(featuredGuide.slug)} min read · Read the guide →</span></span><span class="pb-art" aria-hidden="true"><b>AI</b></span></a><div class="pb-grid">${allGuides.map(cardHtml).join('')}</div><p class="pb-empty">No guides match. Try a shorter word, or choose All.</p><aside class="pb-community"><p class="eyebrow">Learn with others</p><h2>Prefer to learn with a community?</h2><p>Each guide links to official sources where the rules matter. If you want live training, mentorship and a community alongside the free guides, see what the Diaspora Wealth Network includes.</p><a class="button" href="/diaspora-wealth-network/">Explore DWN</a></aside></div>`;
await save('/blog/', page({ path: '/blog/', title: 'Guides for Immigrants and Diaspora Professionals', description: 'Practical Canadian guides on online side hustles, affiliate marketing, digital products, cybersecurity careers and building wealth.', body: blogBody }));

const aiFaq = [
  ['What is AI training work?', 'It is paid work that helps improve AI systems: ranking and rating answers, checking facts, writing prompts and ideal responses, reviewing code and testing for safety. Companies use human judgment to make models more accurate and useful.'],
  ['Is AI training work a real job?', 'Real work exists, usually as part-time or project-based contracting rather than full-time employment. Hours are often not guaranteed. Scammers also copy this kind of work, so read our guide to spotting job scams before you apply.'],
  ['What are Mercor, micro1 and Handshake AI?', 'They are companies that connect skilled people with AI labs and businesses that need models trained and evaluated. Each sets its own eligibility, screening and pay. See our comparison for what each describes publicly and what to check.'],
  ['Do I need a degree or technical background?', 'Not always. Some entry-level projects value careful reading and following instructions. Expert projects ask for proven experience or qualifications in a subject, which can be professional experience as well as a degree.'],
  ['Can I do AI training work from Canada or outside the United States?', 'Often yes, but it depends on the platform and project. Some programs limit eligibility by country or work authorization, so read each current eligibility page before you apply.'],
  ['How much does AI training work pay?', 'It varies widely by project, expertise and platform, and no amount is guaranteed. Check the rate on the actual listing and treat figures in videos or posts as examples only.'],
  ['Do I have to pay to apply or to get access to tasks?', 'No. Legitimate platforms do not charge applicants for access, tests, training or pay. A request for money is a major warning sign.'],
  ['What will the community teach me?', 'Dr. Hauwa\'s community shares tips and training on finding and applying for AI-training work, preparing for AI-led interviews, avoiding scams and building other income paths such as eBay, Amazon and Shopify selling, dropshipping and affiliate marketing. Results vary by person and nothing is guaranteed.'],
  ['Is DWN affiliated with Mercor, micro1 or Handshake?', 'No. DWN is independent, and naming a platform is not an endorsement. Each company controls its own terms, availability and pay.'],
  ['Is there a certificate or a fixed course schedule?', 'A course outline, schedule, price and any completion record are not published here yet. Ask through the enquiry form and we will share the current details when they are confirmed.'],
  ['Can AI training work replace my job?', 'For most people it is extra, flexible income, not a guaranteed replacement for a stable job. Hours and availability change, so plan around that.'],
];
const aiCards = [
  ['AI training jobs: what they are and how to get started', '/blog/ai-training-jobs-guide/', 'Tasks, screening, preparation, taxes and honest expectations.'],
  ['Mercor, micro1 and Handshake AI compared', '/blog/ai-training-platforms-compared/', 'How each describes itself and what to check before applying.'],
  ['How to spot AI training and remote job scams', '/blog/ai-training-job-scams/', 'Warning signs from Canadian fraud authorities and what to do.'],
  ['Dropshipping for beginners: eBay, Shopify and Amazon', '/blog/dropshipping-beginners-guide/', 'How the models differ, plus Canadian tax and customs basics.'],
  ['eBay dropshipping: what is allowed', '/blog/ebay-dropshipping-guide/', 'Why you cannot fulfil eBay orders from Amazon.'],
  ['Amazon dropshipping rules', '/blog/amazon-dropshipping-rules/', 'The seller-of-record rule and packaging requirements.'],
  ['How to set up a Shopify store', '/blog/shopify-store-setup-guide/', 'A launch checklist: products, shipping, taxes, payments and policies.'],
  ['How to become a UGC creator', '/blog/ugc-creator-guide/', 'Portfolio, pitching, usage rights and contracts for brand content.'],
  ['How to find legitimate remote jobs', '/blog/remote-jobs-guide/', 'Where to look, how to filter and how to avoid fake offers.'],
  ['Affiliate marketing in Canada', '/blog/affiliate-marketing-canada/', 'Choose programs, disclose commissions and track results.'],
  ['Best affiliate programs in Canada', '/blog/best-affiliate-programs-canada/', 'Amazon Associates, Shopify and the main networks compared.'],
];
const aiTrainingBody = `<div class="editorial-shell"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><span aria-current="page">AI training</span></nav>
<header class="editorial-hero"><p class="eyebrow">AI training with Dr. Hauwa</p><h1>Practical AI skills, and how to find AI-training work.</h1><p>Dr. Hauwa's community shares tips and training on finding and applying for AI-training gigs on platforms such as Mercor, micro1 and Handshake AI, and on using AI for work, learning and business. It is open to anyone, wherever you live. No income is guaranteed, and each platform sets its own terms.</p><a class="button" href="/#ai-training">Ask about AI training</a> <a class="button" href="/blog/ai-training-jobs-guide/">Read the AI training jobs guide</a></header>
<section class="editorial-columns"><div><h2>Two ways to build AI skills</h2><p><strong>Use AI well.</strong> Learn to give clear instructions, check outputs, protect private information and apply AI to research, writing, admin work and business tasks.</p><p><strong>Work on AI.</strong> Learn how people are paid to rank, rate, write and evaluate AI outputs, and how to find, apply for and prepare for that work.</p></div><div><h2>Who it is for</h2><p>Professionals, students, career changers, entrepreneurs and people building extra income. You do not need to be technical to begin. Whether you are an immigrant, a newcomer or a long-time resident, the goal is the same: realistic skills and safe choices.</p></div></section>
<section><h2>What AI-training work involves</h2><div class="guide-list"><article class="guide-row"><h3>Ranking and rating answers</h3><p>Compare responses, decide which is better and explain why. This human feedback helps models improve.</p></article><article class="guide-row"><h3>Writing prompts and ideal answers</h3><p>Create questions and model responses in your subject area or language.</p></article><article class="guide-row"><h3>Checking facts and reasoning</h3><p>Verify accuracy, spot errors and apply professional judgment in fields such as finance, law, health, science, teaching or languages.</p></article><article class="guide-row"><h3>Reviewing and correcting code</h3><p>Fix and explain auto-generated scripts for people with programming skills.</p></article><article class="guide-row"><h3>Safety testing</h3><p>Probe where a model fails or behaves badly, following strict project guidelines.</p></article></div></section>
<section><h2>Platforms people ask about</h2><p>Each platform describes itself differently and sets its own eligibility, screening and pay. Read our <a href="/blog/ai-training-platforms-compared/">side-by-side comparison</a> and each company's official pages before applying. Naming a platform here is not an endorsement, and DWN is not affiliated with any of them.</p><div class="guide-list"><article class="guide-row"><h3>Mercor</h3><p>A talent marketplace connecting domain experts with AI labs and enterprises. Applicants typically complete an AI-led interview in a chosen domain.</p></article><article class="guide-row"><h3>micro1</h3><p>A data company that supplies experts for AI training and evaluation and screens applicants with an AI interviewer. Roles are independent contractor work.</p></article><article class="guide-row"><h3>Handshake AI</h3><p>Handshake's program for students, graduates and professionals doing paid, part-time, project-based AI evaluation work. Eligibility conditions apply, so check your country and status.</p></article></div></section>
<section class="editorial-columns"><div><h2>How the community helps</h2><p>Dr. Hauwa and the Diaspora Wealth Network community share tips and training on how to find AI-training work, prepare a strong profile, handle AI-led interviews, read agreements carefully and avoid scams. Members can ask questions and learn from each other's experience.</p></div><div><h2>Beyond AI training</h2><p>The same community covers other practical income paths: selling on eBay and Amazon, dropshipping and Shopify stores, and affiliate marketing. Explore them in our guides below, and <a href="/diaspora-wealth-network/">see what DWN membership includes</a>.</p></div></section>
<section><h2>Before you start: stay safe</h2><p>Real work exists, and scammers copy it. A genuine platform never charges you to apply, test, train or get paid. Read <a href="/blog/ai-training-job-scams/">how to spot AI training and remote job scams</a> before you share documents or money with anyone.</p></section>
<section><h2>Guides that answer your questions</h2><div class="guide-list">${aiCards.map(([title, href, text]) => `<article class="guide-row"><h3><a href="${href}">${title}</a></h3><p>${text}</p></article>`).join('')}</div></section>
<section class="editorial-faq"><h2>Frequently asked questions</h2>${aiFaq.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join('')}</section>
<aside class="editorial-cta"><h2>Tell us what you want to learn</h2><p>Share your goals and experience, or ask a question. We will reply with the current training details. Course outline, schedule and price are not published yet.</p><a class="button" href="/#ai-training">Ask about AI training</a></aside></div>`;
const aiSchema = { '@context': 'https://schema.org', '@graph': [
  { '@type': 'WebPage', '@id': `${site}/ai-training/#webpage`, url: `${site}/ai-training/`, name: 'AI Training with Dr. Hauwa', isPartOf: { '@id': `${site}/#dwn-organization` } },
  { '@type': 'FAQPage', mainEntity: aiFaq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
] };
await save('/ai-training/', page({ path: '/ai-training/', title: 'AI Training: Practical AI Skills and AI-Training Gigs', description: 'Learn practical AI skills and how to find and prepare for AI-training work such as Mercor, micro1 and Handshake AI, plus safe-job tips and answers to common questions.', body: aiTrainingBody, schema: aiSchema }));

const privacyBody = `<div class="editorial-shell"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><span aria-current="page">Privacy</span></nav><header class="editorial-hero"><p class="eyebrow">Website information</p><h1>Privacy and your website enquiries.</h1><p>This page explains what the Dr. Hauwa website collects through its own forms and tracking choices. External providers have their own practices.</p></header><section><h2>Information you choose to provide</h2><p>Our forms may collect your name, email address, interest, optional country and message. We save the form source, page, time, referral or campaign parameters and your email marketing choice in the website CRM. We use that information to review your enquiry, manage follow-up and understand which website resources are useful.</p><h2>Email choices</h2><p>The marketing checkbox is optional on the free guide form. The website currently has no connected automated email sender. We record explicit opt-in, and you can use the <a href="/#unsubscribe">unsubscribe form</a> or contact us through the website to change your preference.</p><h2>Website measurement</h2><p>If you allow optional website tracking, the site records anonymous popup impressions, successful popup submissions and clicks to external offers. We do not treat those clicks as purchases. If advertising measurement is switched on for this website, Meta's Pixel may receive page views, form submissions and offer clicks, but only after you choose Allow tracking. It does not receive your name or email address, and you can change your choice at any time through Tracking choices. No automated marketing emails are sent without your separate consent. Cloudflare may collect basic operational and visit data separately.</p><h2>External services</h2><p>Selfany handles its own guide access, enrollment, bookings and payments. Stan Store hosts the housing blueprint. Their privacy terms apply when you visit those services. Cloudflare provides the website hosting, database, security checks and storage.</p><h2>Questions</h2><p>Use the <a href="/#contact">website enquiry form</a> for questions about information submitted here. We do not publish a fixed retention period because one has not been established in this project.</p></section></div>`;
await save('/privacy-policy/', page({ path: '/privacy-policy/', title: 'Website Privacy Information', description: 'How drhauwaphd.ca collects website enquiries, consent choices and optional engagement measurements.', body: privacyBody }));

const urls = ['/', '/opportunities/', '/diaspora-wealth-network/', '/ai-training/', '/privacy-policy/', '/blog/', '/blog/build-wealth-as-an-immigrant-in-canada/', ...guides.map(item => `/blog/${item.slug}/`)];
await writeFile(join(root, 'public', 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(path => `<url><loc>${site}${path}</loc>${path.startsWith('/blog/') && path !== '/blog/' ? `<lastmod>${path.includes('build-wealth-as') ? '2026-11-14' : '2026-11-19'}</lastmod>` : ''}</url>`).join('')}</urlset>\n`);
await writeFile(join(root, 'public', 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${site}/sitemap.xml\n`);
console.log(`Generated ${guides.length} new guides, opportunities, membership, blog index and sitemap.`);
