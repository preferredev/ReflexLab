import { useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "three";
import { useSettingsStore } from "../../state/settingsStore";
import type { SessionRuntime } from "./runtime";

/** Radians per pixel of raw mouse movement at sensitivity 1.0. */
const BASE_SENSITIVITY = 0.0022;
const MAX_PITCH = Math.PI / 2 - 0.01;

const EYE_HEIGHT = 1.6;
const PLAYER_Z = 6;

/**
 * Pointer-lock FPS camera. Raw mouse input — no smoothing, no acceleration.
 * mousemove writes yaw/pitch into the runtime refs; useFrame applies them
 * to the camera right before render.
 */
export function PlayerController({ runtime }: { runtime: SessionRuntime }) {
  const camera = useThree((s) => s.camera);
  const fov = useSettingsStore((s) => s.fov);

  // One-time camera setup + FOV sync (only re-runs when the setting changes).
  useEffect(() => {
    camera.rotation.order = "YXZ";
    camera.position.set(0, EYE_HEIGHT, PLAYER_Z);
    if (camera instanceof PerspectiveCamera) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
  }, [camera, fov]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement === null) return;
      // Read sensitivity via getState() so this handler never re-binds.
      const sens = useSettingsStore.getState().sensitivity * BASE_SENSITIVITY;
      runtime.yaw -= e.movementX * sens;
      runtime.pitch = Math.min(
        MAX_PITCH,
        Math.max(-MAX_PITCH, runtime.pitch - e.movementY * sens),
      );
    };
    document.addEventListener("mousemove", onMouseMove);
    return () => document.removeEventListener("mousemove", onMouseMove);
  }, [runtime]);

  useFrame(() => {
    camera.rotation.y = runtime.yaw;
    camera.rotation.x = runtime.pitch;
  });

  return null;
}
