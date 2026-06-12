import { create } from "zustand";
import type { ScenarioId } from "../game/types";

export type Screen = "menu" | "scenario-select" | "playing" | "summary";

interface ScreenState {
  screen: Screen;
  /** Scenario chosen for the current/last session. */
  scenarioId: ScenarioId | null;
  settingsOpen: boolean;
  goTo: (screen: Screen) => void;
  startScenario: (id: ScenarioId) => void;
  openSettings: () => void;
  closeSettings: () => void;
}

export const useScreenStore = create<ScreenState>((set) => ({
  screen: "menu",
  scenarioId: null,
  settingsOpen: false,
  goTo: (screen) => set({ screen }),
  startScenario: (id) => set({ scenarioId: id, screen: "playing" }),
  openSettings: () => set({ settingsOpen: true }),
  closeSettings: () => set({ settingsOpen: false }),
}));
