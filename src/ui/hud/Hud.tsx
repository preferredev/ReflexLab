import { useEffect, useState } from "react";
import type { SessionRuntime } from "../../game/engine/runtime";

const POLL_MS = 100;

interface HudProps {
  runtime: SessionRuntime;
  scenarioName: string;
  accent: string;
}

/**
 * DOM stat bar. Polls the mutable runtime at 10 Hz instead of subscribing
 * to per-frame updates, so gameplay never causes React churn.
 */
export function Hud({ runtime, scenarioName, accent }: HudProps) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), POLL_MS);
    return () => window.clearInterval(id);
  }, []);

  const { hits, misses } = runtime;
  const shots = hits + misses;
  const accuracy = shots === 0 ? 100 : (hits / shots) * 100;

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4">
      <span
        className="text-sm font-bold uppercase tracking-widest"
        style={{ color: accent }}
      >
        {scenarioName}
      </span>
      <div className="flex gap-5 rounded-md border border-zinc-800 bg-ink/70 px-4 py-2 text-sm">
        <span>
          <span className="text-zinc-500">Hits </span>
          <span className="font-bold text-emerald-300">{hits}</span>
        </span>
        <span>
          <span className="text-zinc-500">Misses </span>
          <span className="font-bold text-rose-300">{misses}</span>
        </span>
        <span>
          <span className="text-zinc-500">Acc </span>
          <span className="font-bold">{accuracy.toFixed(0)}%</span>
        </span>
      </div>
    </div>
  );
}
