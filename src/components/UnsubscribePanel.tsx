import { useState } from 'react';
import TurnstileField from './TurnstileField';
import { useLeadIntake } from '../utils/useLeadIntake';

export default function UnsubscribePanel() {
  const { available, turnstile } = useLeadIntake();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [resetNonce, setResetNonce] = useState(0);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true); setStatus('');
    try {
      const response = await fetch('/api/unsubscribe', { method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, turnstileToken: token }) });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || 'Could not save your request.');
      setStatus('Your email has been removed from DWN marketing updates.');
      setEmail('');
    } catch (error) { setStatus((error as Error).message); }
    finally { setBusy(false); setToken(''); setResetNonce(value => value + 1); }
  };
  return <section id="unsubscribe" className="bg-ivory text-primary px-6 py-12" aria-labelledby="unsubscribe-title">
    <div className="max-w-2xl mx-auto"><h2 id="unsubscribe-title" className="text-2xl font-bold mb-3">Stop DWN emails</h2>
      <p className="mb-5">Enter the address you used for DWN updates. This does not affect access to Selfany.</p>
      {available && turnstile ? <form onSubmit={submit} className="grid gap-3">
        <label htmlFor="unsubscribe-email">Email address</label>
        <input id="unsubscribe-email" type="email" required value={email} onChange={event => setEmail(event.target.value)} className="p-3 border border-primary/30 rounded-lg" />
        <TurnstileField onToken={setToken} resetNonce={resetNonce} />
        <button type="submit" disabled={busy || !token} className="bg-primary text-ivory rounded-full px-6 py-3 font-bold w-fit disabled:opacity-50">{busy ? 'Saving…' : 'Stop DWN emails'}</button>
      </form> : <p>Self-service unsubscribe is temporarily unavailable. No marketing emails are currently sent by this website.</p>}
      <p role="status" aria-live="polite" className="mt-4">{status}</p>
    </div>
  </section>;
}
