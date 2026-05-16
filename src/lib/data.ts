import type { Task, Gate, RoadmapProgress } from '@/types'

export const TASKS: Task[] = [
  // Career Prep
  { id: 'lc-weekly', category: 'career', name: 'LeetCode mediums', target: '4–5 problems', priority: 'critical' },
  { id: 'rag-course', category: 'career', name: 'DL.AI RAG course module', target: '1 module or 1 hr journal app', priority: 'critical' },
  { id: 'journal-session', category: 'career', name: 'Journal app dev session', target: '2 sessions × 45 min', priority: 'critical' },
  { id: 'chip-huyen', category: 'career', name: 'Chip Huyen / ML system design', target: '1 chapter or 30 min', priority: 'high' },
  { id: 'outreach', category: 'career', name: 'Warm outreach to ML engineers', target: '2–3 DMs', priority: 'high' },
  { id: 'mock-interview', category: 'career', name: 'Mock interview', target: '1 per month', priority: 'medium' },

  // Wells Fargo
  { id: 'wf-sprint', category: 'wells', name: 'Deliver sprint commitments only', target: '80% output — full stop', priority: 'high' },
  { id: 'wf-boundary', category: 'wells', name: 'Hard stop at 6pm', target: 'No after-hours Slack or email', priority: 'high' },
  { id: 'wf-delegate', category: 'wells', name: 'Delegate or defer 1 item', target: 'Actively clear your plate', priority: 'high' },
  { id: 'wf-rescue', category: 'wells', name: 'No rescuing underperformers', target: "Their output is not yours", priority: 'medium' },

  // OMSCS
  { id: 'omscs-prep', category: 'omscs', name: 'CS 7641 prep reading', target: '1–2 hrs (until Sep)', priority: 'high' },
  { id: 'omscs-hw', category: 'omscs', name: 'CS 7641 coursework', target: '8–10 hrs/week (Sep+)', priority: 'high' },

  // Fitness
  { id: 'muay-thai', category: 'fitness', name: 'Muay Thai / BJJ sessions', target: '2–3 sessions', priority: 'high' },
  { id: 'lifting', category: 'fitness', name: 'Lifting', target: '3 sessions', priority: 'high' },
  { id: 'rest', category: 'fitness', name: 'Full rest day', target: 'At least 1 — non-negotiable', priority: 'high' },

  // Projects
  { id: 'journal-app', category: 'projects', name: 'Journal app commit', target: '1 meaningful commit', priority: 'high' },
  { id: 'mma-video', category: 'projects', name: 'MMA video posted', target: '1 per 2 weeks', priority: 'medium' },
  { id: 'website', category: 'projects', name: 'michaelebelle.dev progress', target: 'Any visible improvement', priority: 'medium' },
]

export const CATEGORY_META: Record<string, { label: string; color: string; dot: string; description: string }> = {
  career: { label: 'Career Prep', color: 'text-amber-700', dot: 'bg-amber-500', description: 'The core lever. Protect this time above all else.' },
  wells: { label: 'Wells Fargo', color: 'text-blue-700', dot: 'bg-blue-400', description: 'Delegate, clear your plate, hold the boundary.' },
  omscs: { label: 'OMSCS', color: 'text-violet-700', dot: 'bg-violet-500', description: '7641 is the most valuable course for interviews.' },
  fitness: { label: 'Fitness & Recovery', color: 'text-emerald-700', dot: 'bg-emerald-500', description: 'This keeps you functional. Protect it.' },
  projects: { label: 'Personal Projects', color: 'text-rose-700', dot: 'bg-rose-500', description: 'Journal app is your #1 portfolio artifact.' },
}

// GATE SYSTEM — concrete binary milestones that gate readiness levels
// tier: foundation → must clear before any serious applying
//       tier2_ready → Affirm / Robinhood / Capital One window
//       tier1_ready → Stripe / Plaid / Chime / Brex window
export const GATES: Gate[] = [
  // ── FOUNDATION (must have before applying anywhere) ──
  {
    id: 'wf-delegated',
    label: 'Wells plate cleared',
    description: 'Meaningfully delegated or deferred non-critical work. No longer in hero mode.',
    category: 'wells',
    tier: 'foundation',
    targetDate: '2026-06-01',
    hardDeadline: '2026-06-30',
    done: false,
  },
  {
    id: 'exit-fund-open',
    label: 'Exit fund opened',
    description: 'Account opened, auto-transfer on. At least $1k/mo going in.',
    category: 'wells',
    tier: 'foundation',
    targetDate: '2026-05-20',
    hardDeadline: '2026-06-01',
    done: false,
  },
  {
    id: 'website-live',
    label: 'michaelebelle.dev live',
    description: 'Personal site deployed on Vercel. Has your name, role, and links.',
    category: 'portfolio',
    tier: 'foundation',
    targetDate: '2026-06-01',
    hardDeadline: '2026-06-30',
    done: false,
  },
  {
    id: 'rag-course-complete',
    label: 'DL.AI RAG course done',
    description: 'Full sequence complete: LangChain, ChatGPT API, Vector DBs, RAG from Scratch.',
    category: 'rag',
    tier: 'foundation',
    targetDate: '2026-07-10',
    hardDeadline: '2026-08-01',
    done: false,
  },
  {
    id: 'lc-20',
    label: 'LeetCode: 20 mediums',
    description: 'Arrays, hashing, two pointers, sliding window, BFS/DFS. Foundation patterns solid.',
    category: 'leetcode',
    tier: 'foundation',
    targetDate: '2026-06-30',
    hardDeadline: '2026-07-15',
    done: false,
  },
  {
    id: 'resume-final',
    label: 'Resume finalized',
    description: 'Fixed summary, OMSCS date, GitHub link, reviewed by 1 ML engineer.',
    category: 'portfolio',
    tier: 'foundation',
    targetDate: '2026-06-15',
    hardDeadline: '2026-07-01',
    done: false,
  },

  // ── TIER 2 READY (Affirm, Robinhood, Databricks, Capital One) ──
  {
    id: 'journal-mvp',
    label: 'Journal app MVP deployed',
    description: 'Auth + entries + RAG retrieval live. GitHub link on resume. Can demo in 5 min.',
    category: 'portfolio',
    tier: 'tier2_ready',
    targetDate: '2026-07-31',
    hardDeadline: '2026-08-31',
    done: false,
  },
  {
    id: 'lc-40',
    label: 'LeetCode: 40 mediums',
    description: 'Add trees, graphs, DP intro. Consistent 4–5/week cadence proven.',
    category: 'leetcode',
    tier: 'tier2_ready',
    targetDate: '2026-08-15',
    hardDeadline: '2026-09-15',
    done: false,
  },
  {
    id: 'outreach-10',
    label: '10 ML engineers contacted',
    description: 'Warm outreach, not cold apps. Curiosity-led conversations. At least 3 replies.',
    category: 'network',
    tier: 'tier2_ready',
    targetDate: '2026-09-30',
    hardDeadline: '2026-10-15',
    done: false,
  },
  {
    id: 'chip-huyen-done',
    label: 'Chip Huyen book complete',
    description: 'Designing ML Systems read cover to cover. Can discuss feature stores, serving, monitoring.',
    category: 'rag',
    tier: 'tier2_ready',
    targetDate: '2026-09-30',
    hardDeadline: '2026-10-31',
    done: false,
  },
  {
    id: 'mock-x3',
    label: '3 mock interviews done',
    description: 'At least 3 timed mock interviews. Reviewed and adjusted after each.',
    category: 'apply',
    tier: 'tier2_ready',
    targetDate: '2026-10-15',
    hardDeadline: '2026-10-31',
    done: false,
  },
  {
    id: 'tier2-apply',
    label: 'Tier 2 applications live',
    description: 'Active applications at Affirm, Robinhood, Capital One, Databricks.',
    category: 'apply',
    tier: 'tier2_ready',
    targetDate: '2026-10-01',
    hardDeadline: '2026-11-01',
    done: false,
  },

  // ── TIER 1 READY (Stripe, Plaid, Chime, Brex) ──
  {
    id: 'lc-60',
    label: 'LeetCode: 60 mediums + 10 hards',
    description: 'DP, graphs, advanced trees solid. Timed under pressure. Fintech interview standard.',
    category: 'leetcode',
    tier: 'tier1_ready',
    targetDate: '2026-11-30',
    hardDeadline: '2026-12-31',
    done: false,
  },
  {
    id: 'journal-v2',
    label: 'Journal app v2 — production quality',
    description: 'Polished UI, semantic search, conversation history. Can speak to every technical decision.',
    category: 'portfolio',
    tier: 'tier1_ready',
    targetDate: '2026-11-01',
    hardDeadline: '2026-12-01',
    done: false,
  },
  {
    id: '7641-enrolled',
    label: 'CS 7641 enrolled + active',
    description: 'Actively doing coursework. Can discuss ML theory in interviews (bias-variance, ensemble methods, etc).',
    category: 'omscs',
    tier: 'tier1_ready',
    targetDate: '2026-09-01',
    hardDeadline: '2026-09-15',
    done: false,
  },
  {
    id: 'referral-tier1',
    label: 'Referral at 1+ Tier 1 company',
    description: 'At least one warm referral at Stripe, Plaid, Chime, or Brex. Relationship built over weeks.',
    category: 'network',
    tier: 'tier1_ready',
    targetDate: '2026-11-01',
    hardDeadline: '2026-12-01',
    done: false,
  },
  {
    id: 'tier1-apply',
    label: 'Tier 1 applications live',
    description: 'Active applications at Stripe, Plaid, Chime, Brex — via referral where possible.',
    category: 'apply',
    tier: 'tier1_ready',
    targetDate: '2026-11-15',
    hardDeadline: '2027-01-15',
    done: false,
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
  journalApp: 'Journal app / RAG',
  aiLearning: 'AI/ML learning',
  omscs: 'OMSCS progress',
  networking: 'Networking & outreach',
  exitFund: 'Exit fund',
}

export const MANTRAS = [
  'Clear Wells. Build the app. Do the reps. Leave.',
  'Delegate at Wells. That time belongs to your future.',
  'The journal app is the unlock. Ship it.',
  'Referrals beat cold apps 5:1. Build relationships now.',
  'Consistent 4 LeetCode/week beats a binge then nothing.',
  'Ship imperfect. Iterate. That beats waiting for perfect.',
  "You're not Wells Fargo's problem to solve. Act like it.",
]

export const MILESTONES = [
  {
    quarter: 'Q2 2026',
    title: 'Stabilize & Launch',
    targetDate: 'May – Jun 2026',
    items: [
      'Exit fund opened + $1k/mo auto-transfer',
      'michaelebelle.dev live on Vercel',
      'DL.AI RAG course sequence started',
      'Wells hero mode off — delegate actively',
      'Resume finalized with OMSCS date + GitHub',
    ],
  },
  {
    quarter: 'Q3 2026',
    title: 'Build & Ship',
    targetDate: 'Jul – Sep 2026',
    items: [
      'Journal app MVP deployed & demoable',
      'DL.AI RAG course sequence complete',
      'LeetCode: 40 mediums done',
      'CS 7641 enrolled + active',
      'Warm outreach: 10 ML engineers contacted',
    ],
  },
  {
    quarter: 'Q4 2026',
    title: 'Apply & Interview',
    targetDate: 'Oct – Dec 2026',
    items: [
      'Chip Huyen complete',
      'LeetCode: 60 mediums + 10 hards',
      'Tier 2 applications active (Affirm, Robinhood, Capital One)',
      'Tier 1 applications via referral (Stripe, Plaid, Chime, Brex)',
      'Monthly mock interviews running',
    ],
  },
  {
    quarter: 'Q1 2027',
    title: 'Land the Role',
    targetDate: 'Jan – Mar 2027',
    items: [
      'Exit fund: 6 months runway',
      'Offer received + negotiated ($180–250k TC)',
      'Counter everything — use competing offers',
      'Start new role, ship in first 90 days',
    ],
  },
]
