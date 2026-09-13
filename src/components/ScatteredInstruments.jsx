import { useState } from 'react';
import { artFor } from './InstrumentArt';
import { useSound } from '../lib/sound';

/**
 * Small instruments tucked into the corners of a section. They are decoration
 * first — low-contrast, behind the content — but every one is playable, so
 * poking around the page is rewarded rather than inert.
 *
 * Deliberately few per section. These are real focusable buttons so they can be
 * found by keyboard, and twenty of them would wreck the tab order.
 */
const PRESETS = {
  warm: [
    { slug: 'dholki', top: '8%', left: '4%', size: 108, rotate: -14 },
    { slug: 'taal', top: '62%', left: '90%', size: 84, rotate: 12 },
    { slug: 'bansuri', top: '84%', left: '12%', size: 128, rotate: 6 },
  ],
  cool: [
    { slug: 'tabla', top: '14%', left: '88%', size: 112, rotate: 10 },
    { slug: 'peti', top: '74%', left: '6%', size: 120, rotate: -8 },
    { slug: 'ektari', top: '40%', left: '94%', size: 78, rotate: 16 },
  ],
  sparse: [
    { slug: 'dhol', top: '20%', left: '92%', size: 96, rotate: -10 },
    { slug: 'tuntune', top: '70%', left: '5%', size: 82, rotate: 14 },
  ],
  reeds: [
    { slug: 'sanai', top: '10%', left: '91%', size: 72, rotate: 12 },
    { slug: 'tarpa', top: '66%', left: '4%', size: 88, rotate: -9 },
    { slug: 'lezim', top: '88%', left: '86%', size: 104, rotate: 7 },
  ],
  march: [
    { slug: 'tasha', top: '12%', left: '6%', size: 96, rotate: -11 },
    { slug: 'tutari', top: '72%', left: '89%', size: 118, rotate: 8 },
    { slug: 'halgi', top: '46%', left: '3%', size: 86, rotate: 14 },
  ],
};

function Toy({ spec, tone }) {
  const Art = artFor(spec.slug);
  const { play } = useSound();
  const [struck, setStruck] = useState(0);

  const color = tone === 'dark' ? 'var(--color-marigold)' : 'var(--color-espresso)';

  return (
    <button
      type="button"
      onClick={() => {
        play(spec.slug);
        setStruck((n) => n + 1);
      }}
      aria-label={`${spec.slug} — tap to play`}
      className="toy pointer-events-auto absolute"
      style={{
        top: spec.top,
        left: spec.left,
        width: spec.size,
        '--toy-rotate': `${spec.rotate}deg`,
      }}
    >
      <Art
        key={struck}
        stroke={color}
        width={2}
        className={`h-auto w-full ${struck ? 'toy-struck' : ''}`}
      />
    </button>
  );
}

export function ScatteredInstruments({ preset = 'warm', tone = 'light', className = '' }) {
  const specs = PRESETS[preset] ?? PRESETS.warm;

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${
        tone === 'dark' ? 'opacity-[0.13]' : 'opacity-[0.09]'
      } ${className}`}
    >
      {specs.map((spec) => (
        <Toy key={spec.slug + spec.top} spec={spec} tone={tone} />
      ))}
    </div>
  );
}
