import { useScrollProgress } from '../lib/interactions';

/** Hairline marigold bar across the top, filling as you read. */
export function ScrollProgress() {
  const progress = useScrollProgress();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-60 h-0.5 origin-left"
    >
      <div
        className="h-full bg-gradient-to-r from-marigold via-marigold-light to-terracotta"
        style={{
          transform: `scaleX(${progress})`,
          transformOrigin: 'left',
          transition: 'transform 0.1s linear',
        }}
      />
    </div>
  );
}
