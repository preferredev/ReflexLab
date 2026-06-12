import type { ScenarioId } from "../types";
import type { ScenarioConfig } from "./types";

export const SCENARIOS: ScenarioConfig[] = [
  {
    id: "grid-rush",
    name: "Grid Rush",
    tagline: "Clear the wall. Fast.",
    description:
      "A grid of targets fills the wall ahead. Pop them as fast as you can — every hit respawns a new target somewhere else on the grid.",
    accent: "#22d3ee",
    targetRadius: 0.45,
    simultaneousTargets: 6,
    spawnPattern: "grid",
    moveSpeed: 0,
    hitScore: 100,
    missPenalty: 25,
  },
  {
    id: "micro-control",
    name: "Micro Control",
    tagline: "Tiny targets, tiny corrections.",
    description:
      "Very small targets spawn close to your crosshair. Train precise micro-adjustments without big arm movement.",
    accent: "#a78bfa",
    targetRadius: 0.16,
    simultaneousTargets: 1,
    spawnPattern: "center-cluster",
    moveSpeed: 0,
    hitScore: 120,
    missPenalty: 20,
  },
  {
    id: "strafe-track",
    name: "Strafe Track",
    tagline: "Stay glued to the mover.",
    description:
      "A single target strafes left and right with sudden direction changes. Keep your crosshair on it and click to score.",
    accent: "#34d399",
    targetRadius: 0.4,
    simultaneousTargets: 1,
    spawnPattern: "strafe-lane",
    moveSpeed: 6,
    hitScore: 80,
    missPenalty: 15,
  },
  {
    id: "flick-rush",
    name: "Flick Rush",
    tagline: "Snap wide, snap true.",
    description:
      "One target at a time spawns at wide angles across the room. Flick to it, hit it, and reset for the next snap.",
    accent: "#fb7185",
    targetRadius: 0.35,
    simultaneousTargets: 1,
    spawnPattern: "wide-arc",
    moveSpeed: 0,
    hitScore: 130,
    missPenalty: 30,
  },
  {
    id: "precision",
    name: "Precision",
    tagline: "Slow is smooth. Smooth is points.",
    description:
      "Small, sparse targets and a heavy miss penalty. Accuracy matters far more than speed here — take the shot only when you are sure.",
    accent: "#fbbf24",
    targetRadius: 0.22,
    simultaneousTargets: 2,
    spawnPattern: "sparse",
    moveSpeed: 0,
    hitScore: 150,
    missPenalty: 75,
  },
];

const byId = new Map(SCENARIOS.map((s) => [s.id, s]));

export function getScenario(id: ScenarioId): ScenarioConfig {
  const config = byId.get(id);
  if (!config) throw new Error(`Unknown scenario: ${id}`);
  return config;
}
