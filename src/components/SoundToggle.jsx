import { useSound } from '../lib/sound';

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
 * One fixed control, because the instruments are clickable on every page and
 * someone in a quiet room needs a way to stop them. Bottom-left: bottom-right
 * is where a phone's back gesture and most floating buttons live.
 */
export function SoundToggle() {
  const { muted, toggle } = useSound();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={muted}
      title={muted ? 'Instrument sounds are off' : 'Instrument sounds are on'}
      className="glass glass-nav fixed bottom-4 left-4 z-50 flex h-11 w-11 items-center justify-center
        rounded-full text-cream/70 transition-colors hover:text-marigold"
    >
      <SpeakerIcon muted={muted} className="h-5 w-5" />
      <span className="sr-only">{muted ? 'Turn instrument sounds on' : 'Turn instrument sounds off'}</span>
    </button>
  );
}
