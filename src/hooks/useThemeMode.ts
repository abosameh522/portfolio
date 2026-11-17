import { useSyncExternalStore } from 'react'

export type ThemeMode = 'dark' | 'light'

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  })
  return () => observer.disconnect()
}

function getSnapshot(): ThemeMode {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

/** Live-updating theme flag (mirrors the `data-theme` attribute on <html>). */
export function useThemeMode(): ThemeMode {
  return useSyncExternalStore(subscribe, getSnapshot, () => 'dark')
}
