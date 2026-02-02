'use client'

import { useEffect, useState } from 'react'

/**
 * Returns true when the media query matches (e.g. viewport is at or above the breakpoint).
 * @param query - CSS media query string (e.g. '(min-width: 768px)')
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mql = window.matchMedia(query)
    const handler = () => setMatches(mql.matches)
    setMatches(mql.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [query])

  return matches
}
