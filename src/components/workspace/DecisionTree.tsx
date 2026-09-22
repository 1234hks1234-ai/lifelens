import type { Assumptions, ScoredOption } from '@/types'
import { outcomesFor } from '@/lib/scoring'
import { formatCurrency, formatMonths, truncate } from '@/lib/format'
import { DANGER, GOOD } from '@/lib/palette'

const W = 900
const ROW = 108
const PAD = 28
const ROOT_X = 108
const ROOT_R = 32
const OPT_X = 296
const OPT_W = 204
const OPT_H = 56
const LEAF_X = 640
const LEAF_W = 252
const LEAF_H = 44

const curve = (x1: number, y1: number, x2: number, y2: number) => {
  const mx = (x1 + x2) / 2
  return `M${x1} ${y1} C${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`
}

interface DecisionTreeProps {
  scored: ScoredOption[]
  assumptions: Assumptions
  selectedId: string | null
  onSelect: (id: string) => void
}

/**
 * Decision → option → two possible outcomes. Line weight tracks fit score,
 * and outcomes that break your budget or deadline turn red and dashed.
 */
export function DecisionTree({ scored, assumptions, selectedId, onSelect }: DecisionTreeProps) {
  const height = PAD * 2 + scored.length * ROW
  const rootY = height / 2

  return (
    <div className="rounded-2xl border border-line bg-white p-5 sm:p-7">
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${height}`} className="block h-auto w-full min-w-[760px]" role="group" aria-label="Decision tree of options and outcomes">
          {scored.map((s, i) => {
            const oy = PAD + i * ROW + ROW / 2
            const active = selectedId === null || selectedId === s.option.id
            const isSelected = selectedId === s.option.id
            const outcomes = outcomesFor(s, assumptions)

            return (
              <g key={s.option.id} style={{ opacity: active ? 1 : 0.28, transition: 'opacity 300ms ease' }}>
                <path
                  d={curve(ROOT_X + ROOT_R - 2, rootY, OPT_X, oy)}
                  fill="none"
                  stroke={s.color}
                  strokeLinecap="round"
                  style={{ strokeWidth: 2 + (s.overall / 100) * 5, transition: 'stroke-width 500ms ease' }}
                />

                {outcomes.map((outcome, k) => {
                  const ly = oy + (k === 0 ? -27 : 27)
                  const stroke = outcome.withinLimits ? s.color : DANGER
                  return (
                    <g key={outcome.id}>
                      <path
                        d={curve(OPT_X + OPT_W, oy, LEAF_X, ly)}
                        fill="none"
                        stroke={stroke}
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeDasharray={outcome.withinLimits ? undefined : '6 5'}
                        style={{ transition: 'stroke 300ms ease' }}
                      />
                      <rect
                        x={LEAF_X}
                        y={ly - LEAF_H / 2}
                        width={LEAF_W}
                        height={LEAF_H}
                        rx={12}
                        fill={outcome.withinLimits ? '#FFFFFF' : '#FEF3F2'}
                        stroke={outcome.withinLimits ? '#E2E6EC' : DANGER}
                        strokeWidth={1.5}
                        style={{ transition: 'fill 300ms ease, stroke 300ms ease' }}
                      />
                      <circle cx={LEAF_X + 18} cy={ly} r={5} fill={outcome.withinLimits ? GOOD : DANGER} />
                      <text x={LEAF_X + 34} y={ly - 5} fontSize={11.5} fill="#5A6678">
                        {outcome.label}
                        {!outcome.withinLimits &&
                          (outcome.overBudget && outcome.overDeadline
                            ? ', over budget and late'
                            : outcome.overBudget
                              ? ', over budget'
                              : ', past deadline')}
                      </text>
                      <text x={LEAF_X + 34} y={ly + 12} fontSize={13} fontWeight={600} fill="#0E1726">
                        {formatCurrency(outcome.cost)}
                        <tspan dx={14}>{formatMonths(outcome.months)}</tspan>
                      </text>
                    </g>
                  )
                })}

                <g
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  aria-label={`${s.option.name}, ranked ${s.rank}, fit score ${Math.round(s.overall)}`}
                  onClick={() => onSelect(s.option.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onSelect(s.option.id)
                    }
                  }}
                  className="cursor-pointer focus:outline-none [&:focus-visible>rect]:stroke-[3px]"
                >
                  <rect
                    x={OPT_X}
                    y={oy - OPT_H / 2}
                    width={OPT_W}
                    height={OPT_H}
                    rx={14}
                    fill="#FFFFFF"
                    stroke={s.color}
                    strokeWidth={isSelected ? 3 : 1.75}
                  />
                  <circle cx={OPT_X + 20} cy={oy} r={6} fill={s.color} />
                  <text x={OPT_X + 36} y={oy - 3} fontSize={14} fontWeight={600} fill="#0E1726" className="font-display">
                    {truncate(s.option.name, 22)}
                  </text>
                  <text x={OPT_X + 36} y={oy + 15} fontSize={12} fill="#5A6678">
                    Ranked #{s.rank}, fit {Math.round(s.overall)}
                  </text>
                </g>
              </g>
            )
          })}

          <g>
            <circle cx={ROOT_X} cy={rootY} r={ROOT_R} fill="#0E1726" />
            <circle cx={ROOT_X} cy={rootY} r={12} fill="none" stroke="#fff" strokeWidth={2} />
            <circle cx={ROOT_X} cy={rootY} r={4} fill="#fff" />
            <text x={ROOT_X} y={rootY + ROOT_R + 24} textAnchor="middle" fontSize={13} fill="#5A6678">
              The decision
            </text>
          </g>
        </svg>
      </div>

      <p className="mt-5 border-t border-line pt-4 text-sm text-muted">
        Thicker lines mean a higher fit score. Each option shows two paths: one that goes well and one that drags on. Red
        dashed paths break your budget or deadline. Select an option to follow its branch.
      </p>
    </div>
  )
}
