import LogEntry from "../../types/logDecoder";
import { OutMakeHumanDraftPick } from "../../types/draft";
import { addDraftPick } from "../../shared/store/currentDraftStore";

interface Entry extends LogEntry {
  json: () => OutMakeHumanDraftPick;
}

export default function onLabelOutMakeHumanDraftPick(entry: Entry): void {
  const json = entry.json();
  console.log("LABEL:  Make pick > ", json);
  if (!json || !json.params) return;
  const { packNumber, pickNumber, cardId } = json.params;

  addDraftPick(
    parseInt(cardId),
    parseInt(packNumber) - 1, // packs and picks start at 1
    parseInt(pickNumber) - 1
  );
}
