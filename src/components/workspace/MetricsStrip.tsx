import type { ScoredOption } from '@/types'
import { highlightsFor, verdictFor } from '@/lib/scoring'
import { formatCurrency, formatMonths, plural } from '@/lib/format'

function Stat({ label, value, option }: { label: string; value: string; option: ScoredOption }) {
  return (
    <div className="border-t border-line p-6 md:border-l md:border-t-0">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 font-display text-[28px] font-semibold leading-none tracking-tight tabular-nums">{value}</p>
      <p className="mt-3 flex items-center gap-2 text-sm text-ink-soft">
        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: option.color }} />
        <span className="truncate">{option.option.name}</span>
      </p>
    </div>
  )
}

/** The headline result plus the three extremes: cheapest, fastest, most important. */
export function MetricsStrip({ scored }: { scored: ScoredOption[] }) {
  const verdict = verdictFor(scored)
  const highlights = highlightsFor(scored)
  if (!verdict || !highlights) return null

  const { leader } = verdict

  return (
    <section
      aria-label="Comparison metrics"
      className="grid overflow-hidden rounded-2xl border border-line bg-white md:grid-cols-[1.6fr_1fr_1fr_1fr]"
    >
      <div className="p-6 sm:p-7" aria-live="polite">
        <p className="text-sm text-muted">Best overall fit</p>
        <p className="mt-2 flex items-center gap-3 font-display text-[28px] font-semibold leading-tight tracking-tight">
          <span className="h-3.5 w-3.5 shrink-0 rounded-full" style={{ backgroundColor: leader.color }} />
          {leader.option.name}
        </p>
        <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-soft">
          {verdict.tone === 'tie'
            ? verdict.summary
            : `Leads by ${Math.round(verdict.margin)} points. ${verdict.summary}`}
        </p>
        {verdict.outsideLimits > 0 && (
          <p className="mt-2 text-sm font-medium text-danger">
            {plural(verdict.outsideLimits, 'option')} outside your budget or deadline.
          </p>
        )}
      </div>
      <Stat label="Lowest cost" value={formatCurrency(highlights.lowestCost.adjustedCost)} option={highlights.lowestCost} />
      <Stat label="Fastest" value={formatMonths(highlights.fastest.adjustedMonths)} option={highlights.fastest} />
      <Stat
        label="Most important"
        value={`${highlights.mostImportant.option.importance}/10`}
        option={highlights.mostImportant}
      />
    </section>
  )
}
