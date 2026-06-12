import {
  CROSSHAIR_COLORS,
  SESSION_DURATIONS,
  useSettingsStore,
} from "../../state/settingsStore";
import { useScreenStore } from "../../state/screenStore";
import { Button } from "../components/Button";
import { Panel } from "../components/Panel";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs uppercase tracking-widest text-zinc-400">{label}</span>
      {children}
    </div>
  );
}

export function SettingsOverlay() {
  const closeSettings = useScreenStore((s) => s.closeSettings);
  const settings = useSettingsStore();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6"
      onClick={closeSettings}
    >
      <Panel
        className="w-full max-w-md"
        // Stop clicks inside the panel from closing the overlay.
      >
        <div onClick={(e) => e.stopPropagation()} className="flex flex-col gap-6">
          <h2 className="text-xl font-bold uppercase tracking-widest">Settings</h2>

          <Row label={`Sensitivity — ${settings.sensitivity.toFixed(2)}`}>
            <input
              type="range"
              min={0.1}
              max={5}
              step={0.05}
              value={settings.sensitivity}
              onChange={(e) =>
                settings.updateSettings({ sensitivity: Number(e.target.value) })
              }
              className="accent-cyan-400"
            />
          </Row>

          <Row label={`Field of view — ${settings.fov}°`}>
            <input
              type="range"
              min={60}
              max={120}
              step={1}
              value={settings.fov}
              onChange={(e) => settings.updateSettings({ fov: Number(e.target.value) })}
              className="accent-cyan-400"
            />
          </Row>

          <Row label={`Volume — ${Math.round(settings.volume * 100)}%`}>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={settings.volume}
              onChange={(e) => settings.updateSettings({ volume: Number(e.target.value) })}
              className="accent-cyan-400"
            />
          </Row>

          <Row label="Session duration">
            <div className="flex gap-2">
              {SESSION_DURATIONS.map((sec) => (
                <button
                  key={sec}
                  onClick={() => settings.updateSettings({ sessionDurationSec: sec })}
                  className={`flex-1 rounded-md border px-3 py-2 text-sm font-semibold transition-colors ${
                    settings.sessionDurationSec === sec
                      ? "border-cyan-400/70 bg-cyan-400/15 text-cyan-300"
                      : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
                  }`}
                >
                  {sec}s
                </button>
              ))}
            </div>
          </Row>

          <Row label="Crosshair color">
            <div className="flex gap-3">
              {CROSSHAIR_COLORS.map((c) => (
                <button
                  key={c.value}
                  title={c.label}
                  onClick={() => settings.updateSettings({ crosshairColor: c.value })}
                  className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${
                    settings.crosshairColor === c.value
                      ? "border-white"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: c.value }}
                />
              ))}
            </div>
          </Row>

          <div className="flex justify-between">
            <Button variant="danger" onClick={settings.resetSettings}>
              Reset
            </Button>
            <Button onClick={closeSettings}>Done</Button>
          </div>
        </div>
      </Panel>
    </div>
  );
}
