import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Resets scroll on navigation, or jumps to a #section when the link has one. */
export function ScrollToTop() {
  const { pathname, hash, key } = useLocation()

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        el.scrollIntoView()
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash, key])

  return null
}
