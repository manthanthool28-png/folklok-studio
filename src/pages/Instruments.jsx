import { useState } from 'react';
import instruments from '../content/instruments.json';
import { PageHeader } from '../components/PageHeader';
import { Reveal } from '../components/Reveal';
import { GlassCard, GlassLayer } from '../components/Glass';
import { InstrumentCard } from '../components/InstrumentCard';
import { ScatteredInstruments } from '../components/ScatteredInstruments';
import { artFor } from '../components/InstrumentArt';
import { useSound } from '../lib/sound';
import { useLang } from '../lib/lang';
import { photoByPrefix } from '../lib/photos';

function InstrumentTile({ item, index, onOpen }) {
  const Art = artFor(item.slug);
  const { play } = useSound();
  const { t, pick } = useLang();
  const [struck, setStruck] = useState(0);

  const photo = item.image ?? photoByPrefix(`instrument-${item.slug}-`)?.src ?? null;
  const role = pick(item.role);

  // Striking and opening are separate actions on the same tile: the drawing
  // plays, the rest of the card opens the detail. Otherwise you can't hear an
  // instrument without a modal appearing over it.
  const strike = (e) => {
    e.stopPropagation();
    play(item.slug, item.audio);
    setStruck((n) => n + 1);
  };

  return (
    <Reveal delay={(index % 3) * 90}>
      <GlassCard tone="light" tilt spotlight className="group flex h-full flex-col overflow-hidden">
        <GlassLayer className="flex flex-1 flex-col p-7">
          <button
            type="button"
            onClick={strike}
            aria-label={`${item.en} — ${t('instruments.tapToPlay')}`}
            className="relative mx-auto block w-32 shrink-0 sm:w-40"
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
            <p className="font-display text-2xl text-marigold">{item.mr}</p>
            <h2 className="mt-0.5 font-display text-xl text-espresso">{item.en}</h2>
          </div>

          <p className="mt-3 flex-1 text-center font-body text-sm text-espresso/70">
            {role ?? (
              <span className="font-600 uppercase tracking-[0.12em] text-terracotta">
                {t('instruments.tapToPlay')}
              </span>
            )}
          </p>

          <div className="mt-5 flex justify-center gap-2">
            <button
              type="button"
              onClick={strike}
              className="rounded-full border border-espresso/20 px-4 py-2 font-body text-sm font-600
                text-espresso transition-colors hover:border-marigold hover:bg-marigold"
            >
              ♪
              <span className="sr-only">{t('instruments.tapToPlay')}</span>
            </button>
            <button
              type="button"
              onClick={() => onOpen(item)}
              className="rounded-full bg-espresso px-5 py-2 font-body text-sm font-600 text-cream
                transition-colors hover:bg-espresso-light"
            >
              {t('instruments.aboutThis')}
            </button>
          </div>

          {!item.confirmed && (
            <span
              data-needed
              className="mt-4 self-center rounded-full border border-dashed border-terracotta/60 px-2.5 py-1
                font-body text-[0.6rem] font-600 uppercase tracking-[0.12em] text-terracotta"
            >
              {t('instruments.unconfirmed')}
            </span>
          )}
        </GlassLayer>
      </GlassCard>
    </Reveal>
  );
}

export function Instruments() {
  const { t } = useLang();
  const [open, setOpen] = useState(null);
  const items = instruments.items;
  const unconfirmed = items.filter((i) => !i.confirmed).length;

  return (
    <>
      <PageHeader mr="वाद्ये" en={t('nav.instruments')} lead={t('instruments.lead')} />

      <section className="texture-cloth relative overflow-hidden">
        <ScatteredInstruments preset="cool" tone="light" />

        <div className="relative mx-auto max-w-7xl px-5 py-18 sm:px-8">
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
                  {unconfirmed} of these came from the brief's suggested list, not from you. The
                  performance photos show guitar, bass, keyboard, flute, tabla, dholki and harmonium —
                  not ektara or tuntune. Edit{' '}
                  <code className="rounded bg-espresso/8 px-1.5 py-0.5 text-sm">
                    src/content/instruments.json
                  </code>{' '}
                  and set <code className="rounded bg-espresso/8 px-1.5 py-0.5 text-sm">confirmed: true</code>{' '}
                  to clear the badges.
                </p>
              </div>
            </Reveal>
          )}

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, i) => (
              <InstrumentTile key={item.slug} item={item} index={i} onOpen={setOpen} />
            ))}
          </div>
        </div>
      </section>

      {open && <InstrumentCard item={open} onClose={() => setOpen(null)} />}
    </>
  );
}
