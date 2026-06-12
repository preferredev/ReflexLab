import { Button } from "../components/Button";
import { Panel } from "../components/Panel";
import type { ScenarioConfig } from "../../game/scenarios/types";

interface LockOverlayProps {
  scenario: ScenarioConfig;
  onResume: () => void;
  onQuit: () => void;
}

/**
 * Shown whenever the pointer is not locked (session start, or after the
 * player presses Escape). Losing pointer lock IS the pause state.
 */
export function LockOverlay({ scenario, onResume, onQuit }: LockOverlayProps) {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60">
      <Panel className="flex max-w-sm flex-col items-center gap-4 text-center">
        <h2 className="text-xl font-bold" style={{ color: scenario.accent }}>
          {scenario.name}
        </h2>
        <p className="text-sm text-zinc-400">{scenario.tagline}</p>
        <p className="text-xs text-zinc-500">
          Click Play to lock your mouse. Press <kbd className="rounded border border-zinc-700 px-1">Esc</kbd> anytime to pause.
        </p>
        <div className="flex gap-3">
          <Button onClick={onResume}>Play</Button>
          <Button variant="ghost" onClick={onQuit}>
            Quit
          </Button>
        </div>
      </Panel>
    </div>
  );
}
