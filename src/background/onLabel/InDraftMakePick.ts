import LogEntry from "../../types/logDecoder";
import { DraftStatus } from "../../types/draft";
import { setDraftPack } from "../../shared/store/currentDraftStore";
import { ipcSend } from "../backgroundUtil";
import globalStore from "../../shared/store";
import { IPC_OVERLAY } from "../../shared/constants";

interface Entry extends LogEntry {
  json: () => DraftStatus;
}

export default function onLabelInDraftMakePick(entry: Entry): void {
  const json = entry.json();
  //console.log("LABEL:  Make pick < ", json);
  if (!json) return;

  const cards = (json.DraftPack || []).map((n) => parseInt(n));
  const pack = json.PackNumber;
  const pick = json.PickNumber;
  setDraftPack(cards, pack, pick);
  ipcSend("set_draft", globalStore.currentDraft, IPC_OVERLAY);
  // we do everything in the out msg
}
