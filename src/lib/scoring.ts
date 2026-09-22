import type { Assumptions, Decision, Outcome, ScoredOption, Weights } from '@/types'
import { optionColor } from '@/lib/palette'

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value))
const roundUp = (value: number, step: number) => Math.ceil(value / step) * step

/* ------------------------------------------------------------------ */
/* Limits and defaults                                                 */
/* ------------------------------------------------------------------ */

function costStep(max: number): number {
  if (max <= 5_000) return 100
  if (max <= 50_000) return 500
  if (max <= 250_000) return 1_000
  return 5_000
}

export interface LimitRanges {
  budget: { min: number; max: number; step: number }
  deadline: { min: number; max: number; step: number }
}

/** Slider ranges for the budget ceiling and deadline, scaled to this decision. */
export function limitRanges(decision: Decision): LimitRanges {
  const maxCost = Math.max(0, ...decision.options.map((o) => o.cost))
  const maxMonths = Math.max(1, ...decision.options.map((o) => o.months))
  const step = costStep(maxCost * 2)
  return {
    budget: { min: 0, max: Math.max(roundUp(maxCost * 2, step), step * 10), step },
    deadline: { min: 1, max: Math.max(12, Math.ceil(maxMonths * 2)), step: 1 },
  }
}

/** Starting assumptions: balanced weights and limits with headroom over every option. */
export function defaultAssumptions(decision: Decision): Assumptions {
  const ranges = limitRanges(decision)
  const maxCost = Math.max(0, ...decision.options.map((o) => o.cost))
  const maxMonths = Math.max(1, ...decision.options.map((o) => o.months))
  return {
    weights: { importance: 50, cost: 30, time: 20 },
    costShift: 0,
    timeShift: 0,
    budgetCeiling: Math.min(ranges.budget.max, roundUp(maxCost * 1.25, ranges.budget.step)),
    deadlineMonths: Math.min(ranges.deadline.max, Math.ceil(maxMonths * 1.25)),
  }
}

export function isSameAssumptions(a: Assumptions, b: Assumptions): boolean {
  return (
    a.weights.importance === b.weights.importance &&
    a.weights.cost === b.weights.cost &&
    a.weights.time === b.weights.time &&
    a.costShift === b.costShift &&
    a.timeShift === b.timeShift &&
    a.budgetCeiling === b.budgetCeiling &&
    a.deadlineMonths === b.deadlineMonths
  )
}

/** Weights as shares that add up to 1. Falls back to an even split when all are zero. */
export function normalizedWeights(weights: Weights): Weights {
  const total = weights.importance + weights.cost + weights.time
  if (total <= 0) return { importance: 1 / 3, cost: 1 / 3, time: 1 / 3 }
  return {
    importance: weights.importance / total,
    cost: weights.cost / total,
    time: weights.time / total,
  }
}

/* ------------------------------------------------------------------ */
/* Scoring                                                             */
/* ------------------------------------------------------------------ */

/** Options past a limit keep 70% of their score for each limit they break. */
export const LIMIT_PENALTY = 0.7

function evaluate(decision: Decision, assumptions: Assumptions) {
  const { options } = decision
  if (options.length === 0) return []

  // Cost and time are scored against the range of the *original* estimates, so
  // changing an assumption moves scores instead of being cancelled out.
  const costs = options.map((o) => o.cost)
  const times = options.map((o) => o.months)
  const minCost = Math.min(...costs)
  const maxCost = Math.max(...costs)
  const minTime = Math.min(...times)
  const maxTime = Math.max(...times)
  const costSpan = Math.max(maxCost - minCost, maxCost * 0.25, 1)
  const timeSpan = Math.max(maxTime - minTime, maxTime * 0.25, 1)
  const share = normalizedWeights(assumptions.weights)

  const rows = options.map((option, index) => {
    const adjustedCost = option.cost * (1 + assumptions.costShift / 100)
    const adjustedMonths = option.months * (1 + assumptions.timeShift / 100)

    const importance = clamp(option.importance / 10)
    const cost = clamp(1 - (0.85 * (adjustedCost - minCost)) / costSpan)
    const time = clamp(1 - (0.85 * (adjustedMonths - minTime)) / timeSpan)

    const overBudget = adjustedCost > assumptions.budgetCeiling
    const overDeadline = adjustedMonths > assumptions.deadlineMonths

    let overall = (share.importance * importance + share.cost * cost + share.time * time) * 100
    if (overBudget) overall *= LIMIT_PENALTY
    if (overDeadline) overall *= LIMIT_PENALTY

    return {
      option,
      index,
      color: optionColor(index),
      adjustedCost,
      adjustedMonths,
      scores: { importance: importance * 100, cost: cost * 100, time: time * 100 },
      overall,
      overBudget,
      overDeadline,
    }
  })

  const order = [...rows].sort((a, b) => b.overall - a.overall)
  const rankById = new Map(order.map((row, i): [string, number] => [row.option.id, i + 1]))
  return rows.map((row) => ({ ...row, rank: rankById.get(row.option.id) ?? rows.length }))
}

export function scoreOptions(
  decision: Decision,
  assumptions: Assumptions,
  baseline: Assumptions = defaultAssumptions(decision),
): ScoredOption[] {
  const baselineRanks = new Map(
    evaluate(decision, baseline).map((row): [string, number] => [row.option.id, row.rank]),
  )
  return evaluate(decision, assumptions).map((row) => ({
    ...row,
    baselineRank: baselineRanks.get(row.option.id) ?? row.rank,
  }))
}

/* ------------------------------------------------------------------ */
/* Outcomes for the decision tree                                      */
/* ------------------------------------------------------------------ */

const SMOOTH_FACTOR = 0.9
const ROUGH_COST_FACTOR = 1.25
const ROUGH_TIME_FACTOR = 1.3

/** Two plausible paths per option: it goes well, or it drags on. */
export function outcomesFor(scored: ScoredOption, assumptions: Assumptions): Outcome[] {
  const build = (id: Outcome['id'], label: string, costFactor: number, timeFactor: number): Outcome => {
    const cost = scored.adjustedCost * costFactor
    const months = scored.adjustedMonths * timeFactor
    const overBudget = cost > assumptions.budgetCeiling
    const overDeadline = months > assumptions.deadlineMonths
    return { id, label, cost, months, overBudget, overDeadline, withinLimits: !overBudget && !overDeadline }
  }
  return [
    build('smooth', 'If it goes well', SMOOTH_FACTOR, SMOOTH_FACTOR),
    build('rough', 'If it drags on', ROUGH_COST_FACTOR, ROUGH_TIME_FACTOR),
  ]
}

/* ------------------------------------------------------------------ */
/* Summaries                                                           */
/* ------------------------------------------------------------------ */

export interface Verdict {
  leader: ScoredOption
  margin: number
  tone: 'clear' | 'narrow' | 'tie'
  summary: string
  outsideLimits: number
}

export function verdictFor(scored: ScoredOption[]): Verdict | null {
  if (scored.length === 0) return null
  const sorted = [...scored].sort((a, b) => a.rank - b.rank)
  const leader = sorted[0]
  const margin = sorted.length > 1 ? leader.overall - sorted[1].overall : 100
  const outsideLimits = scored.filter((s) => s.overBudget || s.overDeadline).length

  if (margin >= 12) {
    return { leader, margin, tone: 'clear', outsideLimits, summary: 'A clear lead. It holds up unless your assumptions change a lot.' }
  }
  if (margin >= 5) {
    return { leader, margin, tone: 'narrow', outsideLimits, summary: 'A narrow lead. A small shift in priorities could change the order.' }
  }
  return { leader, margin, tone: 'tie', outsideLimits, summary: 'Too close to call. Try the What If? controls to see what tips it.' }
}

export interface Highlights {
  lowestCost: ScoredOption
  fastest: ScoredOption
  mostImportant: ScoredOption
}

export function highlightsFor(scored: ScoredOption[]): Highlights | null {
  if (scored.length === 0) return null
  const pick = (better: (a: ScoredOption, b: ScoredOption) => boolean) =>
    scored.reduce((best, s) => (better(s, best) ? s : best))
  return {
    lowestCost: pick((a, b) => a.adjustedCost < b.adjustedCost),
    fastest: pick((a, b) => a.adjustedMonths < b.adjustedMonths),
    mostImportant: pick((a, b) => a.option.importance > b.option.importance),
  }
}
