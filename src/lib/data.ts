import type { Task, Milestone, RoadmapProgress } from '@/types'

export const TASKS: Task[] = [
  // Career Prep
  {
    id: 'lc-weekly',
    category: 'career',
    name: 'LeetCode mediums',
    target: '3–4 problems',
    priority: 'critical',
  },
  {
    id: 'rag-course',
    category: 'career',
    name: 'DL.AI RAG course or journal app work',
    target: '3 sessions × 45 min',
    priority: 'critical',
  },
  {
    id: 'chip-huyen',
    category: 'career',
    name: 'Chip Huyen / ML system design',
    target: '1 chapter or 30 min',
    priority: 'high',
  },
  {
    id: 'outreach',
    category: 'career',
    name: 'Warm outreach to ML engineers',
    target: '2–3 DMs (starts Sep)',
    priority: 'high',
  },
  {
    id: 'mock-interview',
    category: 'career',
    name: 'Mock interview',
    target: '1 per month (starts Oct)',
    priority: 'medium',
  },

  // Wells Fargo
  {
    id: 'wf-sprint',
    category: 'wells',
    name: 'Deliver sprint commitments',
    target: '80% output — no more',
    priority: 'high',
  },
  {
    id: 'wf-boundary',
    category: 'wells',
    name: 'Hard stop at 6pm',
    target: 'No after-hours Slack or email',
    priority: 'high',
  },
  {
    id: 'wf-rescue',
    category: 'wells',
    name: 'No rescuing underperformers',
    target: "Their output is not yours to absorb",
    priority: 'medium',
  },

  // OMSCS
  {
    id: 'omscs-prep',
    category: 'omscs',
    name: 'CS 7641 prep reading',
    target: '1–2 hrs (May–Aug)',
    priority: 'high',
  },
  {
    id: 'omscs-hw',
    category: 'omscs',
    name: 'CS 7641 coursework',
    target: '8–10 hrs/week (Sep+)',
    priority: 'high',
  },

  // Fitness
  {
    id: 'muay-thai',
    category: 'fitness',
    name: 'Muay Thai / BJJ sessions',
    target: '2–3 sessions',
    priority: 'high',
  },
  {
    id: 'lifting',
    category: 'fitness',
    name: 'Lifting',
    target: '3 sessions (Mon / Wed / Fri)',
    priority: 'high',
  },
  {
    id: 'rest',
    category: 'fitness',
    name: 'At least 1 full rest day',
    target: 'Non-negotiable',
    priority: 'high',
  },
  {
    id: 'run',
    category: 'fitness',
    name: 'Easy run (optional)',
    target: '0–1 run, no pressure',
    priority: 'medium',
  },

  // Personal Projects
  {
    id: 'journal-app',
    category: 'projects',
    name: 'Journal app feature or fix',
    target: '1 meaningful commit',
    priority: 'high',
  },
  {
    id: 'mma-video',
    category: 'projects',
    name: 'MMA video posted',
    target: '1 per 2 weeks — imperfect, done',
    priority: 'medium',
  },
  {
    id: 'website',
    category: 'projects',
    name: 'michaelebelle.dev progress',
    target: 'Any visible improvement',
    priority: 'medium',
  },
]

export const CATEGORY_META: Record<
  string,
  { label: string; color: string; dot: string; description: string }
> = {
  career: {
    label: 'Career Prep',
    color: 'text-amber-700 dark:text-amber-400',
    dot: 'bg-amber-500',
    description: 'The core lever. Protect this time above all else.',
  },
  wells: {
    label: 'Wells Fargo',
    color: 'text-blue-700 dark:text-blue-400',
    dot: 'bg-blue-500',
    description: '80% output. Deliver commitments. Stop there.',
  },
  omscs: {
    label: 'OMSCS',
    color: 'text-violet-700 dark:text-violet-400',
    dot: 'bg-violet-500',
    description: 'Stay enrolled. 7641 is the most important course.',
  },
  fitness: {
    label: 'Fitness & Recovery',
    color: 'text-emerald-700 dark:text-emerald-400',
    dot: 'bg-emerald-500',
    description: 'This keeps you functional. Protect it.',
  },
  projects: {
    label: 'Personal Projects',
    color: 'text-rose-700 dark:text-rose-400',
    dot: 'bg-rose-500',
    description: 'Journal app is your #1 portfolio artifact.',
  },
}

export const MILESTONES: Milestone[] = [
  {
    quarter: 'Q2 2026',
    title: 'Stabilize & Launch',
    targetDate: 'May – Jun 2026',
    items: [
      'Exit fund opened + $1k/mo auto-transfer',
      'michaelebelle.dev live on Vercel',
      'First MMA video posted (imperfect, done)',
      'DL.AI RAG course sequence started',
      'Wells hero mode officially off',
    ],
  },
  {
    quarter: 'Q3 2026',
    title: 'Build & Ship',
    targetDate: 'Jul – Sep 2026',
    items: [
      'Journal app MVP deployed & publicly accessible',
      'DL.AI RAG course sequence complete',
      'LeetCode: 30 mediums done',
      'CS 7641 enrolled + prep reading complete',
      'Resume v2 drafted',
    ],
  },
  {
    quarter: 'Q4 2026',
    title: 'Interview Ready',
    targetDate: 'Oct – Dec 2026',
    items: [
      'Resume v2 + portfolio finalized (ML eng reviewed)',
      'Warm outreach: 10 ML engineers contacted',
      'Chip Huyen book complete',
      'LeetCode: 50+ mediums done',
      'Monthly mock interviews running',
      'Tier 1 applications submitted via referral',
    ],
  },
  {
    quarter: 'Q1–Q2 2027',
    title: 'Land the Role',
    targetDate: 'Jan – Jun 2027',
    items: [
      'CS 7641 complete with strong grade',
      'Exit fund: 6 months runway (~$35–40k)',
      'Offer received + negotiated ($180–250k TC)',
      'Start new role — ship something in first 90 days',
      'No lifestyle inflation for 12 months',
    ],
  },
]

export const DEFAULT_ROADMAP: RoadmapProgress = {
  leetcode: 0,
  systemDesign: 0,
  journalApp: 0,
  aiLearning: 0,
  omscs: 0,
  networking: 0,
  exitFund: 0,
}

export const ROADMAP_LABELS: Record<keyof RoadmapProgress, string> = {
  leetcode: 'LeetCode readiness',
  systemDesign: 'System design',
  journalApp: 'Journal app / RAG project',
  aiLearning: 'AI/ML learning',
  omscs: 'OMSCS progress',
  networking: 'Networking & outreach',
  exitFund: 'Exit fund',
}

export const MANTRAS = [
  'Do less. Do it consistently. Leave with leverage.',
  'Sustainable beats heroic every time.',
  'The plan you can execute while tired is the right plan.',
  'Referrals beat cold apps 5:1. Build relationships now.',
  "You're not Wells Fargo's problem to solve.",
  'Ship imperfect. Iterate. That beats waiting for perfect.',
]
