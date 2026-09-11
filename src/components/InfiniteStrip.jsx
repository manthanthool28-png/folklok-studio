import { useCallback, useEffect, useRef } from 'react';
import { useReducedMotion } from '../lib/interactions';

/**
 * An endlessly looping horizontal strip.
 *
 * The trick is three identical copies of the photos. The strip sits in the
 * middle copy, and whenever scrolling carries it into the first or last copy
 * it jumps by exactly one copy's width — the same photos are under the pointer
 * at the same offset, so the jump is invisible and you can drag forever in
 * either direction.
 *
 * The alternative, appending items as you reach the end, grows the DOM without
 * limit and eventually stutters.
 */
export function InfiniteStrip({ items, renderItem, className = '', gap = 16 }) {
  const ref = useRef(null);
  const drag = useRef({ down: false, startX: 0, startScroll: 0 });
  const recentering = useRef(false);
  const reduced = useReducedMotion();

  const copyWidth = useCallback(() => {
    const node = ref.current;
    if (!node) return 0;
    // One copy is a third of the scrollable content, minus nothing — all three
    // copies are identical, so this stays correct as images load and resize.
    return node.scrollWidth / 3;
  }, []);

  /** Park the strip in the middle copy. */
  const centre = useCallback(() => {
    const node = ref.current;
    if (!node) return;
    const w = copyWidth();
    if (w > 0) node.scrollLeft = w;
  }, [copyWidth]);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    centre();
    // Images arrive after first paint and change the width, so re-centre once
    // the layout settles rather than trusting the first measurement.
    const ro = new ResizeObserver(() => {
      if (!drag.current.down) centre();
    });
    ro.observe(node);
    return () => ro.disconnect();
  }, [centre, items.length]);

  const onScroll = useCallback(() => {
    const node = ref.current;
    if (!node || recentering.current) return;
    const w = copyWidth();
    if (w <= 0) return;

    // Wrap a whole copy at a time, so the offset within the copy is preserved.
    if (node.scrollLeft < w * 0.5) {
      recentering.current = true;
      node.scrollLeft += w;
      recentering.current = false;
    } else if (node.scrollLeft > w * 1.5) {
      recentering.current = true;
      node.scrollLeft -= w;
      recentering.current = false;
    }
  }, [copyWidth]);

  const onPointerDown = useCallback((e) => {
    if (e.pointerType !== 'mouse') return;
    const node = ref.current;
    if (!node) return;
    drag.current = { down: true, startX: e.clientX, startScroll: node.scrollLeft };
    node.setPointerCapture?.(e.pointerId);
    node.dataset.dragging = 'true';
  }, []);

  const onPointerMove = useCallback((e) => {
    const node = ref.current;
    if (!node || !drag.current.down) return;
    node.scrollLeft = drag.current.startScroll - (e.clientX - drag.current.startX);
  }, []);

  const endDrag = useCallback((e) => {
    const node = ref.current;
    if (!node) return;
    drag.current.down = false;
    node.dataset.dragging = 'false';
    if (e?.pointerId != null) node.releasePointerCapture?.(e.pointerId);
  }, []);

  const step = useCallback((direction) => {
    const node = ref.current;
    if (!node) return;
    const card = node.querySelector('[data-card]');
    const width = card ? card.getBoundingClientRect().width + gap : node.clientWidth * 0.8;
    node.scrollBy({ left: width * direction, behavior: 'smooth' });
  }, [gap]);

  // Three copies. Only the middle one is announced — the other two are the same
  // photos again and would be read out three times over.
  const copies = [0, 1, 2];

  return {
    scrollByCard: step,
    element: (
      <div
        ref={ref}
        onScroll={onScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
        tabIndex={0}
        className={`drag-strip flex overflow-x-auto ${className}`}
        style={{ gap, scrollBehavior: reduced ? 'auto' : undefined }}
      >
        {copies.map((copy) => (
          <div
            key={copy}
            className="flex shrink-0"
            style={{ gap }}
            aria-hidden={copy !== 1}
            {...(copy === 1 ? {} : { inert: '' })}
          >
            {items.map((item, i) => renderItem(item, i, copy))}
          </div>
        ))}
      </div>
    ),
  };
}
