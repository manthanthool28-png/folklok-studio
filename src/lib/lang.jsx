import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import ui from '../content/ui.json';

const LanguageContext = createContext(null);
const STORAGE_KEY = 'folklok:lang';

/** Reads a dotted path out of ui.json — t('nav.instruments'). */
function lookup(path) {
  return path.split('.').reduce((node, key) => (node ? node[key] : undefined), ui);
}

export function LanguageProvider({ children }) {
  // Read synchronously during the first render rather than in an effect.
  // Persisting from an effect instead caused a race that silently reset the
  // preference: the write ran with the initial 'en' before the read had
  // applied the stored value, overwriting it. Anyone who left the page in
  // that window came back to English.
  const [lang, setLangState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved === 'mr' || saved === 'en' ? saved : 'en';
    } catch {
      return 'en';
    }
  });

  // Only an explicit choice writes to storage, so there is nothing to race.
  const setLang = useCallback((next) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* preference just won't persist — the site still works */
    }
  }, []);

  useEffect(() => {
    // Screen readers and browser translation both key off this.
    document.documentElement.lang = lang === 'mr' ? 'mr' : 'en';
  }, [lang]);

  /**
   * Translate a key. Falls back to English, then to the key itself, so a
   * missing string shows up as an obvious bug rather than a blank space.
   */
  const t = useCallback(
    (path) => {
      const entry = lookup(path);
      if (!entry) return path;
      return entry[lang] ?? entry.en ?? path;
    },
    [lang]
  );

  /**
   * Pick a language off a content value. Handles both shapes the content
   * files use: { en, mr } objects, and plain strings that aren't translated.
   */
  const pick = useCallback(
    (value) => {
      if (value == null) return null;
      if (typeof value === 'string') return value;
      return value[lang] ?? value.en ?? value.mr ?? null;
    },
    [lang]
  );

  const value = useMemo(
    () => ({ lang, setLang, t, pick, isMr: lang === 'mr' }),
    [lang, t, pick]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used inside <LanguageProvider>');
  return ctx;
}
