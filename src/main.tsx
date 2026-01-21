import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Load theme from localStorage, default to dark
const THEME_STORAGE_KEY = 'theme-preference'
const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
if (savedTheme === 'light') {
  document.documentElement.classList.remove('dark')
} else {
  // Default to dark theme
  document.documentElement.classList.add('dark')
  if (!savedTheme) {
    localStorage.setItem(THEME_STORAGE_KEY, 'dark')
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
