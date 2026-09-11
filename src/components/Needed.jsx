/**
 * Deliberately unfinished-looking markers for content that doesn't exist yet.
 *
 * The rule for this build: never render a plausible-looking invention. If a
 * value is null in /src/content, one of these shows instead, so nothing fake
 * can quietly survive to launch. Every marker carries data-needed, so a quick
 *   document.querySelectorAll('[data-needed]')
 * tells you exactly what's still outstanding.
 */

const chip =
  'inline-flex items-center gap-1.5 rounded-full border border-dashed border-terracotta ' +
  'bg-terracotta/10 px-3 py-1 align-middle font-body text-[0.7rem] font-600 ' +
  'uppercase tracking-[0.12em] text-terracotta backdrop-blur-sm';

/** Inline: stands in for a missing word or short phrase. */
export function Needed({ children }) {
  return (
    <span data-needed className={chip} title="Content still needed">
      <span aria-hidden="true">◆</span>
      {children}
    </span>
  );
}

/** Framed box: stands in for a missing photo, illustration or video. */
export function NeededBox({ children, className = '', aspect = 'aspect-[4/3]' }) {
  return (
    <div
      data-needed
      className={`${aspect} ${className} flex flex-col items-center justify-center gap-2
        rounded-3xl border border-dashed border-terracotta/55 bg-terracotta/8 p-5 text-center
        backdrop-blur-md`}
    >
      <span aria-hidden="true" className="text-xl text-terracotta/70">
        ◆
      </span>
      <span className="font-body text-[0.72rem] font-600 uppercase tracking-[0.14em] text-terracotta">
        Asset needed
      </span>
      <span className="max-w-[26ch] font-body text-sm leading-snug text-espresso/65">
        {children}
      </span>
    </div>
  );
}

/** Full-width note: stands in for a whole section with nothing in it yet. */
export function NeededPanel({ title, children }) {
  return (
    <div
      data-needed
      className="rounded-3xl border border-dashed border-terracotta/45 bg-terracotta/7 p-9 text-center
        backdrop-blur-md shadow-[0_8px_30px_rgba(59,31,14,0.06)]"
    >
      <p className="font-body text-[0.72rem] font-600 uppercase tracking-[0.14em] text-terracotta">
        Content needed
      </p>
      <h3 className="mt-2 font-display text-2xl text-espresso">{title}</h3>
      <p className="mx-auto mt-2 max-w-prose font-body text-espresso/70">{children}</p>
    </div>
  );
}
