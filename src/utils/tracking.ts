export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  // Only send to a configured Google tag, if one is added later.
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, params);
  }
  // Meta Pixel exists only after consent and only when a Pixel ID is configured. Standard Lead for sign-ups.
  const fbq = typeof window !== 'undefined' ? (window as any).fbq : undefined;
  if (fbq) {
    if (eventName === 'Lead') fbq('track', 'Lead', { content_name: params?.content_name });
    else if (eventName === 'path_finder_select') fbq('trackCustom', 'PathFinderSelect', { choice: params?.choice });
  }
};
