import { getScenario } from "../../game/scenarios";
import { useResultsStore } from "../../state/resultsStore";
import { useScreenStore } from "../../state/screenStore";
import { Button } from "../components/Button";
import { Panel } from "../components/Panel";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-ink/60 px-4 py-3 text-center">
      <div className="text-[10px] uppercase tracking-widest text-zinc-500">{label}</div>
      <div className="mt-1 text-xl font-bold">{value}</div>
    </div>
  );
}

export function SummaryScreen() {
  const goTo = useScreenStore((s) => s.goTo);
  const startScenario = useScreenStore((s) => s.startScenario);
  const lastSession = useResultsStore((s) => s.lastSession);
  const lastWasBest = useResultsStore((s) => s.lastWasBest);
  const personalBests = useResultsStore((s) => s.personalBests);

  if (!lastSession) {
    goTo("menu");
    return null;
  }

  const scenario = getScenario(lastSession.scenarioId);
  const best = personalBests[lastSession.scenarioId];

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-6">
      <Panel className="w-full max-w-lg">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Session complete</p>
          <h2 className="mt-1 text-2xl font-bold" style={{ color: scenario.accent }}>
            {scenario.name}
          </h2>
          {lastWasBest && (
            <p className="mt-2 inline-block rounded-full border border-cyan-400/50 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-cyan-300 shadow-neon-sm">
              New personal best
            </p>
          )}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Stat label="Score" value={String(lastSession.score)} />
          <Stat label="Accuracy" value={`${(lastSession.accuracy * 100).toFixed(1)}%`} />
          <Stat label="Avg reaction" value={`${Math.round(lastSession.avgReactionMs)} ms`} />
          <Stat label="Hits" value={String(lastSession.hits)} />
          <Stat label="Misses" value={String(lastSession.misses)} />
          <Stat label="Duration" value={`${lastSession.durationSec}s`} />
        </div>

        {best && !lastWasBest && (
          <p className="mt-4 text-center text-xs text-zinc-500">
            Personal best: <span className="text-zinc-300">{best.score}</span>
          </p>
        )}

        <div className="mt-6 flex justify-center gap-3">
          <Button onClick={() => startScenario(lastSession.scenarioId)}>Retry</Button>
          <Button variant="ghost" onClick={() => goTo("scenario-select")}>
            Scenarios
          </Button>
          <Button variant="ghost" onClick={() => goTo("menu")}>
            Menu
          </Button>
        </div>
      </Panel>
    </div>
  );
}
