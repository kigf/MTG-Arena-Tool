import LogEntry from "../../types/logDecoder";
import { DraftNotify } from "../../types/draft";
import { setDraftPack } from "../../shared/store/currentDraftStore";
import { ipcSend } from "../backgroundUtil";
import globalStore from "../../shared/store";
import { IPC_OVERLAY } from "../../shared/constants";

interface Entry extends LogEntry {
  json: () => DraftNotify;
}

export default function onLabelInDraftNotify(entry: Entry): void {
  const json = entry.json();
  console.log("LABEL: Draft Notify > ", json);
  if (!json) return;

  const currentPack = json.PackCards.split(",").map((c) => parseInt(c));
  // packs and picks start at 1;
  setDraftPack(currentPack, json.SelfPack - 1, json.SelfPick - 1);
  ipcSend("set_draft", globalStore.currentDraft, IPC_OVERLAY);
}
