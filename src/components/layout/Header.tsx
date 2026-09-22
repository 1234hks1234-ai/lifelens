import { Link, useLocation } from 'react-router-dom'
import { Container } from '@/components/layout/Container'
import { Logo } from '@/components/ui/Logo'
import { ButtonLink } from '@/components/ui/Button'

const navLink =
  'hidden rounded-full px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-ink/5 md:inline-flex'

export function Header() {
  const { pathname } = useLocation()

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-fog/85 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between">
        <Link to="/" aria-label="LifeLens home" className="text-ink">
          <Logo />
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-1 sm:gap-2">
          {pathname === '/' && (
            <>
              <Link to={{ pathname: '/', hash: '#how' }} className={navLink}>
                How it works
              </Link>
              <Link to={{ pathname: '/', hash: '#examples' }} className={navLink}>
                Examples
              </Link>
            </>
          )}
          {pathname !== '/create' && (
            <ButtonLink to="/create" size="sm">
              Create a Decision
            </ButtonLink>
          )}
        </nav>
      </Container>
    </header>
  )
}
