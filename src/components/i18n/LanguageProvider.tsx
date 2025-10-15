"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { dictionaries, detectBrowserLocale, type Dictionary, type Locale } from "@/lib/i18n";

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (path: string, tokens?: Record<string, string | number>) => string;
  dict: Dictionary;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

const STORAGE_KEY = "pubquiz.lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const initializedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
    const preferred = stored ?? detectBrowserLocale();
    setLocaleState(preferred);
    initializedRef.current = true;
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!initializedRef.current) return;
    window.localStorage.setItem(STORAGE_KEY, locale);
  }, [locale]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        setLocaleState(e.newValue as Locale);
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const dict = useMemo(() => dictionaries[locale], [locale]);

  const setLocale = useCallback((l: Locale) => setLocaleState(l), []);

  const t = useCallback(
    (path: string, tokens?: Record<string, string | number>) => {
      const segments = path.split(".");
      let current: unknown = dict;
      for (const s of segments) {
        if (current == null || typeof current !== "object") break;
        current = (current as Record<string, unknown>)[s];
      }
      let str = typeof current === "string" ? current : path;
      if (tokens) {
        for (const [k, v] of Object.entries(tokens)) {
          str = str.replaceAll(`{${k}}`, String(v));
        }
      }
      return str;
    },
    [dict]
  );

  const value = useMemo<I18nContextValue>(
    () => ({ locale, setLocale, t, dict }),
    [dict, locale, setLocale, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within LanguageProvider");
  return ctx;
}
