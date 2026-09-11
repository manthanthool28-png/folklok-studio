/**
 * The flourish from the wordmark — a tabla stroke resolving into a sound
 * wave. Recurring transition motif: section dividers, hero, page heads.
 * Inside a <Reveal> it draws itself in.
 */
export function Swirl({ className = '', color = 'currentColor', width = 2.5 }) {
  return (
    <svg
      viewBox="0 0 400 60"
      fill="none"
      aria-hidden="true"
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      <path
        className="swirl-path"
        style={{ '--swirl-len': 520 }}
        d="M4 46C34 46 52 8 84 8c26 0 30 38 56 38s30-38 56-38 30 38 56 38 30-38 56-38c22 0 34 20 88 20"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
      />
    </svg>
  );
}

/** The single tapering curl that hangs off the logo's "k". */
export function SwirlCurl({ className = '', color = 'currentColor' }) {
  return (
    <svg viewBox="0 0 120 90" fill="none" aria-hidden="true" className={className}>
      <path
        className="swirl-path"
        style={{ '--swirl-len': 240 }}
        d="M8 6c0 34 22 52 52 58 22 4 38-6 44-22"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
