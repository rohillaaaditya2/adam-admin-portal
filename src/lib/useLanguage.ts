'use client';
import { useState, useEffect, useCallback } from 'react';
import { SUPPORTED_LANGUAGES, t, LanguageOption } from './i18n';

export function getSavedLanguage(): string {
  if (typeof window === 'undefined') return 'en';
  try {
    return localStorage.getItem('ane_lang') || 'en';
  } catch {
    return 'en';
  }
}

export function setSavedLanguage(langCode: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('ane_lang', langCode);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = langCode;
    }
    window.dispatchEvent(new CustomEvent('ane_lang_change', { detail: langCode }));
  } catch {
    // ignore local storage restrictions if any
  }
}

export function useLanguage() {
  const [lang, setLangState] = useState<string>('en');

  useEffect(() => {
    // Sync initial state on mount
    const saved = getSavedLanguage();
    setLangState(saved);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = saved;
    }

    // Listen to in-app custom event
    const handleCustomChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      const newLang = customEvent.detail || getSavedLanguage();
      setLangState(newLang);
    };

    // Listen to cross-tab storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'ane_lang') {
        const newLang = e.newValue || 'en';
        setLangState(newLang);
        if (typeof document !== 'undefined') {
          document.documentElement.lang = newLang;
        }
      }
    };

    window.addEventListener('ane_lang_change', handleCustomChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('ane_lang_change', handleCustomChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const changeLanguage = useCallback((code: string) => {
    setLangState(code);
    setSavedLanguage(code);
  }, []);

  const translate = useCallback((key: string, fallback?: string): string => {
    const res = t(lang, key);
    if (res && res !== key) return res;
    return fallback || res || key;
  }, [lang]);

  const currentLangObj: LanguageOption =
    SUPPORTED_LANGUAGES.find((l) => l.code === lang) || SUPPORTED_LANGUAGES[0];

  return {
    lang,
    setLang: changeLanguage,
    t: translate,
    currentLangObj,
    languages: SUPPORTED_LANGUAGES
  };
}
