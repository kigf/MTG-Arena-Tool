import { constants, Deck } from "mtgatool-shared";
import { ipcSend } from "./backgroundUtil";
import globalStore from "../shared/store";
import debugLog from "../shared/debugLog";

const { IPC_OVERLAY } = constants;

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
