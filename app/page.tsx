import { redirect } from 'next/navigation'
import { DEFAULT_LOCALE, DEFAULT_TECHNOLOGY } from '@/shared/types/routing'

export default function RootPage() {
  redirect(`/${DEFAULT_LOCALE}/${DEFAULT_TECHNOLOGY}`)
}
