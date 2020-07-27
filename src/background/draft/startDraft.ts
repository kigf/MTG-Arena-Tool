import { ipcSend } from "../backgroundUtil";
import globals from "../globals";
import { setDraftData } from "../../shared/store/currentDraftStore";
import { constants } from "mtgatool-shared";
import { InternalDraftv2 } from "mtgatool-shared/dist/types/draft";

const { ARENA_MODE_DRAFT } = constants;

export default function startDraft(): void {
  if (globals.debugLog || !globals.firstPass) {
    if (globals.store.getState().settings.close_on_match) {
      ipcSend("renderer_hide", 1);
    }
    ipcSend("set_arena_state", ARENA_MODE_DRAFT);
  }

  const playerData = globals.store.getState().playerdata;
  const appSettings = globals.store.getState().appsettings;
  const add = {
    arenaId: playerData.playerName,
    owner: appSettings.email,
    date: globals.logTime.toISOString(),
  } as Partial<InternalDraftv2>;

  setDraftData(add);
  globals.duringDraft = true;
}
