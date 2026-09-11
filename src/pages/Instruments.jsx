import { useState } from 'react';
import instruments from '../content/instruments.json';
import { PageHeader } from '../components/PageHeader';
import { Reveal } from '../components/Reveal';
import { Needed, NeededBox } from '../components/Needed';
import { SwirlCurl } from '../components/Swirl';
import { GlassCard, GlassLayer } from '../components/Glass';
import { photoByPrefix } from '../lib/photos';

function InstrumentCard({ item, index }) {
  const [playing, setPlaying] = useState(false);
  const photo = item.image ?? photoByPrefix(`instrument-${item.slug}-`)?.src ?? null;

  return (
    <Reveal delay={(index % 3) * 90}>
      <GlassCard tone="light" tilt spotlight className="group flex h-full flex-col overflow-hidden">
        <div className="relative">
          {photo ? (
            <img
              src={photo}
              alt={`${item.en} (${item.mr})`}
              loading="lazy"
              decoding="async"
              className="aspect-[4/3] w-full object-cover"
            />
          ) : (
            <NeededBox className="rounded-none border-0 border-b">
              Photo or illustration of the {item.en}
            </NeededBox>
          )}

          {!item.confirmed && (
            <span
              data-needed
              title="This instrument has not been confirmed as one you play"
              className="absolute right-3 top-3 rounded-full border border-dashed border-terracotta bg-cream/95 px-2.5 py-1 font-body text-[0.62rem] font-600 uppercase tracking-[0.12em] text-terracotta"
            >
              Unconfirmed
            </span>
          )}
        </div>

        <GlassLayer className="flex flex-1 flex-col p-6">
          <p className="font-display text-2xl text-marigold">{item.mr}</p>
          <h2 className="mt-0.5 font-display text-xl text-espresso">{item.en}</h2>

          <div className="mt-3 flex-1 font-body text-espresso/70">
            {item.role ? <p>{item.role}</p> : <Needed>Its role in folk music</Needed>}
          </div>

          {item.audio ? (
            <>
              <button
                type="button"
                onClick={() => setPlaying((v) => !v)}
                aria-pressed={playing}
                className="mt-5 self-start rounded-full bg-espresso px-5 py-2.5 font-body text-sm font-600 text-cream shadow-lg shadow-espresso/20 transition-all duration-300 hover:bg-espresso-light hover:shadow-xl"
              >
                {playing ? 'Stop' : `Hear the ${item.en}`}
              </button>
              {playing && (
                <audio
                  src={item.audio}
                  autoPlay
                  onEnded={() => setPlaying(false)}
                  className="mt-3 w-full"
                  controls
                />
              )}
            </>
          ) : (
            <p className="mt-5">
              <Needed>Audio clip</Needed>
            </p>
          )}
        </GlassLayer>
      </GlassCard>
    </Reveal>
  );
}

export function Instruments() {
  const items = instruments.items;
  const unconfirmed = items.filter((i) => !i.confirmed).length;

  return (
    <>
      <PageHeader
        mr="वाद्ये"
        en="Instruments"
        lead="Every song starts with a piece of wood, skin or brass. These are the voices Folklok plays through."
      />

      <section className="texture-cloth relative overflow-hidden">
        <SwirlCurl
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-24 h-80 w-80 opacity-[0.05]"
          color="var(--color-espresso)"
        />

        <div className="mx-auto max-w-7xl px-5 py-18 sm:px-8">
          {unconfirmed > 0 && (
            <Reveal className="mb-10">
              <div
                data-needed
                className="rounded-3xl border border-dashed border-terracotta/45 bg-terracotta/7 p-7 backdrop-blur-md"
              >
                <p className="font-body text-[0.72rem] font-600 uppercase tracking-[0.14em] text-terracotta">
                  Confirm this list
                </p>
                <p className="mt-2 font-body text-espresso/75">
                  All {unconfirmed} instruments below came from the brief's
                  suggested list, not from you — none are confirmed as instruments
                  Folklok actually plays. Edit{' '}
                  <code className="rounded bg-espresso/8 px-1.5 py-0.5 text-sm">
                    src/content/instruments.json
                  </code>
                  : remove any you don't play, add any missing, and set{' '}
                  <code className="rounded bg-espresso/8 px-1.5 py-0.5 text-sm">confirmed: true</code>{' '}
                  to clear the badge.
                </p>
              </div>
            </Reveal>
          )}

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, i) => (
              <InstrumentCard key={item.slug} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
