import { useSettingsStore } from "../../state/settingsStore";

/** Fixed center crosshair: dot + thin ring, colored from settings. */
export function Crosshair() {
  const color = useSettingsStore((s) => s.crosshairColor);

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div
        className="absolute h-4 w-4 rounded-full border opacity-60"
        style={{ borderColor: color }}
      />
      <div
        className="absolute h-1 w-1 rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}
