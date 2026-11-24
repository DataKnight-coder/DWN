// Progressive enhancement for the blog: search and topic filter on the index, reading progress and contents highlighting on guides.
(() => {
  const banner = document.getElementById('dwn-top-banner');
  if (banner) {
    const key = banner.dataset.key;
    try { if (localStorage.getItem(key) === '1') banner.remove(); } catch { /* Storage is optional. */ }
    banner.querySelector('button')?.addEventListener('click', () => { try { localStorage.setItem(key, '1'); } catch { /* Optional. */ } banner.remove(); });
  }
  const bar = document.querySelector('.pb-progress span');
  if (bar) {
    const article = document.querySelector('.article-content');
    let ticking = false;
    const update = () => {
      ticking = false;
      if (!article) return;
      const rect = article.getBoundingClientRect();
      const total = rect.height - innerHeight * 0.6;
      const done = Math.min(1, Math.max(0, (-rect.top + innerHeight * 0.2) / Math.max(total, 1)));
      bar.style.transform = `scaleX(${done})`;
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  const toc = document.querySelector('.pb-toc');
  if (toc) {
    if (matchMedia('(min-width: 801px)').matches) toc.open = true;
    const links = [...toc.querySelectorAll('a[href^="#"]')];
    const map = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          links.forEach(a => a.removeAttribute('aria-current'));
          map.get(entry.target.id)?.setAttribute('aria-current', 'true');
        }
      }, { rootMargin: '-15% 0px -70% 0px' });
      document.querySelectorAll('.article-content > h2[id]').forEach(h => map.has(h.id) && io.observe(h));
    }
    links.forEach(a => a.addEventListener('click', () => { if (!matchMedia('(min-width: 801px)').matches) toc.open = false; }));
  }

  const grid = document.querySelector('.pb-grid');
  if (!grid) return;
  const cards = [...grid.querySelectorAll('.pb-card')];
  const input = document.querySelector('.pb-search input');
  const chips = [...document.querySelectorAll('.pb-chip')];
  const count = document.querySelector('.pb-count');
  const empty = document.querySelector('.pb-empty');
  const featured = document.querySelector('.pb-featured');
  let topic = 'All';
  const apply = () => {
    const q = (input?.value || '').trim().toLowerCase();
    let shown = 0;
    for (const card of cards) {
      const okTopic = topic === 'All' || card.dataset.category === topic;
      const okText = !q || card.dataset.text.includes(q);
      const ok = okTopic && okText;
      card.hidden = !ok;
      if (ok) shown++;
    }
    if (featured) featured.hidden = topic !== 'All' || Boolean(q);
    if (count) count.textContent = `${shown} ${shown === 1 ? 'guide' : 'guides'}${topic !== 'All' ? ` in ${topic}` : ''}${q ? ` matching “${input.value.trim()}”` : ''}`;
    if (empty) empty.style.display = shown ? 'none' : 'block';
  };
  input?.addEventListener('input', apply);
  chips.forEach(chip => chip.addEventListener('click', () => {
    topic = chip.dataset.topic;
    chips.forEach(c => c.setAttribute('aria-pressed', String(c === chip)));
    apply();
  }));
  apply();
})();
