import { useState } from 'react';
import music from '../content/music.json';
import site from '../content/site.json';
import { PageHeader } from '../components/PageHeader';
import { Reveal } from '../components/Reveal';
import { Divider } from '../components/Divider';
import { NeededPanel } from '../components/Needed';
import { IconSpotify, IconArrow } from '../components/Icons';

/**
 * Lazy YouTube embed. Renders the thumbnail only; the iframe (and ~1MB of
 * player JS) loads on click. With a gallery of videos this is the difference
 * between a fast page and an unusable one on mobile data.
 */
function VideoEmbed({ video }) {
  const [active, setActive] = useState(false);

  if (active) {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-lg bg-ink">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          className="h-full w-full border-0"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setActive(true)}
      className="group relative block aspect-video w-full overflow-hidden rounded-lg bg-ink"
    >
      <img
        src={`https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`}
        alt=""
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <span className="absolute inset-0 bg-ink/25 transition-colors group-hover:bg-ink/10" />
      <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-marigold shadow-lg transition-transform duration-300 group-hover:scale-110">
        <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7 fill-espresso" aria-hidden="true">
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
      <span className="sr-only">Play {video.title}</span>
    </button>
  );
}

export function Music() {
  const { videos, releases, discography } = music;
  const spotifyUrl = site.socials.find((s) => s.id === 'spotify')?.url;

  return (
    <>
      <PageHeader
        mr="संगीत"
        en="Music & Releases"
        lead="Videos, singles and everything we have put out."
      />

      <section className="texture-cloth">
        <div className="mx-auto max-w-6xl px-5 py-18 sm:px-8">
          {/* Videos */}
          <Reveal>
            <p className="font-display text-xl text-terracotta">व्हिडिओ</p>
            <h2 className="mt-1 font-display text-3xl text-espresso sm:text-4xl">Music videos</h2>
          </Reveal>

          {videos.length === 0 ? (
            <Reveal delay={100} className="mt-7">
              <NeededPanel title="No videos added yet">
                Add entries to{' '}
                <code className="rounded bg-espresso/8 px-1.5 py-0.5 text-sm">
                  src/content/music.json
                </code>{' '}
                under <code className="rounded bg-espresso/8 px-1.5 py-0.5 text-sm">videos</code> —
                each needs a <code className="rounded bg-espresso/8 px-1.5 py-0.5 text-sm">youtubeId</code>,
                a title, a release date and a short description. Newest first.
              </NeededPanel>
            </Reveal>
          ) : (
            <div className="mt-9 grid gap-8 md:grid-cols-2">
              {videos.map((v, i) => (
                <Reveal key={v.youtubeId} delay={(i % 2) * 90}>
                  <VideoEmbed video={v} />
                  <h3 className="mt-4 font-display text-xl text-espresso">{v.title}</h3>
                  {v.releaseDate && (
                    <p className="mt-0.5 font-body text-sm text-espresso/55">{v.releaseDate}</p>
                  )}
                  {v.description && (
                    <p className="mt-2 font-body text-espresso/70">{v.description}</p>
                  )}
                </Reveal>
              ))}
            </div>
          )}

          <Divider />

          {/* Spotify */}
          <Reveal>
            <p className="font-display text-xl text-terracotta">स्पॉटिफाय</p>
            <h2 className="mt-1 font-display text-3xl text-espresso sm:text-4xl">On Spotify</h2>
          </Reveal>

          {releases.length === 0 ? (
            <Reveal delay={100} className="mt-7">
              <NeededPanel title="No Spotify releases linked yet">
                Add each album or single to{' '}
                <code className="rounded bg-espresso/8 px-1.5 py-0.5 text-sm">releases</code> with a
                type (<code className="rounded bg-espresso/8 px-1.5 py-0.5 text-sm">album</code> or{' '}
                <code className="rounded bg-espresso/8 px-1.5 py-0.5 text-sm">track</code>) and its
                Spotify ID, and an embedded player appears here.
              </NeededPanel>
            </Reveal>
          ) : (
            <div className="mt-9 grid gap-6 md:grid-cols-2">
              {releases.map((r, i) => (
                <Reveal key={r.spotifyId} delay={(i % 2) * 90}>
                  <iframe
                    src={`https://open.spotify.com/embed/${r.type}/${r.spotifyId}`}
                    title={r.title ?? 'Spotify player'}
                    width="100%"
                    height="352"
                    loading="lazy"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    className="rounded-xl border-0"
                  />
                </Reveal>
              ))}
            </div>
          )}

          {spotifyUrl && (
            <Reveal delay={150} className="mt-8 text-center">
              <a
                href={spotifyUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 rounded-full bg-espresso px-6 py-3 font-body font-600 text-cream transition-colors hover:bg-espresso-light"
              >
                <IconSpotify className="h-5 w-5" />
                Full artist profile
                <IconArrow className="h-4 w-4" />
              </a>
            </Reveal>
          )}

          {/* Discography */}
          {discography.length > 0 && (
            <>
              <Divider />
              <Reveal>
                <h2 className="font-display text-3xl text-espresso sm:text-4xl">Discography</h2>
              </Reveal>
              <Reveal delay={100} className="mt-7 overflow-x-auto">
                <table className="w-full min-w-[32rem] border-collapse text-left font-body">
                  <thead>
                    <tr className="border-b-2 border-espresso/15">
                      <th className="py-3 pr-4 text-sm font-600 uppercase tracking-[0.1em] text-espresso/60">Title</th>
                      <th className="py-3 pr-4 text-sm font-600 uppercase tracking-[0.1em] text-espresso/60">Type</th>
                      <th className="py-3 text-sm font-600 uppercase tracking-[0.1em] text-espresso/60">Year</th>
                    </tr>
                  </thead>
                  <tbody>
                    {discography.map((d, i) => (
                      <tr key={`${d.title}-${i}`} className="border-b border-espresso/10">
                        <td className="py-3.5 pr-4 font-display text-lg text-espresso">{d.title}</td>
                        <td className="py-3.5 pr-4 text-espresso/70 capitalize">{d.type}</td>
                        <td className="py-3.5 text-espresso/70">{d.year}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Reveal>
            </>
          )}
        </div>
      </section>
    </>
  );
}
