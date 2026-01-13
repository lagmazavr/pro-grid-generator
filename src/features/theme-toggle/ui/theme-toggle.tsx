import { Button } from '@/shared/ui'

function ThemeToggle() {
  function toggleTheme() {
    document.documentElement.classList.toggle('dark')
  }

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme}>
      <span className="dark:hidden">🌙</span>
      <span className="hidden dark:inline">☀️</span>
    </Button>
  )
}

export { ThemeToggle }

