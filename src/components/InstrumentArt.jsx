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


export function Tasha({ stroke = 'currentColor', width = 2, ...p }) {
  return (
    <svg viewBox="0 0 100 70" aria-hidden="true" {...p}>
      <g {...base} stroke={stroke} strokeWidth={width}>
        <path d="M20 30h60c0 18-13 30-30 30S20 48 20 30z" />
        <ellipse cx="50" cy="30" rx="30" ry="8" />
        <ellipse cx="50" cy="30" rx="23" ry="6" strokeWidth={width * 0.7} />
        <path d="M10 6l30 17M28 3l26 16" strokeWidth={width * 0.7} />
      </g>
    </svg>
  );
}

export function Sambal({ stroke = 'currentColor', width = 2, ...p }) {
  return (
    <svg viewBox="0 0 100 74" aria-hidden="true" {...p}>
      <g {...base} stroke={stroke} strokeWidth={width}>
        <path d="M14 26v26c0 6 7 10 16 10s16-4 16-10V26" />
        <ellipse cx="30" cy="26" rx="16" ry="6" />
        <path d="M54 30v22c0 5 7 9 15 9s15-4 15-9V30" />
        <ellipse cx="69" cy="30" rx="15" ry="5.5" />
        {/* straight stick for the bass head, curved one for the treble */}
        <path d="M16 4l12 14" strokeWidth={width * 0.7} />
        <path d="M88 4c-9 3-13 9-11 16" strokeWidth={width * 0.7} />
      </g>
    </svg>
  );
}

export function Halgi({ stroke = 'currentColor', width = 2, ...p }) {
  return (
    <svg viewBox="0 0 100 84" aria-hidden="true" {...p}>
      <g {...base} stroke={stroke} strokeWidth={width}>
        <circle cx="44" cy="48" r="30" />
        <circle cx="44" cy="48" r="24" strokeWidth={width * 0.8} />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
          const r = (deg * Math.PI) / 180;
          return (
            <path
              key={deg}
              d={`M${44 + 24 * Math.cos(r)} ${48 + 24 * Math.sin(r)}L${44 + 30 * Math.cos(r)} ${
                48 + 30 * Math.sin(r)
              }`}
              strokeWidth={width * 0.55}
            />
          );
        })}
        <path d="M92 8L66 30M96 24L70 42" strokeWidth={width * 0.7} />
      </g>
    </svg>
  );
}

export function Daf({ stroke = 'currentColor', width = 2, ...p }) {
  return (
    <svg viewBox="0 0 100 96" aria-hidden="true" {...p}>
      <g {...base} stroke={stroke} strokeWidth={width}>
        <circle cx="50" cy="50" r="36" />
        <circle cx="50" cy="50" r="29" strokeWidth={width * 0.8} />
        {[-60, 0, 60, 120, 180, 240].map((deg) => {
          const r = (deg * Math.PI) / 180;
          return (
            <circle
              key={deg}
              cx={50 + 32.5 * Math.cos(r)}
              cy={50 + 32.5 * Math.sin(r)}
              r="2.6"
              strokeWidth={width * 0.55}
            />
          );
        })}
      </g>
    </svg>
  );
}

export function Khanjiri({ stroke = 'currentColor', width = 2, ...p }) {
  return (
    <svg viewBox="0 0 100 84" aria-hidden="true" {...p}>
      <g {...base} stroke={stroke} strokeWidth={width}>
        <circle cx="50" cy="44" r="28" />
        <circle cx="50" cy="44" r="21" strokeWidth={width * 0.8} />
        {[-90, 30, 150].map((deg) => {
          const r = (deg * Math.PI) / 180;
          return (
            <g key={deg} strokeWidth={width * 0.6}>
              <circle cx={50 + 24.5 * Math.cos(r)} cy={44 + 24.5 * Math.sin(r)} r="3.4" />
              <path
                d={`M${50 + 21 * Math.cos(r)} ${44 + 21 * Math.sin(r)}L${50 + 28 * Math.cos(r)} ${
                  44 + 28 * Math.sin(r)
                }`}
              />
            </g>
          );
        })}
      </g>
    </svg>
  );
}

export function Mridang({ stroke = 'currentColor', width = 2, ...p }) {
  return (
    <svg viewBox="0 0 110 62" aria-hidden="true" {...p}>
      <g {...base} stroke={stroke} strokeWidth={width}>
        <path d="M16 24c10-8 24-12 40-12s34 5 42 14v10c-8 9-26 14-42 14s-30-4-40-12z" />
        <ellipse cx="16" cy="31" rx="6" ry="13" />
        <ellipse cx="98" cy="33" rx="7" ry="16" />
        <ellipse cx="98" cy="33" rx="3" ry="7" strokeWidth={width * 0.7} />
        {[34, 50, 66, 82].map((x) => (
          <path key={x} d={`M${x} 14l-2 34`} strokeWidth={width * 0.55} />
        ))}
      </g>
    </svg>
  );
}

export function Ghumat({ stroke = 'currentColor', width = 2, ...p }) {
  return (
    <svg viewBox="0 0 100 70" aria-hidden="true" {...p}>
      <g {...base} stroke={stroke} strokeWidth={width}>
        {/* wide skinned mouth on the left, small open end on the right */}
        <path d="M26 10c24-3 46 4 56 15v20c-10 11-32 18-56 15z" />
        <ellipse cx="26" cy="35" rx="9" ry="25" />
        <ellipse cx="26" cy="35" rx="4" ry="12" strokeWidth={width * 0.7} />
        <ellipse cx="82" cy="35" rx="5" ry="10" />
      </g>
    </svg>
  );
}

export function Chiplya({ stroke = 'currentColor', width = 2, ...p }) {
  return (
    <svg viewBox="0 0 100 62" aria-hidden="true" {...p}>
      <g {...base} stroke={stroke} strokeWidth={width}>
        <rect x="10" y="10" width="34" height="11" rx="5" transform="rotate(-9 27 15)" />
        <rect x="10" y="30" width="34" height="11" rx="5" transform="rotate(9 27 35)" />
        <rect x="56" y="12" width="34" height="11" rx="5" transform="rotate(8 73 17)" />
        <rect x="56" y="32" width="34" height="11" rx="5" transform="rotate(-8 73 37)" />
        {[20, 30, 40].map((x) => (
          <g key={x} strokeWidth={width * 0.55}>
            <circle cx={x} cy={13 - (x - 30) * 0.16} r="2" />
            <circle cx={x + 46} cy={16 + (x - 30) * 0.14} r="2" />
          </g>
        ))}
      </g>
    </svg>
  );
}

export function Lezim({ stroke = 'currentColor', width = 2, ...p }) {
  return (
    <svg viewBox="0 0 100 62" aria-hidden="true" {...p}>
      <g {...base} stroke={stroke} strokeWidth={width}>
        <path d="M14 46C28 8 72 8 86 46" />
        <path d="M14 46h72" strokeWidth={width * 0.7} />
        <rect x="8" y="41" width="10" height="10" rx="3" />
        <rect x="82" y="41" width="10" height="10" rx="3" />
        {[26, 36, 46, 56, 66, 76].map((x) => (
          <circle key={x} cx={x} cy="46" r="3.6" strokeWidth={width * 0.6} />
        ))}
      </g>
    </svg>
  );
}

export function Sanai({ stroke = 'currentColor', width = 2, ...p }) {
  return (
    <svg viewBox="0 0 60 100" aria-hidden="true" {...p}>
      <g {...base} stroke={stroke} strokeWidth={width}>
        <path d="M30 4v9" />
        <path d="M26 13h8l4 52H22z" />
        {[26, 36, 46, 56].map((y) => (
          <circle key={y} cx="30" cy={y} r="1.7" strokeWidth={width * 0.6} />
        ))}
        <path d="M22 65c-10 8-13 21-11 31h38c2-10-1-23-11-31" />
      </g>
    </svg>
  );
}

export function Tarpa({ stroke = 'currentColor', width = 2, ...p }) {
  return (
    <svg viewBox="0 0 80 100" aria-hidden="true" {...p}>
      <g {...base} stroke={stroke} strokeWidth={width}>
        {/* gourd wind chest, two bamboo pipes, a horn of dried leaf */}
        <ellipse cx="26" cy="76" rx="17" ry="19" />
        <path d="M26 57v-6" />
        <path d="M19 62l7-38M33 62l8-38" />
        <path d="M20 26L11 6l38-3-12 25" />
        <circle cx="26" cy="76" r="4" strokeWidth={width * 0.6} />
      </g>
    </svg>
  );
}

export function Tutari({ stroke = 'currentColor', width = 2, ...p }) {
  return (
    <svg viewBox="0 0 100 70" aria-hidden="true" {...p}>
      <g {...base} stroke={stroke} strokeWidth={width}>
        <path d="M10 54c17 0 20-29 36-31s18 19 32 19" />
        <circle cx="9" cy="54" r="4" />
        <path d="M78 28l16-10v38l-16-10z" />
      </g>
    </svg>
  );
}

/**
 * Keyed by the slugs in instruments.json. Anything without a drawing of its
 * own borrows the dholki rather than rendering a hole.
 */
export const INSTRUMENT_ART = {
  dholki: Dholki,
  dhol: Dhol,
  tasha: Tasha,
  sambal: Sambal,
  halgi: Halgi,
  daf: Daf,
  khanjiri: Khanjiri,
  tabla: Tabla,
  mridang: Mridang,
  ghumat: Ghumat,
  taal: Manjira,
  chiplya: Chiplya,
  lezim: Lezim,
  tuntune: Tuntune,
  ektari: Ektara,
  bansuri: Bansuri,
  sanai: Sanai,
  tarpa: Tarpa,
  tutari: Tutari,
  peti: Harmonium,
};

export function artFor(slug) {
  return INSTRUMENT_ART[slug] ?? Dholki;
}
