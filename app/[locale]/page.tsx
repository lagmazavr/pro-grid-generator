import { redirect } from 'next/navigation'
import { DEFAULT_TECHNOLOGY } from '@/shared/types/routing'
import { isValidLocale } from '@/shared/types/routing'
import { notFound } from 'next/navigation'

interface LocalePageProps {
  params: Promise<{ locale: string }>
}

export default async function LocalePage({ params }: LocalePageProps) {
  const { locale } = await params

  if (!isValidLocale(locale)) {
    notFound()
  }

  redirect(`/${locale}/${DEFAULT_TECHNOLOGY}`)
}
