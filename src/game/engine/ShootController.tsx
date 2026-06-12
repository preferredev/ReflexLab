import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { Raycaster, Vector3 } from "three";
import { playHit, playMiss } from "../../lib/audio";
import { useSettingsStore } from "../../state/settingsStore";
import type { ScenarioConfig } from "../scenarios/types";
import type { SessionRuntime } from "./runtime";

/**
 * Left click while pointer-locked fires one ray from the screen center.
 * Hit: add score + reaction time, respawn the target. Miss: apply the
 * scenario's penalty. Raycaster and vectors are allocated once.
 */
export function ShootController({
  runtime,
  scenario,
}: {
  runtime: SessionRuntime;
  scenario: ScenarioConfig;
}) {
  const camera = useThree((s) => s.camera);

  useEffect(() => {
    const raycaster = new Raycaster();
    const origin = new Vector3();
    const direction = new Vector3();

    const onMouseDown = (e: MouseEvent) => {
      if (
        e.button !== 0 ||
        document.pointerLockElement === null ||
        runtime.finished
      ) {
        return;
      }

      camera.getWorldPosition(origin);
      camera.getWorldDirection(direction);
      raycaster.set(origin, direction);

      const volume = useSettingsStore.getState().volume;
      const hit = raycaster.intersectObjects(runtime.targetMeshes, false)[0];
      if (hit) {
        runtime.hits += 1;
        runtime.score += scenario.hitScore;

        const spawnedAt = hit.object.userData.spawnedAt as number | undefined;
        if (spawnedAt !== undefined) {
          runtime.reactionSum += performance.now() - spawnedAt;
        }

        runtime.respawnTarget?.(hit.object);
        runtime.notifyShot?.(true);
        playHit(volume);
      } else {
        runtime.misses += 1;
        runtime.score = Math.max(0, runtime.score - scenario.missPenalty);
        runtime.notifyShot?.(false);
        playMiss(volume);
      }
    };

    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [camera, runtime, scenario]);

  return null;
}
