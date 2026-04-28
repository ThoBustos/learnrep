import { useEffect } from 'react'

/**
 * Use this instead of useEffect when you need to sync with an external system
 * on mount (DOM integration, third-party widgets, browser API subscriptions).
 *
 * Direct useEffect calls are banned — this is the only sanctioned escape hatch.
 * For data fetching use React Query. For derived state compute inline.
 */
export function useMountEffect(effect: () => void | (() => void)) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, [])
}
