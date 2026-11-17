export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  // Safely trigger Meta (Facebook) Pixel
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', eventName, params);
  }
  
  // Only send to a configured Google tag, if one is added later.
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, params);
  }
};
