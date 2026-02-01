'use client'

import { useParams, useRouter, usePathname } from 'next/navigation'
import { Button } from '@/shared/ui'
import { LOCALES, type Locale } from '@/shared/types/routing'

const LOCALE_LABELS: Record<Locale, string> = {
  en: 'EN',
  es: 'ES',
  ru: 'RU',
}

const FlagIcon = ({ locale }: { locale: Locale }) => {
  const size = 18
  
  if (locale === 'en') {
    return (
      <svg width={size} height={size * 0.75} viewBox="0 0 60 45" xmlns="http://www.w3.org/2000/svg">
        <rect width="60" height="45" fill="#012169"/>
        <path d="M0 0l60 45M60 0L0 45" stroke="#fff" strokeWidth="6" fill="none"/>
        <path d="M0 0l60 45M60 0L0 45" stroke="#C8102E" strokeWidth="4" fill="none"/>
        <path d="M30 0v45M0 22.5h60" stroke="#fff" strokeWidth="8" fill="none"/>
        <path d="M30 0v45M0 22.5h60" stroke="#C8102E" strokeWidth="5" fill="none"/>
      </svg>
    )
  }
  
  if (locale === 'es') {
    return (
      <svg width={size} height={size * 0.75} viewBox="0 0 60 45" xmlns="http://www.w3.org/2000/svg">
        <rect width="60" height="15" fill="#AA151B"/>
        <rect y="15" width="60" height="15" fill="#F1BF00"/>
        <rect y="30" width="60" height="15" fill="#AA151B"/>
      </svg>
    )
  }
  
  if (locale === 'ru') {
    return (
      <svg width={size} height={size * 0.75} viewBox="0 0 60 45" xmlns="http://www.w3.org/2000/svg">
        <rect width="60" height="15" fill="#FFFFFF"/>
        <rect y="15" width="60" height="15" fill="#0039A6"/>
        <rect y="30" width="60" height="15" fill="#D52B1E"/>
      </svg>
    )
  }
  
  return null
}

function LanguageToggle() {
  const params = useParams()
  const router = useRouter()
  const pathname = usePathname()
  const currentLocale = (params?.locale as Locale) || 'en'

  const handleLanguageChange = (locale: Locale) => {
    if (locale === currentLocale) return

    const currentPath = pathname || ''
    const pathWithoutLocale = currentPath.replace(`/${currentLocale}`, '') || '/'
    router.push(`/${locale}${pathWithoutLocale}`)
  }

  return (
    <div className="flex gap-1">
      {LOCALES.map((locale) => (
        <Button
          key={locale}
          variant={currentLocale === locale ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleLanguageChange(locale)}
          className="cursor-pointer min-w-[36px] sm:min-w-[40px] flex items-center justify-center gap-1 sm:gap-1.5 px-1.5 sm:px-2"
          title={LOCALE_LABELS[locale]}
        >
          <FlagIcon locale={locale} />
          <span className="text-[10px] sm:text-xs font-medium">{LOCALE_LABELS[locale]}</span>
        </Button>
      ))}
    </div>
  )
}

export { LanguageToggle }
