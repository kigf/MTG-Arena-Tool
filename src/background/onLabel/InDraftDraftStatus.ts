import LogEntry from "../../types/logDecoder";
import { DraftStatus } from "../../types/draft";
import { setDraftPack } from "../../shared/store/currentDraftStore";
import { ipcSend } from "../backgroundUtil";
import globalStore from "../../shared/store";
import { IPC_OVERLAY } from "../../shared/constants";
import startDraft from "../draft/startDraft";
import globals from "../globals";

interface Entry extends LogEntry {
  json: () => DraftStatus;
}

export default function InDraftDraftStatus(entry: Entry): void {
  const json = entry.json();
  // console.log("LABEL:  Draft status ", json);
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
