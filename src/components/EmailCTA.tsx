import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { submitLead } from '../utils/leads';
import { trackEvent } from '../utils/tracking';
import { useLeadIntake } from '../utils/useLeadIntake';
import TurnstileField from './TurnstileField';

const EmailCTA: React.FC = () => {
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const { available, turnstile } = useLeadIntake();
  const [turnstileToken, setTurnstileToken] = useState('');
  const [resetNonce, setResetNonce] = useState(0);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setBusy(true);
    setStatus('');
    try {
      await submitLead({ firstName: String(data.get('firstName') || ''), email: String(data.get('email') || ''),
        source: 'newsletter', marketingConsent: data.get('consent') === 'on', turnstileToken });
      trackEvent('Lead', { content_name: 'Newsletter' });
      setStatus('Thanks. Your details were saved.');
      form.reset();
    } catch (error) { setStatus((error as Error).message); }
    finally { setBusy(false); if (turnstile) { setTurnstileToken(''); setResetNonce(value => value + 1); } }
  };
  return (
    <section className="bg-sage text-primary py-32 overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-ivory/20 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
      
      <div className="container mx-auto px-6 max-w-4xl text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            Build More Than a Career. <br className="hidden md:block" />
            <span className="text-ivory drop-shadow-sm">Build Options.</span>
          </h2>
          <p className="text-xl md:text-2xl font-medium opacity-90 mb-12 max-w-2xl mx-auto">
            Get practical insights on career growth, entrepreneurship, wealth and opportunities for diaspora professionals.
          </p>

          {available ? <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-2xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
            <input 
              type="text" 
              name="firstName"
              aria-label="First name"
              placeholder="First name" 
              required
              className="flex-grow px-6 py-4 rounded-full bg-ivory/90 border border-primary/10 text-primary placeholder:text-primary/50 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
            />
            <input 
              type="email" 
              name="email"
              aria-label="Email address"
              placeholder="Email address" 
              required
              className="flex-grow px-6 py-4 rounded-full bg-ivory/90 border border-primary/10 text-primary placeholder:text-primary/50 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
            />
            <button 
              type="submit" 
              disabled={busy || (turnstile && !turnstileToken)}
              className="bg-primary text-ivory font-bold px-8 py-4 rounded-full hover:bg-dark transition-colors whitespace-nowrap shadow-xl"
            >
              {busy ? 'Saving…' : 'Get Updates'}
            </button>
            </div>
            <label className="flex items-start gap-2 text-left text-sm"><input type="checkbox" name="consent" required className="mt-1" /> I agree to receive emails from Diaspora Wealth Network. I can unsubscribe at any time.</label>
            {turnstile && <TurnstileField onToken={setTurnstileToken} resetNonce={resetNonce} />}
            <p role="status" aria-live="polite" className="text-sm">{status}</p>
          </form> : <a href="https://selfany.com/w/DrHauwaPhD1" target="_blank" rel="noreferrer" className="inline-block bg-primary text-ivory font-bold px-8 py-4 rounded-full">Explore the Free Webinar</a>}
        </motion.div>
      </div>
    </section>
  );
};

export default EmailCTA;
