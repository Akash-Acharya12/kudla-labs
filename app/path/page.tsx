'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import type { Profile } from '@/types/database.types';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Sparkles,
  Target,
  BarChart3,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface Milestone {
  id: string;
  stage: number;
  title: string;
  duration: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  description: string;
  skills: string[];
}

const DEFAULT_ROADMAP: Milestone[] = [
  {
    id: 'm1',
    stage: 1,
    title: 'Computer Science & Programming Fundamentals',
    duration: 'Weeks 1 - 4',
    status: 'completed',
    description: 'Master core logic, asymptotic analysis (Big-O), memory allocation, and data structures (Arrays, Linked Lists, Trees).',
    skills: ['Python/TypeScript', 'Time & Space Complexity', 'Data Structures', 'Git Version Control'],
  },
  {
    id: 'm2',
    stage: 2,
    title: 'Modern Web Architectures & Backend APIs',
    duration: 'Weeks 5 - 8',
    status: 'in-progress',
    description: 'Build full-stack applications with React, Next.js, relational databases, Row Level Security, and REST/GraphQL APIs.',
    skills: ['React 19 & Next.js 16', 'PostgreSQL & Supabase', 'Authentication & RLS', 'Tailwind CSS'],
  },
  {
    id: 'm3',
    stage: 3,
    title: 'System Design & Cloud Deployment',
    duration: 'Weeks 9 - 12',
    status: 'upcoming',
    description: 'Scale applications with caching, asynchronous queues, microservices, Docker containerization, and CI/CD pipelines.',
    skills: ['System Design', 'Redis Caching', 'Docker & Kubernetes', 'Cloud Deployment'],
  },
  {
    id: 'm4',
    stage: 4,
    title: 'Applied AI Integration & Production Capstone',
    duration: 'Weeks 13 - 16',
    status: 'upcoming',
    description: 'Incorporate Large Language Model APIs, vector embeddings, and build production-grade end-to-end portfolio projects.',
    skills: ['LLM APIs (Gemini)', 'RAG & Vector Search', 'Capstone Engineering', 'Interview Prep'],
  },
];

interface SkillBenchmark {
  name: string;
  currentLevel: number; // 1-5
  requiredLevel: number; // 1-5
}

export default function PathPage() {
  const [profile, setProfile] = useState<Partial<Profile> | null>(null);
  const [targetCareer, setTargetCareer] = useState('Full-Stack Developer');
  const [activeTab, setActiveTab] = useState<'roadmap' | 'gaps' | 'planner'>('roadmap');

  const [skillsBenchmark, setSkillsBenchmark] = useState<SkillBenchmark[]>([
    { name: 'Programming & Logic', currentLevel: 3, requiredLevel: 5 },
    { name: 'Data Structures & Algorithms', currentLevel: 2, requiredLevel: 4 },
    { name: 'Web Development & APIs', currentLevel: 3, requiredLevel: 5 },
    { name: 'System Design & Databases', currentLevel: 2, requiredLevel: 4 },
    { name: 'Analytical Problem Solving', currentLevel: 3, requiredLevel: 4 },
  ]);

  useEffect(() => {
    async function loadProfile() {
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
              if (data.target_career) setTargetCareer(data.target_career);
              if (data.skills && typeof data.skills === 'object') {
                const s = data.skills as Record<string, number>;
                setSkillsBenchmark([
                  { name: 'Programming & Logic', currentLevel: s.programming || 3, requiredLevel: 5 },
                  { name: 'Data Structures & Algorithms', currentLevel: s.dsa || 2, requiredLevel: 4 },
                  { name: 'Web Development & APIs', currentLevel: s.web_dev || 3, requiredLevel: 5 },
                  { name: 'System Design & Databases', currentLevel: 2, requiredLevel: 4 },
                  { name: 'Analytical Problem Solving', currentLevel: s.problem_solving || 3, requiredLevel: 4 },
                ]);
              }
              return;
            }
          }
        } catch (err) {
          console.error('Failed to load profile in Path:', err);
        }
      }

      // Local storage fallback
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('kudla_student_profile');
        if (stored) {
          try {
            const p = JSON.parse(stored);
            if (p.targetCareer) setTargetCareer(p.targetCareer);
            if (p.skills) {
              setSkillsBenchmark([
                { name: 'Programming & Logic', currentLevel: p.skills.programming || 3, requiredLevel: 5 },
                { name: 'Data Structures & Algorithms', currentLevel: p.skills.dsa || 2, requiredLevel: 4 },
                { name: 'Web Development & APIs', currentLevel: p.skills.web_dev || 3, requiredLevel: 5 },
                { name: 'System Design & Databases', currentLevel: 2, requiredLevel: 4 },
                { name: 'Analytical Problem Solving', currentLevel: p.skills.problem_solving || 3, requiredLevel: 4 },
              ]);
            }
          } catch {
            // ignore
          }
        }
      }
    }
    loadProfile();
  }, []);

  return (
    <div className="min-h-screen bg-[#071322] text-slate-100">
      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#071322]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3.5 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-emerald-400 hover:text-emerald-300"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
            </Link>

            <div className="flex items-center gap-2">
              <span className="text-xl">🧭</span>
              <div>
                <h1 className="text-base font-bold text-white">
                  Kudla <span className="text-emerald-400">Path</span>
                </h1>
                <p className="text-[10px] tracking-widest text-slate-400">
                  PERSONALIZED LEARNING ROADMAPS & SKILL GAP ANALYSIS
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/learn"
              className="inline-flex items-center gap-1.5 rounded-full bg-cyan-400 px-4 py-2 text-xs font-bold text-[#071322] transition hover:bg-cyan-300"
            >
              <Sparkles className="h-3.5 w-3.5" /> Ask Kudla Learn
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="relative overflow-hidden rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-[#0c2e36] via-[#102238] to-[#071322] p-8 shadow-2xl">
          <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />

          <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                <Target className="h-3.5 w-3.5" /> TARGET ROLE: {targetCareer}
                {profile?.full_name && <span>· Learner: {profile.full_name}</span>}
              </div>
              <h2 className="mt-4 text-3xl font-extrabold text-white md:text-4xl">
                Your Career Roadmap to{' '}
                <span className="text-emerald-400">{targetCareer}</span>
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                Kudla Path tracks your learning milestones, highlights skill deficiencies, and schedules study targets to take you from fundamentals to employment.
              </p>
            </div>

            <div className="flex gap-4">
              <div className="rounded-2xl border border-white/10 bg-[#071322]/80 p-4 text-center">
                <p className="text-xs uppercase tracking-wider text-slate-400">Current Progress</p>
                <p className="mt-1 text-3xl font-black text-emerald-400">35%</p>
                <p className="text-[10px] text-slate-500">Stage 2 of 4</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#071322]/80 p-4 text-center">
                <p className="text-xs uppercase tracking-wider text-slate-400">Estimated Completion</p>
                <p className="mt-1 text-2xl font-bold text-white">10 Weeks</p>
                <p className="text-[10px] text-slate-500">at 8 hrs/week</p>
              </div>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="mt-8 flex gap-3 border-b border-white/10 pb-4">
          <button
            type="button"
            onClick={() => setActiveTab('roadmap')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === 'roadmap'
                ? 'bg-emerald-400 text-[#071322]'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <Layers className="h-4 w-4" /> Milestone Roadmap
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('gaps')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === 'gaps'
                ? 'bg-emerald-400 text-[#071322]'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <BarChart3 className="h-4 w-4" /> Skill Gap Analysis
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('planner')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === 'planner'
                ? 'bg-emerald-400 text-[#071322]'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <Calendar className="h-4 w-4" /> Study Planner
          </button>
        </div>

        {/* TAB CONTENT: 1. ROADMAP */}
        {activeTab === 'roadmap' && (
          <div className="mt-8 space-y-6">
            <div className="grid gap-6">
              {DEFAULT_ROADMAP.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-2xl border p-6 transition ${
                    item.status === 'completed'
                      ? 'border-emerald-500/30 bg-emerald-500/5'
                      : item.status === 'in-progress'
                      ? 'border-cyan-400/40 bg-cyan-400/10 shadow-lg shadow-cyan-950/40'
                      : 'border-white/10 bg-[#102238]/60 opacity-80'
                  }`}
                >
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-black ${
                          item.status === 'completed'
                            ? 'bg-emerald-400 text-[#071322]'
                            : item.status === 'in-progress'
                            ? 'bg-cyan-400 text-[#071322]'
                            : 'bg-white/10 text-slate-400'
                        }`}
                      >
                        0{item.stage}
                      </span>
                      <div>
                        <h3 className="text-lg font-bold text-white">{item.title}</h3>
                        <p className="text-xs text-slate-400">{item.duration}</p>
                      </div>
                    </div>

                    <div>
                      {item.status === 'completed' && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-semibold text-emerald-300">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Completed
                        </span>
                      )}
                      {item.status === 'in-progress' && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-400/20 px-3 py-1 text-xs font-semibold text-cyan-300">
                          <Clock className="h-3.5 w-3.5" /> In Progress (Active)
                        </span>
                      )}
                      {item.status === 'upcoming' && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-400">
                          Upcoming Milestone
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-slate-300">
                    {item.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-lg border border-white/10 bg-[#071322] px-3 py-1 text-xs text-slate-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB CONTENT: 2. SKILL GAP ANALYSIS */}
        {activeTab === 'gaps' && (
          <div className="mt-8 rounded-3xl border border-white/10 bg-[#102238] p-8">
            <h3 className="text-xl font-bold text-white">Skill Benchmark vs. Target Expectations</h3>
            <p className="mt-2 text-sm text-slate-400">
              Comparing your current self-assessed ratings with target competencies for a {targetCareer}.
            </p>

            <div className="mt-8 space-y-6">
              {skillsBenchmark.map((skill) => {
                const gap = Math.max(0, skill.requiredLevel - skill.currentLevel);
                const percent = (skill.currentLevel / 5) * 100;

                return (
                  <div key={skill.name} className="rounded-2xl border border-white/5 bg-[#071322]/60 p-5">
                    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                      <div>
                        <h4 className="font-bold text-white">{skill.name}</h4>
                        <p className="text-xs text-slate-400">
                          Current: Level {skill.currentLevel}/5 · Target Expectation: Level {skill.requiredLevel}/5
                        </p>
                      </div>

                      <div>
                        {gap === 0 ? (
                          <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-bold text-emerald-300">
                            ✓ On Target
                          </span>
                        ) : (
                          <span className="rounded-full bg-amber-400/20 px-3 py-1 text-xs font-bold text-amber-300">
                            Gap: {gap} Level{gap > 1 ? 's' : ''} to improve
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB CONTENT: 3. STUDY PLANNER */}
        {activeTab === 'planner' && (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-[#102238] p-6">
              <h3 className="text-lg font-bold text-white">Weekly Focus Schedule</h3>
              <p className="mt-1 text-xs text-slate-400">Recommended 8-10 hours allocated study plan</p>

              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between rounded-xl border border-white/5 bg-[#071322] p-3 text-xs">
                  <span className="font-semibold text-slate-200">Monday & Tuesday (3 hrs)</span>
                  <span className="text-cyan-300">Data Structures & Relational Schemas</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-white/5 bg-[#071322] p-3 text-xs">
                  <span className="font-semibold text-slate-200">Wednesday & Thursday (3 hrs)</span>
                  <span className="text-emerald-300">Full-Stack Project Development (Next.js)</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-white/5 bg-[#071322] p-3 text-xs">
                  <span className="font-semibold text-slate-200">Saturday (2 hrs)</span>
                  <span className="text-amber-300">PYQ Exam & Interview Mock Solving</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#102238] p-6">
              <h3 className="text-lg font-bold text-white">Recommended Bridging Modules</h3>
              <p className="mt-1 text-xs text-slate-400">Targeted lessons to close your highest skill gaps</p>

              <div className="mt-5 space-y-3">
                <Link
                  href="/learn"
                  className="flex items-center justify-between rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-3 text-xs transition hover:border-cyan-400/50"
                >
                  <div>
                    <p className="font-bold text-cyan-300">Data Structures Masterclass</p>
                    <p className="text-slate-400">Covers Trees, Heaps, and Dynamic Programming</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-cyan-400" />
                </Link>

                <Link
                  href="/learn"
                  className="flex items-center justify-between rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-3 text-xs transition hover:border-emerald-400/50"
                >
                  <div>
                    <p className="font-bold text-emerald-300">System Design Primer</p>
                    <p className="text-slate-400">Microservices, Caching, and Database Sharding</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-emerald-400" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
