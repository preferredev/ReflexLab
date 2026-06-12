import { getScenario } from "../../game/scenarios";
import { useResultsStore } from "../../state/resultsStore";
import { useScreenStore } from "../../state/screenStore";
import { useSettingsStore } from "../../state/settingsStore";
import { Button } from "../components/Button";
import { Panel } from "../components/Panel";

/**
 * Phase 1 placeholder. The 3D engine (pointer lock, raycasting, targets)
 * replaces this in Phase 2. The dev-only "simulate session" button exists
 * purely to exercise the Summary screen and personal-best flow.
 */
export function PlayingScreen() {
  const scenarioId = useScreenStore((s) => s.scenarioId);
  const goTo = useScreenStore((s) => s.goTo);
  const recordSession = useResultsStore((s) => s.recordSession);
  const sessionDurationSec = useSettingsStore((s) => s.sessionDurationSec);

  if (!scenarioId) {
    // Defensive: landed here without a scenario; bounce back.
    goTo("scenario-select");
    return null;
  }

  const scenario = getScenario(scenarioId);

  const simulateSession = () => {
    const hits = 20 + Math.floor(Math.random() * 40);
    const misses = Math.floor(Math.random() * 15);
    const score = Math.max(0, hits * scenario.hitScore - misses * scenario.missPenalty);
    recordSession({
      scenarioId: scenario.id,
      score,
      hits,
      misses,
      accuracy: hits / Math.max(1, hits + misses),
      avgReactionMs: 350 + Math.random() * 400,
      durationSec: sessionDurationSec,
      endedAt: Date.now(),
    });
    goTo("summary");
  };

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-6">
      <Panel className="flex max-w-md flex-col items-center gap-4 text-center">
        <h2 className="text-xl font-bold" style={{ color: scenario.accent }}>
          {scenario.name}
        </h2>
        <p className="text-sm text-zinc-400">
          3D engine arrives in Phase 2. This placeholder verifies the screen flow,
          scoring model, and personal-best persistence.
        </p>
        <div className="flex gap-3">
          <Button onClick={simulateSession}>Simulate Session (dev)</Button>
          <Button variant="ghost" onClick={() => goTo("scenario-select")}>
            Quit
          </Button>
        </div>
      </Panel>
    </div>
  );
}
