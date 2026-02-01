'use client'

import { useEffect } from 'react'

const THEME_STORAGE_KEY = 'theme-preference'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
    if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark')
    } else {
      document.documentElement.classList.add('dark')
      if (!savedTheme) {
        localStorage.setItem(THEME_STORAGE_KEY, 'dark')
      }
    }
  }, [])

  return <>{children}</>
}
