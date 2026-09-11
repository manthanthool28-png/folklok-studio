/**
 * Photos are picked up from src/assets/photos/ automatically — drop a file in
 * and it appears. No manifest to keep in sync, and no chance of the site
 * referencing an image that isn't there.
 *
 * Vite resolves this glob at build time, so each photo still gets hashed,
 * fingerprinted and served like any other asset.
 */
const modules = import.meta.glob('../assets/photos/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  import: 'default',
});

/** [{ name: 'live-kalidas-1', src: '/assets/live-kalidas-1-a1b2.jpg' }, …] */
export const photos = Object.entries(modules)
  .map(([path, src]) => ({
    name: path.split('/').pop().replace(/\.[^.]+$/, ''),
    src,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

/** Every photo whose filename starts with the given prefix. */
export function photosByPrefix(prefix) {
  return photos.filter((p) => p.name.toLowerCase().startsWith(prefix.toLowerCase()));
}

/** The first photo matching a prefix, or null — callers fall back to a marker. */
export function photoByPrefix(prefix) {
  return photosByPrefix(prefix)[0] ?? null;
}

/**
 * Photos for the homepage strip: anything tagged `live-`, falling back to
 * whatever else is in the folder so a handful of unnamed files still produces
 * a gallery rather than an empty row.
 *
 * Capped deliberately. The strip scrolls horizontally, so an uncapped list
 * means someone who drags to the end pulls every photo in the project — with
 * 47 of them that's tens of megabytes on a phone. The rest stay available to
 * other pages through photosByPrefix.
 */
export function galleryPhotos(limit = 12) {
  const live = photosByPrefix('live-');
  const pool =
    live.length >= 4
      ? live
      : [...live, ...photos.filter((p) => !live.includes(p) && !p.name.startsWith('hero-'))];
  return pool.slice(0, limit);
}

export const hasPhotos = photos.length > 0;
