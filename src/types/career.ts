export interface CareerPhase {
  id: number
  title: string
  subtitle: string
  description: string
  is_active: boolean
  is_unlocked: boolean
  sort_order: number
  skills?: CareerSkill[]
  notes?: CareerNote[]
}

export interface CareerSkill {
  id: string
  phase_id: number
  area: string
  tool: string
  learn_from: string
  exit_criteria: string
  priority: 'critical' | 'important' | 'continue'
  is_done: boolean
  sort_order: number
}

export interface CareerNote {
  id: string
  phase_id: number
  content: string
  created_at: string
}
