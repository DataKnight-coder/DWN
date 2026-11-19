import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    turnstile?: { render: (element: HTMLElement, options: Record<string, unknown>) => string;
      remove: (id: string) => void };
  }
}

const TurnstileField: React.FC<{ onToken: (token: string) => void; resetNonce: number }> = ({ onToken, resetNonce }) => {
  const ref = useRef<HTMLDivElement>(null);
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
  useEffect(() => {
    if (!siteKey) return;
    let active = true;
    let widgetId: string | undefined;
    const render = () => {
      if (!active || !ref.current || !window.turnstile || widgetId) return;
      widgetId = window.turnstile.render(ref.current, {
        sitekey: siteKey,
        callback: onToken,
        'expired-callback': () => onToken(''),
        'error-callback': () => onToken(''),
      });
    };
    let script = document.querySelector<HTMLScriptElement>('script[data-dwn-turnstile]');
    if (!script) {
      script = document.createElement('script');
      script.dataset.dwnTurnstile = 'true';
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      document.head.appendChild(script);
    }
    script.addEventListener('load', render);
    render();
    return () => {
      active = false;
      script?.removeEventListener('load', render);
      if (widgetId) window.turnstile?.remove(widgetId);
    };
  }, [siteKey, onToken, resetNonce]);
  if (!siteKey) return null;
  return <div ref={ref} role="group" aria-label="Security check" />;
};

export default TurnstileField;
