import { useEffect, useRef, useState } from 'react';
import { artFor } from './InstrumentArt';
import { GlassCard } from './Glass';
import { Needed } from './Needed';
import { useSound } from '../lib/sound';
import { useLang } from '../lib/lang';
import { photoByPrefix } from '../lib/photos';

/**
 * The play card. Both languages sit side by side here rather than switching
 * with the rail — on a page about Marathi folk instruments, seeing the
 * Devanagari and the English together is the point, and someone reading one
 * usually wants the other to hand.
 */
export function InstrumentCard({ item, onClose }) {
  const Art = artFor(item.slug);
  const { play } = useSound();
  const { t } = useLang();
  const [struck, setStruck] = useState(0);
  const dialogRef = useRef(null);
  const closeRef = useRef(null);

  const photo = item.image ?? photoByPrefix(`instrument-${item.slug}-`)?.src ?? null;

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
            aria-label={t('instruments.close')}
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
            aria-label={t('instruments.tapToPlay')}
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
            <p className="font-display text-4xl text-marigold">{item.mr}</p>
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
              {struck ? t('instruments.playAgain') : t('instruments.tapToPlay')}
            </button>
          </div>

          {/* Both languages, always — that is the point of this card. */}
          <div className="mt-8 grid gap-6 border-t border-espresso/12 pt-7 sm:grid-cols-2">
            {[
              { code: 'mr', heading: 'मराठी', body: item.role?.mr, extra: item.history?.mr },
              { code: 'en', heading: 'English', body: item.role?.en, extra: item.history?.en },
            ].map((col) => (
              <div key={col.code} lang={col.code}>
                <p className="font-body text-[0.68rem] font-600 uppercase tracking-[0.18em] text-terracotta">
                  {col.heading}
                </p>
                <div className="mt-2 font-body text-espresso/80">
                  {col.body ?? (
                    <Needed>{col.code === 'mr' ? 'मराठी माहिती' : 'English description'}</Needed>
                  )}
                </div>
                {col.extra && <p className="mt-3 font-body text-espresso/70">{col.extra}</p>}
              </div>
            ))}
          </div>

          {!item.confirmed && (
            <p
              data-needed
              className="mt-7 rounded-2xl border border-dashed border-terracotta/45 bg-terracotta/7 p-4
                text-center font-body text-sm text-espresso/70"
            >
              Not yet confirmed as an instrument Folklok plays — set{' '}
              <code className="rounded bg-espresso/8 px-1.5 py-0.5">confirmed: true</code> in
              instruments.json.
            </p>
          )}

          {!item.audio && (
            <p className="mt-4 text-center font-body text-xs text-espresso/45">
              Sound is synthesised — add an <code>audio</code> path for a real recording.
            </p>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
