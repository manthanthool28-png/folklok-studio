/**
 * An endless ticker. The track holds the items twice, so translating it by
 * exactly -50% lands the second copy where the first began and the loop is
 * seamless — no measuring, no JavaScript. Hovering pauses it.
 */
export function Marquee({ items, duration = '42s', className = '' }) {
  const run = (key) => (
    <ul key={key} className="flex shrink-0 items-center" aria-hidden={key === 'b'}>
      {items.map((item, i) => (
        <li key={i} className="flex items-center gap-8 px-8">
          <span className="font-display text-2xl whitespace-nowrap text-cream/70 sm:text-3xl">
            {item.mr}
          </span>
          <span className="font-body text-xs uppercase tracking-[0.2em] whitespace-nowrap text-marigold/70">
            {item.en}
          </span>
          <span aria-hidden="true" className="text-marigold/40">
            ◆
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className={`marquee-wrap relative overflow-hidden ${className}`}
      style={{
        maskImage: 'linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)',
        WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)',
      }}
    >
      <div className="marquee" style={{ '--marquee-dur': duration }}>
        {run('a')}
        {run('b')}
      </div>
    </div>
  );
}
