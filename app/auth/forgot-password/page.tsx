'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import {
  ArrowLeft,
  Mail,
  AlertCircle,
  AlertTriangle,
  Clock,
  Loader2,
  RefreshCw,
  KeyRound,
  ShieldCheck,
  Server,
} from 'lucide-react';

type SubmissionStatus = 'idle' | 'accepted' | 'rate_limited' | 'smtp_error' | 'error';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<SubmissionStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Anti-spam client throttle (prevents double-clicking / rapid repeated submissions)
  const [antiSpamCooldown, setAntiSpamCooldown] = useState(0);

  const isConfigured = isSupabaseConfigured();

  // Local client throttle timer
  useEffect(() => {
    if (antiSpamCooldown <= 0) return;
    const interval = setInterval(() => {
      setAntiSpamCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [antiSpamCooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading || antiSpamCooldown > 0) return;

    if (!isConfigured) {
      setStatus('error');
      setErrorMessage(
        'Supabase is not configured. Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are set in .env.local.'
      );
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address (e.g., student@kudla.edu).');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const supabase = createClient();
      const origin = window.location.origin;

      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: `${origin}/auth/callback?next=/auth/reset-password`,
      });

      if (error) {
        const msg = error.message.toLowerCase();
        const code = (error as { code?: string }).code?.toLowerCase() || '';
        const httpStatus = (error as { status?: number }).status;

        // 1. Detect project-wide rate limit
        if (
          httpStatus === 429 ||
          code === 'over_email_send_rate_limit' ||
          msg.includes('rate limit') ||
          msg.includes('over_email_send_rate_limit')
        ) {
          setStatus('rate_limited');
          setErrorMessage(
            error.message ||
              'Supabase email sending limit reached. The built-in email quota for this project is currently exhausted.'
          );
          // Set a short 15s throttle against rapid double-clicks
          setAntiSpamCooldown(15);
          return;
        }

        // 2. Detect SMTP server connection / authentication failure
        if (
          msg.includes('smtp') ||
          msg.includes('535') ||
          msg.includes('connection refused') ||
          msg.includes('error sending email') ||
          msg.includes('mailer')
        ) {
          setStatus('smtp_error');
          setErrorMessage(
            `Email server error: ${error.message}. Please verify the Custom SMTP configuration in the Supabase Dashboard.`
          );
          setAntiSpamCooldown(15);
          return;
        }

        // 3. General Supabase auth error
        setStatus('error');
        setErrorMessage(error.message);
        setAntiSpamCooldown(15);
        return;
      }

      // 4. Request Accepted:
      // Note: Never claim that the email was actually delivered to the inbox,
      // as Supabase returns 200 to acknowledge queuing the request.
      setSubmittedEmail(cleanEmail);
      setStatus('accepted');
      setErrorMessage(null);
      // Activate a 45-second client anti-spam throttle before allowing a resend
      setAntiSpamCooldown(45);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'An unexpected network error occurred. Please try again.';
      setStatus('error');
      setErrorMessage(message);
      setAntiSpamCooldown(15);
    } finally {
      setLoading(false);
    }
  };

  const handleResetForm = () => {
    setStatus('idle');
    setErrorMessage(null);
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-[#071322] px-6 py-12 text-slate-100 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link
          href="/auth/login"
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-cyan-300"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Sign In
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300 to-blue-600 text-2xl font-black text-[#071322]">
            K
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Kudla <span className="text-cyan-400">Labs</span>
            </h1>
            <p className="text-[10px] tracking-[0.22em] text-slate-400">ACCOUNT RECOVERY</p>
          </div>
        </div>

        <h2 className="mt-8 text-2xl font-extrabold tracking-tight text-white">
          Reset your password
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Enter your registered email address to request a secure password recovery link.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-2xl border border-white/10 bg-[#102238] p-8 shadow-xl">
          {!isConfigured && (
            <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-300">
              <div className="flex items-center gap-2 font-semibold">
                <AlertCircle className="h-4 w-4" /> Supabase Configuration Required
              </div>
              <p className="mt-1 text-slate-300">
                Please set <code className="text-amber-200">NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
                <code className="text-amber-200">NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> in{' '}
                <code className="text-amber-200">.env.local</code>.
              </p>
            </div>
          )}

          {/* Rate-Limit State Banner */}
          {status === 'rate_limited' && (
            <div className="mb-6 space-y-3 rounded-xl border border-amber-500/40 bg-amber-500/10 p-5 text-xs text-amber-200">
              <div className="flex items-center gap-2 text-sm font-bold text-amber-300">
                <AlertTriangle className="h-4 w-4 shrink-0" /> Supabase Project Email Quota Reached
              </div>
              <p className="leading-relaxed text-slate-300">
                The Supabase authentication service has rejected this request because the
                project-wide email rate limit was exceeded.
              </p>
              <div className="rounded-lg border border-amber-500/20 bg-[#071322]/80 p-3 text-[11px] text-slate-300">
                <p className="font-semibold text-amber-300">Why this happens:</p>
                <p className="mt-1">
                  Supabase free-tier projects use a shared email pool strictly limited to ~3-4
                  emails per hour across all project users.
                </p>
                <p className="mt-2 font-semibold text-amber-300">Permanent Solution:</p>
                <p className="mt-1">
                  Configure a Custom SMTP provider (Resend, SendGrid, Amazon SES, or Brevo) in the{' '}
                  <span className="font-mono text-cyan-300">Supabase Dashboard → Project Settings → Authentication → SMTP</span>.
                  Custom SMTP immediately removes the hourly quota.
                </p>
              </div>
              <p className="text-[11px] text-slate-400">
                If you are a student, please wait for the hourly quota refresh or contact your course
                instructor for credential assistance.
              </p>
            </div>
          )}

          {/* SMTP Configuration Error Banner */}
          {status === 'smtp_error' && (
            <div className="mb-6 space-y-3 rounded-xl border border-rose-500/40 bg-rose-500/10 p-5 text-xs text-rose-200">
              <div className="flex items-center gap-2 text-sm font-bold text-rose-300">
                <Server className="h-4 w-4 shrink-0" /> Email Delivery Service Error
              </div>
              <p className="leading-relaxed text-slate-300">
                {errorMessage ||
                  'The authentication provider encountered an error communicating with the configured SMTP mail server.'}
              </p>
              <div className="rounded-lg border border-rose-500/20 bg-[#071322]/80 p-3 text-[11px] text-slate-300">
                <p className="font-semibold text-rose-300">Troubleshooting Steps:</p>
                <ul className="mt-1 list-disc pl-4 space-y-1">
                  <li>Verify SMTP host, port (465/587), and encryption in Supabase Dashboard.</li>
                  <li>Ensure the SMTP username and password / API key are valid.</li>
                  <li>Verify that your sender email domain is authenticated in your SMTP provider.</li>
                </ul>
              </div>
            </div>
          )}

          {/* General Error Banner */}
          {status === 'error' && errorMessage && (
            <div className="mb-6 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300">
              <div className="flex items-center gap-2 font-semibold">
                <AlertCircle className="h-4 w-4" /> Recovery Request Error
              </div>
              <p className="mt-1 leading-relaxed">{errorMessage}</p>
            </div>
          )}

          {/* State: Request Accepted & Queued */}
          {status === 'accepted' ? (
            <div className="space-y-4">
              <div className="rounded-xl border border-cyan-400/30 bg-cyan-400/10 p-5 text-sm text-cyan-200">
                <div className="flex items-center gap-2 text-base font-bold text-cyan-300">
                  <Clock className="h-5 w-5 shrink-0 text-cyan-400" /> Request Accepted & Queued
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-200">
                  Your password recovery request has been submitted to the authentication system for{' '}
                  <strong className="text-white">{submittedEmail}</strong>.
                </p>
                <p className="mt-2 text-[11px] leading-relaxed text-slate-300">
                  If an active student account exists for this address and project email quotas are
                  available, a password reset link will be dispatched to your inbox.
                </p>
              </div>

              {/* Delivery Disclaimer Card */}
              <div className="rounded-xl border border-white/10 bg-[#071322] p-4 text-xs text-slate-300 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-slate-200">
                  <ShieldCheck className="h-4 w-4 text-cyan-400" /> Delivery Expectations
                </div>
                <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-400">
                  <li>Check your Inbox and Spam/Junk folders over the next 2-5 minutes.</li>
                  <li>
                    Delivery confirmation depends on your email provider and project sending quotas.
                  </li>
                  <li>
                    If project email rate limits were reached, delivery may be delayed until the quota resets or Custom SMTP is active.
                  </li>
                </ul>
              </div>

              {/* Controlled Resend Actions */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading || antiSpamCooldown > 0}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 py-2.5 text-xs font-semibold text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Processing request...
                    </>
                  ) : antiSpamCooldown > 0 ? (
                    `Submission cooldown active (${antiSpamCooldown}s)`
                  ) : (
                    <>
                      <RefreshCw className="h-3.5 w-3.5" /> Submit Another Request
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleResetForm}
                  className="flex w-full items-center justify-center rounded-xl border border-white/10 bg-[#071322] py-2 text-xs font-semibold text-slate-400 transition hover:text-slate-200"
                >
                  Try a different email address
                </button>

                <Link
                  href="/auth/login"
                  className="flex w-full items-center justify-center rounded-xl bg-cyan-400 py-2.5 text-sm font-bold text-[#071322] transition hover:bg-cyan-300"
                >
                  Return to Sign In →
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
                >
                  Registered Email Address
                </label>
                <div className="relative mt-2">
                  <Mail className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    disabled={loading}
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@kudla.edu"
                    className="w-full rounded-xl border border-white/10 bg-[#071322] py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 disabled:opacity-50"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || antiSpamCooldown > 0 || !isConfigured}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-cyan-400 py-3 text-sm font-bold text-[#071322] transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Submitting request...
                  </>
                ) : antiSpamCooldown > 0 ? (
                  `Please wait ${antiSpamCooldown}s before resubmitting`
                ) : (
                  <>
                    <KeyRound className="h-4 w-4" /> Request Password Reset
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-6 border-t border-white/10 pt-6 text-center text-sm text-slate-400">
            Remember your credentials?{' '}
            <Link
              href="/auth/login"
              className="font-semibold text-cyan-400 transition hover:text-cyan-300"
            >
              Sign in here →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
