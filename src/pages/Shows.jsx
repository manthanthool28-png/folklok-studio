import { PageHeader } from '../components/PageHeader';
import { ScatteredInstruments } from '../components/ScatteredInstruments';
import { Reveal } from '../components/Reveal';
import { Divider } from '../components/Divider';
import { NeededPanel } from '../components/Needed';
import { IconPin, IconArrow } from '../components/Icons';
import { upcomingShows, pastShows, formatShowDate } from '../lib/content';

function DateBlock({ show }) {
  const d = formatShowDate(show);
  return (
    <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-lg bg-marigold font-display leading-none text-espresso">
      <span className="text-2xl font-700">{d.day}</span>
      <span className="mt-0.5 text-[0.65rem] font-600 tracking-[0.1em]">{d.month}</span>
    </div>
  );
}

function UpcomingRow({ show, index }) {
  const d = formatShowDate(show);
  return (
    <Reveal delay={index * 80}>
      <article className="flex flex-col gap-4 rounded-xl border border-espresso/12 bg-cream p-5 transition-colors hover:border-marigold sm:flex-row sm:items-center sm:gap-6">
        <DateBlock show={show} />

        <div className="flex-1">
          <h3 className="font-display text-xl text-espresso">{show.venue}</h3>
          <p className="mt-1 flex items-center gap-1.5 font-body text-sm text-espresso/65">
            <IconPin className="h-4 w-4 text-terracotta" />
            {show.city}
            <span className="text-espresso/35">·</span>
            {d.year}
          </p>
          {show.note && <p className="mt-2 font-body text-espresso/70">{show.note}</p>}
        </div>

        {show.ticketUrl && (
          <a
            href={show.ticketUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-espresso px-5 py-2.5 font-body text-sm font-600 text-cream transition-colors hover:bg-espresso-light sm:self-auto"
          >
            Tickets
            <IconArrow className="h-4 w-4" />
          </a>
        )}
      </article>
    </Reveal>
  );
}

function PastRow({ show, index }) {
  const d = formatShowDate(show);
  return (
    <Reveal delay={Math.min(index, 6) * 60}>
      <li className="relative pb-9 pl-9">
        {/* Timeline spine and node */}
        <span aria-hidden="true" className="absolute left-[7px] top-2 h-full w-px bg-espresso/15" />
        <span aria-hidden="true" className="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-marigold bg-cream" />

        <p className="font-body text-xs font-600 uppercase tracking-[0.14em] text-terracotta">
          {d.full}
        </p>
        <h3 className="mt-1 font-display text-lg text-espresso">{show.venue}</h3>
        <p className="font-body text-sm text-espresso/60">{show.city}</p>
        {show.photo && (
          <img
            src={show.photo}
            alt={`${show.venue}, ${show.city}`}
            loading="lazy"
            decoding="async"
            className="mt-3 aspect-[16/9] w-full max-w-md rounded-lg object-cover"
          />
        )}
      </li>
    </Reveal>
  );
}

export function Shows() {
  const upcoming = upcomingShows();
  const past = pastShows();

  return (
    <>
      <PageHeader
        mr="कार्यक्रम"
        en="Shows"
        lead="Where to find us next — and every stage we have stood on."
      />

      <section className="texture-cloth relative overflow-hidden">
        <ScatteredInstruments preset="march" tone="light" />
        <div className="mx-auto max-w-4xl px-5 py-18 sm:px-8">
          <Reveal>
            <p className="font-display text-xl text-terracotta">येणारे कार्यक्रम</p>
            <h2 className="mt-1 font-display text-3xl text-espresso sm:text-4xl">Upcoming</h2>
          </Reveal>

          {upcoming.length === 0 ? (
            <Reveal delay={100} className="mt-7">
              <NeededPanel title="No shows scheduled yet">
                Add dates to{' '}
                <code className="rounded bg-espresso/8 px-1.5 py-0.5 text-sm">
                  src/content/shows.json
                </code>{' '}
                with an ISO date (YYYY-MM-DD), venue, city and an optional ticket
                link. Upcoming and past are worked out from today's date, so a
                show slides into the archive by itself the day after it plays.
              </NeededPanel>
            </Reveal>
          ) : (
            <div className="mt-8 space-y-4">
              {upcoming.map((s, i) => (
                <UpcomingRow key={`${s.date}-${s.venue}`} show={s} index={i} />
              ))}
            </div>
          )}

          <Divider />

          <Reveal>
            <p className="font-display text-xl text-terracotta">मागील कार्यक्रम</p>
            <h2 className="mt-1 font-display text-3xl text-espresso sm:text-4xl">Show history</h2>
          </Reveal>

          {past.length === 0 ? (
            <Reveal delay={100} className="mt-7">
              <NeededPanel title="The archive is empty">
                Past shows use the same file — anything with a date before today
                lands here automatically, as a timeline. Worth backfilling old
                dates: for a folk group, the history is part of the pitch.
              </NeededPanel>
            </Reveal>
          ) : (
            <ol className="mt-9">
              {past.map((s, i) => (
                <PastRow key={`${s.date}-${s.venue}`} show={s} index={i} />
              ))}
            </ol>
          )}
        </div>
      </section>
    </>
  );
}
