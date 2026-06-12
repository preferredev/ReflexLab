const PREFIX = "reflexlab:";

/** Load a JSON value from LocalStorage, falling back on missing/corrupt data. */
export function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** Save a JSON-serializable value to LocalStorage. Fails silently (e.g. private mode). */
export function saveJSON<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Storage unavailable — gameplay must keep working without persistence.
  }
}
