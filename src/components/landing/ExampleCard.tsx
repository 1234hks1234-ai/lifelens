import { useMemo } from 'react'
import { Button } from '@/components/ui/Button'
import { defaultAssumptions, scoreOptions } from '@/lib/scoring'
import { plural, truncate } from '@/lib/format'
import type { Example } from '@/types'

export function ExampleCard({ example, onOpen }: { example: Example; onOpen: () => void }) {
  const ranked = useMemo(
    () =>
      scoreOptions(example.decision, defaultAssumptions(example.decision))
        .sort((a, b) => a.rank - b.rank)
        .slice(0, 3),
    [example],
  )

  return (
    <article className="group flex flex-col rounded-2xl border border-line bg-white p-6 transition-colors duration-200 hover:border-ink/25 sm:p-7">
      <span className="w-fit rounded-full bg-fog px-3 py-1 text-[13px] font-medium text-ink-soft">{example.category}</span>
      <h3 className="mt-4 text-[22px] font-semibold leading-snug tracking-tight">{example.decision.title}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-muted">{example.blurb}</p>

      <div className="mt-6 space-y-2.5" aria-label="Starting ranking">
        {ranked.map((s) => (
          <div key={s.option.id} className="grid grid-cols-[minmax(0,9.5rem)_1fr_1.75rem] items-center gap-3 text-[13px]">
            <span className="truncate text-ink-soft">{truncate(s.option.name, 26)}</span>
            <div className="h-2 overflow-hidden rounded-full bg-fog">
              <div className="h-full rounded-full" style={{ width: `${s.overall}%`, backgroundColor: s.color }} />
            </div>
            <span className="text-right font-semibold tabular-nums">{Math.round(s.overall)}</span>
          </div>
        ))}
      </div>

      <div className="mt-7 flex flex-1 items-end justify-between gap-4">
        <span className="text-sm text-muted">{plural(example.decision.options.length, 'option')} compared</span>
        <Button variant="secondary" size="sm" onClick={onOpen} aria-label={`Explore this decision: ${example.decision.title}`}>
          Explore this decision
        </Button>
      </div>
    </article>
  )
}
