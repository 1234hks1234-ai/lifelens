export interface DecisionOption {
  id: string
  name: string
  description: string
  /** Months until the option pays off or wraps up. */
  months: number
  /** Total expected cost in US dollars. */
  cost: number
  /** How much this outcome matters to the person, 1 to 10. */
  importance: number
}

export interface Decision {
  id: string
  title: string
  description: string
  options: DecisionOption[]
}

export interface Weights {
  importance: number
  cost: number
  time: number
}

/** Everything the "What if?" panel can change. */
export interface Assumptions {
  weights: Weights
  /** Percent change applied to every option's cost. */
  costShift: number
  /** Percent change applied to every option's timeline. */
  timeShift: number
  budgetCeiling: number
  deadlineMonths: number
}

export interface ScoredOption {
  option: DecisionOption
  index: number
  color: string
  adjustedCost: number
  adjustedMonths: number
  /** Each dimension on a 0 to 100 scale. */
  scores: { importance: number; cost: number; time: number }
  /** Weighted fit score, 0 to 100, after limit penalties. */
  overall: number
  overBudget: boolean
  overDeadline: boolean
  rank: number
  baselineRank: number
}

export interface Outcome {
  id: 'smooth' | 'rough'
  label: string
  cost: number
  months: number
  overBudget: boolean
  overDeadline: boolean
  withinLimits: boolean
}

export interface Example {
  slug: string
  category: string
  blurb: string
  decision: Decision
}
