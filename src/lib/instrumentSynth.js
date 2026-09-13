/**
 * Instrument sounds, synthesised in the browser.
 *
 * There are no recordings yet, and shipping twenty audio files for a site tuned
 * to well under 100KB would be its own problem — so each instrument is built
 * from oscillators and filtered noise with the Web Audio API. These are
 * impressions, not samples: enough that tapping a dholki feels like a dholki.
 * Swap in real recordings when they exist by giving the instrument an `audio`
 * path in instruments.json, which takes priority over this.
 *
 * Every voice takes an explicit start time rather than playing "now", because
 * the beat machine schedules strokes ahead of the clock. Passing
 * ac.currentTime gives you an immediate tap.
 *
 * Nothing plays until a real click. The context is created lazily for the same
 * reason — browsers block audio until a user gesture, and creating it earlier
 * just leaves a suspended context lying around.
 */

let ctx = null;

export function audioCtx() {
  if (typeof window === 'undefined') return null;
  const Ctor = window.AudioContext || window.webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

/**
 * Noise buffers are the expensive part — a second of noise is 48,000 random
 * numbers, and the beat machine asks for strokes several times a second. One
 * buffer per context, played back from different offsets, sounds the same and
 * costs nothing after the first call.
 */
let noiseBuffer = null;
function getNoise(ac) {
  if (noiseBuffer && noiseBuffer.sampleRate === ac.sampleRate) return noiseBuffer;
  const frames = ac.sampleRate * 2;
  noiseBuffer = ac.createBuffer(1, frames, ac.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < frames; i++) data[i] = Math.random() * 2 - 1;
  return noiseBuffer;
}

/** Short burst of filtered noise — the "skin" part of any drum, the metal in a cymbal. */
function noise(ac, out, t0, { duration, type = 'bandpass', freq, q = 1, gain = 0.6 }) {
  const src = ac.createBufferSource();
  src.buffer = getNoise(ac);
  src.loop = true;

  const filter = ac.createBiquadFilter();
  filter.type = type;
  filter.frequency.value = freq;
  filter.Q.value = q;

  const env = ac.createGain();
  env.gain.setValueAtTime(gain, t0);
  env.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

  src.connect(filter).connect(env).connect(out);
  // A random offset stops repeated strokes sounding like a copy of each other.
  src.start(t0, Math.random() * 1.5);
  src.stop(t0 + duration + 0.02);
}

/** Pitched body tone with a decaying envelope. */
function tone(ac, out, t0, { freq, duration, type = 'sine', gain = 0.5, bendTo, delay = 0 }) {
  const at = t0 + delay;
  const osc = ac.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, at);
  // The pitch drop is what makes a struck membrane sound struck.
  if (bendTo) osc.frequency.exponentialRampToValueAtTime(bendTo, at + duration * 0.8);

  const env = ac.createGain();
  env.gain.setValueAtTime(0.0001, at);
  env.gain.exponentialRampToValueAtTime(gain, at + 0.005);
  env.gain.exponentialRampToValueAtTime(0.0001, at + duration);

  osc.connect(env).connect(out);
  osc.start(at);
  osc.stop(at + duration + 0.05);
}

/**
 * Each voice is (ac, out, t0, accent). `accent` is true for the bass or
 * emphasised stroke of a pattern — the 2s in beats.json — and is what makes a
 * grid of taps sound like a cycle rather than a metronome.
 */
const VOICES = {
  // ---- drums -------------------------------------------------------------

  // Two-headed folk drum: deep bass head plus a sharp treble slap.
  dholki(ac, out, t, accent) {
    if (accent) {
      tone(ac, out, t, { freq: 150, bendTo: 62, duration: 0.42, gain: 0.75 });
      noise(ac, out, t, { duration: 0.1, freq: 1500, q: 0.7, gain: 0.28 });
    } else {
      tone(ac, out, t, { freq: 430, bendTo: 260, duration: 0.17, type: 'triangle', gain: 0.42 });
      noise(ac, out, t, { duration: 0.06, freq: 2400, q: 1.2, gain: 0.22 });
    }
  },

  // Barrel drum, played with a stick — louder, blunter, longer.
  dhol(ac, out, t, accent) {
    tone(ac, out, t, { freq: accent ? 110 : 160, bendTo: accent ? 45 : 70, duration: accent ? 0.6 : 0.3, gain: 0.8 });
    noise(ac, out, t, { duration: 0.14, freq: 900, q: 0.5, gain: accent ? 0.35 : 0.2 });
  },

  // Metal shell, one tight head, two canes. All crack, no body.
  tasha(ac, out, t, accent) {
    noise(ac, out, t, { duration: accent ? 0.09 : 0.05, type: 'highpass', freq: 3400, gain: accent ? 0.4 : 0.24 });
    tone(ac, out, t, { freq: 900, bendTo: 620, duration: 0.07, type: 'square', gain: 0.1 });
  },

  // Two drums at the waist: straight stick on the low head, curved on the high
  // one — and the curved stick bends the pitch as it strikes.
  sambal(ac, out, t, accent) {
    if (accent) {
      tone(ac, out, t, { freq: 128, bendTo: 58, duration: 0.38, gain: 0.72 });
      noise(ac, out, t, { duration: 0.08, freq: 1100, q: 0.6, gain: 0.24 });
    } else {
      tone(ac, out, t, { freq: 520, bendTo: 330, duration: 0.2, type: 'triangle', gain: 0.34 });
      noise(ac, out, t, { duration: 0.05, freq: 2800, q: 1.4, gain: 0.2 });
    }
  },

  // Flat frame drum, thin sticks. Dry and cutting.
  halgi(ac, out, t, accent) {
    noise(ac, out, t, { duration: 0.11, type: 'bandpass', freq: 1900, q: 0.8, gain: accent ? 0.42 : 0.26 });
    tone(ac, out, t, { freq: 300, bendTo: 170, duration: 0.1, type: 'triangle', gain: 0.2 });
  },

  // Wide frame drum, open hand. More air than the halgi.
  daf(ac, out, t, accent) {
    tone(ac, out, t, { freq: 190, bendTo: 90, duration: 0.3, gain: accent ? 0.6 : 0.34 });
    noise(ac, out, t, { duration: 0.16, type: 'bandpass', freq: 700, q: 0.5, gain: 0.2 });
  },

  // Small frame drum with jingles in the rim.
  khanjiri(ac, out, t, accent) {
    tone(ac, out, t, { freq: 260, bendTo: 140, duration: 0.18, type: 'triangle', gain: accent ? 0.4 : 0.24 });
    noise(ac, out, t, { duration: 0.22, type: 'highpass', freq: 5800, gain: 0.12 });
  },

  // Tabla "na" — ringing, tightly pitched, metallic edge from the syahi.
  tabla(ac, out, t, accent) {
    if (accent) {
      tone(ac, out, t, { freq: 180, bendTo: 74, duration: 0.5, gain: 0.62 });
      noise(ac, out, t, { duration: 0.06, freq: 1200, q: 1, gain: 0.14 });
    } else {
      tone(ac, out, t, { freq: 320, bendTo: 196, duration: 0.55, gain: 0.6 });
      tone(ac, out, t, { freq: 640, bendTo: 400, duration: 0.28, type: 'triangle', gain: 0.22 });
      noise(ac, out, t, { duration: 0.06, freq: 2600, q: 1.6, gain: 0.22 });
    }
  },

  // Barrel drum across the lap — woodier than the tabla, less ring.
  mridang(ac, out, t, accent) {
    if (accent) {
      tone(ac, out, t, { freq: 138, bendTo: 60, duration: 0.45, gain: 0.7 });
      noise(ac, out, t, { duration: 0.07, freq: 800, q: 0.6, gain: 0.16 });
    } else {
      tone(ac, out, t, { freq: 370, bendTo: 230, duration: 0.22, type: 'triangle', gain: 0.36 });
      noise(ac, out, t, { duration: 0.05, freq: 2200, q: 1.3, gain: 0.18 });
    }
  },

  // Clay pot, open at the back — the palm over the opening swoops the note.
  ghumat(ac, out, t, accent) {
    tone(ac, out, t, { freq: accent ? 120 : 210, bendTo: accent ? 78 : 150, duration: 0.34, gain: 0.6 });
    noise(ac, out, t, { duration: 0.05, type: 'lowpass', freq: 600, gain: 0.14 });
  },

  // ---- struck and shaken -------------------------------------------------

  // Small brass cymbals — bright, inharmonic, quick.
  taal(ac, out, t, accent) {
    [2100, 3170, 4390, 5600].forEach((f, i) =>
      tone(ac, out, t, { freq: f, duration: (accent ? 0.5 : 0.24) - i * 0.04, type: 'square', gain: accent ? 0.055 : 0.032 })
    );
    noise(ac, out, t, { duration: accent ? 0.28 : 0.14, type: 'highpass', freq: 5200, gain: 0.14 });
  },

  // Wood first, then the brass discs rattling in their slots.
  chiplya(ac, out, t, accent) {
    noise(ac, out, t, { duration: 0.035, type: 'bandpass', freq: 2400, q: 2.5, gain: accent ? 0.4 : 0.26 });
    noise(ac, out, t, { duration: 0.16, type: 'highpass', freq: 6800, gain: 0.08 });
  },

  // A chain of loose discs on a bow: shaken, so it is noise all the way down.
  lezim(ac, out, t, accent) {
    noise(ac, out, t, { duration: accent ? 0.2 : 0.12, type: 'highpass', freq: 4200, gain: accent ? 0.3 : 0.18 });
    noise(ac, out, t, { duration: 0.05, type: 'bandpass', freq: 1800, q: 1.5, gain: 0.12 });
  },

  // ---- strings -----------------------------------------------------------

  // One string, plucked on the beat, buzzing against its bridge.
  tuntune(ac, out, t, accent) {
    tone(ac, out, t, { freq: 220, bendTo: 160, duration: accent ? 0.6 : 0.4, type: 'sawtooth', gain: 0.34 });
    noise(ac, out, t, { duration: 0.12, freq: 1200, q: 1.2, gain: 0.16 });
  },

  // Gourd drone — longer, rounder, less attack than the tuntune.
  ektari(ac, out, t) {
    tone(ac, out, t, { freq: 196, bendTo: 190, duration: 1.3, type: 'sawtooth', gain: 0.3 });
    tone(ac, out, t, { freq: 392, duration: 0.8, type: 'triangle', gain: 0.1 });
  },

  // ---- wind --------------------------------------------------------------

  // Bamboo flute — breath noise over a soft, slightly wavering tone.
  bansuri(ac, out, t) {
    tone(ac, out, t, { freq: 587, duration: 1.1, gain: 0.32 });
    tone(ac, out, t, { freq: 880, duration: 0.9, gain: 0.08 });
    noise(ac, out, t, { duration: 0.5, freq: 2000, q: 0.8, gain: 0.045 });
  },

  // Double reed — nasal and buzzy, which is the sawtooth's whole job.
  sanai(ac, out, t) {
    tone(ac, out, t, { freq: 466, duration: 1.1, type: 'sawtooth', gain: 0.16 });
    tone(ac, out, t, { freq: 933, duration: 0.9, type: 'sawtooth', gain: 0.05 });
    tone(ac, out, t, { freq: 233, duration: 1.2, type: 'sine', gain: 0.07 });
  },

  // Drone and melody at once, the way the two bamboo pipes do it.
  tarpa(ac, out, t) {
    tone(ac, out, t, { freq: 174.6, duration: 1.6, type: 'sawtooth', gain: 0.14 });
    tone(ac, out, t, { freq: 261.6, duration: 1.5, type: 'square', gain: 0.09 });
    tone(ac, out, t, { freq: 349.2, duration: 1.4, type: 'sawtooth', gain: 0.06 });
    noise(ac, out, t, { duration: 0.9, freq: 1400, q: 0.6, gain: 0.03 });
  },

  // Not a tune, an announcement: one note that swells and holds.
  tutari(ac, out, t) {
    tone(ac, out, t, { freq: 233, duration: 1.5, type: 'sawtooth', gain: 0.22 });
    tone(ac, out, t, { freq: 349.2, duration: 1.3, type: 'square', gain: 0.09, delay: 0.18 });
    tone(ac, out, t, { freq: 466, duration: 1.0, type: 'sawtooth', gain: 0.07, delay: 0.36 });
  },

  // Reed box — a sustained chord that swells rather than strikes.
  peti(ac, out, t) {
    [261.6, 392, 523.2].forEach((f) =>
      tone(ac, out, t, { freq: f, duration: 1.2, type: 'sawtooth', gain: 0.12 })
    );
  },
};

/** Anything without its own voice falls back to a generic drum tap. */
const DEFAULT_VOICE = VOICES.dholki;

export const SYNTH_SLUGS = Object.keys(VOICES);

/** Schedules one stroke at an exact context time. Used by the beat machine. */
export function strikeAt(ac, out, slug, time, accent = false) {
  (VOICES[slug] ?? DEFAULT_VOICE)(ac, out, time, accent);
}

/**
 * Play an instrument now. Returns false when audio is unavailable or muted, so
 * callers can still run their animation either way.
 */
export function playInstrument(slug, { muted = false, volume = 0.9, accent = true } = {}) {
  if (muted) return false;
  const ac = audioCtx();
  if (!ac) return false;

  const master = ac.createGain();
  master.gain.value = volume;
  master.connect(ac.destination);

  strikeAt(ac, master, slug, ac.currentTime, accent);
  return true;
}

/** Plays a real recording when one exists, else falls back to the synth. */
export function playInstrumentOrClip(slug, audioPath, opts = {}) {
  if (opts.muted) return false;
  if (audioPath) {
    const el = new Audio(audioPath);
    el.volume = opts.volume ?? 0.9;
    el.play().catch(() => playInstrument(slug, opts));
    return true;
  }
  return playInstrument(slug, opts);
}
