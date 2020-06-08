import LogEntry from "../../types/logDecoder";
import { PlayerCourse } from "../../types/event";
import { setDraftId, setDraftData } from "../../shared/store/currentDraftStore";
import getSetCodeInEventId from "../../shared/utils/getSetInEventId";
import { ARENA_MODE_IDLE } from "../../shared/constants";
import { ipcSend } from "../backgroundUtil";
import globals from "../globals";
import { httpSetDraft } from "../httpApi";
import globalStore from "../../shared/store";

interface Entry extends LogEntry {
  json: () => PlayerCourse;
}
export default function InEventCompleteDraft(entry: Entry): void {
  const json = entry.json();
  console.log("LABEL:  Complete draft ", json);
  if (!json) return;
  if (globals.debugLog || !globals.firstPass) {
    ipcSend("set_arena_state", ARENA_MODE_IDLE);
  }

  const set = getSetCodeInEventId(json.InternalEventName);
  setDraftData({ draftSet: set, eventId: json.InternalEventName });
  setDraftId(json.Id + "-draft");
  httpSetDraft(globalStore.currentDraft);
  ipcSend("popup", { text: "Draft saved!", time: 3000 });
  console.log(globalStore.currentDraft);
}
