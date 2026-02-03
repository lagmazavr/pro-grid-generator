'use client'

import { useTranslations } from 'next-intl'
import { LanguageToggle } from '@/features/language-toggle'
import { ThemeToggle } from '@/features/theme-toggle'
import { Logo } from '@/shared/ui'

function GridEditorHeader() {
  const t = useTranslations()

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/30">
      <div className="container mx-auto px-4 py-3 sm:px-6 sm:py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <Logo size={28} className="shrink-0 sm:w-8 sm:h-8" />
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              {t('header.title')}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}

export { GridEditorHeader }
