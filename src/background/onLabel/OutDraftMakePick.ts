import LogEntry from "../../types/logDecoder";
import { addDraftPick } from "../../shared/store/currentDraftStore";
import { DraftMakePick } from "mtgatool-shared/dist/types/draft";

interface Entry extends LogEntry {
  json: () => DraftMakePick;
}

export default function onLabelOutDraftMakePick(entry: Entry): void {
  const json = entry.json();
  if (!json || !json.params) return;
  const { packNumber, pickNumber, cardId } = json.params;

  const grpId = parseInt(cardId);
  const pack = parseInt(packNumber);
  const pick = parseInt(pickNumber);
  //debugLog("LABEL:  Make pick > ", json, data);
  addDraftPick(grpId, pack, pick);
}
