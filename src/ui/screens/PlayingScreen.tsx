import { useCallback, useEffect, useRef, useState } from "react";
import { getScenario } from "../../game/scenarios";
import { GameCanvas } from "../../game/GameCanvas";
import { createRuntime, type SessionRuntime } from "../../game/engine/runtime";
import { useResultsStore } from "../../state/resultsStore";
import { useScreenStore } from "../../state/screenStore";
import { useSettingsStore } from "../../state/settingsStore";
import { Crosshair } from "../hud/Crosshair";
import { Hud } from "../hud/Hud";
import { LockOverlay } from "../overlays/LockOverlay";

/**
 * Hosts the 3D canvas plus DOM overlays (crosshair, HUD, pause).
 * One SessionRuntime is created per visit and shared by canvas + HUD.
 * When the clock ends, runtime stats become a SessionStats record and the
 * app moves to the summary screen.
 */
export function PlayingScreen() {
  const scenarioId = useScreenStore((s) => s.scenarioId);
  const goTo = useScreenStore((s) => s.goTo);
  const recordSession = useResultsStore((s) => s.recordSession);
  const durationSec = useSettingsStore((s) => s.sessionDurationSec);

  const containerRef = useRef<HTMLDivElement>(null);
  const runtimeRef = useRef<SessionRuntime | null>(null);
  if (runtimeRef.current === null) runtimeRef.current = createRuntime(durationSec);
  const runtime = runtimeRef.current;

  const [locked, setLocked] = useState(false);

  // Track pointer lock; losing it (e.g. Escape) shows the pause overlay.
  useEffect(() => {
    const onChange = () => setLocked(document.pointerLockElement !== null);
    document.addEventListener("pointerlockchange", onChange);
    return () => document.removeEventListener("pointerlockchange", onChange);
  }, []);

  // Defensive: landed here without a scenario; bounce back.
  useEffect(() => {
    if (!scenarioId) goTo("scenario-select");
  }, [scenarioId, goTo]);

  const finishSession = useCallback(() => {
    if (!scenarioId) return;
    document.exitPointerLock();

    const shots = runtime.hits + runtime.misses;
    recordSession({
      scenarioId,
      score: Math.max(0, Math.round(runtime.score)),
      hits: runtime.hits,
      misses: runtime.misses,
      accuracy: runtime.hits / Math.max(1, shots),
      avgReactionMs: runtime.hits > 0 ? runtime.reactionSum / runtime.hits : 0,
      durationSec,
      endedAt: Date.now(),
    });
    goTo("summary");
  }, [scenarioId, runtime, durationSec, recordSession, goTo]);

  if (!scenarioId) return null;

  const scenario = getScenario(scenarioId);

  const requestLock = () => {
    containerRef.current?.querySelector("canvas")?.requestPointerLock();
  };

  return (
    <div ref={containerRef} className="relative h-full">
      <GameCanvas
        runtime={runtime}
        scenario={scenario}
        durationSec={durationSec}
        onFinish={finishSession}
      />
      <Crosshair />
      <Hud runtime={runtime} scenarioName={scenario.name} accent={scenario.accent} />
      {!locked && (
        <LockOverlay
          scenario={scenario}
          onResume={requestLock}
          onQuit={() => goTo("scenario-select")}
        />
      )}
    </div>
  );
}
