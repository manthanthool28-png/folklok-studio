import { useEffect, useState } from 'react';
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

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the drawer on navigation, and don't let the page scroll behind it.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const onHome = pathname === '/';
  const solid = scrolled || !onHome || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid ? 'texture-grain bg-espresso shadow-lg shadow-ink/20' : 'bg-transparent'
      }`}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8"
      >
        <Link to="/" className="shrink-0" aria-label="Folklok — home">
          <img
            src={wordmark}
            alt="Folklok"
            width="1782"
            height="919"
            className="h-11 w-auto transition-transform duration-300 hover:scale-[1.04] md:h-12"
          />
        </Link>

        <ul className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `relative font-body text-sm font-500 tracking-wide transition-colors ${
                    isActive ? 'text-marigold' : 'text-cream/85 hover:text-marigold'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    <span
                      className={`absolute -bottom-1.5 left-0 h-px bg-marigold transition-all duration-300 ${
                        isActive ? 'w-full' : 'w-0'
                      }`}
                    />
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="flex h-11 w-11 items-center justify-center rounded-md text-cream lg:hidden"
        >
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M5 5l14 14M19 5L5 19" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>

      {open && (
        <div id="mobile-nav" className="texture-grain border-t border-cream/12 bg-espresso lg:hidden">
          <ul className="mx-auto max-w-7xl px-5 pb-7 pt-3 sm:px-8">
            {NAV_LINKS.map((link) => (
              <li key={link.to} className="border-b border-cream/10 last:border-0">
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `flex items-baseline justify-between py-3.5 font-body transition-colors ${
                      isActive ? 'text-marigold' : 'text-cream/85'
                    }`
                  }
                >
                  <span className="text-lg">{link.label}</span>
                  <span className="font-display text-sm text-cream/45">{link.mr}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
