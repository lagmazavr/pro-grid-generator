import { getRequestConfig } from 'next-intl/server'
import { LOCALES, DEFAULT_LOCALE, type Locale } from '@/shared/types/routing'
import { notFound } from 'next/navigation'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
  
  // Fallback to default locale if requestLocale is undefined (e.g., prefetch requests)
  if (!locale) {
    locale = DEFAULT_LOCALE
  }
  
  if (!LOCALES.includes(locale as Locale)) {
    notFound()
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  }
})
