import type { Object3D } from "three";

/**
 * Mutable per-session state shared between the render loop, input handlers,
 * and the HUD. Lives in refs — NEVER in React state — so the game loop and
 * mouse input never trigger React re-renders.
 */
export interface SessionRuntime {
  /** Camera yaw in radians (rotation around Y). */
  yaw: number;
  /** Camera pitch in radians (rotation around X), clamped. */
  pitch: number;
  hits: number;
  misses: number;
  score: number;
  /** Sum of spawn->hit reaction times in ms (divide by hits for average). */
  reactionSum: number;
  elapsedSec: number;
  remainingSec: number;
  /** Set once when the clock runs out; blocks further input/movement. */
  finished: boolean;
  /** Active target meshes registered by the target pool for raycasting. */
  targetMeshes: Object3D[];
  /** Registered by the target pool: repositions a hit target. */
  respawnTarget: ((target: Object3D) => void) | null;
  /** Registered by the DOM hitmarker: fires feedback for a shot. */
  notifyShot: ((hit: boolean) => void) | null;
}

export function createRuntime(durationSec: number): SessionRuntime {
  return {
    yaw: 0,
    pitch: 0,
    hits: 0,
    misses: 0,
    score: 0,
    reactionSum: 0,
    elapsedSec: 0,
    remainingSec: durationSec,
    finished: false,
    targetMeshes: [],
    respawnTarget: null,
    notifyShot: null,
  };
}
