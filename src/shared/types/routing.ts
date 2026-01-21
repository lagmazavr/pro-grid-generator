export type Locale = 'en' | 'es' | 'ru'

export type Technology = 'material-ui' | 'ant-design' | 'mantine' | 'raw-css' | 'tailwind'

export const LOCALES: Locale[] = ['en', 'es', 'ru']

export const TECHNOLOGIES: Technology[] = [
  'material-ui',
  'ant-design',
  'mantine',
  'raw-css',
  'tailwind',
]

export const DEFAULT_LOCALE: Locale = 'en'

export const DEFAULT_TECHNOLOGY: Technology = 'tailwind'

export function isValidLocale(locale: string): locale is Locale {
  return LOCALES.includes(locale as Locale)
}

export function isValidTechnology(technology: string): technology is Technology {
  return TECHNOLOGIES.includes(technology as Technology)
}
