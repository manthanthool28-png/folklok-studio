import { useState } from 'react';
import beatsContent from '../content/beats.json';
import instruments from '../content/instruments.json';
import { artFor } from './InstrumentArt';
import { GlassCard } from './Glass';
import { useSound } from '../lib/sound';
import { useBeatMachine } from '../lib/beat';

const BEATS = beatsContent.beats;
const BY_SLUG = Object.fromEntries(instruments.items.map((i) => [i.slug, i]));

function nameOf(slug) {
  return BY_SLUG[slug] ?? { mr: slug, en: slug, audio: null };
}

/** One cell of the grid: silent, stroke, or accent. */
function Cell({ value, active, onClick, label }) {
  const look =
    value === 2
      ? 'bg-marigold border-marigold'
      : value === 1
        ? 'bg-marigold/40 border-marigold/50'
        : 'border-cream/15 hover:border-cream/45';

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`h-8 w-7 shrink-0 rounded-md border transition-all duration-150 sm:h-9 sm:w-8 ${look} ${
        active ? 'scale-110 ring-2 ring-cream/70' : ''
      }`}
    />
  );
}

export function BeatMachine() {
  const [beat, setBeat] = useState(BEATS[0]);
  const { muted, play } = useSound();
  const machine = useBeatMachine(beat, { muted });
  const { lanes, steps, bpm, setBpm, playing, step, toggle, cycleCell, clear, reset, edited } = machine;

  return (
    <GlassCard tone="dark" spotlight={false} className="overflow-hidden">
      <div className="p-6 sm:p-9">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-display text-xl text-marigold" lang="mr">ठेका</p>
            <h2 className="mt-0.5 font-display text-3xl text-cream sm:text-4xl">Play a beat</h2>
          </div>
          <p className="max-w-sm font-body text-sm text-cream/55">
            Pick a cycle, press play, then change it. Every square is a stroke — tap once for a
            stroke, twice for the accent, three times to silence it.
          </p>
        </div>

        {/* Which cycle */}
        <div className="mt-7 flex flex-wrap gap-2">
          {BEATS.map((b) => (
            <button
              key={b.slug}
              type="button"
              onClick={() => setBeat(b)}
              aria-pressed={b.slug === beat.slug}
              className={`rounded-full px-4 py-2 font-body text-sm transition-colors ${
                b.slug === beat.slug
                  ? 'bg-marigold font-600 text-espresso'
                  : 'border border-cream/20 text-cream/75 hover:border-marigold hover:text-marigold'
              }`}
            >
              <span lang="mr">{b.mr}</span>
              <span className="ml-2 text-cream/40">{b.matra}</span>
            </button>
          ))}
        </div>

        <p className="mt-5 font-body text-cream/70">{beat.note.en}</p>
        <p className="mt-1 font-body text-sm text-cream/45" lang="mr">{beat.note.mr}</p>

        {/* Transport */}
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={toggle}
            className="inline-flex items-center gap-2 rounded-full bg-marigold px-6 py-3 font-body
              font-600 text-espresso transition-colors hover:bg-marigold-light"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-espresso" aria-hidden="true">
              {playing ? <path d="M7 5h4v14H7zM13 5h4v14h-4z" /> : <path d="M8 5v14l11-7z" />}
            </svg>
            {playing ? 'Stop' : 'Play'}
          </button>

          <label className="flex items-center gap-3 font-body text-sm text-cream/60">
            <span className="whitespace-nowrap">{bpm} मात्रा/min</span>
            <input
              type="range"
              min="50"
              max="190"
              value={bpm}
              onChange={(e) => setBpm(Number(e.target.value))}
              aria-label="Tempo in matras per minute"
              className="h-1 w-32 cursor-pointer appearance-none rounded-full bg-cream/20 accent-marigold sm:w-44"
            />
          </label>

          <button
            type="button"
            onClick={clear}
            className="rounded-full border border-cream/20 px-4 py-2 font-body text-sm text-cream/70
              transition-colors hover:border-cream/50 hover:text-cream"
          >
            Clear
          </button>
          {edited && (
            <button
              type="button"
              onClick={reset}
              className="rounded-full border border-cream/20 px-4 py-2 font-body text-sm text-cream/70
                transition-colors hover:border-cream/50 hover:text-cream"
            >
              Back to the {beat.en} pattern
            </button>
          )}
        </div>

        {/* The grid. Sixteen columns will not fit a phone, so it scrolls. */}
        <div className="-mx-6 mt-7 overflow-x-auto px-6 sm:-mx-9 sm:px-9">
          <div className="min-w-max">
            <div className="mb-2 flex gap-1.5 pl-[8.5rem]">
              {Array.from({ length: steps }, (_, i) => (
                <span
                  key={i}
                  className={`w-7 shrink-0 text-center font-body text-[0.62rem] sm:w-8 ${
                    i === step ? 'text-marigold' : 'text-cream/30'
                  }`}
                >
                  {i % 2 === 0 ? i / 2 + 1 : ''}
                </span>
              ))}
            </div>

            {Object.entries(lanes).map(([slug, row]) => {
              const item = nameOf(slug);
              const Art = artFor(slug);
              return (
                <div key={slug} className="mb-1.5 flex items-center gap-1.5">
                  {/* The label is also the tap pad: hit along while it runs. */}
                  <button
                    type="button"
                    onClick={() => play(slug, item.audio)}
                    className="group flex shrink-0 items-center gap-2 rounded-lg py-1 pr-2 text-left
                      transition-colors hover:bg-cream/8"
                    style={{ width: '8.5rem' }}
                  >
                    <Art stroke="var(--color-marigold)" width={2} className="h-6 w-8 shrink-0 opacity-70" />
                    <span className="truncate">
                      <span className="block font-display text-sm leading-tight text-cream" lang="mr">
                        {item.mr}
                      </span>
                      <span className="block font-body text-[0.6rem] uppercase tracking-[0.1em] text-cream/40">
                        {item.en}
                      </span>
                    </span>
                  </button>

                  {row.map((value, i) => (
                    <Cell
                      key={i}
                      value={value}
                      active={i === step}
                      onClick={() => cycleCell(slug, i)}
                      label={`${item.en}, matra ${Math.floor(i / 2) + 1}${i % 2 ? ' and a half' : ''}`}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        <p className="mt-6 font-body text-xs text-cream/40">
          {muted
            ? 'Sound is muted — the cursor still runs. Unmute from the speaker button.'
            : 'Sounds are synthesised, not recordings.'}{' '}
          The matra counts are as documented; the grids are simplified skeletons, and a player
          should correct them in{' '}
          <code className="rounded bg-cream/10 px-1.5 py-0.5">src/content/beats.json</code>.
        </p>
      </div>
    </GlassCard>
  );
}
