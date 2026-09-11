import site from '../content/site.json';
import { PageHeader } from '../components/PageHeader';
import { Reveal } from '../components/Reveal';
import { Divider } from '../components/Divider';
import { Needed, NeededBox, NeededPanel } from '../components/Needed';

export function About() {
  return (
    <>
      <PageHeader
        mr="आमच्याविषयी"
        en="Explore Folklok"
        lead="Where the songs come from, and why we keep singing them."
      />

      <section className="texture-cloth">
        <div className="mx-auto max-w-5xl px-5 py-18 sm:px-8">
          {/* Facts strip */}
          <Reveal className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-xl border border-espresso/12 bg-cream-deep p-6">
              <p className="font-body text-[0.7rem] font-600 uppercase tracking-[0.16em] text-terracotta">
                Founded
              </p>
              <p className="mt-2 font-display text-3xl text-espresso">
                {site.foundedYear ?? <Needed>Year</Needed>}
              </p>
            </div>
            <div className="rounded-xl border border-espresso/12 bg-cream-deep p-6">
              <p className="font-body text-[0.7rem] font-600 uppercase tracking-[0.16em] text-terracotta">
                Based in
              </p>
              <p className="mt-2 font-display text-3xl text-espresso">
                {site.baseCity ?? <Needed>City</Needed>}
              </p>
            </div>
          </Reveal>

          <Divider />

          {/* The story */}
          <Reveal>
            <p className="font-display text-xl text-terracotta">आमची गोष्ट</p>
            <h2 className="mt-1 font-display text-3xl text-espresso sm:text-4xl">Our story</h2>
          </Reveal>

          <Reveal delay={100} className="mt-7">
            <NeededPanel title="How Folklok began">
              The founding story: who started it, what brought them together, and
              what the group set out to do. A few paragraphs in your own words —
              this is the page people read before they book you, so it should
              sound like you rather than like a biography.
            </NeededPanel>
          </Reveal>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <Reveal delay={140}>
              <NeededBox>A rehearsal photo — the room, the instruments, the mess.</NeededBox>
            </Reveal>
            <Reveal delay={220}>
              <NeededBox>A performance photo — the group mid-song, in front of a crowd.</NeededBox>
            </Reveal>
          </div>

          <Divider />

          {/* Philosophy */}
          <Reveal>
            <p className="font-display text-xl text-terracotta">आमचं तत्त्वज्ञान</p>
            <h2 className="mt-1 font-display text-3xl text-espresso sm:text-4xl">Why folk, why now</h2>
          </Reveal>

          <Reveal delay={100} className="mt-7">
            <NeededPanel title="The artistic statement">
              What makes the Folklok sound distinct — the forms you draw on, what
              you keep traditional and what you let change, and why this music
              matters at this moment. Two or three paragraphs.
            </NeededPanel>
          </Reveal>

          <Divider />

          {/* Press */}
          <Reveal>
            <h2 className="font-display text-3xl text-espresso sm:text-4xl">Press</h2>
            <p className="mt-2 font-body text-espresso/70">
              Coverage, features and interviews.
            </p>
          </Reveal>

          <Reveal delay={100} className="mt-6">
            <NeededPanel title="No press listed yet">
              Any articles, radio spots or festival write-ups — a headline, the
              publication and a link each. If there aren't any yet, this whole
              section can be deleted rather than left empty.
            </NeededPanel>
          </Reveal>
        </div>
      </section>
    </>
  );
}
