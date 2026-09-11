# Folklok

Website for **Folklok** — a Marathi folk music band and studio.
_लोकसंगीताचं दान, माय मराठीचं गुणगान_

Built from the brand brief: marigold on deep espresso over a warm cream ground,
Devanagari and Latin set as one type family, hand-drawn swirl dividers instead
of plain rules.

---

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:3000. `npm run build` produces `dist/`.

## The stack, and why it's small

React 18 + Vite + Tailwind v4 + React Router. Four runtime packages, 78
installed in total. There's no component library, no animation library and no
icon package — the site needs eight icons and one scroll-reveal effect, and
both are a few dozen lines here. The production bundle is **65 KB gzipped**,
which matters because most visitors will arrive from an Instagram link on
mobile data.

Scroll reveals are CSS transitions driven by an `IntersectionObserver` in
[`Reveal.jsx`](src/components/Reveal.jsx). YouTube embeds in
[`Music.jsx`](src/pages/Music.jsx) load only the thumbnail until clicked, so a
gallery of videos doesn't pull a megabyte of player JavaScript on load.

---

## Editing content

**All content lives in `src/content/*.json`. You should never need to touch a
`.jsx` file to update the site.**

| File | Holds |
| --- | --- |
| `site.json` | Name, tagline, intro line, founding year, base city, booking email/phone, social URLs, Spotify artist ID |
| `instruments.json` | One entry per instrument — Devanagari + English name, its role, photo, audio clip |
| `members.json` | One entry per member, plus the group shot and the "how we met" line |
| `music.json` | YouTube video IDs, Spotify releases, discography rows |
| `shows.json` | Every show, past and future, in one list |

Two things worth knowing:

- **Shows sort themselves.** Dates are ISO (`YYYY-MM-DD`); upcoming vs. archive
  is computed against today, so a show moves into the history timeline by
  itself the day after it plays. You never edit two lists.
- **Empty is handled.** An empty array renders an honest "nothing here yet"
  panel, not a broken grid.

### The placeholder system

Nothing on this site is invented. Where a real value wasn't available, the
content files hold `null` and the page renders a visible dashed marker rather
than plausible-looking filler — no stock photos stand in for your performances,
and no guessed URL points at an account that may not be yours.

Every marker carries a `data-needed` attribute, so you can count what's
outstanding from the browser console on any page:

```js
document.querySelectorAll('[data-needed]').length
```

Fill the value in `src/content/`, and the marker disappears on its own.

---

## Before this goes live

**Content still needed:**

- [ ] One-line description of Folklok for the hero (`site.intro`)
- [ ] Founding year and base city
- [ ] Booking email and phone
- [ ] Real social URLs — Instagram, YouTube, Spotify, Facebook
- [ ] Spotify artist ID, for the embedded players
- [ ] The founding story, the artistic statement, and any press
- [ ] Band members — name, role, bio, headshot, plus a group shot
- [ ] **Confirm the instrument list.** The six currently listed came from the
      brief's *suggested* set, not from the band; each is flagged `Unconfirmed`
      on the page until you set `confirmed: true`
- [ ] Photos: rehearsal, performance, per-instrument, per-show
- [ ] Audio clips per instrument
- [ ] The "what we offer" blurb for organisers (set length, group size, rider)

**Two build tasks:**

1. **The booking form can't send yet.** With no backend it hands off to the
   visitor's mail client with the enquiry pre-filled, and the submit button
   stays disabled until `site.contact.bookingEmail` is set. A mail-client
   handoff loses anyone browsing without one configured, so before launch point
   `handleSubmit` in [`Booking.jsx`](src/pages/Booking.jsx) at a real endpoint —
   Formspree or Basin are a few lines and need no server.

2. **Search engines see an empty page.** This is a client-rendered app: the
   served HTML is `<div id="root"></div>`, so the band name, genre and location
   the brief wants crawlable aren't in the source. The `<title>`, meta
   description and `MusicGroup` JSON-LD in `index.html` are static and will be
   read, but nothing on the pages themselves is. Fix it with
   [`vite-plugin-prerender`](https://github.com/Front-Yard/vite-plugin-prerender)
   or by moving to Next.js — worth doing before you chase search traffic.

**Assets:** only the horizontal `Folk लोक STUDIO` wordmark was available. The
dholki badge from the brief is missing — it's the natural favicon and mobile
nav mark, so it's worth digging out. There's no favicon set yet.

---

## Not built

- **Audio easter egg** — needs an instrument riff to play; no audio yet.
- **Press kit download** — needs the PDF.
- **Dark mode** — deliberately skipped. The cream ground is core to the brand.
