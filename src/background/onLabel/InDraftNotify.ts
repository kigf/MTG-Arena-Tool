import LogEntry from "../../types/logDecoder";
import { DraftNotify } from "../../types/draft";
import { setDraftPack } from "../../shared/store/currentDraftStore";
import { ipcSend } from "../backgroundUtil";
import globalStore from "../../shared/store";
import globals from "../globals";
import debugLog from "../../shared/debugLog";
import { constants } from "mtgatool-shared";

const { IPC_OVERLAY } = constants;

interface Entry extends LogEntry {
  json: () => DraftNotify;
}

export default function onLabelInDraftNotify(entry: Entry): void {
  const json = entry.json();
  debugLog(`LABEL: Draft Notify > ${json}`);
  if (!json) return;

  const currentPack = json.PackCards.split(",").map((c) => parseInt(c));
  // packs and picks start at 1;
  setDraftPack(currentPack, json.SelfPack - 1, json.SelfPick - 1);
  if (globals.debugLog || !globals.firstPass) {
    ipcSend("set_draft", globalStore.currentDraft, IPC_OVERLAY);
  }
}
