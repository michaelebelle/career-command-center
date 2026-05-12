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
}

export interface WeekState {
  completed: Record<string, boolean>
}

export interface Reflection {
  energy: number       // 1–5
  burnout: number      // 1–5
  confidence: number   // 1–5
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

export interface AppState {
  weeks: Record<string, WeekState>
  reflections: Record<string, Reflection>
  roadmap: RoadmapProgress
}

export interface Milestone {
  quarter: string
  title: string
  items: string[]
  targetDate: string
}
