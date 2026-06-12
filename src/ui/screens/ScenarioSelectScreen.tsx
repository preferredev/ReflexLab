import { SCENARIOS } from "../../game/scenarios";
import { useResultsStore } from "../../state/resultsStore";
import { useScreenStore } from "../../state/screenStore";
import { Button } from "../components/Button";
import { Panel } from "../components/Panel";

export function ScenarioSelectScreen() {
  const goTo = useScreenStore((s) => s.goTo);
  const startScenario = useScreenStore((s) => s.startScenario);
  const personalBests = useResultsStore((s) => s.personalBests);

  return (
    <div className="mx-auto flex h-full max-w-5xl flex-col gap-6 px-6 py-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold uppercase tracking-widest">Scenarios</h2>
        <Button variant="ghost" onClick={() => goTo("menu")}>
          Back
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 overflow-y-auto pb-6 sm:grid-cols-2 lg:grid-cols-3">
        {SCENARIOS.map((scenario) => {
          const best = personalBests[scenario.id];
          return (
            <Panel key={scenario.id} className="flex flex-col gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: scenario.accent }}
                  />
                  <h3 className="text-lg font-bold">{scenario.name}</h3>
                </div>
                <p className="mt-0.5 text-xs italic text-zinc-400">{scenario.tagline}</p>
              </div>

              <p className="flex-1 text-sm text-zinc-300">{scenario.description}</p>

              <div className="text-xs text-zinc-500">
                {best ? (
                  <>
                    Best: <span className="font-semibold text-cyan-300">{best.score}</span>{" "}
                    · {(best.accuracy * 100).toFixed(0)}% acc
                  </>
                ) : (
                  "No personal best yet"
                )}
              </div>

              <Button onClick={() => startScenario(scenario.id)}>Start</Button>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}
