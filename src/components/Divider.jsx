import { Reveal } from './Reveal';
import { Swirl } from './Swirl';

/** Hand-drawn section break — used instead of a plain <hr>. */
export function Divider({ tone = 'espresso', className = '' }) {
  const color = tone === 'cream' ? 'var(--color-marigold)' : 'var(--color-espresso)';

  return (
    <Reveal className={`flex justify-center py-12 ${className}`}>
      <Swirl className="h-10 w-full max-w-md opacity-60" color={color} width={2} />
    </Reveal>
  );
}
