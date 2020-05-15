import { ARENA_MODE_IDLE } from "../../shared/constants";
import globals from "../globals";
import { ipcSend } from "../backgroundUtil";
import { InternalDraft } from "../../types/draft";

export default function endDraft(data?: InternalDraft): void {
  globals.duringDraft = false;
  if (globals.debugLog || !globals.firstPass) {
    ipcSend("set_arena_state", ARENA_MODE_IDLE);
  }

  if (!data) return;

  const httpApi = require("../httpApi");
  httpApi.httpSetDraft(data);
  ipcSend("popup", { text: "Draft saved!", time: 3000 });
}
