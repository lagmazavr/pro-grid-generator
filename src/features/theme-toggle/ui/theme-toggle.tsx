'use client'

import { useEffect } from 'react'
import { Button } from '@/shared/ui'

const THEME_STORAGE_KEY = 'theme-preference'

function ThemeToggle() {
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
    if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark')
    } else {
      document.documentElement.classList.add('dark')
    }
  }, [])

  function toggleTheme() {
    const isDark = document.documentElement.classList.contains('dark')
    if (isDark) {
      document.documentElement.classList.remove('dark')
      localStorage.setItem(THEME_STORAGE_KEY, 'light')
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem(THEME_STORAGE_KEY, 'dark')
    }
  }

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme} className="cursor-pointer">
      <span className="dark:hidden">🌙</span>
      <span className="hidden dark:inline">☀️</span>
    </Button>
  )
}

export { ThemeToggle }

