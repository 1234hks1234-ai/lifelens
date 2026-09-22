import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Decision } from '@/types'

const STORAGE_KEY = 'lifelens.decision.v1'

interface DecisionContextValue {
  decision: Decision | null
  setDecision: (decision: Decision) => void
  clearDecision: () => void
}

const DecisionContext = createContext<DecisionContextValue | null>(null)

function isDecision(value: unknown): value is Decision {
  if (!value || typeof value !== 'object') return false
  const d = value as Partial<Decision>
  return (
    typeof d.id === 'string' &&
    typeof d.title === 'string' &&
    typeof d.description === 'string' &&
    Array.isArray(d.options) &&
    d.options.every(
      (o) =>
        typeof o === 'object' &&
        o !== null &&
        typeof o.id === 'string' &&
        typeof o.name === 'string' &&
        typeof o.description === 'string' &&
        typeof o.months === 'number' &&
        typeof o.cost === 'number' &&
        typeof o.importance === 'number',
    )
  )
}

/** Keeps the current decision across page refreshes. Purely client-side. */
function readStored(): Decision | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    return isDecision(parsed) ? parsed : null
  } catch {
    return null
  }
}

export function DecisionProvider({ children }: { children: ReactNode }) {
  const [decision, setDecisionState] = useState<Decision | null>(readStored)

  useEffect(() => {
    try {
      if (decision) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(decision))
      else window.localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* Storage can be unavailable (private mode); the app still works in memory. */
    }
  }, [decision])

  const setDecision = useCallback((next: Decision) => setDecisionState(next), [])
  const clearDecision = useCallback(() => setDecisionState(null), [])

  const value = useMemo(() => ({ decision, setDecision, clearDecision }), [decision, setDecision, clearDecision])

  return <DecisionContext.Provider value={value}>{children}</DecisionContext.Provider>
}

export function useDecision(): DecisionContextValue {
  const ctx = useContext(DecisionContext)
  if (!ctx) throw new Error('useDecision must be used inside <DecisionProvider>')
  return ctx
}
