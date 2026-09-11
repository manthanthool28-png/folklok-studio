import { Reveal } from './Reveal';
import { Swirl } from './Swirl';
import { Aurora } from './Aurora';

/** Shared masthead for every page but Home. */
export function PageHeader({ mr, en, lead }) {
  return (
    <header className="relative overflow-hidden bg-espresso pb-20 pt-36 sm:pb-24 sm:pt-44">
      <Aurora />
      <div className="texture-grain absolute inset-0" />

      <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
        <Reveal>
          <span
            className="glass inline-block rounded-full px-5 py-1.5 font-display text-lg text-marigold sm:text-xl"
          >
            {mr}
          </span>
          <h1 className="mt-5 font-display text-4xl text-cream sm:text-6xl md:text-7xl">{en}</h1>
          {lead && (
            <p className="mx-auto mt-5 max-w-prose font-body text-base text-cream/72 sm:text-lg">
              {lead}
            </p>
          )}
          <Swirl className="mx-auto mt-8 h-8 w-56 opacity-80" color="var(--color-marigold)" width={2} />
        </Reveal>
      </div>
    </header>
  );
}
