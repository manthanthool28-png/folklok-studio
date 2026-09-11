import { Link } from 'react-router-dom';
import site from '../content/site.json';
import wordmark from '../assets/folklok-wordmark.png';
import { NAV_LINKS } from './Nav';
import { Socials } from './Socials';
import { Needed } from './Needed';
import { IconMail, IconPhone } from './Icons';
import { Swirl } from './Swirl';
import { useLang } from '../lib/lang';
import { Aurora } from './Aurora';

export function Footer() {
  const { t } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-espresso text-cream">
      <Aurora className="opacity-60" />
      <div className="texture-grain absolute inset-0" />
      <div className="relative">
      <Swirl className="mx-auto h-10 w-full max-w-lg pt-12 opacity-45" color="var(--color-marigold)" width={2} />

      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <img src={wordmark} alt="Folklok" width="1782" height="919" className="h-12 w-auto" />
          <p className="mt-5 font-display text-lg text-marigold">{site.tagline.mr}</p>
          <p className="mt-1 font-body text-sm text-cream/60 italic">{site.tagline.en}</p>
          <Socials className="mt-7" />
        </div>

        <nav aria-label="Footer">
          <h2 className="font-display text-sm uppercase tracking-[0.18em] text-cream/50">{t('common.explore')}</h2>
          <ul className="mt-4 space-y-2.5">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="font-body text-cream/80 transition-colors hover:text-marigold"
                >
                  {t(`nav.${link.key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-display text-sm uppercase tracking-[0.18em] text-cream/50">{t('common.bookings')}</h2>
          <ul className="mt-4 space-y-3">
            <li className="flex items-center gap-2.5">
              <IconMail className="h-4.5 w-4.5 shrink-0 text-marigold" />
              {site.contact.bookingEmail ? (
                <a
                  href={`mailto:${site.contact.bookingEmail}`}
                  className="font-body text-cream/80 transition-colors hover:text-marigold"
                >
                  {site.contact.bookingEmail}
                </a>
              ) : (
                <Needed>Booking email</Needed>
              )}
            </li>
            <li className="flex items-center gap-2.5">
              <IconPhone className="h-4.5 w-4.5 shrink-0 text-marigold" />
              {site.contact.bookingPhone ? (
                <a
                  href={`tel:${site.contact.bookingPhone.replace(/\s/g, '')}`}
                  className="font-body text-cream/80 transition-colors hover:text-marigold"
                >
                  {site.contact.bookingPhone}
                </a>
              ) : (
                <Needed>Phone</Needed>
              )}
            </li>
          </ul>

          <Link
            to="/booking"
            className="mt-6 inline-block rounded-full bg-marigold px-5 py-2.5 font-body text-sm font-600 text-espresso shadow-[0_6px_22px_rgba(245,183,0,0.3)] transition-all duration-300 hover:bg-marigold-light hover:shadow-[0_10px_30px_rgba(245,183,0,0.45)]"
          >
            {t('common.bookFolklok')}
          </Link>
        </div>
      </div>

      <div className="border-t border-cream/12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-5 py-6 font-body text-xs text-cream/45 sm:flex-row sm:px-8">
          <p>© {year} Folklok. All rights reserved.</p>
          <p>
            {site.baseCity ? site.baseCity : <Needed>Base city</Needed>} · Marathi folk music
          </p>
        </div>
      </div>
      </div>
    </footer>
  );
}
