import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { playInstrumentOrClip } from './instrumentSynth';

const SoundContext = createContext(null);
const STORAGE_KEY = 'folklok:muted';

/**
 * Sound is on by default but never plays unaided — every sound on this site is
 * the direct result of someone clicking an instrument. The preference is
 * remembered so anyone who mutes it stays muted.
 */
export function SoundProvider({ children }) {
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    try {
      setMuted(localStorage.getItem(STORAGE_KEY) === '1');
    } catch {
      /* no stored preference */
    }
  }, []);

  const toggle = useCallback(() => {
    setMuted((m) => {
      const next = !m;
      try {
        localStorage.setItem(STORAGE_KEY, next ? '1' : '0');
      } catch {
        /* preference just won't persist */
      }
      return next;
    });
  }, []);

  const play = useCallback(
    (slug, audioPath) => playInstrumentOrClip(slug, audioPath, { muted }),
    [muted]
  );

  const value = useMemo(() => ({ muted, toggle, play }), [muted, toggle, play]);
  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export function useSound() {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error('useSound must be used inside <SoundProvider>');
  return ctx;
}
