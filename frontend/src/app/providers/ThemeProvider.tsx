import type { ReactNode } from 'react'
import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'
type ThemeMode = 'auto' | 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)
const STORAGE_KEY = 'myflix-theme'

const readStoredMode = (): ThemeMode => {
  if (typeof window === 'undefined') return 'auto'
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored === 'light' || stored === 'dark' || stored === 'auto' ? stored : 'auto'
  } catch {
    return 'auto'
  }
}

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<ThemeMode>(() => readStoredMode())
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'dark'
    const storedMode = readStoredMode()
    if (storedMode === 'light') return 'light'
    if (storedMode === 'dark') return 'dark'
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  })

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: light)')
    const compute = () => {
      if (mode === 'light') return 'light'
      if (mode === 'dark') return 'dark'
      return mq.matches ? 'light' : 'dark'
    }
    setTheme(compute())
    const listener = (event: MediaQueryListEvent) => {
      if (mode === 'auto') {
        setTheme(event.matches ? 'light' : 'dark')
      }
    }
    mq.addEventListener('change', listener)
    return () => mq.removeEventListener('change', listener)
  }, [mode])

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, mode)
    } catch {
      // ignore write failure
    }
  }, [mode])

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  return <ThemeContext.Provider value={{ theme, mode, setMode }}>{children}</ThemeContext.Provider>
}

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return ctx
}
