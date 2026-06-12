import { useEffect, useRef, useState } from "react";
import { getScenario } from "../../game/scenarios";
import { GameCanvas } from "../../game/GameCanvas";
import { createRuntime, type SessionRuntime } from "../../game/engine/runtime";
import { useScreenStore } from "../../state/screenStore";
import { Crosshair } from "../hud/Crosshair";
import { Hud } from "../hud/Hud";
import { LockOverlay } from "../overlays/LockOverlay";

/**
 * Hosts the 3D canvas plus DOM overlays (crosshair, HUD, pause).
 * One SessionRuntime is created per visit and shared by canvas + HUD.
 */
export function PlayingScreen() {
  const scenarioId = useScreenStore((s) => s.scenarioId);
  const goTo = useScreenStore((s) => s.goTo);

  const containerRef = useRef<HTMLDivElement>(null);
  const runtimeRef = useRef<SessionRuntime | null>(null);
  if (runtimeRef.current === null) runtimeRef.current = createRuntime();
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
  if (!scenarioId) return null;

  const scenario = getScenario(scenarioId);

  const requestLock = () => {
    containerRef.current?.querySelector("canvas")?.requestPointerLock();
  };

  return (
    <div ref={containerRef} className="relative h-full">
      <GameCanvas runtime={runtime} />
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
