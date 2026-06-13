import { createContext, useContext, useState, type ReactNode } from 'react'
import { translations, type Lang, type T } from '../constants/i18n'

interface LangCtx {
  lang:    Lang
  t:       T
  setLang: (l: Lang) => void
}

const LanguageContext = createContext<LangCtx>({} as LangCtx)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const defaultLang: Lang = navigator.language.startsWith('en') ? 'en' : 'es'
  const [lang, setLang] = useState<Lang>(defaultLang)

  return (
    <LanguageContext.Provider value={{ lang, t: translations[lang], setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
