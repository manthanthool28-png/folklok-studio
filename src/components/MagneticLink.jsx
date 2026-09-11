import { Link } from 'react-router-dom';
import { useMagnetic } from '../lib/interactions';

/**
 * A call to action that leans toward the cursor as it approaches. The pull is
 * small on purpose — enough to feel alive, not enough to make the target
 * hard to hit.
 */
export function MagneticLink({ to, href, children, className = '', ...rest }) {
  const { ref, onPointerMove, onPointerLeave } = useMagnetic();

  const inner = (
    <span
      ref={ref}
      className="inline-flex items-center gap-2"
      style={{ transition: 'transform 0.45s var(--ease-spring)' }}
    >
      {children}
    </span>
  );

  const shared = {
    onPointerMove,
    onPointerLeave,
    className: `shimmer inline-flex items-center justify-center ${className}`,
    ...rest,
  };

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer noopener" {...shared}>
        {inner}
      </a>
    );
  }

  return (
    <Link to={to} {...shared}>
      {inner}
    </Link>
  );
}
