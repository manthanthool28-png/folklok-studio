import { Link } from 'react-router-dom';
import site from '../content/site.json';
import wordmark from '../assets/folklok-wordmark.png';
import { Reveal } from '../components/Reveal';
import { Swirl, SwirlCurl } from '../components/Swirl';
import { Divider } from '../components/Divider';
import { Socials } from '../components/Socials';
import { Needed, NeededBox } from '../components/Needed';
import { IconArrow, IconPin, IconSpotify } from '../components/Icons';
import { upcomingShows, latestVideo, formatShowDate } from '../lib/content';

const TEASERS = [
  { to: '/instruments', mr: 'वाद्ये', en: 'Instruments', copy: 'The dholki, the ektara, the tuntune — the voices behind the songs.' },
  { to: '/members', mr: 'सदस्य', en: 'Members', copy: 'The people who make up the collective.' },
  { to: '/music', mr: 'संगीत', en: 'Music & Releases', copy: 'Videos, singles and everything on Spotify.' },
  { to: '/shows', mr: 'कार्यक्रम', en: 'Shows', copy: 'Where to find us next, and everywhere we have played.' },
  { to: '/booking', mr: 'बुकिंग', en: 'Booking', copy: 'Bring Folklok to your stage, festival or celebration.' },
];

function Hero() {
  return (
    <section className="texture-grain relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-espresso px-5 py-28">
      {/* Ambient flourishes — the logo's curl, enlarged and slowed right down. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.07]">
        <SwirlCurl className="absolute -left-16 top-10 h-72 w-72 rotate-12" color="var(--color-marigold)" />
        <SwirlCurl className="absolute -right-20 bottom-4 h-96 w-96 -rotate-[160deg]" color="var(--color-marigold)" />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 45%, rgba(245,183,0,0.14), transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-3xl text-center">
        <Reveal>
          <img
            src={wordmark}
            alt="Folklok"
            width="1782"
            height="919"
            fetchpriority="high"
            className="mx-auto w-full max-w-md drop-shadow-[0_6px_28px_rgba(0,0,0,0.4)] sm:max-w-lg"
          />
        </Reveal>

        <Reveal delay={160}>
          <h1 className="mt-9 font-display text-2xl leading-snug text-cream sm:text-3xl md:text-[2.5rem]">
            {site.tagline.mr}
          </h1>
          <p className="mt-3 font-body text-sm italic text-marigold/90 sm:text-base">
            {site.tagline.en}
          </p>
        </Reveal>

        <Reveal delay={280}>
          <Swirl className="mx-auto mt-8 h-9 w-64 opacity-80" color="var(--color-marigold)" width={2} />
        </Reveal>

        <Reveal delay={360}>
          <div className="mt-8 font-body text-base text-cream/75 sm:text-lg">
            {site.intro ? (
              <p className="mx-auto max-w-xl">{site.intro}</p>
            ) : (
              <p className="mx-auto max-w-xl">
                <Needed>One-line description of Folklok</Needed>
              </p>
            )}
          </div>
        </Reveal>

        <Reveal delay={440}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/music"
              className="inline-flex items-center gap-2 rounded-full bg-marigold px-7 py-3.5 font-body font-600 text-espresso transition-transform duration-200 hover:scale-[1.03] hover:bg-marigold-light"
            >
              Hear the music
              <IconArrow className="h-4.5 w-4.5" />
            </Link>
            <Link
              to="/booking"
              className="inline-flex items-center gap-2 rounded-full border border-cream/35 px-7 py-3.5 font-body font-600 text-cream transition-colors duration-200 hover:border-marigold hover:text-marigold"
            >
              Book us
            </Link>
          </div>
          <Socials className="mt-9 justify-center" />
        </Reveal>
      </div>
    </section>
  );
}

function Highlights() {
  const next = upcomingShows()[0];
  const video = latestVideo();
  const when = next ? formatShowDate(next) : null;

  return (
    <section className="texture-cloth border-y border-espresso/10 bg-cream-deep">
      <div className="mx-auto grid max-w-7xl gap-px overflow-hidden px-5 py-2 sm:px-8 md:grid-cols-3">
        {/* Latest release */}
        <Reveal className="px-2 py-8 md:px-7">
          <p className="font-body text-[0.7rem] font-600 uppercase tracking-[0.16em] text-terracotta">
            Latest release
          </p>
          {video ? (
            <>
              <h2 className="mt-2 font-display text-2xl text-espresso">{video.title}</h2>
              {video.releaseDate && (
                <p className="mt-1 font-body text-sm text-espresso/60">{video.releaseDate}</p>
              )}
              <Link to="/music" className="mt-3 inline-flex items-center gap-1.5 font-body text-sm font-600 text-espresso underline decoration-marigold decoration-2 underline-offset-4">
                Watch it <IconArrow className="h-4 w-4" />
              </Link>
            </>
          ) : (
            <p className="mt-3">
              <Needed>Latest release</Needed>
            </p>
          )}
        </Reveal>

        {/* Next show */}
        <Reveal delay={100} className="border-espresso/12 px-2 py-8 md:border-x md:px-7">
          <p className="font-body text-[0.7rem] font-600 uppercase tracking-[0.16em] text-terracotta">
            Next show
          </p>
          {next ? (
            <>
              <h2 className="mt-2 font-display text-2xl text-espresso">{when.full}</h2>
              <p className="mt-1 flex items-center gap-1.5 font-body text-sm text-espresso/70">
                <IconPin className="h-4 w-4 text-marigold" />
                {next.venue}
                {next.city ? `, ${next.city}` : ''}
              </p>
              <Link to="/shows" className="mt-3 inline-flex items-center gap-1.5 font-body text-sm font-600 text-espresso underline decoration-marigold decoration-2 underline-offset-4">
                All shows <IconArrow className="h-4 w-4" />
              </Link>
            </>
          ) : (
            <p className="mt-3">
              <Needed>Next show</Needed>
            </p>
          )}
        </Reveal>

        {/* Spotify */}
        <Reveal delay={200} className="px-2 py-8 md:px-7">
          <p className="font-body text-[0.7rem] font-600 uppercase tracking-[0.16em] text-terracotta">
            Listen
          </p>
          <h2 className="mt-2 font-display text-2xl text-espresso">On Spotify</h2>
          {site.socials.find((s) => s.id === 'spotify')?.url ? (
            <a
              href={site.socials.find((s) => s.id === 'spotify').url}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-espresso px-5 py-2.5 font-body text-sm font-600 text-cream transition-colors hover:bg-espresso-light"
            >
              <IconSpotify className="h-4.5 w-4.5" />
              Play now
            </a>
          ) : (
            <p className="mt-3">
              <Needed>Spotify artist link</Needed>
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}

function Teasers() {
  return (
    <section className="texture-cloth mx-auto max-w-7xl px-5 py-20 sm:px-8">
      <Reveal className="text-center">
        <p className="font-display text-xl text-terracotta">फिरून बघा</p>
        <h2 className="mt-1 font-display text-3xl text-espresso sm:text-4xl">Explore Folklok</h2>
      </Reveal>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {TEASERS.map((t, i) => (
          <Reveal key={t.to} delay={i * 80}>
            <Link
              to={t.to}
              className="group flex h-full flex-col rounded-xl border border-espresso/12 bg-cream p-7 transition-all duration-300 hover:-translate-y-1 hover:border-marigold hover:shadow-xl hover:shadow-espresso/10"
            >
              <p className="font-display text-lg text-marigold">{t.mr}</p>
              <h3 className="mt-1 font-display text-2xl text-espresso">{t.en}</h3>
              <p className="mt-3 flex-1 font-body text-espresso/70">{t.copy}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 font-body text-sm font-600 text-espresso">
                Open
                <IconArrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>
          </Reveal>
        ))}

        <Reveal delay={400}>
          <NeededBox aspect="h-full min-h-[13rem]">
            A performance photo or short looping clip for the homepage — the one
            image that should make someone want to see you live.
          </NeededBox>
        </Reveal>
      </div>
    </section>
  );
}

export function Home() {
  return (
    <>
      <Hero />
      <Highlights />
      <Teasers />
      <Divider />
    </>
  );
}
