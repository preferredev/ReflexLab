import type { ScenarioId } from "../types";

export type SpawnPattern =
  | "grid"
  | "center-cluster"
  | "strafe-lane"
  | "wide-arc"
  | "sparse";

/**
 * One shared engine, five configs. Every scenario is fully described by
 * this data — no per-scenario engine code.
 */
export interface ScenarioConfig {
  id: ScenarioId;
  name: string;
  tagline: string;
  description: string;
  /** Accent color for UI cards and in-game targets. */
  accent: string;
  /** Target sphere radius in world units. */
  targetRadius: number;
  /** How many targets are active at once. */
  simultaneousTargets: number;
  spawnPattern: SpawnPattern;
  /** World units per second. 0 = static targets. */
  moveSpeed: number;
  /** Points awarded per hit. */
  hitScore: number;
  /** Points removed per miss (clicked but hit nothing). */
  missPenalty: number;
}
