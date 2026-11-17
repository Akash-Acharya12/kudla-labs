
const modules = [
  {
    number: "01",
    icon: "📚",
    name: "Kudla Learn",
    description:
      "Understand difficult concepts through personalized AI learning, multilingual explanations and interactive lessons.",
    features: ["AI Learning Assistant", "PDF & Image Explanations", "Audio & Visual Lessons", "PYQ Analysis"],
    color: "from-cyan-400/20 to-blue-500/10",
  },
  {
    number: "02",
    icon: "🧭",
    name: "Kudla Path",
    description:
      "Discover your potential with personalized learning roadmaps and career-focused skill development.",
    features: ["Career Roadmaps", "Skill Gap Analysis", "Smart Study Planner", "Course Recommendations"],
    color: "from-emerald-400/20 to-teal-500/10",
  },
  {
    number: "03",
    icon: "💼",
    name: "Kudla Career",
    description:
      "Build your professional identity and prepare yourself for real-world career opportunities.",
    features: ["Resume Analysis", "GitHub & Project Review", "AI Mock Interviews", "Portfolio Builder"],
    color: "from-violet-400/20 to-purple-500/10",
  },
  {
    number: "04",
    icon: "🎓",
    name: "Kudla Marketplace",
    description:
      "Discover relevant courses, certifications and professional learning opportunities.",
    features: ["Free & Paid Courses", "Course Recommendations", "Certifications", "Learning Partners"],
    color: "from-orange-400/20 to-amber-500/10",
  },
];

const highlights = [
  ["🌐", "Multilingual Learning", "Learn in the language you understand best."],
  ["📄", "Document Intelligence", "Turn PDFs, images and questions into explanations."],
  ["🎧", "Audio Learning", "Listen to concepts and learn on the go."],
  ["📊", "Exam Intelligence", "Analyse previous-year papers and practice important topics."],
  ["🚀", "Career Roadmaps", "Get a personalized path towards your career goals."],
  ["🧠", "AI Skill Assessment", "Identify strengths and discover skills to improve."],
];

const steps = [
  ["01", "Create Your Profile", "Tell us about your education, interests, skills and goals."],
  ["02", "Get AI Personalization", "Receive learning recommendations and a tailored roadmap."],
  ["03", "Learn & Build", "Understand concepts, practice questions and develop projects."],
  ["04", "Become Career-Ready", "Improve your skills, portfolio and interview preparation."],
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#071322] text-slate-100">
      {/* NAVIGATION */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#071322]/90 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="#" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300 to-blue-600 text-xl font-black text-[#071322]">
              K
            </div>
            <div>
              <p className="text-xl font-bold tracking-tight">
                Kudla <span className="text-cyan-400">Labs</span>
              </p>
              <p className="text-[10px] tracking-[0.22em] text-slate-400">
                LEARN · BUILD · GROW
              </p>
            </div>
          </a>

          <div className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            <a href="#modules" className="transition hover:text-cyan-400">Modules</a>
            <a href="/learn" className="transition hover:text-cyan-400">Kudla Learn</a>
            <a href="/path" className="transition hover:text-cyan-400">Kudla Path</a>
            <a href="/dashboard" className="transition hover:text-cyan-400">Dashboard</a>
            <a href="#about" className="transition hover:text-cyan-400">About</a>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/auth/login"
              className="text-sm font-semibold text-slate-300 transition hover:text-cyan-300"
            >
              Sign In
            </a>
            <a
              href="/auth/register"
              className="rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-bold text-[#071322] transition hover:bg-cyan-300"
            >
              Get Started ↗
            </a>
          </div>
        </nav>
      </header>

      {/* HERO SECTION */}
      <section className="relative mx-auto grid max-w-7xl gap-16 px-6 py-24 lg:grid-cols-2 lg:items-center lg:py-32">
        <div className="pointer-events-none absolute -left-48 top-10 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />

        <div className="relative z-10">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-xs font-semibold tracking-wide text-cyan-300">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            THE FUTURE OF PERSONALIZED LEARNING
          </div>

          <h1 className="max-w-2xl text-5xl font-extrabold leading-[1.12] tracking-tight md:text-7xl">
            Your Learning Journey.
            <span className="mt-2 block bg-gradient-to-r from-cyan-300 via-blue-400 to-cyan-500 bg-clip-text text-transparent">
              One Intelligent Platform.
            </span>
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-8 text-slate-400">
            Learn without language barriers. Build skills with personalized
            roadmaps. Discover your potential and become career-ready with
            Kudla Labs.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#modules"
              className="rounded-full bg-cyan-400 px-7 py-4 font-bold text-[#071322] transition hover:-translate-y-1 hover:bg-cyan-300"
            >
              Discover Kudla Labs ↗
            </a>
            <a
              href="#how-it-works"
              className="rounded-full border border-white/15 px-7 py-4 font-semibold text-white transition hover:border-cyan-400 hover:text-cyan-300"
            >
              Explore How It Works
            </a>
          </div>

          <div className="mt-12 flex flex-wrap gap-7 text-sm text-slate-400">
            <span>✦ AI-Powered Learning</span>
            <span>✦ Personalized Growth</span>
            <span>✦ Career Development</span>
          </div>
        </div>

        {/* PRODUCT PREVIEW */}
        <div className="relative">
          <div className="absolute -inset-10 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative rounded-3xl border border-white/10 bg-[#102238] p-5 shadow-2xl shadow-cyan-950/40 md:p-7">
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <div>
                <p className="text-xs text-slate-400">WELCOME TO</p>
                <h2 className="mt-1 text-xl font-bold">
                  Kudla <span className="text-cyan-400">Workspace</span>
                </h2>
              </div>
              <span className="rounded-full bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-300">
                Learning ecosystem
              </span>
            </div>

            <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 to-blue-500/5 p-5">
              <p className="text-sm text-cyan-300">YOUR NEXT STEP STARTS HERE</p>
              <h3 className="mt-3 text-2xl font-bold">
                Discover. Learn. Improve.
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                A connected experience for your academic and professional journey.
              </p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {modules.map((item) => (
                <div
                  key={item.name}
                  className={`rounded-2xl border border-white/10 bg-gradient-to-br ${item.color} p-5 transition hover:-translate-y-1 hover:border-cyan-400/40`}
                >
                  <span className="text-3xl">{item.icon}</span>
                  <h3 className="mt-3 font-bold">{item.name}</h3>
                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    {item.name === "Kudla Learn" && "Learn with AI"}
                    {item.name === "Kudla Path" && "Plan your journey"}
                    {item.name === "Kudla Career" && "Build your future"}
                    {item.name === "Kudla Marketplace" && "Discover courses"}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-xl border border-white/10 bg-[#071322] p-4 text-center">
              <p className="text-sm font-semibold text-slate-200">
                One student. One journey. One platform.
              </p>
              <p className="mt-1 text-xs text-slate-500">
                The Kudla Labs vision
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BRAND MESSAGE */}
      <section id="about" className="border-y border-white/10 bg-[#0b1c30] px-6 py-12">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-xs font-bold tracking-[0.3em] text-cyan-400">
            OUR VISION
          </p>
          <h2 className="mt-4 text-2xl font-bold md:text-4xl">
            Learn Smarter. Build Skills. Become Career-Ready.
          </h2>
          <p className="mx-auto mt-4 max-w-3xl leading-7 text-slate-400">
            We envision an education ecosystem where every learner can
            access personalized learning, develop practical skills and
            explore meaningful career opportunities.
          </p>
        </div>
      </section>

      {/* FOUR MODULES */}
      <section id="modules" className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-2xl">
          <p className="text-sm font-bold tracking-widest text-cyan-400">
            OUR ECOSYSTEM
          </p>
          <h2 className="mt-4 text-4xl font-extrabold md:text-5xl">
            Everything You Need to
            <span className="text-cyan-400"> Move Forward.</span>
          </h2>
          <p className="mt-5 leading-7 text-slate-400">
            Four connected modules designed to support your learning,
            personal development and professional journey.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {modules.map((item) => (
            <article
              key={item.name}
              className="group rounded-3xl border border-white/10 bg-[#102238] p-7 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/50 hover:shadow-xl hover:shadow-cyan-950/30"
            >
              <div className="flex items-start justify-between">
                <span className="text-4xl">{item.icon}</span>
                <span className="text-sm font-bold tracking-widest text-slate-600">
                  {item.number}
                </span>
              </div>

              <h3 className="mt-6 text-2xl font-bold group-hover:text-cyan-300">
                {item.name}
              </h3>
              <p className="mt-3 leading-7 text-slate-400">
                {item.description}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {item.features.map((feature) => (
                  <p key={feature} className="text-sm text-slate-300">
                    <span className="mr-2 text-cyan-400">✓</span>
                    {feature}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* SPECIAL FEATURES */}
      <section id="features" className="bg-[#0b1c30] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-sm font-bold tracking-widest text-cyan-400">
              WHAT MAKES US DIFFERENT
            </p>
            <h2 className="mt-4 text-4xl font-extrabold">
              Learning Without Limits.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-400">
              Thoughtful learning tools designed around the individual student.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {highlights.map(([icon, title, description]) => (
              <div
                key={title}
                className="rounded-2xl border border-white/10 bg-[#102238] p-6 transition hover:border-cyan-400/40"
              >
                <span className="text-3xl">{icon}</span>
                <h3 className="mt-5 text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center">
          <p className="text-sm font-bold tracking-widest text-cyan-400">
            YOUR JOURNEY WITH US
          </p>
          <h2 className="mt-4 text-4xl font-extrabold">
            How Kudla Labs Works
          </h2>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-4">
          {steps.map(([number, title, description], index) => (
            <div
              key={number}
              className="rounded-2xl border border-white/10 bg-[#102238] p-6"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl font-black text-cyan-400/40">
                  {number}
                </span>
                {index !== 3 && (
                  <span className="hidden text-xl text-cyan-400 md:block">→</span>
                )}
              </div>
              <h3 className="mt-6 text-lg font-bold">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="px-6 pb-24">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-[#10334b] to-[#102238] px-8 py-16 text-center md:px-16">
          <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />

          <p className="relative text-sm font-bold tracking-widest text-cyan-300">
            THE FUTURE STARTS WITH A SINGLE STEP
          </p>
          <h2 className="relative mt-5 text-4xl font-extrabold md:text-5xl">
            Your Potential Has No Limits.
          </h2>
          <p className="relative mx-auto mt-5 max-w-2xl leading-7 text-slate-300">
            Discover a smarter way to learn, develop your skills and
            build your future with Kudla Labs.
          </p>
          <a
            href="#modules"
            className="relative mt-9 inline-block rounded-full bg-cyan-400 px-8 py-4 font-bold text-[#071322] transition hover:bg-cyan-300"
          >
            Explore Our Ecosystem ↗
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#050e19] px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h3 className="text-xl font-bold">
              Kudla <span className="text-cyan-400">Labs</span>
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Learn Smarter. Build Skills. Become Career-Ready.
            </p>
          </div>

          <div className="text-sm text-slate-500">
            © 2026 Kudla Labs. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
