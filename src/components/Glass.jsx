import { useSpotlight, useTilt } from '../lib/interactions';

/**
 * A frosted surface. `tone` picks the palette: "dark" for panels over the
 * espresso sections, "light" for panels on the cream field.
 *
 * Spotlight and tilt are opt-in per card — used everywhere they'd become
 * noise rather than depth.
 */
export function GlassCard({
  children,
  tone = 'light',
  spotlight = true,
  tilt = false,
  className = '',
  as: Tag = 'div',
  ...rest
}) {
  const spot = useSpotlight();
  const tiltHandlers = useTilt();

  // One element, up to two pointer behaviours — merge rather than nest, so
  // the tilt transform and the spotlight gradient share a border radius.
  const ref = tilt ? tiltHandlers.ref : spot.ref;

  const onPointerMove = (e) => {
    if (spotlight) spot.onPointerMove(e);
    if (tilt) tiltHandlers.onPointerMove(e);
  };

  const onPointerLeave = (e) => {
    if (tilt) tiltHandlers.onPointerLeave(e);
  };

  // When both are active the spotlight needs the same node the tilt holds.
  const attachBoth = (node) => {
    if (tilt) tiltHandlers.ref.current = node;
    if (spotlight) spot.ref.current = node;
  };

  return (
    <Tag
      ref={tilt && spotlight ? attachBoth : ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={[
        tone === 'dark' ? 'glass' : 'glass-light',
        spotlight && 'spotlight',
        tilt && 'tilt',
        'rounded-3xl',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Content layer that floats above a tilting card face. */
export function GlassLayer({ children, className = '' }) {
  return <div className={`tilt-layer ${className}`}>{children}</div>;
}
