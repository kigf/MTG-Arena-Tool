import LogEntry from "../../types/logDecoder";
import { InMakeHumanDraftPick } from "../../types/draft";
import globalStore from "../../shared/store";

interface Entry extends LogEntry {
  json: () => InMakeHumanDraftPick;
}

export default function onLabelInMakeHumanDraftPick(entry: Entry): void {
  const json = entry.json();
  //console.log("LABEL:  Make pick < ", json);
  if (!json) return;

  if (json.IsPickingCompleted) {
    console.log(globalStore.currentDraft);
  }
}
