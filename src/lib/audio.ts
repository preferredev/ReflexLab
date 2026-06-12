/**
 * Procedurally generated SFX via WebAudio — no audio assets shipped.
 * The context is created lazily on first play (after a user gesture, so
 * autoplay policies are satisfied: shots only happen while pointer-locked).
 */
let ctx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (ctx === null) {
    try {
      ctx = new AudioContext();
    } catch {
      return null;
    }
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function blip(
  freq: number,
  durationSec: number,
  type: OscillatorType,
  peak: number,
  slideTo?: number,
): void {
  if (peak <= 0.001) return;
  const ac = getContext();
  if (!ac) return;

  const osc = ac.createOscillator();
  const gain = ac.createGain();
  const now = ac.currentTime;

  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  if (slideTo !== undefined) {
    osc.frequency.exponentialRampToValueAtTime(slideTo, now + durationSec);
  }

  gain.gain.setValueAtTime(peak, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

  osc.connect(gain).connect(ac.destination);
  osc.start(now);
  osc.stop(now + durationSec);
}

/** Short rising chirp on a successful hit. */
export function playHit(volume: number): void {
  blip(900, 0.08, "triangle", 0.22 * volume, 1400);
}

/** Low dull thud on a miss. */
export function playMiss(volume: number): void {
  blip(220, 0.1, "square", 0.08 * volume, 140);
}

/** Two-note sting when the session ends. */
export function playFinish(volume: number): void {
  blip(520, 0.18, "sine", 0.2 * volume);
  window.setTimeout(() => blip(780, 0.25, "sine", 0.2 * volume), 140);
}
