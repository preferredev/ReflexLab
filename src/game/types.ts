export type ScenarioId =
  | "grid-rush"
  | "micro-control"
  | "strafe-track"
  | "flick-rush"
  | "precision";

/** Stats for one completed training session. */
export interface SessionStats {
  scenarioId: ScenarioId;
  score: number;
  hits: number;
  misses: number;
  /** 0..1 */
  accuracy: number;
  /** Average ms from target spawn to hit. */
  avgReactionMs: number;
  durationSec: number;
  /** Unix ms timestamp. */
  endedAt: number;
}

/** Best recorded result for a scenario. */
export interface PersonalBest {
  score: number;
  accuracy: number;
  avgReactionMs: number;
  achievedAt: number;
}
