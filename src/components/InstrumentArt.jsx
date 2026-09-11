/**
 * Hand-drawn instrument shapes, used both as the scattered page decoration and
 * as the illustration on each instrument card. Drawn rather than photographed
 * so they sit in the brand palette and cost nothing to load.
 */

const base = { fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' };

export function Dholki({ stroke = 'currentColor', width = 2, ...p }) {
  return (
    <svg viewBox="0 0 100 60" aria-hidden="true" {...p}>
      <g {...base} stroke={stroke} strokeWidth={width}>
        <path d="M22 14c0-3 5-5 12-5h32c7 0 12 2 12 5v32c0 3-5 5-12 5H34c-7 0-12-2-12-5z" />
        <ellipse cx="22" cy="30" rx="7" ry="16" />
        <ellipse cx="78" cy="30" rx="6" ry="14" />
        <ellipse cx="22" cy="30" rx="3.5" ry="8" />
        {[30, 42, 54, 66].map((x) => (
          <path key={x} d={`M${x} 11l-3 38`} strokeWidth={width * 0.6} />
        ))}
      </g>
    </svg>
  );
}

export function Tabla({ stroke = 'currentColor', width = 2, ...p }) {
  return (
    <svg viewBox="0 0 100 70" aria-hidden="true" {...p}>
      <g {...base} stroke={stroke} strokeWidth={width}>
        <path d="M14 24c0-5 6-8 14-8s14 3 14 8v26c0 5-6 8-14 8s-14-3-14-8z" />
        <ellipse cx="28" cy="24" rx="14" ry="6" />
        <circle cx="28" cy="24" r="4.5" strokeWidth={width * 0.8} />
        <path d="M58 30c0-4 6-7 13-7s13 3 13 7v20c0 5-6 8-13 8s-13-3-13-8z" />
        <ellipse cx="71" cy="30" rx="13" ry="5.5" />
        <circle cx="71" cy="30" r="4" strokeWidth={width * 0.8} />
      </g>
    </svg>
  );
}

export function Harmonium({ stroke = 'currentColor', width = 2, ...p }) {
  return (
    <svg viewBox="0 0 100 60" aria-hidden="true" {...p}>
      <g {...base} stroke={stroke} strokeWidth={width}>
        <rect x="10" y="16" width="80" height="30" rx="3" />
        <path d="M10 34h80" />
        {[22, 32, 42, 52, 62, 72, 82].map((x) => (
          <path key={x} d={`M${x} 34v12`} strokeWidth={width * 0.6} />
        ))}
        <path d="M18 16V9h64v7" />
        <circle cx="50" cy="25" r="3.5" strokeWidth={width * 0.7} />
      </g>
    </svg>
  );
}

export function Bansuri({ stroke = 'currentColor', width = 2, ...p }) {
  return (
    <svg viewBox="0 0 100 30" aria-hidden="true" {...p}>
      <g {...base} stroke={stroke} strokeWidth={width}>
        <path d="M8 15h84" strokeWidth={width * 3.2} opacity="0.18" />
        <rect x="8" y="9" width="84" height="12" rx="6" />
        <circle cx="22" cy="15" r="1.8" />
        {[38, 47, 56, 65, 74].map((x) => (
          <circle key={x} cx={x} cy="15" r="1.6" />
        ))}
      </g>
    </svg>
  );
}

export function Manjira({ stroke = 'currentColor', width = 2, ...p }) {
  return (
    <svg viewBox="0 0 100 50" aria-hidden="true" {...p}>
      <g {...base} stroke={stroke} strokeWidth={width}>
        <circle cx="32" cy="25" r="16" />
        <circle cx="32" cy="25" r="6" />
        <path d="M32 9v-5" />
        <circle cx="70" cy="25" r="14" />
        <circle cx="70" cy="25" r="5" />
        <path d="M70 11v-5" />
      </g>
    </svg>
  );
}

export function Ektara({ stroke = 'currentColor', width = 2, ...p }) {
  return (
    <svg viewBox="0 0 60 100" aria-hidden="true" {...p}>
      <g {...base} stroke={stroke} strokeWidth={width}>
        <ellipse cx="30" cy="74" rx="19" ry="21" />
        <path d="M30 53V12" />
        <path d="M18 30c0-10 5-18 12-18s12 8 12 18" />
        <circle cx="30" cy="10" r="3" />
        <circle cx="30" cy="74" r="5" strokeWidth={width * 0.7} />
      </g>
    </svg>
  );
}

export function Tuntune({ stroke = 'currentColor', width = 2, ...p }) {
  return (
    <svg viewBox="0 0 60 100" aria-hidden="true" {...p}>
      <g {...base} stroke={stroke} strokeWidth={width}>
        <path d="M14 62c0-9 7-16 16-16s16 7 16 16v16c0 8-7 14-16 14s-16-6-16-14z" />
        <ellipse cx="30" cy="62" rx="16" ry="7" />
        <path d="M30 46V10" />
        <path d="M24 10h12" />
      </g>
    </svg>
  );
}

export function Dhol({ stroke = 'currentColor', width = 2, ...p }) {
  return (
    <svg viewBox="0 0 100 60" aria-hidden="true" {...p}>
      <g {...base} stroke={stroke} strokeWidth={width}>
        <path d="M20 18c0-4 6-7 14-7h32c8 0 14 3 14 7v24c0 4-6 7-14 7H34c-8 0-14-3-14-7z" />
        <ellipse cx="20" cy="30" rx="8" ry="13" />
        <ellipse cx="80" cy="30" rx="8" ry="13" />
        <path d="M28 12l-6 36M72 12l6 36" strokeWidth={width * 0.6} />
      </g>
    </svg>
  );
}

/** Anything without a drawing of its own borrows the dholki. */
export const INSTRUMENT_ART = {
  dholki: Dholki,
  tabla: Tabla,
  harmonium: Harmonium,
  bansuri: Bansuri,
  manjira: Manjira,
  ektara: Ektara,
  tuntune: Tuntune,
  dhol: Dhol,
};

export function artFor(slug) {
  return INSTRUMENT_ART[slug] ?? Dholki;
}
