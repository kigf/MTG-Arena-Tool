import LogEntry from "../../types/logDecoder";
import { setDraftPack } from "../../shared/store/currentDraftStore";
import { ipcSend } from "../backgroundUtil";
import globalStore from "../../shared/store";
import startDraft from "../draft/startDraft";
import globals from "../globals";
import { constants } from "mtgatool-shared";
import { DraftStatus } from "mtgatool-shared/dist/types/draft";

const { IPC_OVERLAY } = constants;

interface Entry extends LogEntry {
  json: () => DraftStatus;
}

export default function InDraftDraftStatus(entry: Entry): void {
  const json = entry.json();
  // debugLog("LABEL:  Draft status ", json);
  if (!json) return;

  startDraft();
  const pack = json.PackNumber;
  const pick = json.PickNumber;
  const currentPack = (json.DraftPack || []).slice(0).map((n) => parseInt(n));

  setDraftPack(currentPack, pack, pick);
  if (globals.debugLog || !globals.firstPass) {
    ipcSend("set_draft", globalStore.currentDraft, IPC_OVERLAY);
  }
}
