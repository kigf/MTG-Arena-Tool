import Deck from "../shared/deck";
import { IPC_OVERLAY } from "../shared/constants";
import { ipcSend } from "./backgroundUtil";
import globalStore from "../shared/store";
import debugLog from "../shared/debugLog";

export default function selectDeck(arg: Deck): void {
  debugLog(`Select deck: ${arg}`);
  // This does not work
  //globalStore.currentMatch = {
  //  ...globalStore.currentMatch,
  //  originalDeck: arg.clone(),
  //  currentDeck: arg.clone(),
  //};
  // This does
  Object.assign(globalStore.currentMatch.originalDeck, arg.clone());
  Object.assign(globalStore.currentMatch.currentDeck, arg.clone());
  ipcSend("set_deck", arg.getSave(), IPC_OVERLAY);
}
