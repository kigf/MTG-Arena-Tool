import LogEntry from "../../types/logDecoder";
import setDraftData from "../draft/setDraftData";
import { DraftStatus } from "../../types/draft";
import globals from "../globals";

interface Entry extends LogEntry {
  json: () => DraftStatus;
}

export default function onLabelInDraftMakePick(entry: Entry): void {
  const json = entry.json();
  //console.log("LABEL:  Make pick < ", json);
  if (!json) return;

  const data = {
    ...globals.currentDraft,
    draftId: json.DraftId,
    packNumber: json.PackNumber,
    pickNumber: json.PickNumber,
    pickedCards: json.PickedCards,
    currentPack: json.DraftPack || [],
  };
  data.draftId = data.id;
  setDraftData(data);
}
