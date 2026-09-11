# Photos

Drop performance photos straight into this folder. Nothing needs registering —
the site picks up whatever is here via `src/lib/photos.js`.

## Naming decides where a photo appears

The filename prefix is the only wiring:

| Prefix        | Used for                                        |
| ------------- | ----------------------------------------------- |
| `hero-*`      | Full-bleed background on the homepage hero      |
| `group-*`     | The collective shot on Members                  |
| `live-*`      | The homepage gallery strip, and About            |
| `crew-*`      | Behind-the-scenes / rehearsal, on About         |
| `venue-*`     | Show archive imagery                            |
| `instrument-<slug>-*` | That instrument's card (e.g. `instrument-dholki-1.jpg`) |

Anything not matching a prefix still shows in the gallery strip.

## Optimise before committing

Phone photos are 3–5 MB each and would undo the whole point of a 68 KB build.
Run this once after adding files — it resizes to 2000px, strips EXIF, and
re-encodes at quality 72, in place:

```bash
npm run photos
```

It uses `sips`, which ships with macOS, so there's nothing to install.
