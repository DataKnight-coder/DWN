export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  // Only send to a configured Google tag, if one is added later.
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, params);
  }
};
