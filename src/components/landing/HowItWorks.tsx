import type { ReactNode } from 'react'
import { Container } from '@/components/layout/Container'
import { optionColor } from '@/lib/palette'

interface Step {
  title: string
  body: string
  art: ReactNode
}

function CreateArt() {
  const names = ['Full-time master\u2019s', 'Part-time online', 'Stay the course']
  return (
    <div className="space-y-2">
      {names.map((name, i) => (
        <div key={name} className="flex items-center gap-2.5 rounded-lg border border-line bg-white px-3 py-2 text-[13px] text-ink-soft">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: optionColor(i) }} />
          {name}
        </div>
      ))}
    </div>
  )
}

function CompareArt() {
  const bars = [82, 61, 44]
  return (
    <div className="space-y-3 py-1">
      {bars.map((width, i) => (
        <div key={width} className="flex items-center gap-3">
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white">
            <div className="h-full rounded-full" style={{ width: `${width}%`, backgroundColor: optionColor(i) }} />
          </div>
          <span className="w-6 text-right text-[13px] font-semibold tabular-nums text-ink-soft">{width}</span>
        </div>
      ))}
    </div>
  )
}

function ExploreArt() {
  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between text-[13px] text-ink-soft">
          <span>Budget ceiling</span>
          <span className="font-semibold tabular-nums">$30,000</span>
        </div>
        <div className="relative mt-2.5 h-1.5 rounded-full bg-white">
          <div className="absolute inset-y-0 left-0 w-[46%] rounded-full bg-lens" />
          <div className="absolute left-[46%] top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-lens bg-white shadow" />
        </div>
      </div>
      <div className="flex items-center gap-2 text-[13px]">
        <span className="rounded-full px-2 py-0.5 font-semibold text-white" style={{ backgroundColor: optionColor(1) }}>
          #1
        </span>
        <span className="text-ink-soft">Part-time online moves up</span>
      </div>
    </div>
  )
}

const STEPS: Step[] = [
  {
    title: 'Create',
    body: 'Name the decision and add every option you are weighing. For each one, estimate the time it takes, what it costs, and how much it matters to you.',
    art: <CreateArt />,
  },
  {
    title: 'Compare',
    body: 'See your options side by side on the same scale. LifeLens scores each one and shows where the trade-offs really sit.',
    art: <CompareArt />,
  },
  {
    title: 'Explore',
    body: 'Change your assumptions and watch the ranking respond. What if the budget shrinks, or the deadline moves?',
    art: <ExploreArt />,
  },
]

export function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-20 border-y border-line bg-white py-20 sm:py-24">
      <Container>
        <div className="max-w-2xl">
          <h2 className="text-[clamp(1.9rem,3.6vw,2.75rem)] font-semibold leading-[1.1] tracking-tight">How LifeLens works</h2>
          <p className="mt-4 text-lg text-ink-soft">
            Three steps from a knot of competing thoughts to a decision you can explain to someone else.
          </p>
        </div>

        <ol className="mt-14 grid gap-12 md:grid-cols-3 md:gap-8">
          {STEPS.map((step, i) => (
            <li key={step.title}>
              <div className="flex items-center gap-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink text-sm font-semibold text-white">
                  {i + 1}
                </span>
                {i < STEPS.length - 1 && <span aria-hidden="true" className="hidden h-px flex-1 bg-line md:block" />}
              </div>
              <h3 className="mt-6 text-2xl font-semibold tracking-tight">{step.title}</h3>
              <p className="mt-2 max-w-sm text-[15.5px] leading-relaxed text-ink-soft">{step.body}</p>
              <div className="mt-6 max-w-sm rounded-xl bg-fog p-4">{step.art}</div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}
