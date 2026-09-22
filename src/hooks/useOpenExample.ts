import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDecision } from '@/context/DecisionContext'
import { findExample, instantiate } from '@/data/examples'

/** Loads one of the sample decisions and jumps to its workspace. */
export function useOpenExample() {
  const { setDecision } = useDecision()
  const navigate = useNavigate()

  return useCallback(
    (slug: string) => {
      setDecision(instantiate(findExample(slug).decision))
      navigate('/workspace')
    },
    [setDecision, navigate],
  )
}
