import { useSyncExternalStore } from 'react'

/** Generic live media-query hook. */
export function useMediaQuery(query: string): boolean {
  const subscribe = (callback: () => void) => {
    const mq = window.matchMedia(query)
    mq.addEventListener('change', callback)
    return () => mq.removeEventListener('change', callback)
  }
  const getSnapshot = () => window.matchMedia(query).matches
  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}
