import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import wordmark from '../assets/folklok-wordmark.png';

export const NAV_LINKS = [
  { to: '/', label: 'Home', mr: 'मुख्यपृष्ठ' },
  { to: '/about', label: 'About', mr: 'आमच्याविषयी' },
  { to: '/instruments', label: 'Instruments', mr: 'वाद्ये' },
  { to: '/members', label: 'Members', mr: 'सदस्य' },
  { to: '/music', label: 'Music', mr: 'संगीत' },
  { to: '/shows', label: 'Shows', mr: 'कार्यक्रम' },
  { to: '/booking', label: 'Booking', mr: 'बुकिंग' },
];

/**
 * A single marigold pill that slides between nav items rather than one
 * highlight per item switching on and off. It's the detail that makes a
 * navbar feel native: the eye tracks one object moving, so the change of
 * section reads as continuous.
 */
function useSlidingIndicator(pathname) {
  const listRef = useRef(null);
  const [box, setBox] = useState(null);

  useLayoutEffect(() => {
    const measure = () => {
      const list = listRef.current;
      if (!list) return;
      const active = list.querySelector('[data-active="true"]');
      if (!active) return setBox(null);
      setBox({ left: active.offsetLeft, width: active.offsetWidth });
    };

    measure();

    // Webfonts land after first paint and change the text width, so measure
    // again once they're ready or the pill sits slightly off.
    document.fonts?.ready.then(measure).catch(() => {});
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [pathname]);

  return { listRef, box };
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { listRef, box } = useSlidingIndicator(pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <nav
        aria-label="Main"
        className={`glass pointer-events-auto mx-auto flex items-center justify-between rounded-full pl-4 pr-2
          transition-all duration-500 ease-[var(--ease-out-quint)] sm:pl-6
          ${scrolled ? 'max-w-5xl py-1.5' : 'max-w-6xl py-2.5'}`}
      >
        <Link to="/" className="shrink-0 py-1" aria-label="Folklok — home">
          <img
            src={wordmark}
            alt="Folklok"
            width="1782"
            height="919"
            className={`w-auto transition-all duration-500 ease-[var(--ease-out-quint)]
              ${scrolled ? 'h-8' : 'h-10'}`}
          />
        </Link>

        <div ref={listRef} className="relative hidden items-center lg:flex">
          {/* The pill itself — one element, moved. */}
          {box && (
            <span
              aria-hidden="true"
              className="absolute inset-y-0 rounded-full bg-marigold"
              style={{
                left: box.left,
                width: box.width,
                transition:
                  'left 0.5s var(--ease-spring), width 0.5s var(--ease-spring)',
              }}
            />
          )}

          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              data-active={pathname === link.to}
              className={({ isActive }) =>
                `relative z-10 rounded-full px-4 py-2 font-body text-sm font-500 transition-colors duration-300 ${
                  isActive ? 'text-espresso' : 'text-cream/80 hover:text-cream'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="flex h-10 w-10 items-center justify-center rounded-full text-cream transition-colors hover:bg-cream/10 lg:hidden"
        >
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M5 5l14 14M19 5L5 19" /> : <path d="M4 8h16M4 16h16" />}
          </svg>
        </button>
      </nav>

      {open && (
        <div
          id="mobile-nav"
          className="glass pointer-events-auto mx-auto mt-2 max-w-6xl overflow-hidden rounded-3xl lg:hidden"
        >
          <ul className="p-2">
            {NAV_LINKS.map((link, i) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  style={{
                    animation: `reveal-in 0.45s var(--ease-out-quint) both`,
                    animationDelay: `${i * 40}ms`,
                  }}
                  className={({ isActive }) =>
                    `flex items-baseline justify-between rounded-2xl px-4 py-3 font-body transition-colors ${
                      isActive ? 'bg-marigold text-espresso' : 'text-cream/85 hover:bg-cream/10'
                    }`
                  }
                >
                  <span className="text-lg">{link.label}</span>
                  <span className="font-display text-sm opacity-60">{link.mr}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
