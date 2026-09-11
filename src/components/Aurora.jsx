/**
 * Slow-drifting colour behind the glass panels. Purely decorative, and
 * deliberately low-contrast — it exists so the frosted surfaces have
 * something to refract. Without movement back here, glass reads as flat
 * translucency.
 */
const BLOBS = [
  { color: 'var(--color-marigold)', size: '46rem', top: '-12%', left: '-8%', dur: '34s', delay: '0s', opacity: 0.34 },
  { color: 'var(--color-terracotta)', size: '38rem', top: '35%', left: '58%', dur: '42s', delay: '-8s', opacity: 0.3 },
  { color: 'var(--color-brass)', size: '32rem', top: '62%', left: '12%', dur: '38s', delay: '-16s', opacity: 0.26 },
];

export function Aurora({ className = '' }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {BLOBS.map((b, i) => (
        <span
          key={i}
          className="aurora-blob"
          style={{
            background: b.color,
            width: b.size,
            height: b.size,
            top: b.top,
            left: b.left,
            opacity: b.opacity,
            '--dur': b.dur,
            '--delay': b.delay,
          }}
        />
      ))}
    </div>
  );
}
