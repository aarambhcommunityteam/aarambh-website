
import { useState } from 'react';
import { Mail, AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus('');

    const normalizedEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setStatus('invalid');
      return;
    }

    if (!consent) {
      setStatus('consent');
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      setStatus('not-connected');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({
          email: normalizedEmail,
          consent: true,
          consent_at: new Date().toISOString(),
        });

      if (error) {
        if (error.code === '23505') {
          setStatus('already-subscribed');
          return;
        }

        console.error('Newsletter subscription error:', error);
        setStatus('error');
        return;
      }

      setStatus('success');
      setEmail('');
      setConsent(false);
    } catch (error) {
      console.error('Newsletter submission failed:', error);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-xl">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Email address</span>
          <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            value={email}
            disabled={isSubmitting}
            onChange={(event) => {
              setEmail(event.target.value);
              setStatus('');
            }}
            placeholder="Enter your email address"
            className="w-full rounded-xl border border-white/15 bg-white/10 py-4 pl-12 pr-4 text-white outline-none placeholder:text-gray-400 focus:border-[#19C8FF] focus:ring-2 focus:ring-[#19C8FF]/20 disabled:opacity-60"
          />
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#087BFF] px-7 py-4 font-semibold text-white transition hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-[#19C8FF] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Subscribing...' : 'Subscribe'}
          <Mail className="h-4 w-4" />
        </button>
      </div>

      <label className="mt-5 flex cursor-pointer items-start gap-3 text-left text-sm text-gray-300">
        <input
          type="checkbox"
          name="newsletterConsent"
          checked={consent}
          disabled={isSubmitting}
          onChange={(event) => {
            setConsent(event.target.checked);
            setStatus('');
          }}
          className="mt-1 h-4 w-4 accent-[#087BFF]"
        />

        <span>
          I agree to receive newsletters and updates from AARAMBH.
          I understand that I can unsubscribe at any time.
        </span>
      </label>

      {status && (
        <div role="status" aria-live="polite" className="mt-4 text-left text-sm">
          {status === 'invalid' && (
            <p className="text-red-300">
              Please enter a valid email address.
            </p>
          )}

          {status === 'consent' && (
            <p className="text-amber-200">
              Please agree to receive newsletters before subscribing.
            </p>
          )}

          {status === 'not-connected' && (
            <div className="flex items-start gap-2 text-amber-200">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p>
                Newsletter service is not configured. Your email has not
                been saved.
              </p>
            </div>
          )}

          {status === 'already-subscribed' && (
            <p className="text-cyan-300">
              This email is already subscribed to the AARAMBH newsletter.
            </p>
          )}

          {status === 'success' && (
            <div className="flex items-start gap-2 text-green-300">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              <p>
                You're subscribed! Thank you for joining the AARAMBH newsletter.
              </p>
            </div>
          )}

          {status === 'error' && (
            <p className="text-red-300">
              We couldn't save your subscription. Please try again later.
            </p>
          )}
        </div>
      )}
    </form>
  );
}
