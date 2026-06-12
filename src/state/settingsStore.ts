import { create } from "zustand";
import { loadJSON, saveJSON } from "../lib/storage";

export interface Settings {
  /** Mouse sensitivity multiplier applied to raw movementX/Y. */
  sensitivity: number;
  /** Camera field of view in degrees. */
  fov: number;
  /** Session length in seconds. */
  sessionDurationSec: number;
  /** Crosshair color (hex). */
  crosshairColor: string;
  /** SFX volume, 0..1. */
  volume: number;
}

export const DEFAULT_SETTINGS: Settings = {
  sensitivity: 1,
  fov: 90,
  sessionDurationSec: 60,
  crosshairColor: "#22d3ee",
  volume: 0.5,
};

export const SESSION_DURATIONS = [30, 60, 90] as const;

export const CROSSHAIR_COLORS = [
  { label: "Cyan", value: "#22d3ee" },
  { label: "Lime", value: "#a3e635" },
  { label: "Magenta", value: "#e879f9" },
  { label: "Amber", value: "#fbbf24" },
  { label: "White", value: "#ffffff" },
] as const;

interface SettingsState extends Settings {
  updateSettings: (patch: Partial<Settings>) => void;
  resetSettings: () => void;
}

const STORAGE_KEY = "settings";

function loadInitial(): Settings {
  // Merge with defaults so new fields added later get sane values.
  return { ...DEFAULT_SETTINGS, ...loadJSON<Partial<Settings>>(STORAGE_KEY, {}) };
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  ...loadInitial(),
  updateSettings: (patch) => {
    set(patch);
    const { sensitivity, fov, sessionDurationSec, crosshairColor, volume } = get();
    saveJSON<Settings>(STORAGE_KEY, {
      sensitivity,
      fov,
      sessionDurationSec,
      crosshairColor,
      volume,
    });
  },
  resetSettings: () => {
    set(DEFAULT_SETTINGS);
    saveJSON<Settings>(STORAGE_KEY, DEFAULT_SETTINGS);
  },
}));
