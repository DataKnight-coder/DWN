const keys = ['utm_source','utm_medium','utm_campaign','ref'] as const;

export function currentAttribution() {
  const query = new URLSearchParams(window.location.search);
  const result: Record<(typeof keys)[number], string> = { utm_source: '', utm_medium: '', utm_campaign: '', ref: '' };
  for (const key of keys) {
    const incoming = (query.get(key) || '').slice(0,100);
    try {
      const storageKey = `dwn-attribution:${key}`;
      if (incoming) sessionStorage.setItem(storageKey,incoming);
      result[key] = incoming || sessionStorage.getItem(storageKey) || '';
    } catch { result[key] = incoming; }
  }
  return result;
}
