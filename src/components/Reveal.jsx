import { useEffect, useRef, useState } from 'react';

/**
 * Fades and lifts its children into view once, on scroll.
 *
 * The transition lives in styles.css — this only flips a flag, so nothing but
 * an IntersectionObserver ships to the phone.
 *
 * The reveal is deliberately fail-safe: content starts hidden, so it must
 * never be possible for it to stay hidden. Three ways it can un-hide:
 *   1. the observer fires (the normal path),
 *   2. it was already on screen at mount — revealed on the next frame, so the
 *      animation still plays for above-the-fold content without depending on
 *      an observer callback ever arriving,
 *   3. a backstop timer, for renderers that run JS but never settle observers
 *      (screenshotters, print, some crawlers and in-app browsers).
 * Without 2 and 3 a missed callback means a permanently blank page.
 */
const BACKSTOP_MS = 1200;

export function Reveal({ children, delay = 0, as: Tag = 'div', className = '', ...rest }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let raf = 0;
    let timer = 0;
    let observer;

    const show = () => setVisible(true);

    // (2) Already on screen — reveal next frame so the transition still runs.
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      raf = requestAnimationFrame(show);
    } else if (typeof IntersectionObserver === 'function') {
      // (1) The normal path.
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            show();
            observer.disconnect();
          }
        },
        { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
      );
      observer.observe(node);
    } else {
      show();
    }

    // (3) Backstop.
    timer = setTimeout(show, BACKSTOP_MS + delay);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      observer?.disconnect();
    };
  }, [delay]);

  return (
    <Tag
      ref={ref}
      data-visible={visible}
      style={{ transitionDelay: `${delay}ms` }}
      className={`reveal ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
