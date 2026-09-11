import { useLang } from '../lib/lang';
import { useSound } from '../lib/sound';

const LANGS = [
  { code: 'en', label: 'EN', full: 'English' },
  { code: 'mr', label: 'मर', full: 'मराठी' },
];

function SpeakerIcon({ muted, ...p }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
      <path d="M11 5L6 9H3v6h3l5 4z" />
      {muted ? (
        <path d="M16 9l5 6M21 9l-5 6" />
      ) : (
        <>
          <path d="M15.5 8.5a5 5 0 010 7" />
          <path d="M18.5 6a9 9 0 010 12" />
        </>
      )}
    </svg>
  );
}

/**
 * A fixed rail down the right edge: language, and a mute for the instrument
 * sounds. Vertical and narrow so it stays out of the way of the content, and
 * it drops to a compact bar at the bottom on phones, where a side rail would
 * sit under the thumb.
 */
export function LanguageRail() {
  const { lang, setLang, t } = useLang();
  const { muted, toggle } = useSound();

  return (
    <div
      className="glass glass-nav fixed right-3 top-1/2 z-50 hidden -translate-y-1/2 flex-col
        items-center gap-1 rounded-full p-1.5 sm:flex"
      role="group"
      aria-label={t('common.language')}
    >
      {LANGS.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => setLang(l.code)}
          aria-pressed={lang === l.code}
          title={l.full}
          className={`flex h-10 w-10 items-center justify-center rounded-full font-display text-sm
            transition-all duration-300 ${
              lang === l.code
                ? 'bg-marigold text-espresso shadow-[0_4px_14px_rgba(245,183,0,0.4)]'
                : 'text-cream/70 hover:bg-cream/10 hover:text-cream'
            }`}
        >
          {l.label}
        </button>
      ))}

      <span aria-hidden="true" className="my-0.5 h-px w-6 bg-cream/20" />

      <button
        type="button"
        onClick={toggle}
        aria-pressed={muted}
        title={muted ? t('common.soundOff') : t('common.soundOn')}
        className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-300 ${
          muted ? 'text-cream/40 hover:text-cream/70' : 'text-marigold hover:bg-cream/10'
        }`}
      >
        <SpeakerIcon muted={muted} className="h-5 w-5" />
        <span className="sr-only">{muted ? t('common.soundOff') : t('common.soundOn')}</span>
      </button>
    </div>
  );
}

/** Phone version — a small bar above the thumb zone rather than a side rail. */
export function LanguageBar() {
  const { lang, setLang, t } = useLang();
  const { muted, toggle } = useSound();

  return (
    <div
      className="glass glass-nav fixed bottom-3 left-1/2 z-50 flex -translate-x-1/2 items-center
        gap-1 rounded-full p-1.5 sm:hidden"
      role="group"
      aria-label={t('common.language')}
    >
      {LANGS.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => setLang(l.code)}
          aria-pressed={lang === l.code}
          className={`rounded-full px-4 py-2 font-display text-sm transition-all duration-300 ${
            lang === l.code ? 'bg-marigold text-espresso' : 'text-cream/70'
          }`}
        >
          {l.full}
        </button>
      ))}
      <span aria-hidden="true" className="mx-0.5 h-6 w-px bg-cream/20" />
      <button
        type="button"
        onClick={toggle}
        aria-pressed={muted}
        className={`flex h-10 w-10 items-center justify-center rounded-full ${
          muted ? 'text-cream/40' : 'text-marigold'
        }`}
      >
        <SpeakerIcon muted={muted} className="h-5 w-5" />
        <span className="sr-only">{muted ? t('common.soundOff') : t('common.soundOn')}</span>
      </button>
    </div>
  );
}
