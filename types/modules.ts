export type ModuleId = 'learn' | 'path' | 'career' | 'marketplace';

export interface ModuleInfo {
  id: ModuleId;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  accentColor: string;
  href: string;
  features: string[];
}

export const KUDLA_MODULES: Record<ModuleId, ModuleInfo> = {
  learn: {
    id: 'learn',
    name: 'Kudla Learn',
    tagline: 'Personalized AI Learning',
    description: 'Understand difficult concepts through interactive lessons, document intelligence, and multilingual AI explanations.',
    icon: '📚',
    accentColor: 'cyan',
    href: '/learn',
    features: [
      'AI Learning Assistant',
      'PDF & Image Explanations',
      'Audio & Visual Lessons',
      'PYQ & Exam Intelligence',
    ],
  },
  path: {
    id: 'path',
    name: 'Kudla Path',
    tagline: 'Personalized Learning Roadmaps',
    description: 'Discover your potential with dynamic career roadmaps and customized skill development plans.',
    icon: '🧭',
    accentColor: 'emerald',
    href: '/path',
    features: [
      'Career Roadmaps',
      'Skill Gap Analysis',
      'Smart Study Planner',
      'Course Recommendations',
    ],
  },
  career: {
    id: 'career',
    name: 'Kudla Career',
    tagline: 'Professional Identity & Readiness',
    description: 'Build your portfolio, practice AI mock interviews, and prepare for real-world employment.',
    icon: '💼',
    accentColor: 'violet',
    href: '/career',
    features: [
      'Resume Analysis',
      'GitHub & Project Review',
      'AI Mock Interviews',
      'Portfolio Builder',
    ],
  },
  marketplace: {
    id: 'marketplace',
    name: 'Kudla Marketplace',
    tagline: 'Curated Opportunities & Certifications',
    description: 'Discover verified courses, professional certifications, and industry learning partners.',
    icon: '🎓',
    accentColor: 'amber',
    href: '/marketplace',
    features: [
      'Free & Paid Courses',
      'Course Recommendations',
      'Industry Certifications',
      'Learning Partners',
    ],
  },
};
