import { Container } from '@/components/layout/Container'
import { Logo } from '@/components/ui/Logo'

export function Footer() {
  return (
    <footer className="border-t border-line">
      <Container className="flex flex-col gap-4 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <div className="text-ink">
          <Logo />
        </div>
        <p className="max-w-md">
          LifeLens runs entirely in your browser. Nothing you enter is sent anywhere.
        </p>
        <p>&copy; {new Date().getFullYear()} LifeLens</p>
      </Container>
    </footer>
  )
}
