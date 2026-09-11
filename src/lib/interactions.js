import { useCallback, useEffect, useRef, useState } from 'react';

/** Respects the OS "reduce motion" setting, and reacts if it's toggled. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return reduced;
}

/**
 * Writes the pointer's position into --mx/--my as percentages, for the
 * .spotlight gradient to follow.
 *
 * Written straight to the style attribute rather than through React state:
 * this fires on every pointer move, and a re-render per frame would make the
 * whole page stutter to animate one gradient.
 */
export function useSpotlight() {
  const ref = useRef(null);

  const onPointerMove = useCallback((e) => {
    const node = ref.current;
    if (!node) return;
    const r = node.getBoundingClientRect();
    node.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
    node.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
  }, []);

  return { ref, onPointerMove };
}

/**
 * Tilts an element toward the pointer. `max` is the peak rotation in degrees —
 * past about 10 it stops reading as depth and starts reading as a wobble.
 */
export function useTilt({ max = 7, scale = 1.02 } = {}) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const frame = useRef(0);

  const onPointerMove = useCallback(
    (e) => {
      const node = ref.current;
      if (!node || reduced) return;

      // Coalesce to one write per frame; pointermove can fire far faster.
      cancelAnimationFrame(frame.current);
      const { clientX, clientY } = e;
      frame.current = requestAnimationFrame(() => {
        const r = node.getBoundingClientRect();
        const px = (clientX - r.left) / r.width - 0.5;
        const py = (clientY - r.top) / r.height - 0.5;
        node.dataset.tilting = 'true';
        node.style.setProperty('--ry', `${px * max * 2}deg`);
        node.style.setProperty('--rx', `${-py * max * 2}deg`);
        node.style.setProperty('--tilt-scale', String(scale));
      });
    },
    [max, scale, reduced]
  );

  const onPointerLeave = useCallback(() => {
    const node = ref.current;
    if (!node) return;
    cancelAnimationFrame(frame.current);
    node.dataset.tilting = 'false';
    node.style.setProperty('--rx', '0deg');
    node.style.setProperty('--ry', '0deg');
    node.style.setProperty('--tilt-scale', '1');
  }, []);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  return { ref, onPointerMove, onPointerLeave };
}

/**
 * Pulls an element a little toward the cursor as it approaches — the button
 * feels like it wants to be pressed. `strength` is how far it may travel.
 */
export function useMagnetic({ strength = 0.32 } = {}) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  const onPointerMove = useCallback(
    (e) => {
      const node = ref.current;
      if (!node || reduced) return;
      const r = node.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * strength;
      const y = (e.clientY - (r.top + r.height / 2)) * strength;
      node.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    },
    [strength, reduced]
  );

  const onPointerLeave = useCallback(() => {
    const node = ref.current;
    if (node) node.style.transform = 'translate3d(0,0,0)';
  }, []);

  return { ref, onPointerMove, onPointerLeave };
}

/** How far down the page we are, 0 to 1. */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? Math.min(window.scrollY / max, 1) : 0);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return progress;
}

/** Raw scroll offset, for parallax. */
export function useScrollY() {
  const [y, setY] = useState(0);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setY(window.scrollY));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return y;
}

/**
 * Click-and-drag scrolling for a horizontal strip, plus arrow-key and button
 * control.
 *
 * A horizontally-scrolling row is easy on a trackpad and awkward with a mouse —
 * there's no wheel axis for it, so without this a desktop visitor often can't
 * tell the row moves at all. Touch already works natively, so the pointer
 * handlers deliberately ignore touch and let the browser do it.
 */
export function useDragScroll() {
  const ref = useRef(null);
  const state = useRef({ down: false, startX: 0, startScroll: 0, moved: 0 });

  const onPointerDown = useCallback((e) => {
    // Leave touch and pen to native momentum scrolling — hijacking them makes
    // the strip feel worse on a phone, not better.
    if (e.pointerType !== 'mouse') return;
    const node = ref.current;
    if (!node) return;
    state.current = {
      down: true,
      startX: e.clientX,
      startScroll: node.scrollLeft,
      moved: 0,
    };
    node.setPointerCapture?.(e.pointerId);
    node.dataset.dragging = 'true';
  }, []);

  const onPointerMove = useCallback((e) => {
    const node = ref.current;
    if (!node || !state.current.down) return;
    const dx = e.clientX - state.current.startX;
    state.current.moved = Math.abs(dx);
    node.scrollLeft = state.current.startScroll - dx;
  }, []);

  const endDrag = useCallback((e) => {
    const node = ref.current;
    if (!node) return;
    state.current.down = false;
    node.dataset.dragging = 'false';
    if (e?.pointerId != null) node.releasePointerCapture?.(e.pointerId);
  }, []);

  /** Scroll by roughly one card, in either direction. */
  const scrollByCard = useCallback((direction) => {
    const node = ref.current;
    if (!node) return;
    const card = node.querySelector('[data-card]');
    const step = card ? card.getBoundingClientRect().width + 16 : node.clientWidth * 0.8;
    node.scrollBy({ left: step * direction, behavior: 'smooth' });
  }, []);

  return {
    ref,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
      onPointerLeave: endDrag,
    },
    scrollByCard,
  };
}
