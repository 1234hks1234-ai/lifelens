import { SliderField } from '@/components/ui/Slider'
import { TrashIcon } from '@/components/ui/Icons'
import { formatCompactCurrency, formatMonthsLong, importanceLabel } from '@/lib/format'
import { optionColor, optionLetter } from '@/lib/palette'
import type { DecisionOption } from '@/types'

const NAME_PLACEHOLDERS = [
  "e.g. Full-time master's degree",
  'e.g. Part-time online course',
  'e.g. Stay in my current role',
  'e.g. Take a sabbatical first',
  'e.g. Start something of my own',
  'e.g. Ask for a transfer',
]

const MAX_COST = 10_000_000

interface OptionEditorProps {
  option: DecisionOption
  index: number
  canRemove: boolean
  error?: string
  autoFocusName?: boolean
  onChange: (patch: Partial<DecisionOption>) => void
  onRemove: () => void
}

function CostInput({ id, value, onChange }: { id: string; value: number; onChange: (value: number) => void }) {
  return (
    <div className="flex h-9 items-center rounded-lg border border-line bg-white px-2.5 focus-within:border-lens focus-within:ring-2 focus-within:ring-lens/20">
      <span className="text-sm text-muted">$</span>
      <input
        id={`${id}-input`}
        inputMode="numeric"
        aria-label="Cost in US dollars"
        value={value.toLocaleString('en-US')}
        onChange={(e) => {
          const digits = e.target.value.replace(/\D/g, '')
          onChange(Math.min(MAX_COST, Number(digits || 0)))
        }}
        className="w-[5.5rem] bg-transparent text-right text-sm font-semibold tabular-nums text-ink focus:outline-none"
      />
    </div>
  )
}

export function OptionEditor({ option, index, canRemove, error, autoFocusName, onChange, onRemove }: OptionEditorProps) {
  const color = optionColor(index)
  const letter = optionLetter(index)
  const nameId = `option-${option.id}-name`

  return (
    <section aria-label={`Option ${letter}`} className="rounded-2xl border border-line bg-white p-5 sm:p-7">
      <div className="flex items-start gap-4">
        <span
          className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full font-display text-[15px] font-semibold text-white"
          style={{ backgroundColor: color }}
          aria-hidden="true"
        >
          {letter}
        </span>

        <div className="min-w-0 flex-1">
          <label htmlFor={nameId} className="sr-only">
            Name of option {letter}
          </label>
          <input
            id={nameId}
            autoFocus={autoFocusName}
            value={option.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder={NAME_PLACEHOLDERS[index % NAME_PLACEHOLDERS.length]}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${nameId}-error` : undefined}
            className={`w-full border-0 border-b-2 bg-transparent py-2 font-display text-[22px] font-semibold tracking-tight text-ink transition-colors placeholder:font-normal placeholder:text-faint focus:outline-none ${
              error ? 'border-danger' : 'border-line hover:border-ink/25 focus:border-lens'
            }`}
          />
          {error && (
            <p id={`${nameId}-error`} role="alert" className="mt-2 text-sm font-medium text-danger">
              {error}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onRemove}
          disabled={!canRemove}
          aria-label={`Remove option ${letter}`}
          title={canRemove ? 'Remove this option' : 'A decision needs at least two options'}
          className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full text-faint transition-colors hover:bg-danger/10 hover:text-danger disabled:pointer-events-none disabled:opacity-40"
        >
          <TrashIcon className="h-[18px] w-[18px]" />
        </button>
      </div>

      <div className="mt-4 sm:pl-[52px]">
        <label htmlFor={`option-${option.id}-description`} className="sr-only">
          Description of option {letter}
        </label>
        <textarea
          id={`option-${option.id}-description`}
          value={option.description}
          onChange={(e) => onChange({ description: e.target.value })}
          rows={2}
          placeholder="What would this look like in practice? Note the upsides and the catches."
          className="w-full resize-y rounded-xl border border-transparent bg-fog px-4 py-3 text-[15px] leading-relaxed text-ink placeholder:text-faint transition focus:border-lens focus:bg-white focus:outline-none focus:ring-4 focus:ring-lens/15"
        />

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <SliderField
            id={`option-${option.id}-time`}
            label="Estimated time"
            hint="Until it pays off or wraps up"
            value={option.months}
            min={1}
            max={36}
            onChange={(months) => onChange({ months })}
            format={formatMonthsLong}
            color={color}
            minLabel="1 mo"
            maxLabel="3 yrs"
          />
          <SliderField
            id={`option-${option.id}-cost`}
            label="Cost"
            hint="Total you expect to spend"
            value={option.cost}
            min={0}
            max={100_000}
            step={500}
            onChange={(cost) => onChange({ cost })}
            format={formatCompactCurrency}
            color={color}
            minLabel="$0"
            maxLabel="$100k"
            valueSlot={<CostInput id={`option-${option.id}-cost`} value={option.cost} onChange={(cost) => onChange({ cost })} />}
          />
          <SliderField
            id={`option-${option.id}-importance`}
            label="Importance"
            hint="How much this outcome matters"
            value={option.importance}
            min={1}
            max={10}
            onChange={(importance) => onChange({ importance })}
            format={(v) => `${v} of 10, ${importanceLabel(v).toLowerCase()}`}
            color={color}
            minLabel="Minor"
            maxLabel="Critical"
            valueSlot={
              <output htmlFor={`option-${option.id}-importance`} className="text-sm font-semibold tabular-nums text-ink">
                {option.importance}/10 <span className="font-medium text-muted">{importanceLabel(option.importance)}</span>
              </output>
            }
          />
        </div>
      </div>
    </section>
  )
}
