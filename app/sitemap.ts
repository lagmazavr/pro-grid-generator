import { LOCALES, TECHNOLOGIES } from '@/shared/types/routing'
import type { MetadataRoute } from 'next'

function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  return 'https://example.com'
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl()

  const technologyPages = LOCALES.flatMap((locale) =>
    TECHNOLOGIES.map((technology) => ({
      url: `${baseUrl}/${locale}/${technology}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: locale === 'en' && technology === 'tailwind' ? 1 : 0.9,
    }))
  )

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    ...technologyPages,
  ]
}
