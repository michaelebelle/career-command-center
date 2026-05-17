export type Priority = 'critical' | 'high' | 'medium'

export type Category =
  | 'career'
  | 'wells'
  | 'omscs'
  | 'fitness'
  | 'projects'

export interface Task {
  id: string
  category: Category
  name: string
  target: string
  priority: Priority
  targetCount?: number   // how many times to check off before "done" (default 1)
}

export interface WeekState {
  // number = count done; boolean kept for backward-compat with v1 localStorage
  completed: Record<string, number | boolean>
}

export interface Reflection {
  energy: number
  burnout: number
  confidence: number
  win: string
  adjustment: string
}

export interface RoadmapProgress {
  leetcode: number
  systemDesign: number
  journalApp: number
  aiLearning: number
  omscs: number
  networking: number
  exitFund: number
}

// Gate milestone — concrete, binary, trackable
export interface Gate {
  id: string
  label: string
  description: string
  category: 'leetcode' | 'rag' | 'portfolio' | 'network' | 'apply' | 'wells' | 'omscs'
  tier: 'foundation' | 'tier2_ready' | 'tier1_ready'
  targetDate: string        // ISO date string
  hardDeadline: string      // ISO — if missed, sends alert
  done: boolean
}

export interface AppState {
  weeks: Record<string, WeekState>
  reflections: Record<string, Reflection>
  roadmap: RoadmapProgress
  gates: Record<string, boolean>   // gateId -> done
  leetcodeCount: number            // exact count — key signal
  ragModulesCount: number          // exact count of DL.AI modules done
}

export interface Milestone {
  quarter: string
  title: string
  items: string[]
  targetDate: string
}
