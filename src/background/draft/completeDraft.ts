import globals from "../globals";
import { playerDb } from "../../shared/db/LocalDatabase";
import globalStore from "../../shared/store";
import { reduxAction } from "../../shared/redux/sharedRedux";
import { IPC_RENDERER, ARENA_MODE_IDLE } from "../../shared/constants";
import { ipcSend } from "../backgroundUtil";
import debugLog from "../../shared/debugLog";

export default function completeDraft(): void {
  if (globals.debugLog || !globals.firstPass) {
    ipcSend("set_arena_state", ARENA_MODE_IDLE);
  }
  // Add to indexes
  const draft = globalStore.currentDraft;
  console.log(globalStore.currentDraft);
  if (draft.id) {
    let draftIndex = globals.store.getState().drafts.draftsIndex;
    if (!draftIndex.includes(draft.id)) {
      draftIndex = [...draftIndex, draft.id];
      playerDb.upsert("", "draftv2_index", draftIndex);
      reduxAction(
        globals.store.dispatch,
        { type: "SET_DRAFT", arg: draft },
        IPC_RENDERER
      );
    }
    debugLog(`Compelte draft: ${draft}`);
    playerDb.upsert("", draft.id, draft);
  } else {
    debugLog(`Couldnt save draft without id: ${draft}`);
  }
}
