import { useFrame } from "@react-three/fiber";
import type { SessionRuntime } from "./runtime";

interface SessionClockProps {
  runtime: SessionRuntime;
  durationSec: number;
  /** Called exactly once when the timer reaches zero. */
  onFinish: () => void;
}

/**
 * Counts the session down inside useFrame, writing only to the runtime.
 * The clock only advances while the pointer is locked, so losing lock
 * (Escape / pause overlay) automatically pauses the session.
 */
export function SessionClock({ runtime, durationSec, onFinish }: SessionClockProps) {
  useFrame((_, delta) => {
    if (runtime.finished || document.pointerLockElement === null) return;

    runtime.elapsedSec += delta;
    runtime.remainingSec = Math.max(0, durationSec - runtime.elapsedSec);

    if (runtime.remainingSec <= 0) {
      runtime.finished = true;
      onFinish();
    }
  });

  return null;
}
