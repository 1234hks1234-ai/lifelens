import { useId, type ReactNode } from 'react'
import { Button } from '@/components/ui/Button'
import { ResetIcon } from '@/components/ui/Icons'
import { SliderField } from '@/components/ui/Slider'
import { formatCurrency, formatMonthsLong, formatSignedPercent, plural } from '@/lib/format'
import { limitRanges, normalizedWeights } from '@/lib/scoring'
import type { Assumptions, Decision, ScoredOption, Weights } from '@/types'

interface WhatIfPanelProps {
  decision: Decision
  assumptions: Assumptions
  scored: ScoredOption[]
  changed: boolean
  onChange: (next: Assumptions) => void
  onReset: () => void
}

function Group({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  const id = useId()
  return (
    <section role="group" aria-labelledby={id} className="border-t border-line pt-5">
      <h3 id={id} className="text-[15px] font-semibold">
        {title}
      </h3>
      {note && <p className="mt-1 text-[13px] leading-snug text-muted">{note}</p>}
      <div className="mt-4 space-y-5">{children}</div>
    </section>
  )
}

export function WhatIfPanel({ decision, assumptions, scored, changed, onChange, onReset }: WhatIfPanelProps) {
  const ranges = limitRanges(decision)
  const share = normalizedWeights(assumptions.weights)

  const setWeight = (key: keyof Weights, value: number) =>
    onChange({ ...assumptions, weights: { ...assumptions.weights, [key]: value } })

  const moved = scored.filter((s) => s.rank !== s.baselineRank).sort((a, b) => a.rank - b.rank)
  const outside = scored.filter((s) => s.overBudget || s.overDeadline).length

  return (
    <div className="rounded-2xl border border-line bg-white p-6 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">What if?</h2>
          <p className="mt-1 text-sm text-muted">Change an assumption and the whole page updates.</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onReset} disabled={!changed} className="-mr-2 shrink-0">
          <ResetIcon className="h-4 w-4" />
          Reset
        </Button>
      </div>

      <div className="mt-6 space-y-6">
        <Group title="What matters most" note="These shares always add up to 100%.">
          <SliderField
            id="whatif-weight-importance"
            label="Importance"
            value={assumptions.weights.importance}
            min={0}
            max={100}
            step={5}
            onChange={(v) => setWeight('importance', v)}
            format={() => `${Math.round(share.importance * 100)}%`}
          />
          <SliderField
            id="whatif-weight-cost"
            label="Low cost"
            value={assumptions.weights.cost}
            min={0}
            max={100}
            step={5}
            onChange={(v) => setWeight('cost', v)}
            format={() => `${Math.round(share.cost * 100)}%`}
          />
          <SliderField
            id="whatif-weight-time"
            label="Speed"
            value={assumptions.weights.time}
            min={0}
            max={100}
            step={5}
            onChange={(v) => setWeight('time', v)}
            format={() => `${Math.round(share.time * 100)}%`}
          />
        </Group>

        <Group title="What could change" note="Applied to every option. Negative means cheaper or faster.">
          <SliderField
            id="whatif-cost-shift"
            label="Costs change by"
            value={assumptions.costShift}
            min={-30}
            max={60}
            step={5}
            onChange={(v) => onChange({ ...assumptions, costShift: v })}
            format={formatSignedPercent}
            minLabel={'\u221230%'}
            maxLabel="+60%"
          />
          <SliderField
            id="whatif-time-shift"
            label="Timelines change by"
            value={assumptions.timeShift}
            min={-30}
            max={100}
            step={5}
            onChange={(v) => onChange({ ...assumptions, timeShift: v })}
            format={formatSignedPercent}
            minLabel={'\u221230%'}
            maxLabel="+100%"
          />
        </Group>

        <Group title="Your limits" note="An option that breaks a limit loses 30% of its score.">
          <SliderField
            id="whatif-budget"
            label="Budget ceiling"
            value={assumptions.budgetCeiling}
            min={ranges.budget.min}
            max={ranges.budget.max}
            step={ranges.budget.step}
            onChange={(v) => onChange({ ...assumptions, budgetCeiling: v })}
            format={formatCurrency}
          />
          <SliderField
            id="whatif-deadline"
            label="Deadline"
            value={assumptions.deadlineMonths}
            min={ranges.deadline.min}
            max={ranges.deadline.max}
            step={ranges.deadline.step}
            onChange={(v) => onChange({ ...assumptions, deadlineMonths: v })}
            format={formatMonthsLong}
          />
        </Group>
      </div>

      <div className="mt-6 rounded-xl bg-fog p-4 text-sm" aria-live="polite">
        <p className="font-semibold">What changed</p>
        {moved.length === 0 ? (
          <p className="mt-1.5 text-muted">The ranking matches the starting assumptions.</p>
        ) : (
          <ul className="mt-2 space-y-1.5">
            {moved.slice(0, 4).map((s) => {
              const places = Math.abs(s.baselineRank - s.rank)
              return (
                <li key={s.option.id} className="flex items-start gap-2 text-ink-soft">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
                  <span>
                    <span className="font-medium text-ink">{s.option.name}</span>{' '}
                    {s.baselineRank > s.rank ? 'moves up' : 'drops'} {plural(places, 'place')}, now #{s.rank}.
                  </span>
                </li>
              )
            })}
          </ul>
        )}
        {outside > 0 && (
          <p className="mt-2 font-medium text-danger">{plural(outside, 'option')} outside your limits.</p>
        )}
      </div>
    </div>
  )
}
