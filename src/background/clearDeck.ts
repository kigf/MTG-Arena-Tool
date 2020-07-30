import { constants } from "mtgatool-shared";
import { ipcSend } from "./backgroundUtil";

const { IPC_OVERLAY } = constants;

export default function clearDeck(): void {
  const deck = { mainDeck: [], sideboard: [], name: "" };
  ipcSend("set_deck", deck, IPC_OVERLAY);
}
