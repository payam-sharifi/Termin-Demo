import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { LanguageContext, type LanguageContextValue } from "./language-context";
import { DEFAULT_LOCALE, translate, type Locale } from "./messages";

const storageKey = "bookflow-demo-locale";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window === "undefined") return DEFAULT_LOCALE;
    const stored = window.localStorage.getItem(storageKey) as Locale | null;
    if (stored === "en" || stored === "de" || stored === "fa") return stored;
    return DEFAULT_LOCALE;
  });

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(storageKey, next);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang =
      locale === "fa" ? "fa" : locale === "de" ? "de" : "en";
    document.documentElement.dir = locale === "fa" ? "rtl" : "ltr";
  }, [locale]);

  const t = useCallback((key: string) => translate(locale, key), [locale]);

  const value: LanguageContextValue = useMemo(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
