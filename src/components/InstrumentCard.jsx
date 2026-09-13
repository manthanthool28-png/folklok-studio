import { useCallback, useEffect, useRef, useState } from 'react';
import { artFor } from './InstrumentArt';
import { GlassCard } from './Glass';
import { useSound } from '../lib/sound';
import { photoByPrefix } from '../lib/photos';

const STORAGE_KEY = 'folklok:cardLang';

const MODES = [
  { code: 'mr', label: 'मराठी' },
  { code: 'en', label: 'English' },
  { code: 'both', label: 'दोन्ही · Both' },
];

/**
 * The card's own language switch, and the only one on the site — the rest of
 * the interface is in English. Read synchronously on the first render and
 * written only on an explicit choice: persisting from an effect races the
 * initial value and silently resets the preference.
 */
function useCardLang() {
  const [mode, setMode] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return MODES.some((m) => m.code === saved) ? saved : 'both';
    } catch {
      return 'both';
    }
  });

  const choose = useCallback((next) => {
    setMode(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* preference just won't persist — the card still works */
    }
  }, []);

  return [mode, choose];
}

function Column({ code, item }) {
  const heading = code === 'mr' ? 'मराठी' : 'English';
  return (
    <div lang={code}>
      <p className="font-body text-[0.68rem] font-600 uppercase tracking-[0.18em] text-terracotta">
        {heading}
      </p>
      <p className="mt-2.5 font-body text-espresso/85">{item.role[code]}</p>
      <p className="mt-3 font-body text-sm leading-relaxed text-espresso/65">{item.history[code]}</p>
    </div>
  );
}

/**
 * The play card. One instrument, its sound, and what it actually is — in
 * Marathi and English, with the switch at the bottom of the card.
 */
export function InstrumentCard({ item, onClose }) {
  const Art = artFor(item.slug);
  const { play } = useSound();
  const [mode, setMode] = useCardLang();
  const [struck, setStruck] = useState(0);
  const dialogRef = useRef(null);
  const closeRef = useRef(null);

  const photo = item.image ?? photoByPrefix(`instrument-${item.slug}-`)?.src ?? null;
  const columns = mode === 'both' ? ['mr', 'en'] : [mode];

  // Focus moves into the dialog on open and Escape closes it — a modal you
  // can't leave by keyboard is a trap.
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll(
          'button, a[href], [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const strike = () => {
    play(item.slug, item.audio);
    setStruck((n) => n + 1);
  };

  return (
    <div
      className="fixed inset-0 z-70 flex items-end justify-center bg-ink/70 p-0 backdrop-blur-md sm:items-center sm:p-6"
      onClick={onClose}
    >
      <GlassCard
        tone="light"
        spotlight={false}
        as="div"
        role="dialog"
        aria-modal="true"
        aria-label={`${item.en} — ${item.mr}`}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-b-none sm:rounded-b-3xl"
        style={{ animation: 'card-in 0.45s var(--ease-spring) both' }}
      >
        <div ref={dialogRef} className="relative p-7 sm:p-9">
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full
              text-espresso/60 transition-colors hover:bg-espresso/8 hover:text-espresso"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          {/* Strike the instrument itself, not just a button beside it. */}
          <button
            type="button"
            onClick={strike}
            aria-label={`Play the ${item.en}`}
            className="mx-auto block w-44 sm:w-56"
          >
            {photo ? (
              <img src={photo} alt={item.en} className="w-full rounded-2xl object-cover" />
            ) : (
              <Art
                key={struck}
                stroke="var(--color-espresso)"
                width={2}
                className={`h-auto w-full ${struck ? 'toy-struck' : ''}`}
              />
            )}
          </button>

          <div className="mt-6 text-center">
            <p className="font-display text-4xl text-marigold" lang="mr">{item.mr}</p>
            <h2 className="mt-1 font-display text-2xl text-espresso">{item.en}</h2>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={strike}
              className="inline-flex items-center gap-2 rounded-full bg-espresso px-6 py-3 font-body
                text-sm font-600 text-cream shadow-lg shadow-espresso/20 transition-all duration-300
                hover:bg-espresso-light hover:shadow-xl"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-marigold" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
              {struck ? 'Play again' : 'Tap to play'}
            </button>
          </div>

          <div
            className={`mt-8 grid gap-7 border-t border-espresso/12 pt-7 ${
              columns.length > 1 ? 'sm:grid-cols-2' : ''
            }`}
          >
            {columns.map((code) => (
              <Column key={code} code={code} item={item} />
            ))}
          </div>

          {/* The language switch lives with the text it changes. */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
            <span className="mr-1 font-body text-[0.66rem] font-600 uppercase tracking-[0.16em] text-espresso/40">
              भाषा / Language
            </span>
            {MODES.map((m) => (
              <button
                key={m.code}
                type="button"
                onClick={() => setMode(m.code)}
                aria-pressed={mode === m.code}
                className={`rounded-full px-3.5 py-1.5 font-body text-sm transition-colors ${
                  mode === m.code
                    ? 'bg-espresso font-600 text-cream'
                    : 'border border-espresso/20 text-espresso/70 hover:border-marigold hover:bg-marigold/20'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <p className="mt-7 border-t border-espresso/10 pt-5 text-center font-body text-xs text-espresso/45">
            {item.audio ? 'Recording' : 'Sound is synthesised'} · Description from{' '}
            <a
              href={item.source}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-espresso/25 underline-offset-2 hover:text-espresso"
            >
              this source
            </a>
            {item.played == null && ' · Not yet confirmed as one Folklok plays'}
          </p>
        </div>
      </GlassCard>
    </div>
  );
}
