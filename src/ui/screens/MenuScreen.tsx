import { useScreenStore } from "../../state/screenStore";
import { Button } from "../components/Button";

export function MenuScreen() {
  const goTo = useScreenStore((s) => s.goTo);
  const openSettings = useScreenStore((s) => s.openSettings);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-10 px-6">
      <div className="text-center">
        <h1 className="text-6xl font-black tracking-tight">
          Reflex<span className="text-cyan-400">Lab</span>
        </h1>
        <p className="mt-3 text-sm uppercase tracking-[0.3em] text-zinc-400">
          Browser aim training
        </p>
      </div>

      <div className="flex w-64 flex-col gap-3">
        <Button onClick={() => goTo("scenario-select")}>Train</Button>
        <Button variant="ghost" onClick={openSettings}>
          Settings
        </Button>
      </div>

      <p className="max-w-md text-center text-xs text-zinc-500">
        Open-source FPS aim trainer. Pointer-lock mouse, raw input, no smoothing.
        Your settings and personal bests are stored locally in your browser.
      </p>
    </div>
  );
}
