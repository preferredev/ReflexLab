import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { Raycaster, Vector3 } from "three";
import type { SessionRuntime } from "./runtime";

/**
 * Left click while pointer-locked fires one ray from the screen center.
 * First intersected target = hit (respawn it); nothing = miss.
 * Raycaster and vectors are allocated once — nothing allocates per shot.
 */
export function ShootController({ runtime }: { runtime: SessionRuntime }) {
  const camera = useThree((s) => s.camera);

  useEffect(() => {
    const raycaster = new Raycaster();
    const origin = new Vector3();
    const direction = new Vector3();

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0 || document.pointerLockElement === null) return;

      camera.getWorldPosition(origin);
      camera.getWorldDirection(direction);
      raycaster.set(origin, direction);

      const hit = raycaster.intersectObjects(runtime.targetMeshes, false)[0];
      if (hit) {
        runtime.hits += 1;
        runtime.respawnTarget?.(hit.object);
      } else {
        runtime.misses += 1;
      }
    };

    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [camera, runtime]);

  return null;
}
