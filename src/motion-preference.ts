import { createContext, useContext } from 'react'

export const MotionContext = createContext<{
  reduced: boolean
  systemReduced: boolean
  toggle: () => void
} | null>(null)

export function usePageMotion() {
  const preference = useContext(MotionContext)
  if (!preference) throw new Error('Motion components must be rendered inside PageMotion.')
  return preference
}
