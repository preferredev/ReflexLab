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
  /** Active target meshes registered by the target pool for raycasting. */
  targetMeshes: Object3D[];
  /** Registered by the target pool: repositions a hit target. */
  respawnTarget: ((target: Object3D) => void) | null;
}

export function createRuntime(): SessionRuntime {
  return {
    yaw: 0,
    pitch: 0,
    hits: 0,
    misses: 0,
    targetMeshes: [],
    respawnTarget: null,
  };
}
