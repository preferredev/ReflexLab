import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, MeshStandardMaterial, SphereGeometry } from "three";
import type { ScenarioConfig } from "../scenarios/types";
import { placeTarget, STRAFE_X_LIMIT, WALL_Z } from "./spawning";
import type { SessionRuntime } from "./runtime";

/**
 * Scenario-driven target pool. Meshes are created once per session and
 * reused — a "respawn" only repositions the mesh and restamps its spawn
 * time. Movement (Strafe Track) mutates positions in useFrame with no
 * allocations and no React state.
 */
export function TargetPool({
  runtime,
  scenario,
}: {
  runtime: SessionRuntime;
  scenario: ScenarioConfig;
}) {
  const meshRefs = useRef<(Mesh | null)[]>([]);

  // Shared geometry/material — created once, disposed on unmount.
  const geometry = useMemo(
    () => new SphereGeometry(scenario.targetRadius, 24, 16),
    [scenario.targetRadius],
  );
  const material = useMemo(
    () =>
      new MeshStandardMaterial({
        color: scenario.accent,
        emissive: scenario.accent,
        emissiveIntensity: 0.45,
      }),
    [scenario.accent],
  );

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  // Register the pool with the runtime and scatter initial positions.
  useEffect(() => {
    const meshes = meshRefs.current
      .filter((m): m is Mesh => m !== null)
      .slice(0, scenario.simultaneousTargets);

    runtime.targetMeshes = meshes;
    runtime.respawnTarget = (target) => placeTarget(target, scenario, meshes);

    for (const mesh of meshes) placeTarget(mesh, scenario, meshes);

    return () => {
      runtime.targetMeshes = [];
      runtime.respawnTarget = null;
    };
  }, [runtime, scenario]);

  // Strafe movement: bounce at lane edges + sudden random direction flips.
  useFrame((_, delta) => {
    if (
      scenario.moveSpeed === 0 ||
      runtime.finished ||
      document.pointerLockElement === null
    ) {
      return;
    }

    for (const mesh of runtime.targetMeshes) {
      const data = mesh.userData;
      mesh.position.x += (data.dir as number) * scenario.moveSpeed * delta;

      if (mesh.position.x >= STRAFE_X_LIMIT) {
        mesh.position.x = STRAFE_X_LIMIT;
        data.dir = -1;
      } else if (mesh.position.x <= -STRAFE_X_LIMIT) {
        mesh.position.x = -STRAFE_X_LIMIT;
        data.dir = 1;
      }

      data.flipIn = (data.flipIn as number) - delta;
      if (data.flipIn <= 0) {
        data.dir = -(data.dir as number);
        data.flipIn = 0.6 + Math.random();
      }
    }
  });

  return (
    <>
      {Array.from({ length: scenario.simultaneousTargets }, (_, i) => (
        <mesh
          key={i}
          ref={(m) => {
            meshRefs.current[i] = m;
          }}
          geometry={geometry}
          material={material}
          position={[0, 1.6, WALL_Z]}
        />
      ))}
    </>
  );
}
