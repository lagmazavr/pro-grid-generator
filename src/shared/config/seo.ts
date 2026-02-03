import type { Locale, Technology } from '@/shared/types/routing'
import type { Metadata } from 'next'

interface SEOData {
  title: string
  description: string
  keywords: string[]
}

async function getSEOData(
  locale: Locale,
  technology: Technology
): Promise<SEOData> {
  const messages = await import(`../../../messages/${locale}.json`)
  const seoData = messages.default.seo[technology] as SEOData

  return {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
  }
}

export async function generateMetadata(
  locale: Locale,
  technology: Technology
): Promise<Metadata> {
  const seoData = await getSEOData(locale, technology)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com'
  const url = `${baseUrl}/${locale}/${technology}`

  const techDisplayName = technology
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  return {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    openGraph: {
      title: seoData.title,
      description: seoData.description,
      url,
      siteName: `Pro ${techDisplayName} Grid Generator`,
      locale,
      type: 'website',
      // Images from opengraph-image.tsx file convention
    },
    twitter: {
      card: 'summary_large_image',
      title: seoData.title,
      description: seoData.description,
      // Images from opengraph-image.tsx file convention
    },
    alternates: {
      canonical: url,
      languages: {
        'en': `${baseUrl}/en/${technology}`,
        'es': `${baseUrl}/es/${technology}`,
        'ru': `${baseUrl}/ru/${technology}`,
      },
    },
  }
}
