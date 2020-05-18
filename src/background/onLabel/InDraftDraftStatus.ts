import LogEntry from "../../types/logDecoder";
import { DraftStatus } from "../../types/draft";
import startDraft from "../draft/startDraft";
import setDraftData from "../draft/setDraftData";
import globals from "../globals";

interface Entry extends LogEntry {
  json: () => DraftStatus;
}

export default function InDraftDraftStatus(entry: Entry): void {
  const json = entry.json();
  // console.log("LABEL:  Draft status ", json);
  if (!json) return;

  startDraft();

  const data = {
    ...globals.currentDraft,
    ...json,
    currentPack: (json.DraftPack || []).slice(0),
  };
  data.draftId = data.id;

  setDraftData(data);
}
