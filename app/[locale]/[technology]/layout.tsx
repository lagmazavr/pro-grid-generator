import { generateMetadata as generateSEO } from '@/shared/config/seo'
import { isValidLocale, isValidTechnology } from '@/shared/types/routing'
import { notFound } from 'next/navigation'
import type { Locale, Technology } from '@/shared/types/routing'

interface TechnologyLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string; technology: string }>
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; technology: string }>
}) {
  const { locale, technology } = await params

  if (!isValidLocale(locale) || !isValidTechnology(technology)) {
    return {}
  }

  return generateSEO(locale as Locale, technology as Technology)
}

export default async function TechnologyLayout({
  children,
  params,
}: TechnologyLayoutProps) {
  const { locale, technology } = await params

  if (!isValidLocale(locale) || !isValidTechnology(technology)) {
    notFound()
  }

  return <>{children}</>
}
