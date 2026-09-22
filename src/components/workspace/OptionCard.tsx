import { useId, useState } from 'react'
import { AlertIcon, ChevronDownIcon } from '@/components/ui/Icons'
import { formatCurrency, formatMonths, plural } from '@/lib/format'
import { LIMIT_PENALTY } from '@/lib/scoring'
import type { ScoredOption, Weights } from '@/types'

interface OptionCardProps {
  scored: ScoredOption
  /** Normalised weights (0 to 1) so the breakdown can show each share. */
  shares: Weights
  selected: boolean
  dimmed: boolean
  onSelect: () => void
}

function Metric({ label, value, from }: { label: string; value: string; from?: string }) {
  return (
    <div>
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="mt-0.5 text-[15px] font-semibold tabular-nums">{value}</dd>
      {from && <p className="text-xs text-faint">from {from}</p>}
    </div>
  )
}

function Flag({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-danger/10 px-2.5 py-1 text-xs font-medium text-danger">
      <AlertIcon className="h-3.5 w-3.5" />
      {children}
    </span>
  )
}

export function OptionCard({ scored, shares, selected, dimmed, onSelect }: OptionCardProps) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const { option, color, rank, baselineRank, overall, adjustedCost, adjustedMonths, overBudget, overDeadline, scores } = scored

  const delta = baselineRank - rank
  const costChanged = Math.round(adjustedCost) !== Math.round(option.cost)
  const timeChanged = Math.round(adjustedMonths * 10) !== Math.round(option.months * 10)

  const rows = [
    { label: 'Importance', score: scores.importance, share: shares.importance },
    { label: 'Cost', score: scores.cost, share: shares.cost },
    { label: 'Time', score: scores.time, share: shares.time },
  ]

  return (
    <article
      onClick={onSelect}
      className={`cursor-pointer rounded-2xl border bg-white p-5 transition-all duration-200 sm:p-6 ${
        selected ? '' : 'border-line hover:border-ink/25'
      } ${dimmed ? 'opacity-60' : ''}`}
      style={selected ? { borderColor: color, boxShadow: `0 0 0 1px ${color}` } : undefined}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className="grid h-7 min-w-[2rem] shrink-0 place-items-center rounded-full px-2 text-xs font-semibold tabular-nums text-ink"
            style={{ backgroundColor: `${color}26` }}
          >
            #{rank}
          </span>
          <h3 className="min-w-0 text-lg font-semibold leading-tight tracking-tight">
            <button type="button" aria-pressed={selected} className="text-left">
              {option.name}
            </button>
          </h3>
        </div>
        {delta !== 0 && (
          <span
            className={`shrink-0 rounded-full px-2 py-1 text-xs font-semibold tabular-nums ${
              delta > 0 ? 'bg-good/10 text-good' : 'bg-danger/10 text-danger'
            }`}
            title={`${delta > 0 ? 'Up' : 'Down'} ${plural(Math.abs(delta), 'place')} from the starting ranking`}
          >
            {delta > 0 ? '\u25B2' : '\u25BC'} {Math.abs(delta)}
          </span>
        )}
      </div>

      <p className="mt-3 line-clamp-2 text-[15px] leading-relaxed text-muted">{option.description}</p>

      <div className="mt-5 flex items-baseline gap-2">
        <span className="font-display text-4xl font-semibold leading-none tracking-tight tabular-nums">{Math.round(overall)}</span>
        <span className="text-sm text-muted">fit score</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-fog">
        <div
          className="h-full rounded-full transition-[width] duration-500 ease-out"
          style={{ width: `${Math.min(100, overall)}%`, backgroundColor: color }}
        />
      </div>

      <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-line pt-4">
        <Metric label="Time" value={formatMonths(adjustedMonths)} from={timeChanged ? formatMonths(option.months) : undefined} />
        <Metric label="Cost" value={formatCurrency(adjustedCost)} from={costChanged ? formatCurrency(option.cost) : undefined} />
        <Metric label="Importance" value={`${option.importance}/10`} />
      </dl>

      {(overBudget || overDeadline) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {overBudget && <Flag>Over budget</Flag>}
          {overDeadline && <Flag>Past deadline</Flag>}
        </div>
      )}

      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={(e) => {
          e.stopPropagation()
          setOpen((o) => !o)
        }}
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-ink"
      >
        Score breakdown
        <ChevronDownIcon className={`h-4 w-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>

      <div
        id={panelId}
        aria-hidden={!open}
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <ul className="space-y-3 pt-4">
            {rows.map((row) => (
              <li key={row.label}>
                <div className="flex justify-between text-sm">
                  <span className="text-ink-soft">
                    {row.label} <span className="text-faint">weighted {Math.round(row.share * 100)}%</span>
                  </span>
                  <span className="font-semibold tabular-nums">{Math.round(row.score)}</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-fog">
                  <div
                    className="h-full rounded-full transition-[width] duration-500 ease-out"
                    style={{ width: `${row.score}%`, backgroundColor: color, opacity: 0.75 }}
                  />
                </div>
              </li>
            ))}
          </ul>
          {(overBudget || overDeadline) && (
            <p className="mt-3 text-[13px] text-danger">
              Each limit an option breaks keeps only {Math.round(LIMIT_PENALTY * 100)}% of its score.
            </p>
          )}
        </div>
      </div>
    </article>
  )
}
