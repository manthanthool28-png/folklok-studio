/**
 * Instrument sounds, synthesised in the browser.
 *
 * There are no recordings yet, and shipping a dozen audio files for a site
 * tuned to 72KB would be its own problem — so each instrument is built from
 * oscillators and noise with the Web Audio API. These are impressions, not
 * samples: enough that tapping a dholki feels like a dholki. Swap in real
 * recordings when they exist by giving the instrument an `audio` path in
 * instruments.json, which takes priority over this.
 *
 * Nothing plays until a real click. The context is created lazily for the same
 * reason — browsers block audio until a user gesture, and creating it earlier
 * just leaves a suspended context lying around.
 */

let ctx = null;

function audioCtx() {
  if (typeof window === 'undefined') return null;
  const Ctor = window.AudioContext || window.webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

/** Short burst of filtered noise — the "skin" part of any drum. */
function noiseBurst(ac, out, { duration, type = 'bandpass', freq, q = 1, gain = 0.6 }) {
  const frames = Math.floor(ac.sampleRate * duration);
  const buffer = ac.createBuffer(1, frames, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frames; i++) data[i] = Math.random() * 2 - 1;

  const src = ac.createBufferSource();
  src.buffer = buffer;

  const filter = ac.createBiquadFilter();
  filter.type = type;
  filter.frequency.value = freq;
  filter.Q.value = q;

  const env = ac.createGain();
  env.gain.setValueAtTime(gain, ac.currentTime);
  env.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + duration);

  src.connect(filter).connect(env).connect(out);
  src.start();
  src.stop(ac.currentTime + duration);
}

/** Pitched body tone with a decaying envelope. */
function tone(ac, out, { freq, duration, type = 'sine', gain = 0.5, bendTo, delay = 0 }) {
  const t0 = ac.currentTime + delay;
  const osc = ac.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  // The pitch drop is what makes a struck membrane sound struck.
  if (bendTo) osc.frequency.exponentialRampToValueAtTime(bendTo, t0 + duration * 0.8);

  const env = ac.createGain();
  env.gain.setValueAtTime(0.0001, t0);
  env.gain.exponentialRampToValueAtTime(gain, t0 + 0.005);
  env.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

  osc.connect(env).connect(out);
  osc.start(t0);
  osc.stop(t0 + duration + 0.05);
}

const VOICES = {
  // Two-headed folk drum: deep bass head plus a sharp treble slap.
  dholki(ac, out) {
    tone(ac, out, { freq: 150, bendTo: 62, duration: 0.42, type: 'sine', gain: 0.75 });
    noiseBurst(ac, out, { duration: 0.1, freq: 1500, q: 0.7, gain: 0.28 });
    tone(ac, out, { freq: 420, bendTo: 240, duration: 0.16, type: 'triangle', gain: 0.3, delay: 0.005 });
  },

  // Tabla "na" — ringing, tightly pitched, metallic edge from the syahi.
  tabla(ac, out) {
    tone(ac, out, { freq: 320, bendTo: 196, duration: 0.55, type: 'sine', gain: 0.6 });
    tone(ac, out, { freq: 640, bendTo: 400, duration: 0.28, type: 'triangle', gain: 0.22 });
    noiseBurst(ac, out, { duration: 0.06, freq: 2600, q: 1.6, gain: 0.22 });
  },

  // Barrel drum, played with a stick — louder, blunter, longer.
  dhol(ac, out) {
    tone(ac, out, { freq: 110, bendTo: 45, duration: 0.6, type: 'sine', gain: 0.8 });
    noiseBurst(ac, out, { duration: 0.14, freq: 900, q: 0.5, gain: 0.35 });
  },

  // Small brass cymbals — bright, inharmonic, quick.
  manjira(ac, out) {
    [2100, 3170, 4390, 5600].forEach((f, i) =>
      tone(ac, out, { freq: f, duration: 0.5 - i * 0.07, type: 'square', gain: 0.055 })
    );
    noiseBurst(ac, out, { duration: 0.28, type: 'highpass', freq: 5200, gain: 0.14 });
  },

  // Bamboo flute — breath noise over a soft, slightly wavering tone.
  bansuri(ac, out) {
    tone(ac, out, { freq: 587, duration: 1.1, type: 'sine', gain: 0.32 });
    tone(ac, out, { freq: 880, duration: 0.9, type: 'sine', gain: 0.08 });
    noiseBurst(ac, out, { duration: 0.5, type: 'bandpass', freq: 2000, q: 0.8, gain: 0.045 });
  },

  // Reed box — a sustained chord that swells rather than strikes.
  harmonium(ac, out) {
    [261.6, 392, 523.2].forEach((f) =>
      tone(ac, out, { freq: f, duration: 1.2, type: 'sawtooth', gain: 0.12 })
    );
  },

  // One-string drone.
  ektara(ac, out) {
    tone(ac, out, { freq: 196, bendTo: 190, duration: 1.3, type: 'sawtooth', gain: 0.3 });
    tone(ac, out, { freq: 392, duration: 0.8, type: 'triangle', gain: 0.1 });
  },

  // Plucked, rhythmic, buzzy.
  tuntune(ac, out) {
    tone(ac, out, { freq: 220, bendTo: 160, duration: 0.5, type: 'sawtooth', gain: 0.34 });
    noiseBurst(ac, out, { duration: 0.12, freq: 1200, q: 1.2, gain: 0.16 });
  },
};

/** Anything without its own voice falls back to a generic drum tap. */
const DEFAULT_VOICE = VOICES.dholki;

export const SYNTH_SLUGS = Object.keys(VOICES);

/**
 * Play an instrument. Returns false when audio is unavailable or muted, so
 * callers can still run their animation either way.
 */
export function playInstrument(slug, { muted = false, volume = 0.9 } = {}) {
  if (muted) return false;
  const ac = audioCtx();
  if (!ac) return false;

  const master = ac.createGain();
  master.gain.value = volume;
  master.connect(ac.destination);

  (VOICES[slug] ?? DEFAULT_VOICE)(ac, master);
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
