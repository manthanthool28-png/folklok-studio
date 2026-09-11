import { Reveal } from './Reveal';
import { Swirl } from './Swirl';

/** Shared masthead for every page but Home. */
export function PageHeader({ mr, en, lead }) {
  return (
    <header className="texture-grain relative overflow-hidden bg-espresso pb-16 pt-34 sm:pb-20 sm:pt-40">
      <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
        <Reveal>
          <p className="font-display text-2xl text-marigold sm:text-3xl">{mr}</p>
          <h1 className="mt-2 font-display text-4xl text-cream sm:text-5xl md:text-6xl">{en}</h1>
          {lead && (
            <p className="mx-auto mt-5 max-w-prose font-body text-base text-cream/75 sm:text-lg">
              {lead}
            </p>
          )}
          <Swirl className="mx-auto mt-8 h-8 w-56 opacity-80" color="var(--color-marigold)" width={2} />
        </Reveal>
      </div>
    </header>
  );
}
