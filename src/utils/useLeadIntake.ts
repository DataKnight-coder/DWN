import { useEffect, useState } from 'react';

export function useLeadIntake() {
  const [state, setState] = useState({ available: false, turnstile: false });
  useEffect(() => {
    let active = true;
    fetch('/api/health', { cache: 'no-store' })
      .then(response => response.ok ? response.json() : null)
      .then(data => {
        const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
        if (active) setState({ available: Boolean(data?.leadIntake && (!data.turnstile || siteKey)),
          turnstile: Boolean(data?.turnstile) });
      })
      .catch(() => { if (active) setState({ available: false, turnstile: false }); });
    return () => { active = false; };
  }, []);
  return state;
}
