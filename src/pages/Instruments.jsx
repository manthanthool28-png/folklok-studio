import { useState } from 'react';
import instruments from '../content/instruments.json';
import { PageHeader } from '../components/PageHeader';
import { Reveal } from '../components/Reveal';
import { Divider } from '../components/Divider';
import { GlassCard, GlassLayer } from '../components/Glass';
import { InstrumentCard } from '../components/InstrumentCard';
import { ScatteredInstruments } from '../components/ScatteredInstruments';
import { BeatMachine } from '../components/BeatMachine';
import { artFor } from '../components/InstrumentArt';
import { useSound } from '../lib/sound';
import { photoByPrefix } from '../lib/photos';

const FAMILY_ORDER = ['percussion', 'idiophone', 'string', 'wind'];

function InstrumentTile({ item, index, onOpen }) {
  const Art = artFor(item.slug);
  const { play } = useSound();
  const [struck, setStruck] = useState(0);

  const photo = item.image ?? photoByPrefix(`instrument-${item.slug}-`)?.src ?? null;

  // Striking and opening are separate actions on the same tile: the drawing
  // plays, the button opens the detail. Otherwise you can't hear an instrument
  // without a modal appearing over it.
  const strike = (e) => {
    e.stopPropagation();
    play(item.slug, item.audio);
    setStruck((n) => n + 1);
  };

  return (
    <Reveal delay={(index % 3) * 80}>
      <GlassCard tone="light" tilt spotlight className="group flex h-full flex-col overflow-hidden">
        <GlassLayer className="flex flex-1 flex-col p-7">
          <button
            type="button"
            onClick={strike}
            aria-label={`Play the ${item.en}`}
            className="relative mx-auto block w-28 shrink-0 sm:w-36"
          >
            {photo ? (
              <img
                src={photo}
                alt={item.en}
                loading="lazy"
                decoding="async"
                className="aspect-square w-full rounded-2xl object-cover"
              />
            ) : (
              <Art
                key={struck}
                stroke="var(--color-espresso)"
                width={2}
                className={`h-auto w-full transition-transform duration-500 group-hover:scale-105 ${
                  struck ? 'toy-struck' : ''
                }`}
              />
            )}
          </button>

          <div className="mt-5 text-center">
            <p className="font-display text-2xl text-marigold" lang="mr">{item.mr}</p>
            <h2 className="mt-0.5 font-display text-xl text-espresso">{item.en}</h2>
          </div>

          <p className="mt-3 flex-1 text-center font-body text-sm text-espresso/70">{item.role.en}</p>

          <div className="mt-5 flex justify-center gap-2">
            <button
              type="button"
              onClick={strike}
              className="rounded-full border border-espresso/20 px-4 py-2 font-body text-sm font-600
                text-espresso transition-colors hover:border-marigold hover:bg-marigold"
            >
              ♪<span className="sr-only">Play the {item.en}</span>
            </button>
            <button
              type="button"
              onClick={() => onOpen(item)}
              className="rounded-full bg-espresso px-5 py-2 font-body text-sm font-600 text-cream
                transition-colors hover:bg-espresso-light"
            >
              मराठी / English
            </button>
          </div>
        </GlassLayer>
      </GlassCard>
    </Reveal>
  );
}

export function Instruments() {
  const [open, setOpen] = useState(null);
  const items = instruments.items;
  const families = instruments.families;
  const ours = items.filter((i) => i.played).length;

  return (
    <>
      <PageHeader
        mr="वाद्ये"
        en="Instruments"
        lead="The folk instruments of Maharashtra — what each one is made of, who plays it and where you hear it. Tap any of them."
      />

      <section className="texture-cloth relative overflow-hidden">
        <ScatteredInstruments preset="cool" tone="light" />

        <div className="relative mx-auto max-w-7xl px-5 py-18 sm:px-8">
          <Reveal>
            <BeatMachine />
          </Reveal>

          <Divider />

          {ours === 0 && (
            <Reveal className="mb-12">
              <div
                data-needed
                className="rounded-3xl border border-dashed border-terracotta/45 bg-terracotta/7 p-7 backdrop-blur-md"
              >
                <p className="font-body text-[0.72rem] font-600 uppercase tracking-[0.14em] text-terracotta">
                  Which of these does Folklok play?
                </p>
                <p className="mt-2 font-body text-espresso/75">
                  The descriptions below are researched and sourced — each card links to where it
                  came from. What isn't known is which of them are yours. Set{' '}
                  <code className="rounded bg-espresso/8 px-1.5 py-0.5 text-sm">"played": true</code>{' '}
                  on the ones you actually use in{' '}
                  <code className="rounded bg-espresso/8 px-1.5 py-0.5 text-sm">
                    src/content/instruments.json
                  </code>{' '}
                  and they'll be marked as Folklok's.
                </p>
              </div>
            </Reveal>
          )}

          {FAMILY_ORDER.map((family) => {
            const group = items.filter((i) => i.family === family);
            if (!group.length) return null;
            return (
              <div key={family} className="mb-16 last:mb-0">
                <Reveal>
                  <div className="mb-7 flex items-baseline gap-3">
                    <h2 className="font-display text-2xl text-espresso sm:text-3xl">
                      {families[family].en}
                    </h2>
                    <p className="font-display text-lg text-terracotta" lang="mr">
                      {families[family].mr}
                    </p>
                    <span className="font-body text-xs text-espresso/35">{group.length}</span>
                  </div>
                </Reveal>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {group.map((item, i) => (
                    <InstrumentTile key={item.slug} item={item} index={i} onOpen={setOpen} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {open && <InstrumentCard item={open} onClose={() => setOpen(null)} />}
    </>
  );
}
