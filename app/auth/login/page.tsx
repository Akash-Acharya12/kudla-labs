'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { ArrowLeft, Lock, Mail, AlertCircle, Loader2, RefreshCw, MailCheck, CheckCircle } from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlError = searchParams.get('error');
  const resetSuccess = searchParams.get('reset') === 'success';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    urlError ? decodeURIComponent(urlError) : null
  );
  const [isEmailUnconfirmed, setIsEmailUnconfirmed] = useState(false);

  // Controlled resend state
  const [resendLoading, setResendLoading] = useState(false);
  const [resendNotice, setResendNotice] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  const isConfigured = isSupabaseConfigured();

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConfigured) {
      setErrorMessage(
        'Supabase is not configured. Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are set in .env.local.'
      );
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setIsEmailUnconfirmed(false);
    setResendNotice(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        const msg = error.message.toLowerCase();
        if (msg.includes('email not confirmed')) {
          setIsEmailUnconfirmed(true);
          setErrorMessage(
            'Your email address has not been confirmed yet. Please verify your email using the link sent to your inbox.'
          );
        } else if (msg.includes('invalid login credentials')) {
          setErrorMessage('Invalid email or password. Please check your credentials and try again.');
        } else if (msg.includes('rate limit')) {
          setErrorMessage('Too many sign-in attempts. Please wait a minute before trying again.');
        } else {
          setErrorMessage(error.message);
        }
        return;
      }

      if (data.user) {
        // Check profile onboarding status
        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', data.user.id)
          .single();

        if (profile && profile.onboarding_completed) {
          router.push('/dashboard');
        } else {
          router.push('/onboarding');
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email || resendCooldown > 0 || resendLoading) return;
    setResendLoading(true);
    setResendNotice(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) {
        if (error.message.toLowerCase().includes('rate limit')) {
          setResendNotice('Rate limit reached. Please wait a moment before requesting another email.');
        } else {
          setResendNotice(`Notice: ${error.message}`);
        }
      } else {
        setResendNotice('Verification email resent! Please check your inbox and spam folder.');
        setResendCooldown(60);
      }
    } catch {
      setResendNotice('Could not send verification email at this moment.');
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
              STUDENT PORTAL
            </p>
          </div>
        </div>

        <h2 className="mt-8 text-2xl font-extrabold tracking-tight text-white">
          Sign in to your learning account
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Access Kudla Learn, Path, Career, and Marketplace
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

          {resetSuccess && (
            <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-300">
              <div className="flex items-center gap-2 font-semibold">
                <CheckCircle className="h-4 w-4 text-emerald-400" /> Password Reset Complete
              </div>
              <p className="mt-1 leading-relaxed text-slate-200">
                Your password has been successfully updated. You can now sign in with your new password.
              </p>
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300">
              <div className="flex items-center gap-2 font-semibold">
                <AlertCircle className="h-4 w-4" /> Sign In Notice
              </div>
              <p className="mt-1">{errorMessage}</p>

              {isEmailUnconfirmed && (
                <div className="mt-3 border-t border-rose-500/20 pt-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-200">
                    <MailCheck className="h-3.5 w-3.5" /> Need a new confirmation link?
                  </div>
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={resendLoading || resendCooldown > 0}
                    className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-rose-400/30 bg-rose-400/10 px-3 py-1.5 text-xs font-medium text-rose-200 transition hover:bg-rose-400/20 disabled:opacity-50"
                  >
                    {resendLoading ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin" /> Sending...
                      </>
                    ) : resendCooldown > 0 ? (
                      `Wait ${resendCooldown}s`
                    ) : (
                      <>
                        <RefreshCw className="h-3 w-3" /> Resend Verification Email
                      </>
                    )}
                  </button>
                  {resendNotice && (
                    <p className="mt-2 text-[11px] text-cyan-300">{resendNotice}</p>
                  )}
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
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
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@kudla.edu"
                  className="w-full rounded-xl border border-white/10 bg-[#071322] py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
                >
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs font-semibold text-cyan-400 transition hover:text-cyan-300"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative mt-2">
                <Lock className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/10 bg-[#071322] py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !isConfigured}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-cyan-400 py-3 text-sm font-bold text-[#071322] transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Signing in...
                </>
              ) : (
                'Sign In to Kudla Labs'
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-white/10 pt-6 text-center text-sm text-slate-400">
            Don&apos;t have an account yet?{' '}
            <Link
              href="/auth/register"
              className="font-semibold text-cyan-400 transition hover:text-cyan-300"
            >
              Register here →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#071322]">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}

