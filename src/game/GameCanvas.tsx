import { Canvas } from "@react-three/fiber";
import { Room } from "./engine/Room";
import { TargetPool } from "./engine/TargetPool";
import { PlayerController } from "./engine/PlayerController";
import { ShootController } from "./engine/ShootController";
import { SessionClock } from "./engine/SessionClock";
import type { SessionRuntime } from "./engine/runtime";
import type { ScenarioConfig } from "./scenarios/types";

interface GameCanvasProps {
  runtime: SessionRuntime;
  scenario: ScenarioConfig;
  durationSec: number;
  onFinish: () => void;
}

export function GameCanvas({ runtime, scenario, durationSec, onFinish }: GameCanvasProps) {
  return (
    <Canvas
      gl={{ antialias: true, powerPreference: "high-performance" }}
      dpr={[1, 2]}
      camera={{ fov: 90, near: 0.1, far: 100, position: [0, 1.6, 6] }}
      className="select-none"
    >
      <color attach="background" args={["#0a0a12"]} />
      <fog attach="fog" args={["#0a0a12", 24, 44]} />
      <Room />
      <TargetPool runtime={runtime} scenario={scenario} />
      <PlayerController runtime={runtime} />
      <ShootController runtime={runtime} scenario={scenario} />
      <SessionClock runtime={runtime} durationSec={durationSec} onFinish={onFinish} />
    </Canvas>
  );
}
