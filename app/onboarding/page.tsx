'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import {
  GraduationCap,
  Compass,
  Sparkles,
  Layers,
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
} from 'lucide-react';

const EDUCATION_LEVELS = [
  'High School (11th / 12th / PUC)',
  'Undergraduate (B.Tech, B.E., BCA, B.Sc)',
  'Postgraduate (M.Tech, MCA, M.Sc)',
  'Working Professional / Transitioning',
];

const FIELDS_OF_STUDY = [
  'Computer Science & Engineering',
  'Information Science & Technology',
  'Electronics & Communication',
  'Data Science & Artificial Intelligence',
  'Commerce & Business Applications',
  'Mechanical / Civil / Electrical',
  'Other / Self-Taught',
];

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'kn', name: 'Kannada (ಕನ್ನಡ)' },
  { code: 'hi', name: 'Hindi (हिन्दी)' },
  { code: 'te', name: 'Telugu (తెలుగు)' },
  { code: 'ta', name: 'Tamil (தமிழ்)' },
];

const CAREER_TARGETS = [
  { id: 'fullstack', title: 'Full-Stack Developer', icon: '💻', desc: 'React, Node.js, Next.js, Cloud APIs' },
  { id: 'aiml', title: 'AI / ML Engineer', icon: '🤖', desc: 'Python, LLMs, Neural Nets, PyTorch' },
  { id: 'data', title: 'Data Scientist / Analyst', icon: '📊', desc: 'SQL, Python, Statistics, Dashboards' },
  { id: 'devops', title: 'Cloud & DevOps Engineer', icon: '☁️', desc: 'Docker, Kubernetes, CI/CD, AWS/GCP' },
  { id: 'mobile', title: 'Mobile App Developer', icon: '📱', desc: 'Flutter, React Native, Swift, Kotlin' },
  { id: 'security', title: 'Cybersecurity Analyst', icon: '🛡️', desc: 'Network Security, Ethical Hacking, Audits' },
];

const SKILL_ITEMS = [
  { key: 'programming', label: 'Programming & Logic' },
  { key: 'dsa', label: 'Data Structures & Algorithms' },
  { key: 'web_dev', label: 'Web Development & APIs' },
  { key: 'problem_solving', label: 'Analytical Problem Solving' },
];

const MODULE_OPTIONS = [
  { id: 'learn', name: 'Kudla Learn', icon: '📚', desc: 'Personalized AI explanations & interactive concept mastering' },
  { id: 'path', name: 'Kudla Path', icon: '🧭', desc: 'Targeted skill roadmaps & milestone tracking' },
  { id: 'career', name: 'Kudla Career', icon: '💼', desc: 'Resume review, AI mock interviews & portfolio' },
  { id: 'marketplace', name: 'Kudla Marketplace', icon: '🎓', desc: 'Verified courses, certifications & workshops' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Form states
  const [educationLevel, setEducationLevel] = useState(EDUCATION_LEVELS[1]);
  const [fieldOfStudy, setFieldOfStudy] = useState(FIELDS_OF_STUDY[0]);
  const [preferredLanguage, setPreferredLanguage] = useState('English');
  const [targetCareer, setTargetCareer] = useState(CAREER_TARGETS[0].title);
  const [skills, setSkills] = useState<Record<string, number>>({
    programming: 3,
    dsa: 2,
    web_dev: 3,
    problem_solving: 3,
  });
  const [primaryModule, setPrimaryModule] = useState('learn');

  useEffect(() => {
    async function checkUser() {
      if (!isSupabaseConfigured()) return;
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
          // Pre-fetch any existing profile data
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (profile) {
            if (profile.education_level) setEducationLevel(profile.education_level);
            if (profile.field_of_study) setFieldOfStudy(profile.field_of_study);
            if (profile.preferred_language) setPreferredLanguage(profile.preferred_language);
            if (profile.target_career) setTargetCareer(profile.target_career);
            if (profile.skills && typeof profile.skills === 'object') {
              setSkills((prev) => ({ ...prev, ...(profile.skills as Record<string, number>) }));
            }
          }
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
      }
    }
    checkUser();
  }, []);

  const handleFinish = async () => {
    setLoading(true);

    try {
      if (isSupabaseConfigured() && userId) {
        const supabase = createClient();
        await supabase.from('profiles').upsert({
          id: userId,
          education_level: educationLevel,
          field_of_study: fieldOfStudy,
          preferred_language: preferredLanguage,
          target_career: targetCareer,
          skills: skills,
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        });
      }

      // Also persist to localStorage for client-side fallback/offline state
      if (typeof window !== 'undefined') {
        localStorage.setItem('kudla_selected_language', preferredLanguage);
        localStorage.setItem(
          'kudla_student_profile',
          JSON.stringify({
            educationLevel,
            fieldOfStudy,
            preferredLanguage,
            targetCareer,
            skills,
            primaryModule,
            onboardingCompleted: true,
          })
        );
      }

      router.push('/dashboard');
    } catch (err) {
      console.error('Failed to complete onboarding:', err);
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#071322] px-6 py-12 text-slate-100">
      <div className="mx-auto max-w-3xl">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300 to-blue-600 font-black text-[#071322]">
              K
            </div>
            <div>
              <p className="text-lg font-bold tracking-tight">
                Kudla <span className="text-cyan-400">Labs</span>
              </p>
              <p className="text-[10px] tracking-widest text-slate-400">
                STUDENT PERSONALIZATION ONBOARDING
              </p>
            </div>
          </div>
          <Link
            href="/dashboard"
            className="text-xs text-slate-400 transition hover:text-cyan-300"
          >
            Skip for now →
          </Link>
        </div>

        {/* PROGRESS INDICATOR */}
        <div className="mt-8">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span className={currentStep >= 1 ? 'text-cyan-300' : ''}>1. Background</span>
            <span className={currentStep >= 2 ? 'text-cyan-300' : ''}>2. Career Goal</span>
            <span className={currentStep >= 3 ? 'text-cyan-300' : ''}>3. Skills</span>
            <span className={currentStep >= 4 ? 'text-cyan-300' : ''}>4. Priority</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP CONTENT CONTAINER */}
        <div className="mt-10 rounded-3xl border border-white/10 bg-[#102238] p-8 shadow-2xl">
          {/* STEP 1: Academic Background & Language */}
          {currentStep === 1 && (
            <section className="space-y-6">
              <div className="flex items-center gap-3 text-cyan-400">
                <GraduationCap className="h-6 w-6" />
                <h2 className="text-xl font-bold text-white">Your Academic Profile</h2>
              </div>
              <p className="text-sm text-slate-400">
                Tell us about your background so Kudla Labs can tailor recommendations and curriculum.
              </p>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Current Education Level
                </label>
                <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                  {EDUCATION_LEVELS.map((level) => (
                    <button
                      type="button"
                      key={level}
                      onClick={() => setEducationLevel(level)}
                      className={`rounded-xl border p-4 text-left text-sm transition ${
                        educationLevel === level
                          ? 'border-cyan-400 bg-cyan-400/10 font-bold text-cyan-300'
                          : 'border-white/10 bg-[#071322]/50 text-slate-300 hover:border-white/20'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Field of Study / Department
                </label>
                <select
                  value={fieldOfStudy}
                  onChange={(e) => setFieldOfStudy(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#071322] px-4 py-3 text-sm text-white focus:border-cyan-400 focus:outline-none"
                >
                  {FIELDS_OF_STUDY.map((field) => (
                    <option key={field} value={field} className="bg-[#071322]">
                      {field}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Preferred Learning Language (Multilingual Support)
                </label>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {LANGUAGES.map((lang) => (
                    <button
                      type="button"
                      key={lang.code}
                      onClick={() => setPreferredLanguage(lang.name.split(' ')[0])}
                      className={`rounded-xl border p-3 text-center text-sm transition ${
                        preferredLanguage.includes(lang.name.split(' ')[0])
                          ? 'border-cyan-400 bg-cyan-400/10 font-bold text-cyan-300'
                          : 'border-white/10 bg-[#071322]/50 text-slate-300 hover:border-white/20'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* STEP 2: Career Aspirations */}
          {currentStep === 2 && (
            <section className="space-y-6">
              <div className="flex items-center gap-3 text-cyan-400">
                <Compass className="h-6 w-6" />
                <h2 className="text-xl font-bold text-white">Your Target Career Path</h2>
              </div>
              <p className="text-sm text-slate-400">
                Choose the role you want Kudla Path and Kudla Career to prepare you for.
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                {CAREER_TARGETS.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setTargetCareer(item.title)}
                    className={`rounded-2xl border p-5 text-left transition ${
                      targetCareer === item.title
                        ? 'border-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-950/40'
                        : 'border-white/10 bg-[#071322]/50 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{item.icon}</span>
                      {targetCareer === item.title && (
                        <span className="rounded-full bg-cyan-400/20 p-1 text-cyan-300">
                          <Check className="h-4 w-4" />
                        </span>
                      )}
                    </div>
                    <h3 className="mt-3 font-bold text-white">{item.title}</h3>
                    <p className="mt-1 text-xs text-slate-400">{item.desc}</p>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* STEP 3: Skill Self-Assessment */}
          {currentStep === 3 && (
            <section className="space-y-6">
              <div className="flex items-center gap-3 text-cyan-400">
                <Sparkles className="h-6 w-6" />
                <h2 className="text-xl font-bold text-white">Self-Assessment</h2>
              </div>
              <p className="text-sm text-slate-400">
                Rate your current comfort level from 1 (Beginner) to 5 (Advanced). This baseline helps Kudla Path detect skill gaps.
              </p>

              <div className="space-y-5">
                {SKILL_ITEMS.map((skill) => (
                  <div key={skill.key} className="rounded-xl border border-white/5 bg-[#071322]/50 p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-slate-200">{skill.label}</span>
                      <span className="font-bold text-cyan-300">
                        Level {skills[skill.key] || 1} / 5
                      </span>
                    </div>
                    <div className="mt-3 flex gap-2">
                      {[1, 2, 3, 4, 5].map((lvl) => (
                        <button
                          type="button"
                          key={lvl}
                          onClick={() => setSkills({ ...skills, [skill.key]: lvl })}
                          className={`flex-1 rounded-lg py-2 text-xs font-bold transition ${
                            (skills[skill.key] || 1) >= lvl
                              ? 'bg-cyan-400 text-[#071322]'
                              : 'bg-white/10 text-slate-400 hover:bg-white/15'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* STEP 4: Primary Focus Module */}
          {currentStep === 4 && (
            <section className="space-y-6">
              <div className="flex items-center gap-3 text-cyan-400">
                <Layers className="h-6 w-6" />
                <h2 className="text-xl font-bold text-white">Where would you like to start?</h2>
              </div>
              <p className="text-sm text-slate-400">
                Select your primary focus module. You will have full access to all four modules inside your dashboard.
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                {MODULE_OPTIONS.map((mod) => (
                  <button
                    type="button"
                    key={mod.id}
                    onClick={() => setPrimaryModule(mod.id)}
                    className={`rounded-2xl border p-5 text-left transition ${
                      primaryModule === mod.id
                        ? 'border-cyan-400 bg-cyan-400/10'
                        : 'border-white/10 bg-[#071322]/50 hover:border-white/20'
                    }`}
                  >
                    <span className="text-3xl">{mod.icon}</span>
                    <h3 className="mt-3 font-bold text-white">{mod.name}</h3>
                    <p className="mt-1 text-xs text-slate-400">{mod.desc}</p>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* NAVIGATION BUTTONS */}
          <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-2.5 text-sm font-semibold text-white transition hover:border-cyan-400 hover:text-cyan-300"
              >
                <ArrowLeft className="h-4 w-4" /> Previous
              </button>
            ) : (
              <div />
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => prev + 1)}
                className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-6 py-2.5 text-sm font-bold text-[#071322] transition hover:bg-cyan-300"
              >
                Next Step <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-7 py-3 text-sm font-bold text-[#071322] shadow-lg shadow-cyan-950/40 transition hover:from-cyan-300 hover:to-blue-400 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Saving Profile...
                  </>
                ) : (
                  <>
                    Complete & Enter Dashboard <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
