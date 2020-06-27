import LogEntry from "../../types/logDecoder";
import { InMakeHumanDraftPick } from "../../types/draft";
import completeDraft from "../draft/completeDraft";

interface Entry extends LogEntry {
  json: () => InMakeHumanDraftPick;
}

export default function onLabelInMakeHumanDraftPick(entry: Entry): void {
  const json = entry.json();
  //debugLog("LABEL:  Make pick < ", json);
  if (!json) return;

  if (json.IsPickingCompleted) {
    completeDraft();
  }
}
