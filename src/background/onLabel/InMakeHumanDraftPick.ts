import LogEntry from "../../types/logDecoder";
import completeDraft from "../draft/completeDraft";
import { InMakeHumanDraftPick } from "mtgatool-shared/dist/types/draft";

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
