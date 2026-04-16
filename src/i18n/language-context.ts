import { createContext } from 'react'
import type { Locale } from './messages'

export type LanguageContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

export const LanguageContext = createContext<LanguageContextValue | null>(null)
