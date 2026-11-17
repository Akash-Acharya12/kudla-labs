'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import {
  ArrowLeft,
  Lock,
  Mail,
  User,
  AlertCircle,
  CheckCircle,
  Loader2,
  RefreshCw,
  MailCheck,
  AlertTriangle,
  Info,
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Discrete registration and email delivery statuses
  const [accountCreated, setAccountCreated] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [emailDeliveryStatus, setEmailDeliveryStatus] = useState<'sent' | 'rate_limited' | 'failed' | 'already_registered' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Controlled resend state with 60s cooldown
  const [resendLoading, setResendLoading] = useState(false);
  const [resendNotice, setResendNotice] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  const isConfigured = isSupabaseConfigured();

  // Cooldown countdown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Guard against duplicate / repeated submissions
    if (loading || accountCreated) return;

    if (!isConfigured) {
      setErrorMessage(
        'Supabase is not configured. Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are set in .env.local.'
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setEmailDeliveryStatus(null);
    setResendNotice(null);

    try {
      const supabase = createClient();
      const origin = window.location.origin;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${origin}/auth/callback?next=/onboarding`,
        },
      });

      // 1. Check whether a Supabase user was created in data
      const userObj = data?.user;
      const isUserCreated = Boolean(
        userObj && (!Array.isArray(userObj.identities) || userObj.identities.length > 0)
      );
      const isExistingAccount = Boolean(
        userObj && Array.isArray(userObj.identities) && userObj.identities.length === 0
      );

      // Analyze any error message returned
      const errorMsg = error ? error.message.toLowerCase() : '';
      const isRateLimit =
        errorMsg.includes('over_email_send_rate_limit') ||
        errorMsg.includes('rate limit') ||
        (error as { code?: string })?.code === 'over_email_send_rate_limit';
      const isAlreadyRegistered =
        isExistingAccount ||
        errorMsg.includes('user already registered') ||
        errorMsg.includes('already exists');

      // Case A: User has immediate session (auto-confirmation enabled in Supabase)
      if (data?.session && userObj) {
        setAccountCreated(true);
        setRegisteredEmail(email);
        await supabase.from('profiles').upsert({
          id: userObj.id,
          email,
          full_name: fullName,
          updated_at: new Date().toISOString(),
        });
        router.push('/onboarding');
        return;
      }

      // Case B: User was created in Supabase Auth, but email status might be sent or rate-limited
      if (isUserCreated) {
        setAccountCreated(true);
        setRegisteredEmail(email);

        if (isRateLimit) {
          // Account was created, but email dispatch was rate limited by Supabase
          setEmailDeliveryStatus('rate_limited');
          setResendCooldown(60);
        } else {
          // Normal flow: Account created and confirmation email dispatched
          setEmailDeliveryStatus('sent');
          setResendCooldown(60);
        }
        return;
      }

      // Case C: Account already exists
      if (isAlreadyRegistered) {
        setAccountCreated(true);
        setRegisteredEmail(email);
        setEmailDeliveryStatus('already_registered');
        setErrorMessage(
          'An account with this email address already exists. If your account is unconfirmed, you can request a verification email below, or sign in directly.'
        );
        return;
      }

      // Case D: Pure email rate-limit without user object returned
      if (isRateLimit) {
        setEmailDeliveryStatus('rate_limited');
        setRegisteredEmail(email);
        setErrorMessage(
          'Supabase email delivery rate limit reached. Supabase free-tier built-in email service is restricted to a few emails per hour. If you just registered, your account may already exist. Please wait before attempting again or sign in.'
        );
        setResendCooldown(60);
        return;
      }

      // Case E: Other genuine registration error
      if (error) {
        setErrorMessage(error.message);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred during registration.';
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    const targetEmail = registeredEmail || email;
    if (!targetEmail || resendCooldown > 0 || resendLoading) return;

    setResendLoading(true);
    setResendNotice(null);

    try {
      const supabase = createClient();
      const origin = window.location.origin;

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: targetEmail,
        options: {
          emailRedirectTo: `${origin}/auth/callback?next=/onboarding`,
        },
      });

      if (error) {
        const msg = error.message.toLowerCase();
        if (msg.includes('rate limit') || msg.includes('over_email_send_rate_limit')) {
          setResendNotice(
            'Email delivery rate limit reached. Supabase requires a short waiting period before dispatching another email.'
          );
          setResendCooldown(60);
        } else {
          setResendNotice(`Notice: ${error.message}`);
        }
      } else {
        setResendNotice(`Verification email resent to ${targetEmail}! Please check your inbox and spam folder.`);
        setResendCooldown(60);
      }
    } catch {
      setResendNotice('Unable to resend verification email right now. Please try again shortly.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-[#071322] px-6 py-12 text-slate-100 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-cyan-300"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300 to-blue-600 text-2xl font-black text-[#071322]">
            K
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Kudla <span className="text-cyan-400">Labs</span>
            </h1>
            <p className="text-[10px] tracking-[0.22em] text-slate-400">
              CREATE STUDENT ACCOUNT
            </p>
          </div>
        </div>

        <h2 className="mt-8 text-2xl font-extrabold tracking-tight text-white">
          Begin your learning journey
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          One student. One journey. One unified intelligent platform.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-2xl border border-white/10 bg-[#102238] p-8 shadow-xl">
          {/* Supabase Configuration Warning */}
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

          {/* Error Message Banner */}
          {errorMessage && (
            <div className="mb-6 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300">
              <div className="flex items-center gap-2 font-semibold">
                <AlertCircle className="h-4 w-4" /> Registration Notice
              </div>
              <p className="mt-1 leading-relaxed">{errorMessage}</p>
              {emailDeliveryStatus === 'already_registered' && (
                <div className="mt-3">
                  <Link
                    href="/auth/login"
                    className="font-bold text-cyan-300 underline hover:text-cyan-200"
                  >
                    Proceed to Sign In →
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Account Created / Email Delivery Status Card */}
          {accountCreated ? (
            <div className="space-y-4">
              {/* 1. Account Creation Status */}
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-sm text-emerald-300">
                <div className="flex items-center gap-2 text-base font-bold">
                  <CheckCircle className="h-5 w-5 shrink-0 text-emerald-400" /> Account Created
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-200">
                  Student record created for <strong className="text-white">{registeredEmail}</strong>.
                  Your account is secured in Kudla Labs.
                </p>
              </div>

              {/* 2. Email Delivery Status (Separated clearly) */}
              {emailDeliveryStatus === 'sent' && (
                <div className="rounded-xl border border-cyan-400/30 bg-cyan-400/10 p-4 text-xs text-cyan-200">
                  <div className="flex items-center gap-2 font-semibold text-cyan-300">
                    <MailCheck className="h-4 w-4" /> Verification Email Dispatched
                  </div>
                  <p className="mt-1 leading-relaxed text-slate-300">
                    A confirmation link was sent to your inbox. Please click the link to activate your account and start your personalized learning journey.
                  </p>
                </div>
              )}

              {emailDeliveryStatus === 'rate_limited' && (
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-200">
                  <div className="flex items-center gap-2 font-semibold text-amber-300">
                    <AlertTriangle className="h-4 w-4 shrink-0" /> Email Delivery Delayed (Rate Limit)
                  </div>
                  <p className="mt-1 leading-relaxed text-slate-300">
                    Supabase&apos;s default email service has reached its hourly rate limit. Your account exists and is safe. Please check your spam folder, or use the controlled resend button once the cooldown expires.
                  </p>
                </div>
              )}

              {emailDeliveryStatus === 'already_registered' && (
                <div className="rounded-xl border border-cyan-400/30 bg-cyan-400/10 p-4 text-xs text-cyan-200">
                  <div className="flex items-center gap-2 font-semibold text-cyan-300">
                    <Info className="h-4 w-4" /> Existing Account Found
                  </div>
                  <p className="mt-1 leading-relaxed text-slate-300">
                    You already have an account with this email. If you need a new confirmation email, use the button below.
                  </p>
                </div>
              )}

              {/* Resend Notice Feedback */}
              {resendNotice && (
                <div className="rounded-xl border border-cyan-400/30 bg-cyan-400/10 p-3 text-xs text-cyan-200">
                  {resendNotice}
                </div>
              )}

              {/* Action Buttons: Controlled Resend & Sign In */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendLoading || resendCooldown > 0}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 py-2.5 text-xs font-semibold text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {resendLoading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Sending...
                    </>
                  ) : resendCooldown > 0 ? (
                    `Resend email available in ${resendCooldown}s`
                  ) : (
                    <>
                      <RefreshCw className="h-3.5 w-3.5" /> Resend Verification Email
                    </>
                  )}
                </button>

                <Link
                  href="/auth/login"
                  className="flex w-full items-center justify-center rounded-xl bg-cyan-400 py-2.5 text-sm font-bold text-[#071322] transition hover:bg-cyan-300"
                >
                  Proceed to Sign In →
                </Link>
              </div>

              {/* Helpful developer/admin hint about Supabase custom SMTP */}
              <div className="mt-4 border-t border-white/10 pt-3 text-[11px] text-slate-500">
                <span className="font-semibold text-slate-400">Production Tip:</span> Supabase free-tier limits default email sends. Configure Custom SMTP in your Supabase dashboard for unlimited, instant email delivery.
              </div>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
                >
                  Full Name
                </label>
                <div className="relative mt-2">
                  <User className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    disabled={loading}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Rahul Kumar"
                    className="w-full rounded-xl border border-white/10 bg-[#071322] py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
                >
                  Email address
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
                    placeholder="rahul@example.com"
                    className="w-full rounded-xl border border-white/10 bg-[#071322] py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
                >
                  Password
                </label>
                <div className="relative mt-2">
                  <Lock className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    disabled={loading}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full rounded-xl border border-white/10 bg-[#071322] py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
                >
                  Confirm Password
                </label>
                <div className="relative mt-2">
                  <Lock className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    disabled={loading}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat your password"
                    className="w-full rounded-xl border border-white/10 bg-[#071322] py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 disabled:opacity-50"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !isConfigured}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-cyan-400 py-3 text-sm font-bold text-[#071322] transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Creating Account...
                  </>
                ) : (
                  'Create Student Account'
                )}
              </button>
            </form>
          )}

          <div className="mt-6 border-t border-white/10 pt-6 text-center text-sm text-slate-400">
            Already have an account?{' '}
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
