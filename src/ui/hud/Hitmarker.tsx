import { useEffect, useRef } from "react";
import type { SessionRuntime } from "../../game/engine/runtime";

/**
 * Crosshair-centered X that flashes on every shot (green hit / red miss).
 * Driven by a runtime callback that manipulates the DOM directly — no React
 * state changes during gameplay, and no missed flashes between HUD polls.
 */
export function Hitmarker({ runtime }: { runtime: SessionRuntime }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    runtime.notifyShot = (hit) => {
      const el = ref.current;
      if (!el) return;
      el.style.color = hit ? "#34d399" : "#fb7185";
      // Remove + force reflow + re-add restarts the CSS animation.
      el.classList.remove("hitmarker-pop");
      void el.offsetWidth;
      el.classList.add("hitmarker-pop");
    };
    return () => {
      runtime.notifyShot = null;
    };
  }, [runtime]);

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0"
    >
      <div className="relative h-7 w-7">
        <span className="absolute left-1/2 top-1/2 h-0.5 w-7 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded bg-current" />
        <span className="absolute left-1/2 top-1/2 h-0.5 w-7 -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded bg-current" />
      </div>
    </div>
  );
}
