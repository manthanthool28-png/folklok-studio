import site from '../content/site.json';
import { SOCIAL_ICONS } from './Icons';

/**
 * Renders only the socials that have a real URL. Anything still null shows as
 * a struck-through, non-clickable stub so the gap is visible on the page
 * instead of silently linking somewhere that doesn't exist.
 */
export function Socials({ size = 'md', tone = 'cream', className = '' }) {
  const dim = size === 'lg' ? 'h-12 w-12' : 'h-10 w-10';
  const glyph = size === 'lg' ? 'h-5.5 w-5.5' : 'h-5 w-5';

  const live =
    tone === 'cream'
      ? 'border-cream/25 text-cream/85 hover:border-marigold hover:bg-marigold hover:text-espresso'
      : 'border-espresso/20 text-espresso/80 hover:border-marigold hover:bg-marigold hover:text-espresso';

  const dead =
    tone === 'cream'
      ? 'border-dashed border-terracotta/60 text-terracotta/70'
      : 'border-dashed border-terracotta/60 text-terracotta/70';

  return (
    <ul className={`flex flex-wrap items-center gap-3 ${className}`}>
      {site.socials.map((s) => {
        const Icon = SOCIAL_ICONS[s.id];
        if (!Icon) return null;

        if (!s.url) {
          return (
            <li key={s.id}>
              <span
                data-needed
                title={`${s.label} URL not set yet`}
                className={`flex ${dim} items-center justify-center rounded-full border ${dead}`}
              >
                <Icon className={glyph} />
                <span className="sr-only">{s.label} — link needed</span>
              </span>
            </li>
          );
        }

        return (
          <li key={s.id}>
            <a
              href={s.url}
              target="_blank"
              rel="noreferrer noopener"
              className={`flex ${dim} items-center justify-center rounded-full border transition-colors duration-200 ${live}`}
            >
              <Icon className={glyph} />
              <span className="sr-only">{s.label}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
