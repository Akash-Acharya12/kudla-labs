'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import type { Profile } from '@/types/database.types';
import { KUDLA_MODULES } from '@/types/modules';
import {
  Sparkles,
  LogOut,
  ArrowRight,
  Flame,
  CheckCircle2,
  Settings,
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Partial<Profile> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStudentData() {
      if (isSupabaseConfigured()) {
        try {
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();

          if (user) {
            const { data } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', user.id)
              .single();

            if (data) {
              setProfile(data);
              setLoading(false);
              return;
            } else {
              setProfile({
                email: user.email,
                full_name: (user.user_metadata?.full_name as string) || 'Student',
                target_career: 'Software Engineer',
                education_level: 'Undergraduate',
                preferred_language: 'English',
              });
              setLoading(false);
              return;
            }
          }
        } catch (err) {
          console.error('Failed to load profile from Supabase:', err);
        }
      }

      // Fallback to local storage or guest demo profile
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('kudla_student_profile');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            setProfile({
              full_name: 'Kudla Student',
              education_level: parsed.educationLevel || 'Undergraduate',
              field_of_study: parsed.fieldOfStudy || 'Computer Science',
              target_career: parsed.targetCareer || 'Full-Stack Developer',
              preferred_language: parsed.preferredLanguage || 'English',
            });
            setLoading(false);
            return;
          } catch {
            // ignore
          }
        }
      }

      // Default demo student profile
      setProfile({
        full_name: 'Student Learner',
        target_career: 'Full-Stack Developer',
        education_level: 'Undergraduate (B.Tech)',
        preferred_language: 'English',
      });
      setLoading(false);
    }

    loadStudentData();
  }, []);

  const handleSignOut = async () => {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Sign out error:', err);
      }
    }
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#071322] text-slate-100">
      {/* TOP NAVIGATION */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#071322]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300 to-blue-600 font-black text-[#071322]">
              K
            </div>
            <div>
              <p className="text-lg font-bold tracking-tight">
                Kudla <span className="text-cyan-400">Labs</span>
              </p>
              <p className="text-[10px] tracking-widest text-slate-400">
                STUDENT DASHBOARD
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/path"
              className="hidden items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-400/20 sm:inline-flex"
            >
              🧭 Kudla Path
            </Link>

            <Link
              href="/learn"
              className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-4 py-2 text-xs font-bold text-[#071322] transition hover:bg-cyan-300"
            >
              <Sparkles className="h-3.5 w-3.5" /> Launch AI Assistant
            </Link>

            <Link
              href="/onboarding"
              className="hidden items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-1.5 text-xs font-medium text-slate-300 transition hover:border-cyan-400 sm:inline-flex"
            >
              <Settings className="h-3.5 w-3.5" /> Edit Profile
            </Link>

            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3.5 py-1.5 text-xs font-semibold text-slate-400 transition hover:border-rose-400 hover:text-rose-400"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* DASHBOARD HERO */}
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#102a45] via-[#102238] to-[#0b1c30] p-8 shadow-2xl">
          <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                <span className="h-2 w-2 rounded-full bg-cyan-400" />
                ACTIVE LEARNING SESSION
              </div>
              <h1 className="mt-4 text-3xl font-extrabold md:text-4xl">
                Welcome back,{' '}
                <span className="text-cyan-400">
                  {loading ? 'Student...' : profile?.full_name || 'Learner'}
                </span>
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                Targeting:{' '}
                <span className="font-semibold text-white">
                  {profile?.target_career || 'Software Engineer'}
                </span>{' '}
                · Education:{' '}
                <span className="font-semibold text-white">
                  {profile?.education_level || 'Undergraduate'}
                </span>{' '}
                · Language:{' '}
                <span className="font-semibold text-cyan-300">
                  {profile?.preferred_language || 'English'}
                </span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="rounded-2xl border border-white/10 bg-[#071322]/80 px-4 py-3">
                <div className="flex items-center gap-2 text-amber-400">
                  <Flame className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Study Streak</span>
                </div>
                <p className="mt-1 text-2xl font-black text-white">
                  4 <span className="text-xs font-normal text-slate-400">days active</span>
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#071322]/80 px-4 py-3">
                <div className="flex items-center gap-2 text-cyan-400">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Concepts Mastered</span>
                </div>
                <p className="mt-1 text-2xl font-black text-white">
                  18 <span className="text-xs font-normal text-slate-400">topics</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4 CORE MODULE HUBS */}
        <div className="mt-12">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold tracking-widest text-cyan-400">
                ECOSYSTEM WORKSPACE
              </p>
              <h2 className="mt-1 text-2xl font-bold">Your Four Learning Pillars</h2>
            </div>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {/* 1. Kudla Learn */}
            <div className="group rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 via-[#102238] to-[#102238] p-7 transition hover:-translate-y-1 hover:border-cyan-400/50">
              <div className="flex items-start justify-between">
                <span className="text-4xl">{KUDLA_MODULES.learn.icon}</span>
                <span className="rounded-full bg-cyan-400/15 px-3 py-1 text-xs font-bold text-cyan-300">
                  Core Module 01
                </span>
              </div>
              <h3 className="mt-5 text-2xl font-bold group-hover:text-cyan-300">
                {KUDLA_MODULES.learn.name}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {KUDLA_MODULES.learn.description}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-2 text-xs text-slate-300">
                {KUDLA_MODULES.learn.features.map((feat) => (
                  <span key={feat} className="flex items-center gap-1.5">
                    <span className="text-cyan-400">✓</span> {feat}
                  </span>
                ))}
              </div>

              <div className="mt-6 border-t border-white/10 pt-5">
                <Link
                  href="/learn"
                  className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-5 py-2.5 text-xs font-bold text-[#071322] transition hover:bg-cyan-300"
                >
                  Open AI Learning Assistant <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* 2. Kudla Path */}
            <div className="group rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-emerald-400/10 via-[#102238] to-[#102238] p-7 transition hover:-translate-y-1 hover:border-emerald-400/50">
              <div className="flex items-start justify-between">
                <span className="text-4xl">{KUDLA_MODULES.path.icon}</span>
                <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-300">
                  Core Module 02
                </span>
              </div>
              <h3 className="mt-5 text-2xl font-bold group-hover:text-emerald-300">
                {KUDLA_MODULES.path.name}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {KUDLA_MODULES.path.description}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-2 text-xs text-slate-300">
                {KUDLA_MODULES.path.features.map((feat) => (
                  <span key={feat} className="flex items-center gap-1.5">
                    <span className="text-emerald-400">✓</span> {feat}
                  </span>
                ))}
              </div>

              <div className="mt-6 border-t border-white/10 pt-5">
                <Link
                  href="/path"
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-5 py-2.5 text-xs font-bold text-emerald-300 transition hover:bg-emerald-400/20"
                >
                  View Career Roadmap <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* 3. Kudla Career */}
            <div className="group rounded-3xl border border-violet-400/20 bg-gradient-to-br from-violet-400/10 via-[#102238] to-[#102238] p-7 transition hover:-translate-y-1 hover:border-violet-400/50">
              <div className="flex items-start justify-between">
                <span className="text-4xl">{KUDLA_MODULES.career.icon}</span>
                <span className="rounded-full bg-violet-400/15 px-3 py-1 text-xs font-bold text-violet-300">
                  Core Module 03
                </span>
              </div>
              <h3 className="mt-5 text-2xl font-bold group-hover:text-violet-300">
                {KUDLA_MODULES.career.name}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {KUDLA_MODULES.career.description}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-2 text-xs text-slate-300">
                {KUDLA_MODULES.career.features.map((feat) => (
                  <span key={feat} className="flex items-center gap-1.5">
                    <span className="text-violet-400">✓</span> {feat}
                  </span>
                ))}
              </div>

              <div className="mt-6 border-t border-white/10 pt-5">
                <button
                  type="button"
                  onClick={() => alert('Resume Analysis and AI Mock Interviews are enabled in Kudla Career.')}
                  className="inline-flex items-center gap-2 rounded-full border border-violet-400/40 bg-violet-400/10 px-5 py-2.5 text-xs font-bold text-violet-300 transition hover:bg-violet-400/20"
                >
                  Open Career Suite <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* 4. Kudla Marketplace */}
            <div className="group rounded-3xl border border-amber-400/20 bg-gradient-to-br from-amber-400/10 via-[#102238] to-[#102238] p-7 transition hover:-translate-y-1 hover:border-amber-400/50">
              <div className="flex items-start justify-between">
                <span className="text-4xl">{KUDLA_MODULES.marketplace.icon}</span>
                <span className="rounded-full bg-amber-400/15 px-3 py-1 text-xs font-bold text-amber-300">
                  Core Module 04
                </span>
              </div>
              <h3 className="mt-5 text-2xl font-bold group-hover:text-amber-300">
                {KUDLA_MODULES.marketplace.name}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {KUDLA_MODULES.marketplace.description}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-2 text-xs text-slate-300">
                {KUDLA_MODULES.marketplace.features.map((feat) => (
                  <span key={feat} className="flex items-center gap-1.5">
                    <span className="text-amber-400">✓</span> {feat}
                  </span>
                ))}
              </div>

              <div className="mt-6 border-t border-white/10 pt-5">
                <button
                  type="button"
                  onClick={() => alert('Discovering verified courses and certifications for your track!')}
                  className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-5 py-2.5 text-xs font-bold text-amber-300 transition hover:bg-amber-400/20"
                >
                  Browse Marketplace <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* QUICK LEARNING PROMPT BAR */}
        <section className="mt-12 rounded-3xl border border-cyan-400/20 bg-[#102238] p-6 md:p-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h3 className="text-lg font-bold text-white">Have a difficult concept to solve right now?</h3>
              <p className="text-xs text-slate-400">
                Kudla Learn provides multilingual AI explanations, document parsing, and step-by-step solutions.
              </p>
            </div>
            <Link
              href="/learn"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-400 px-6 py-3 text-xs font-bold text-[#071322] transition hover:bg-cyan-300"
            >
              Ask Kudla Learn Assistant <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
