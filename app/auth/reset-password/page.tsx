'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import {
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Loader2,
  KeyRound,
  ShieldCheck,
  Check,
  X,
} from 'lucide-react';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryError = searchParams.get('error');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [checkingSession, setCheckingSession] = useState(true);
  const [hasValidSession, setHasValidSession] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const isConfigured = isSupabaseConfigured();

  // Validate recovery session on mount
  useEffect(() => {
    let isMounted = true;

    async function verifyRecoverySession() {
      if (queryError) {
        if (isMounted) {
          setErrorMessage(decodeURIComponent(queryError));
          setHasValidSession(false);
          setCheckingSession(false);
        }
        return;
      }

      if (!isConfigured) {
        if (isMounted) {
          setErrorMessage(
            'Supabase is not configured. Please ensure environment variables are configured in .env.local.'
          );
          setCheckingSession(false);
        }
        return;
      }

      try {
        const supabase = createClient();

        // 1. Check existing session from cookie / local storage
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          if (isMounted) {
            setHasValidSession(true);
            setCheckingSession(false);
          }
          return;
        }

        // 2. Listen to auth state change (in case exchange is in flight or URL hash is being parsed)
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
          if (
            event === 'PASSWORD_RECOVERY' ||
            (session && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION'))
          ) {
            if (isMounted) {
              setHasValidSession(true);
              setCheckingSession(false);
            }
          }
        });

        // 3. Grace period check
        setTimeout(async () => {
          if (!isMounted) return;
          const {
            data: { session: delayedSession },
          } = await supabase.auth.getSession();
          if (delayedSession) {
            setHasValidSession(true);
          } else if (!hasValidSession) {
            setErrorMessage(
              'No active recovery session was found. Your password reset link may have expired or already been used.'
            );
          }
          setCheckingSession(false);
        }, 1000);

        return () => {
          authListener.subscription.unsubscribe();
        };
      } catch (err: unknown) {
        if (isMounted) {
          const msg = err instanceof Error ? err.message : 'Failed to verify recovery session.';
          setErrorMessage(msg);
          setCheckingSession(false);
        }
      }
    }

    verifyRecoverySession();

    return () => {
      isMounted = false;
    };
  }, [queryError, isConfigured, hasValidSession]);

  // Validation helpers
  const isMinLength = password.length >= 6;
  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const isFormValid = isMinLength && passwordsMatch;

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    if (!isConfigured) {
      setErrorMessage('Supabase is not configured.');
      return;
    }

    if (!isMinLength) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (!passwordsMatch) {
      setErrorMessage('Passwords do not match. Please verify both fields.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setSuccessNotice(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        const msg = error.message.toLowerCase();
        if (msg.includes('should be different') || msg.includes('same password')) {
          setErrorMessage('Your new password must be different from your previous password.');
        } else if (msg.includes('rate limit')) {
          setErrorMessage('Too many requests. Please wait a moment before trying again.');
        } else if (msg.includes('session') || msg.includes('token') || msg.includes('expired')) {
          setErrorMessage(
            'Your recovery session has expired. Please request a new password reset link.'
          );
          setHasValidSession(false);
        } else {
          setErrorMessage(error.message);
        }
        return;
      }

      // Password updated successfully
      setSuccessNotice(
        'Your password has been successfully updated! Redirecting you to the sign-in page...'
      );

      // Sign out from recovery session and redirect to login
      setTimeout(async () => {
        try {
          await supabase.auth.signOut();
        } catch {
          // ignore signout errors
        }
        router.push('/auth/login?reset=success');
      }, 2500);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred while resetting your password.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
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
            <p className="text-[10px] tracking-[0.22em] text-slate-400">CHOOSE NEW PASSWORD</p>
          </div>
        </div>

        <h2 className="mt-8 text-2xl font-extrabold tracking-tight text-white">
          Create new password
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Your new password must be at least 6 characters and different from previous credentials.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-2xl border border-white/10 bg-[#102238] p-8 shadow-xl">
          {checkingSession ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
              <p className="mt-4 text-sm font-semibold text-slate-200">
                Verifying recovery credentials...
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Please wait while we validate your secure reset link.
              </p>
            </div>
          ) : !hasValidSession ? (
            <div className="space-y-5">
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-5 text-sm text-rose-300">
                <div className="flex items-center gap-2 text-base font-bold text-rose-300">
                  <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
                  Invalid or Expired Link
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-300">
                  {errorMessage ||
                    'This password recovery link is either invalid, has expired, or has already been used. For your security, recovery links are single-use and time-limited.'}
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <Link
                  href="/auth/forgot-password"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 py-3 text-sm font-bold text-[#071322] transition hover:bg-cyan-300"
                >
                  <KeyRound className="h-4 w-4" /> Request a New Reset Link
                </Link>

                <Link
                  href="/auth/login"
                  className="flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-white/10"
                >
                  Return to Sign In
                </Link>
              </div>
            </div>
          ) : successNotice ? (
            <div className="space-y-5">
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-sm text-emerald-300">
                <div className="flex items-center gap-2 text-base font-bold text-emerald-400">
                  <CheckCircle className="h-5 w-5 shrink-0" /> Password Successfully Reset
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-200">{successNotice}</p>
              </div>

              <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-4 text-xs text-slate-300">
                <div className="flex items-center gap-2 font-semibold text-cyan-300">
                  <ShieldCheck className="h-4 w-4" /> Security Confirmation
                </div>
                <p className="mt-1 leading-relaxed text-slate-400">
                  Your credentials have been updated securely across all Kudla Labs sessions. You can
                  now log in with your new password.
                </p>
              </div>

              <Link
                href="/auth/login"
                className="flex w-full items-center justify-center rounded-xl bg-cyan-400 py-3 text-sm font-bold text-[#071322] transition hover:bg-cyan-300"
              >
                Go to Sign In Now →
              </Link>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-5">
              {errorMessage && (
                <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300">
                  <div className="flex items-center gap-2 font-semibold">
                    <AlertCircle className="h-4 w-4" /> Update Failed
                  </div>
                  <p className="mt-1 leading-relaxed">{errorMessage}</p>
                </div>
              )}

              {/* New Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
                >
                  New Password
                </label>
                <div className="relative mt-2">
                  <Lock className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    disabled={loading}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-white/10 bg-[#071322] py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-cyan-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
                >
                  Confirm New Password
                </label>
                <div className="relative mt-2">
                  <Lock className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    disabled={loading}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-white/10 bg-[#071322] py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-cyan-300"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Validation Feedback */}
              <div className="rounded-xl border border-white/5 bg-[#071322] p-3 text-xs space-y-1.5">
                <div className="flex items-center gap-2">
                  {isMinLength ? (
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <X className="h-3.5 w-3.5 text-slate-500" />
                  )}
                  <span className={isMinLength ? 'text-emerald-300' : 'text-slate-400'}>
                    At least 6 characters long
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {passwordsMatch ? (
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <X className="h-3.5 w-3.5 text-slate-500" />
                  )}
                  <span className={passwordsMatch ? 'text-emerald-300' : 'text-slate-400'}>
                    Passwords match
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !isFormValid}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-cyan-400 py-3 text-sm font-bold text-[#071322] transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Updating password...
                  </>
                ) : (
                  <>
                    <KeyRound className="h-4 w-4" /> Reset Password
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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#071322]">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
