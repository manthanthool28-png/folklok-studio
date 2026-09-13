import { Link } from 'react-router-dom';
import site from '../content/site.json';
import instruments from '../content/instruments.json';
import wordmark from '../assets/folklok-wordmark.png';
import { Reveal } from '../components/Reveal';
import { Swirl } from '../components/Swirl';
import { Aurora } from '../components/Aurora';
import { Marquee } from '../components/Marquee';
import { GlassCard, GlassLayer } from '../components/Glass';
import { MagneticLink } from '../components/MagneticLink';
import { Socials } from '../components/Socials';
import { Needed, NeededBox } from '../components/Needed';
import { IconArrow, IconPin, IconSpotify } from '../components/Icons';
import { upcomingShows, latestVideo, formatShowDate } from '../lib/content';
import { useScrollY, useReducedMotion } from '../lib/interactions';
import { InfiniteStrip } from '../components/InfiniteStrip';
import { ScatteredInstruments } from '../components/ScatteredInstruments';
import { photoByPrefix, galleryPhotos } from '../lib/photos';

const TEASERS = [
  { to: '/instruments', mr: 'वाद्ये', en: 'Instruments', copy: 'Twenty of them — dholki, sambal, tarpa, tutari. Play each one, and a beat you can rebuild.' },
  { to: '/members', mr: 'सदस्य', en: 'Members', copy: 'The people who make up the collective.' },
  { to: '/music', mr: 'संगीत', en: 'Music & Releases', copy: 'Videos, singles and everything on Spotify.' },
  { to: '/shows', mr: 'कार्यक्रम', en: 'Shows', copy: 'Where to find us next, and everywhere we have played.' },
  { to: '/booking', mr: 'बुकिंग', en: 'Booking', copy: 'Bring Folklok to your stage, festival or celebration.' },
];

function Hero() {
  const y = useScrollY();
  const reduced = useReducedMotion();
  const hero = photoByPrefix('hero-') ?? photoByPrefix('live-');

  // Layers drift at different rates as you scroll, so the hero has depth
  // rather than sliding away as one flat sheet.
  const shift = (rate) => (reduced ? undefined : { transform: `translate3d(0, ${y * rate}px, 0)` });

  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-espresso px-5 py-32">
      {/* A real photograph reads better than any generated background, so the
          aurora steps back to a glow over it once one exists. */}
      {hero && (
        <div style={shift(0.22)} className="absolute inset-0">
          <img
            src={hero.src}
            alt=""
            aria-hidden="true"
            className="h-full w-full scale-110 object-cover"
          />
          {/* Scrim: the hero type has to stay legible over whatever the photo
              happens to be doing behind it. */}
          <div className="absolute inset-0 bg-espresso/72" />
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 75% 60% at 50% 45%, transparent, color-mix(in oklab, var(--color-ink) 82%, transparent))',
            }}
          />
        </div>
      )}

      <div style={shift(0.25)} className={`absolute inset-0 ${hero ? 'opacity-45' : ''}`}>
        <Aurora />
      </div>
      <div className="texture-grain absolute inset-0" />
      <ScatteredInstruments preset="warm" tone="dark" />

      <div className="relative mx-auto w-full max-w-3xl" style={shift(-0.12)}>
        <Reveal>
          <GlassCard
            tone="dark"
            spotlight
            className="px-6 py-12 text-center sm:px-12 sm:py-16"
          >
            <img
              src={wordmark}
              alt="Folklok"
              width="1782"
              height="919"
              fetchpriority="high"
              className="mx-auto w-full max-w-xs drop-shadow-[0_8px_32px_rgba(0,0,0,0.45)] sm:max-w-md"
            />

            <h1 className="mt-10 font-display text-2xl leading-snug text-cream sm:text-3xl md:text-[2.4rem]">
              {site.tagline.mr}
            </h1>
            <p className="mt-3 font-body text-sm italic text-marigold/90 sm:text-base">
              {site.tagline.en}
            </p>

            <Swirl className="mx-auto mt-8 h-8 w-56 opacity-80" color="var(--color-marigold)" width={2} />

            <div className="mt-7 font-body text-base text-cream/75 sm:text-lg">
              {site.intro ? (
                <p className="mx-auto max-w-xl">{site.intro}</p>
              ) : (
                <p>
                  <Needed>One-line description of Folklok</Needed>
                </p>
              )}
            </div>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <MagneticLink
                to="/music"
                className="rounded-full bg-marigold px-7 py-3.5 font-body font-600 text-espresso
                  shadow-[0_8px_28px_rgba(245,183,0,0.34)] transition-shadow duration-300
                  hover:shadow-[0_12px_38px_rgba(245,183,0,0.5)]"
              >
                Hear the music
                <IconArrow className="h-4.5 w-4.5" />
              </MagneticLink>
              <MagneticLink
                to="/booking"
                className="rounded-full border border-cream/30 px-7 py-3.5 font-body font-600 text-cream
                  transition-colors duration-300 hover:border-marigold hover:text-marigold"
              >
                Book us
              </MagneticLink>
            </div>

            <Socials className="mt-9 justify-center" />
          </GlassCard>
        </Reveal>
      </div>

      {/* Scroll cue */}
      <div
        aria-hidden="true"
        className="absolute bottom-7 left-1/2 -translate-x-1/2 text-cream/40"
        style={{ animation: 'float 2.6s ease-in-out infinite' }}
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="M12 5v14M6 13l6 6 6-6" />
        </svg>
      </div>
    </section>
  );
}

function Ticker() {
  const items = instruments.items.map((i) => ({ mr: i.mr, en: i.en }));
  return (
    <div className="relative border-y border-cream/10 bg-espresso-light py-5">
      <Marquee items={items} duration="38s" />
    </div>
  );
}

function Highlights() {
  const next = upcomingShows()[0];
  const video = latestVideo();
  const when = next ? formatShowDate(next) : null;
  const spotify = site.socials.find((s) => s.id === 'spotify')?.url;

  const cards = [
    {
      eyebrow: 'Latest release',
      title: video?.title ?? null,
      sub: video?.releaseDate ?? null,
      to: '/music',
      cta: 'Watch it',
      missing: 'Latest release',
    },
    {
      eyebrow: 'Next show',
      title: when?.full ?? null,
      sub: next ? `${next.venue}${next.city ? `, ${next.city}` : ''}` : null,
      icon: IconPin,
      to: '/shows',
      cta: 'All shows',
      missing: 'Next show',
    },
    {
      eyebrow: 'Listen',
      title: spotify ? 'On Spotify' : null,
      href: spotify,
      cta: 'Play now',
      icon: IconSpotify,
      missing: 'Spotify artist link',
    },
  ];

  return (
    <section className="texture-cloth relative bg-cream-deep py-16">
      <div className="mx-auto grid max-w-7xl gap-5 px-5 sm:px-8 md:grid-cols-3">
        {cards.map((c, i) => (
          <Reveal key={c.eyebrow} delay={i * 110}>
            <GlassCard tone="light" tilt spotlight className="h-full p-7">
              <GlassLayer>
                <p className="font-body text-[0.68rem] font-600 uppercase tracking-[0.18em] text-terracotta">
                  {c.eyebrow}
                </p>

                {c.title ? (
                  <>
                    <h2 className="mt-2 font-display text-2xl text-espresso">{c.title}</h2>
                    {c.sub && (
                      <p className="mt-1 flex items-center gap-1.5 font-body text-sm text-espresso/65">
                        {c.icon && <c.icon className="h-4 w-4 text-marigold" />}
                        {c.sub}
                      </p>
                    )}
                    {c.href ? (
                      <MagneticLink
                        href={c.href}
                        className="mt-4 rounded-full bg-espresso px-5 py-2.5 font-body text-sm font-600 text-cream"
                      >
                        {c.icon && <c.icon className="h-4 w-4" />}
                        {c.cta}
                      </MagneticLink>
                    ) : (
                      <Link
                        to={c.to}
                        className="mt-4 inline-flex items-center gap-1.5 font-body text-sm font-600 text-espresso
                          underline decoration-marigold decoration-2 underline-offset-4"
                      >
                        {c.cta} <IconArrow className="h-4 w-4" />
                      </Link>
                    )}
                  </>
                ) : (
                  <p className="mt-3">
                    <Needed>{c.missing}</Needed>
                  </p>
                )}
              </GlassLayer>
            </GlassCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Teasers() {
  const gallery = galleryPhotos();

  return (
    <section className="texture-cloth relative px-5 py-20 sm:px-8">
      <ScatteredInstruments preset="warm" tone="light" />
      <div className="relative mx-auto max-w-7xl">
      <Reveal className="text-center">
        <p className="font-display text-xl text-terracotta">फिरून बघा</p>
        <h2 className="mt-1 font-display text-3xl text-espresso sm:text-5xl">Explore Folklok</h2>
      </Reveal>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {TEASERS.map((item, i) => (
          <Reveal key={item.to} delay={i * 90}>
            <GlassCard
              tone="light"
              tilt
              spotlight
              as={Link}
              to={item.to}
              className="group flex h-full flex-col p-7"
            >
              <GlassLayer className="flex h-full flex-col">
                <p className="font-display text-lg text-marigold">{item.mr}</p>
                <h3 className="mt-1 font-display text-2xl text-espresso">{item.en}</h3>
                <p className="mt-3 flex-1 font-body text-espresso/70">{item.copy}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 font-body text-sm font-600 text-espresso">
                  Open
                  <IconArrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                </span>
              </GlassLayer>
            </GlassCard>
          </Reveal>
        ))}

        {gallery.length === 0 && (
          <Reveal delay={450}>
            <NeededBox aspect="h-full min-h-[14rem]">
              A performance photo or short looping clip for the homepage — the one
              image that should make someone want to see you live.
            </NeededBox>
          </Reveal>
        )}
        </div>
      </div>
    </section>
  );
}

/**
 * Live photographs, full-bleed and edge to edge. Shown only when photos exist —
 * an empty strip would be worse than no strip.
 */
function LiveStrip() {
  const shots = galleryPhotos();

  const { element, scrollByCard } = InfiniteStrip({
    items: shots,
    className: 'px-5 pb-4 sm:px-8',
    renderItem: (shot, i, copy) => (
      <div key={`${copy}-${shot.name}`} data-card className="shrink-0">
        <figure className="group relative h-72 w-56 overflow-hidden rounded-3xl sm:h-96 sm:w-72">
          <img
            src={shot.src}
            alt={copy === 1 ? 'Folklok performing live' : ''}
            loading={copy === 1 && i < 3 ? 'eager' : 'lazy'}
            decoding="async"
            draggable="false"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 ring-1 ring-inset ring-cream/15" />
        </figure>
      </div>
    ),
  });

  if (shots.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-espresso py-20">
      <Aurora className="opacity-40" />
      <div className="texture-grain absolute inset-0" />
      <ScatteredInstruments preset="sparse" tone="dark" />

      <div className="relative">
        <div className="mx-auto mb-10 flex max-w-7xl items-end justify-between gap-4 px-5 sm:px-8">
          <Reveal>
            <p className="font-display text-xl text-marigold">रंगमंचावर</p>
            <h2 className="mt-1 font-display text-3xl text-cream sm:text-5xl">On stage</h2>
            <p className="mt-2 font-body text-sm text-cream/50">Drag to see more</p>
          </Reveal>

          <Reveal delay={120} className="flex shrink-0 gap-2">
            {[-1, 1].map((dir) => (
              <button
                key={dir}
                type="button"
                onClick={() => scrollByCard(dir)}
                aria-label={dir === -1 ? 'Previous photos' : 'More photos'}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/25
                  text-cream/80 transition-colors duration-300 hover:border-marigold hover:bg-marigold hover:text-espresso"
              >
                <IconArrow className={`h-4.5 w-4.5 ${dir === -1 ? 'rotate-180' : ''}`} />
              </button>
            ))}
          </Reveal>
        </div>

        {element}
      </div>
    </section>
  );
}

export function Home() {
  return (
    <>
      <Hero />
      <Ticker />
      <Highlights />
      <LiveStrip />
      <Teasers />
    </>
  );
}
