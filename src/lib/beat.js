import { useCallback, useEffect, useRef, useState } from 'react';
import { audioCtx, strikeAt } from './instrumentSynth';

/**
 * The beat machine's clock.
 *
 * setInterval is far too rough to play a rhythm with — it drifts, and it stalls
 * whenever the main thread is busy, which on this site means whenever someone
 * scrolls. So the timer never plays anything itself: it wakes every 25ms and
 * schedules any stroke falling inside the next 120ms directly on the Web Audio
 * clock, which runs on the audio thread and does not drift. This is the
 * standard lookahead scheduler.
 *
 * The cursor the page draws is a separate concern. Scheduled strokes are pushed
 * onto a queue with their audio-clock time, and a rAF loop pops them as that
 * time arrives, so the highlight lands with the sound instead of ~120ms early.
 */
const LOOKAHEAD_MS = 25;
const SCHEDULE_AHEAD = 0.12;

/** structuredClone is not old enough to rely on for phones this site has to run on. */
const clonePattern = (lanes) =>
  Object.fromEntries(Object.entries(lanes).map(([slug, row]) => [slug, [...row]]));

export function useBeatMachine(beat, { muted = false, volume = 0.85 } = {}) {
  const steps = beat.matra * 2;

  const [lanes, setLanes] = useState(() => clonePattern(beat.lanes));
  const [bpm, setBpm] = useState(beat.bpm);
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(-1);

  // The scheduler runs outside React, so everything it reads lives in a ref.
  const lanesRef = useRef(lanes);
  const bpmRef = useRef(bpm);
  const mutedRef = useRef(muted);
  const nextTimeRef = useRef(0);
  const stepRef = useRef(0);
  const stepsRef = useRef(steps);
  const masterRef = useRef(null);
  const timerRef = useRef(null);
  const rafRef = useRef(null);
  const queueRef = useRef([]);

  lanesRef.current = lanes;
  bpmRef.current = bpm;
  mutedRef.current = muted;
  stepsRef.current = steps;

  // A different beat means a different grid, a different tempo and a different
  // number of steps — reset rather than carrying the old pattern across.
  useEffect(() => {
    setLanes(clonePattern(beat.lanes));
    setBpm(beat.bpm);
    stepRef.current = 0;
  }, [beat]);

  const stop = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    timerRef.current = null;
    rafRef.current = null;
    // Each run gets its own output node; leaving stopped ones connected piles
    // them up on the destination over a long session.
    masterRef.current?.disconnect();
    masterRef.current = null;
    queueRef.current = [];
    setPlaying(false);
    setStep(-1);
  }, []);

  const start = useCallback(() => {
    const ac = audioCtx();
    if (!ac) return false;

    const master = ac.createGain();
    master.gain.value = volume;
    master.connect(ac.destination);
    masterRef.current = master;

    stepRef.current = 0;
    nextTimeRef.current = ac.currentTime + 0.08;
    queueRef.current = [];
    setPlaying(true);

    timerRef.current = setInterval(() => {
      // One matra is one beat, and each matra is two grid cells.
      const stepDur = 60 / bpmRef.current / 2;
      while (nextTimeRef.current < ac.currentTime + SCHEDULE_AHEAD) {
        const i = stepRef.current;
        const at = nextTimeRef.current;

        // A shorter pattern can leave the cursor past its own end for one tick.
        if (i >= stepsRef.current) {
          stepRef.current = 0;
          continue;
        }

        if (!mutedRef.current) {
          for (const [slug, row] of Object.entries(lanesRef.current)) {
            const cell = row[i];
            if (cell) strikeAt(ac, master, slug, at, cell === 2);
          }
        }
        queueRef.current.push({ step: i, time: at });

        stepRef.current = (i + 1) % stepsRef.current;
        nextTimeRef.current = at + stepDur;
      }
    }, LOOKAHEAD_MS);

    const draw = () => {
      const q = queueRef.current;
      while (q.length && q[0].time <= ac.currentTime) setStep(q.shift().step);
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return true;
  }, [volume]);

  const toggle = useCallback(() => {
    if (timerRef.current) stop();
    else start();
  }, [start, stop]);

  // The scheduler reads its step count from a ref, so switching beats while it
  // runs just changes what it plays — no restart, no gap.
  useEffect(() => stop, [stop]);

  /** Cycle one cell: silent → stroke → accent → silent. */
  const cycleCell = useCallback((slug, i) => {
    setLanes((prev) => {
      const row = [...prev[slug]];
      row[i] = (row[i] + 1) % 3;
      return { ...prev, [slug]: row };
    });
  }, []);

  const clear = useCallback(() => {
    setLanes((prev) =>
      Object.fromEntries(Object.keys(prev).map((slug) => [slug, new Array(steps).fill(0)]))
    );
  }, [steps]);

  const reset = useCallback(() => {
    setLanes(clonePattern(beat.lanes));
    setBpm(beat.bpm);
  }, [beat]);

  const edited = JSON.stringify(lanes) !== JSON.stringify(beat.lanes);

  return { lanes, steps, bpm, setBpm, playing, step, start, stop, toggle, cycleCell, clear, reset, edited };
}
