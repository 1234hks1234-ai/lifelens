import { useMemo, useState, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Container } from '@/components/layout/Container'
import { OptionEditor } from '@/components/create/OptionEditor'
import { Button } from '@/components/ui/Button'
import { TextAreaField, TextField } from '@/components/ui/Field'
import { CheckIcon, PlusIcon } from '@/components/ui/Icons'
import { useDecision } from '@/context/DecisionContext'
import { EXAMPLES } from '@/data/examples'
import { formatCompactCurrency, formatMonths, plural } from '@/lib/format'
import { uid } from '@/lib/id'
import { MAX_OPTIONS, optionColor } from '@/lib/palette'
import type { DecisionOption } from '@/types'

function blankOption(): DecisionOption {
  return { id: uid(), name: '', description: '', months: 6, cost: 5000, importance: 5 }
}

export function CreateDecisionPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { decision, setDecision } = useDecision()

  // "Edit decision" in the workspace arrives here with state.edit set.
  const editing = Boolean((location.state as { edit?: boolean } | null)?.edit && decision)

  const [title, setTitle] = useState(() => (editing && decision ? decision.title : ''))
  const [description, setDescription] = useState(() => (editing && decision ? decision.description : ''))
  const [options, setOptions] = useState<DecisionOption[]>(() =>
    editing && decision ? decision.options.map((o) => ({ ...o })) : [blankOption(), blankOption()],
  )
  const [showErrors, setShowErrors] = useState(false)
  const [lastAddedId, setLastAddedId] = useState<string | null>(null)

  const namedCount = options.filter((o) => o.name.trim()).length
  const titleError = showErrors && !title.trim() ? 'Give your decision a title so you can find it again.' : undefined
  const ready = title.trim().length > 0 && namedCount === options.length && options.length >= 2

  const summary = useMemo(() => {
    const costs = options.map((o) => o.cost)
    const times = options.map((o) => o.months)
    return {
      cost: `${formatCompactCurrency(Math.min(...costs))} to ${formatCompactCurrency(Math.max(...costs))}`,
      time: `${formatMonths(Math.min(...times))} to ${formatMonths(Math.max(...times))}`,
    }
  }, [options])

  const updateOption = (id: string, patch: Partial<DecisionOption>) =>
    setOptions((prev) => prev.map((o) => (o.id === id ? { ...o, ...patch } : o)))

  const addOption = () => {
    if (options.length >= MAX_OPTIONS) return
    const next = blankOption()
    setLastAddedId(next.id)
    setOptions((prev) => [...prev, next])
  }

  const removeOption = (id: string) => setOptions((prev) => (prev.length > 2 ? prev.filter((o) => o.id !== id) : prev))

  const applyExample = (slug: string) => {
    const example = EXAMPLES.find((e) => e.slug === slug)
    if (!example) return
    setTitle(example.decision.title)
    setDescription(example.decision.description)
    setOptions(example.decision.options.map((o) => ({ ...o, id: uid() })))
    setShowErrors(false)
    setLastAddedId(null)
  }

  const submit = () => {
    setShowErrors(true)
    if (!title.trim()) {
      document.getElementById('decision-title')?.focus()
      return
    }
    const unnamed = options.find((o) => !o.name.trim())
    if (unnamed) {
      document.getElementById(`option-${unnamed.id}-name`)?.focus()
      return
    }
    setDecision({
      id: uid(),
      title: title.trim(),
      description: description.trim(),
      options: options.map((o) => ({ ...o, name: o.name.trim(), description: o.description.trim() })),
    })
    navigate('/workspace')
  }

  return (
    <Container className="pb-24 pt-10 sm:pt-14">
      <header className="max-w-2xl">
        <h1 className="text-[clamp(2.1rem,4.4vw,3.4rem)] font-semibold leading-[1.05] tracking-tight">
          {editing ? 'Edit your decision' : 'Create a decision'}
        </h1>
        <p className="mt-4 text-lg text-ink-soft">
          Describe what you are deciding, then add the options on the table. Rough estimates are fine, and you can adjust
          them any time.
        </p>
        {!editing && (
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-sm text-muted">Not sure where to start? Try an example:</span>
            {EXAMPLES.map((example) => (
              <button
                key={example.slug}
                type="button"
                onClick={() => applyExample(example.slug)}
                className="rounded-full border border-line bg-white px-3.5 py-1.5 text-sm font-medium text-ink-soft transition-colors hover:border-ink/30 hover:text-ink"
              >
                {example.category}
              </button>
            ))}
          </div>
        )}
      </header>

      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14">
        <div className="space-y-12">
          <section aria-labelledby="decision-heading" className="space-y-6">
            <h2 id="decision-heading" className="text-2xl font-semibold tracking-tight">
              The decision
            </h2>
            <TextField
              id="decision-title"
              label="Decision title"
              placeholder="Should I go back to school for a master's degree?"
              value={title}
              maxLength={120}
              onChange={(e) => setTitle(e.target.value)}
              error={titleError}
            />
            <TextAreaField
              id="decision-description"
              label="What's the situation?"
              hint="Optional. Include anything that makes this hard, like a deadline, a budget, or people affected."
              placeholder="I've been in my current role for five years and I've hit a ceiling. A degree could open new doors, but it's a big commitment of money and time."
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </section>

          <section aria-labelledby="options-heading" className="space-y-5">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 id="options-heading" className="text-2xl font-semibold tracking-tight">
                  Your options
                </h2>
                <p className="mt-1 text-[15px] text-muted">Compare two to {MAX_OPTIONS} options. Include doing nothing if it is a real choice.</p>
              </div>
            </div>

            {options.map((option, index) => (
              <OptionEditor
                key={option.id}
                option={option}
                index={index}
                canRemove={options.length > 2}
                autoFocusName={option.id === lastAddedId}
                error={showErrors && !option.name.trim() ? 'Name this option so you can recognise it later.' : undefined}
                onChange={(patch) => updateOption(option.id, patch)}
                onRemove={() => removeOption(option.id)}
              />
            ))}

            <button
              type="button"
              onClick={addOption}
              disabled={options.length >= MAX_OPTIONS}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-line py-5 text-[15px] font-medium text-ink-soft transition-colors hover:border-lens/50 hover:bg-lens-soft/60 hover:text-lens-dark disabled:pointer-events-none disabled:opacity-50"
            >
              <PlusIcon className="h-4 w-4" />
              {options.length >= MAX_OPTIONS ? `You can compare up to ${MAX_OPTIONS} options` : 'Add another option'}
            </button>
          </section>
        </div>

        <aside aria-label="Summary" className="lg:relative">
          <div className="rounded-2xl border border-line bg-white p-6 lg:sticky lg:top-24">
            <h2 className="text-xl font-semibold tracking-tight">At a glance</h2>

            <ul className="mt-5 space-y-2.5">
              {options.map((option, index) => (
                <li key={option.id} className="flex items-center gap-3 text-[15px]">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: optionColor(index) }} />
                  <span className={`truncate ${option.name.trim() ? 'text-ink' : 'text-faint'}`}>
                    {option.name.trim() || 'Untitled option'}
                  </span>
                </li>
              ))}
            </ul>

            <dl className="mt-6 space-y-3 border-t border-line pt-5 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Cost range</dt>
                <dd className="font-semibold tabular-nums">{summary.cost}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Timeline range</dt>
                <dd className="font-semibold tabular-nums">{summary.time}</dd>
              </div>
            </dl>

            <ul className="mt-6 space-y-2 border-t border-line pt-5 text-sm">
              <Check done={title.trim().length > 0}>Decision has a title</Check>
              <Check done={namedCount === options.length}>
                {namedCount} of {plural(options.length, 'option')} named
              </Check>
            </ul>

            <Button size="lg" className="mt-6 w-full" onClick={submit}>
              Continue to Analysis
            </Button>
            <p className="mt-3 text-center text-[13px] text-muted">
              {ready ? 'Everything looks good.' : 'You can change any of this later.'}
            </p>
          </div>
        </aside>
      </div>
    </Container>
  )
}

function Check({ done, children }: { done: boolean; children: ReactNode }) {
  return (
    <li className={`flex items-center gap-2.5 ${done ? 'text-ink' : 'text-muted'}`}>
      <span
        className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border transition-colors ${
          done ? 'border-good bg-good text-white' : 'border-line bg-white text-transparent'
        }`}
      >
        <CheckIcon className="h-3 w-3" strokeWidth={3} />
      </span>
      {children}
    </li>
  )
}
