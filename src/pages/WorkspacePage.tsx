import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container } from '@/components/layout/Container'
import { Button, ButtonLink } from '@/components/ui/Button'
import { ComparisonChart } from '@/components/workspace/ComparisonChart'
import { DecisionTree } from '@/components/workspace/DecisionTree'
import { MetricsStrip } from '@/components/workspace/MetricsStrip'
import { OptionCard } from '@/components/workspace/OptionCard'
import { WhatIfPanel } from '@/components/workspace/WhatIfPanel'
import { useDecision } from '@/context/DecisionContext'
import { useOpenExample } from '@/hooks/useOpenExample'
import { defaultAssumptions, isSameAssumptions, normalizedWeights, scoreOptions } from '@/lib/scoring'
import { plural } from '@/lib/format'
import type { Decision } from '@/types'

export function WorkspacePage() {
  const { decision } = useDecision()
  const openExample = useOpenExample()

  if (!decision) {
    return (
      <Container className="py-24 sm:py-32">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.1] tracking-tight">There is no decision to analyze yet</h1>
          <p className="mt-4 text-lg text-ink-soft">
            Create one from scratch, or open the demo to see how a finished workspace looks.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink to="/create" size="lg">
              Create a Decision
            </ButtonLink>
            <Button variant="secondary" size="lg" onClick={() => openExample('masters')}>
              Explore Demo
            </Button>
          </div>
        </div>
      </Container>
    )
  }

  // Keyed by id so a new decision starts with fresh assumptions and selection.
  return <Workspace key={decision.id} decision={decision} />
}

function Workspace({ decision }: { decision: Decision }) {
  const navigate = useNavigate()
  const baseline = useMemo(() => defaultAssumptions(decision), [decision])
  const [assumptions, setAssumptions] = useState(baseline)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const scored = useMemo(() => scoreOptions(decision, assumptions, baseline), [decision, assumptions, baseline])
  const shares = useMemo(() => normalizedWeights(assumptions.weights), [assumptions.weights])
  const changed = !isSameAssumptions(assumptions, baseline)

  const toggleSelected = (id: string) => setSelectedId((current) => (current === id ? null : id))

  return (
    <div className="pb-24">
      <Container className="pt-10 sm:pt-14">
        <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-10">
          <div className="max-w-3xl">
            <h1 className="text-[clamp(2rem,4.2vw,3.4rem)] font-semibold leading-[1.06] tracking-tight">{decision.title}</h1>
            {decision.description && (
              <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-ink-soft">{decision.description}</p>
            )}
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Button variant="secondary" onClick={() => navigate('/create', { state: { edit: true } })}>
              Edit decision
            </Button>
            <ButtonLink to="/create">Create Another Decision</ButtonLink>
          </div>
        </header>

        <div className="mt-10">
          <MetricsStrip scored={scored} />
        </div>

        <div className="mt-14 grid gap-x-12 gap-y-16 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section aria-labelledby="options-heading" className="lg:col-start-1">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
              <div>
                <h2 id="options-heading" className="text-2xl font-semibold tracking-tight">
                  Your options
                </h2>
                <p className="mt-1 text-[15px] text-muted">
                  {plural(scored.length, 'option')}. Select one to highlight it in the chart and the tree.
                </p>
              </div>
              {selectedId && (
                <Button variant="ghost" size="sm" onClick={() => setSelectedId(null)}>
                  Clear selection
                </Button>
              )}
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {scored.map((s) => (
                <OptionCard
                  key={s.option.id}
                  scored={s}
                  shares={shares}
                  selected={selectedId === s.option.id}
                  dimmed={selectedId !== null && selectedId !== s.option.id}
                  onSelect={() => toggleSelected(s.option.id)}
                />
              ))}
            </div>
          </section>

          <aside aria-label="What if?" className="lg:col-start-2 lg:row-span-3 lg:row-start-1">
            <div className="lg:sticky lg:top-24">
              <WhatIfPanel
                decision={decision}
                assumptions={assumptions}
                scored={scored}
                changed={changed}
                onChange={setAssumptions}
                onReset={() => setAssumptions(baseline)}
              />
            </div>
          </aside>

          <section aria-labelledby="compare-heading" className="lg:col-start-1">
            <h2 id="compare-heading" className="mb-6 text-2xl font-semibold tracking-tight">
              Side by side
            </h2>
            <ComparisonChart scored={scored} selectedId={selectedId} onSelect={toggleSelected} />
          </section>

          <section aria-labelledby="paths-heading" className="lg:col-start-1">
            <div className="mb-6">
              <h2 id="paths-heading" className="text-2xl font-semibold tracking-tight">
                Possible paths
              </h2>
              <p className="mt-1 text-[15px] text-muted">How each option could play out under your current assumptions.</p>
            </div>
            <DecisionTree scored={scored} assumptions={assumptions} selectedId={selectedId} onSelect={toggleSelected} />
          </section>
        </div>

        <div className="mt-24 flex flex-col gap-6 rounded-3xl bg-ink px-7 py-10 text-white sm:px-12 md:flex-row md:items-center md:justify-between">
          <div className="max-w-lg">
            <h2 className="text-[clamp(1.6rem,3vw,2.1rem)] font-semibold leading-tight tracking-tight">
              Ready to weigh up something else?
            </h2>
            <p className="mt-2 text-white/70">Start a new decision. This one stays saved in your browser until you replace it.</p>
          </div>
          <ButtonLink to="/create" variant="light" size="lg" className="self-start md:self-auto">
            Create Another Decision
          </ButtonLink>
        </div>
      </Container>
    </div>
  )
}
