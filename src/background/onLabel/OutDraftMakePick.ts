import LogEntry from "../../types/logDecoder";
import setDraftData from "../draft/setDraftData";
import globals from "../globals";

interface EntryJson {
  params: {
    draftId: string;
    packNumber: string;
    pickNumber: string;
    cardId: string;
  };
}

interface Entry extends LogEntry {
  json: () => EntryJson;
}

export default function onLabelOutDraftMakePick(entry: Entry): void {
  const json = entry.json();
  if (!json || !json.params) return;
  const { packNumber, pickNumber, cardId } = json.params;
  const key = "pack_" + packNumber + "pick_" + pickNumber;
  const draftData = globals.currentDraft;
  const data = {
    ...draftData,
    [key]: {
      pick: cardId,
      pack: draftData.currentPack,
    },
  };

  //console.log("LABEL:  Make pick > ", json, data);
  setDraftData(data);
}
