import { useScreenStore } from "./state/screenStore";
import { MenuScreen } from "./ui/screens/MenuScreen";
import { ScenarioSelectScreen } from "./ui/screens/ScenarioSelectScreen";
import { PlayingScreen } from "./ui/screens/PlayingScreen";
import { SummaryScreen } from "./ui/screens/SummaryScreen";
import { SettingsOverlay } from "./ui/overlays/SettingsOverlay";

export default function App() {
  const screen = useScreenStore((s) => s.screen);
  const settingsOpen = useScreenStore((s) => s.settingsOpen);

  return (
    <div className="h-full">
      {screen === "menu" && <MenuScreen />}
      {screen === "scenario-select" && <ScenarioSelectScreen />}
      {screen === "playing" && <PlayingScreen />}
      {screen === "summary" && <SummaryScreen />}
      {settingsOpen && <SettingsOverlay />}
    </div>
  );
}
