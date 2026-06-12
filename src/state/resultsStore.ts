import { create } from "zustand";
import { loadJSON, saveJSON } from "../lib/storage";
import type { PersonalBest, ScenarioId, SessionStats } from "../game/types";

type BestsMap = Partial<Record<ScenarioId, PersonalBest>>;

interface ResultsState {
  lastSession: SessionStats | null;
  /** True when the most recent session set a new personal best. */
  lastWasBest: boolean;
  personalBests: BestsMap;
  recordSession: (stats: SessionStats) => void;
}

const STORAGE_KEY = "personal-bests";

export const useResultsStore = create<ResultsState>((set, get) => ({
  lastSession: null,
  lastWasBest: false,
  personalBests: loadJSON<BestsMap>(STORAGE_KEY, {}),
  recordSession: (stats) => {
    const bests = get().personalBests;
    const previous = bests[stats.scenarioId];
    const isNewBest = !previous || stats.score > previous.score;

    if (isNewBest) {
      const nextBests: BestsMap = {
        ...bests,
        [stats.scenarioId]: {
          score: stats.score,
          accuracy: stats.accuracy,
          avgReactionMs: stats.avgReactionMs,
          achievedAt: stats.endedAt,
        },
      };
      saveJSON(STORAGE_KEY, nextBests);
      set({ lastSession: stats, lastWasBest: true, personalBests: nextBests });
    } else {
      set({ lastSession: stats, lastWasBest: false });
    }
  },
}));
