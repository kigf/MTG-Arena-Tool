import LogEntry, { ClientSceneChange } from "../../types/logDecoder";
import startDraft from "../draft/startDraft";
import debugLog from "../../shared/debugLog";

interface Entry extends LogEntry {
  json: () => ClientSceneChange;
}

export default function onClientSceneChange(entry: Entry): void {
  const json = entry.json();
  debugLog(`ClientSceneChange ${json}`, "info");
  if (!json) return;

  if (json.toSceneName == "Draft" && json.context == "HumanDraft") {
    startDraft();
  }
  if (json.toSceneName == "Draft" && json.context == "BotDraft") {
    startDraft();
  }
}
