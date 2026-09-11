import showsData from '../content/shows.json';
import musicData from '../content/music.json';

/** Midnight today — a show playing tonight still counts as upcoming. */
function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function parseShowDate(show) {
  const d = new Date(`${show.date}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Upcoming shows, soonest first. Undated entries are dropped, not guessed at. */
export function upcomingShows() {
  const today = startOfToday();
  return showsData.shows
    .map((s) => ({ ...s, _d: parseShowDate(s) }))
    .filter((s) => s._d && s._d >= today)
    .sort((a, b) => a._d - b._d);
}

/** Past shows, most recent first — the archive timeline. */
export function pastShows() {
  const today = startOfToday();
  return showsData.shows
    .map((s) => ({ ...s, _d: parseShowDate(s) }))
    .filter((s) => s._d && s._d < today)
    .sort((a, b) => b._d - a._d);
}

export function formatShowDate(show) {
  const d = parseShowDate(show);
  if (!d) return null;
  return {
    day: d.toLocaleDateString('en-IN', { day: '2-digit' }),
    month: d.toLocaleDateString('en-IN', { month: 'short' }).toUpperCase(),
    year: d.getFullYear(),
    full: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
  };
}

/** Newest video, used for the homepage highlight. */
export function latestVideo() {
  return musicData.videos[0] ?? null;
}

export function latestRelease() {
  return musicData.releases[0] ?? null;
}
