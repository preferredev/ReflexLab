import { useEffect, useMemo, useRef } from "react";
import { Mesh, MeshStandardMaterial, SphereGeometry } from "three";
import type { SessionRuntime } from "./runtime";

/**
 * Phase 2 test pool: a fixed set of static spheres in front of the back
 * wall. Meshes are created once and reused — a "respawn" only repositions
 * the mesh. Phase 3 replaces the hardcoded values with ScenarioConfig.
 */
const TEST_TARGET_COUNT = 5;
const TEST_TARGET_RADIUS = 0.4;

const SPAWN_Z = -7;
const SPAWN_X = 5; // +/- range
const SPAWN_Y_MIN = 0.8;
const SPAWN_Y_MAX = 4;

function randRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export function TargetPool({ runtime }: { runtime: SessionRuntime }) {
  const meshRefs = useRef<(Mesh | null)[]>([]);

  // Shared geometry/material — created once, disposed on unmount.
  const geometry = useMemo(
    () => new SphereGeometry(TEST_TARGET_RADIUS, 24, 16),
    [],
  );
  const material = useMemo(
    () =>
      new MeshStandardMaterial({
        color: "#22d3ee",
        emissive: "#0e7490",
        emissiveIntensity: 0.7,
      }),
    [],
  );

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useEffect(() => {
    const meshes = meshRefs.current.filter((m): m is Mesh => m !== null);

    runtime.targetMeshes = meshes;
    runtime.respawnTarget = (target) => {
      target.position.set(
        randRange(-SPAWN_X, SPAWN_X),
        randRange(SPAWN_Y_MIN, SPAWN_Y_MAX),
        SPAWN_Z,
      );
    };

    // Scatter initial positions.
    for (const mesh of meshes) runtime.respawnTarget(mesh);

    return () => {
      runtime.targetMeshes = [];
      runtime.respawnTarget = null;
    };
  }, [runtime]);

  return (
    <>
      {Array.from({ length: TEST_TARGET_COUNT }, (_, i) => (
        <mesh
          key={i}
          ref={(m) => {
            meshRefs.current[i] = m;
          }}
          geometry={geometry}
          material={material}
          position={[0, 1.6, SPAWN_Z]}
        />
      ))}
    </>
  );
}
