import type { Object3D } from "three";
import type { ScenarioConfig } from "../scenarios/types";

/** Targets live on a plane just in front of the back wall. */
export const WALL_Z = -7;
/** Horizontal travel limit for strafing targets. */
export const STRAFE_X_LIMIT = 6;

const MAX_PLACEMENT_TRIES = 8;

const GRID_COLS = 5;
const GRID_ROWS = 3;
const GRID_SPACING_X = 2.2;
const GRID_SPACING_Y = 1.3;
const GRID_BASE_Y = 1.2;

function randRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function randSign(): number {
  return Math.random() < 0.5 ? -1 : 1;
}

/** Writes a candidate position for the pattern directly into target.position. */
function proposePosition(target: Object3D, config: ScenarioConfig): void {
  switch (config.spawnPattern) {
    case "grid": {
      const col = Math.floor(Math.random() * GRID_COLS);
      const row = Math.floor(Math.random() * GRID_ROWS);
      target.position.set(
        (col - (GRID_COLS - 1) / 2) * GRID_SPACING_X,
        GRID_BASE_Y + row * GRID_SPACING_Y,
        WALL_Z,
      );
      break;
    }
    case "center-cluster":
      // Tight box around the initial crosshair position.
      target.position.set(randRange(-1.4, 1.4), randRange(0.8, 2.5), WALL_Z);
      break;
    case "strafe-lane":
      target.position.set(randRange(-4, 4), 1.7, WALL_Z);
      break;
    case "wide-arc":
      // Force wide horizontal angles: never spawns near the center.
      target.position.set(
        randSign() * randRange(3.5, 8),
        randRange(1, 3.5),
        WALL_Z,
      );
      break;
    case "sparse":
      target.position.set(randRange(-7, 7), randRange(0.8, 4.5), WALL_Z);
      break;
  }
}

/**
 * Positions (or repositions) a pooled target for its scenario, retrying a few
 * times to avoid overlapping other active targets. Also stamps spawn time for
 * reaction tracking and (re)seeds movement state. Allocation-free.
 */
export function placeTarget(
  target: Object3D,
  config: ScenarioConfig,
  others: readonly Object3D[],
): void {
  const minDistSq = (config.targetRadius * 2.5) ** 2;

  for (let attempt = 0; attempt < MAX_PLACEMENT_TRIES; attempt++) {
    proposePosition(target, config);
    let clear = true;
    for (const other of others) {
      if (other === target) continue;
      if (other.position.distanceToSquared(target.position) < minDistSq) {
        clear = false;
        break;
      }
    }
    if (clear) break;
  }

  target.userData.spawnedAt = performance.now();
  // Start small; the target pool animates the grow-in each frame.
  target.scale.setScalar(0.05);

  if (config.moveSpeed > 0) {
    target.userData.dir = randSign();
    target.userData.flipIn = randRange(0.6, 1.6);
  }
}
