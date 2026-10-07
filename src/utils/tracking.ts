export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  // Safely trigger Meta (Facebook) Pixel
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', eventName, params);
  }
  
  // Safely trigger Google Analytics / Google Ads
  if (typeof window !== 'undefined' && (window as any).gtag) {
    // If it's a Meta 'Lead' event, map it to Google's standard 'conversion' event
    const gtagEventName = eventName === 'Lead' ? 'conversion' : eventName;
    (window as any).gtag('event', gtagEventName, params);
  }
};
