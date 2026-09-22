import { Container } from '@/components/layout/Container'
import { Button, ButtonLink } from '@/components/ui/Button'
import { HeroTree } from '@/components/landing/HeroTree'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { ExampleCard } from '@/components/landing/ExampleCard'
import { EXAMPLES } from '@/data/examples'
import { useOpenExample } from '@/hooks/useOpenExample'

export function LandingPage() {
  const openExample = useOpenExample()

  return (
    <>
      <section className="overflow-hidden">
        <Container className="grid items-center gap-10 pb-20 pt-12 sm:pt-16 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,1fr)] lg:gap-6 lg:pb-28 lg:pt-20">
          <div>
            <h1 className="text-[clamp(2.9rem,6.4vw,5.4rem)] font-semibold leading-[0.98] tracking-[-0.035em]">
              See Your Choices Differently.
            </h1>
            <p className="mt-7 max-w-[34rem] text-lg leading-relaxed text-ink-soft">
              LifeLens turns a tangled decision into something you can see. Lay out your options, weigh time, cost, and
              importance side by side, and explore how the trade-offs shift when your assumptions change.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <ButtonLink to="/create" size="lg">
                Create a Decision
              </ButtonLink>
              <Button variant="secondary" size="lg" onClick={() => openExample('masters')}>
                Explore Demo
              </Button>
            </div>
            <p className="mt-6 text-sm text-muted">No account needed. Your decisions stay in this browser.</p>
          </div>
          <div className="mx-auto w-full max-w-[620px] lg:max-w-none">
            <HeroTree />
          </div>
        </Container>
      </section>

      <HowItWorks />

      <section id="examples" className="scroll-mt-20 py-20 sm:py-24">
        <Container>
          <div className="max-w-2xl">
            <h2 className="text-[clamp(1.9rem,3.6vw,2.75rem)] font-semibold leading-[1.1] tracking-tight">
              Start from a real-world decision
            </h2>
            <p className="mt-4 text-lg text-ink-soft">
              Open any example to see how LifeLens breaks it down. Every number is editable, so you can make it your own.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {EXAMPLES.map((example) => (
              <ExampleCard key={example.slug} example={example} onOpen={() => openExample(example.slug)} />
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-20 sm:pb-28">
        <Container>
          <div className="flex flex-col gap-8 rounded-3xl bg-ink px-7 py-12 text-white sm:px-14 sm:py-16 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <h2 className="text-[clamp(1.8rem,3.4vw,2.6rem)] font-semibold leading-[1.1] tracking-tight">
                Bring your next decision into focus.
              </h2>
              <p className="mt-3 text-[17px] text-white/70">It takes about two minutes to set up your options.</p>
            </div>
            <ButtonLink to="/create" variant="light" size="lg" className="self-start md:self-auto">
              Create a Decision
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  )
}
