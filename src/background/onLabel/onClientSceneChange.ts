import LogEntry, { ClientSceneChange } from "../../types/logDecoder";
import startDraft from "../draft/startDraft";

interface Entry extends LogEntry {
  json: () => ClientSceneChange;
}

export default function onClientSceneChange(entry: Entry): void {
  const json = entry.json();
  console.log("ClientSceneChange  ", json);
  if (!json) return;

  if (json.toSceneName == "Draft" && json.context == "HumanDraft") {
    startDraft();
  }
  if (json.toSceneName == "Draft" && json.context == "BotDraft") {
    startDraft();
  }
}
