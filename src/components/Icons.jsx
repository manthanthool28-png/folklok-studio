/* Hand-rolled icon set — a handful of glyphs, rather than a 600-icon package
   for a site that uses six of them. */

const base = { viewBox: '0 0 24 24', 'aria-hidden': 'true', focusable: 'false' };

export function IconInstagram(p) {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconYouTube(p) {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <rect x="2" y="5" width="20" height="14" rx="4" />
      <path d="M10 9.2l5 2.8-5 2.8z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconSpotify(p) {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...p}>
      <circle cx="12" cy="12" r="9.2" />
      <path d="M7.4 9.3c3-.8 6.2-.5 8.8 1" />
      <path d="M8 12.4c2.4-.6 4.9-.4 7 .8" />
      <path d="M8.6 15.4c1.9-.5 3.8-.3 5.5.6" />
    </svg>
  );
}

export function IconFacebook(p) {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <path d="M14.8 8.2h-1.3c-.8 0-1.3.5-1.3 1.3V11h2.5l-.4 2.4h-2.1v4.3" strokeLinecap="round" />
      <path d="M9.6 11h2.6" strokeLinecap="round" />
    </svg>
  );
}

export function IconMail(p) {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
      <path d="M3.5 7l8.5 6 8.5-6" strokeLinecap="round" />
    </svg>
  );
}

export function IconPhone(p) {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...p}>
      <path d="M6.5 3.5h3l1.5 4L9 9a11 11 0 006 6l1.5-2 4 1.5v3a2 2 0 01-2.2 2A16.5 16.5 0 014.5 5.7 2 2 0 016.5 3.5z" />
    </svg>
  );
}

export function IconArrow(p) {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M5 12h13M12.5 6l6 6-6 6" />
    </svg>
  );
}

export function IconPin(p) {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <path d="M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  );
}

export const SOCIAL_ICONS = {
  instagram: IconInstagram,
  youtube: IconYouTube,
  spotify: IconSpotify,
  facebook: IconFacebook,
};
