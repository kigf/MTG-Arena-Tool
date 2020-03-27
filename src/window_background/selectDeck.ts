import globals from "./globals";
import Deck from "../shared/deck";
import { IPC_OVERLAY } from "../shared/constants";
import { ipcSend } from "./backgroundUtil";

export default function selectDeck(arg: Deck): void {
  globals.currentDeck = arg;
  // console.log("Select deck: ", globals.currentDeck, arg);
  globals.originalDeck = globals.currentDeck.clone();
  ipcSend("set_deck", globals.currentDeck.getSave(), IPC_OVERLAY);
}
