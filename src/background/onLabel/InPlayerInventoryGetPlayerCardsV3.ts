/* eslint-disable @typescript-eslint/camelcase */
import { playerDb } from "../../shared/db/LocalDatabase";
import LogEntry from "../../types/logDecoder";
import globals from "../globals";
import { reduxAction } from "../../shared/redux/sharedRedux";
import { IPC_RENDERER, IPC_OVERLAY } from "../../shared/constants";

interface Cards {
  [grpId: string]: number;
}

interface Entry extends LogEntry {
  json: () => Cards;
}

export default function InPlayerInventoryGetPlayerCardsV3(entry: Entry): void {
  const json = entry.json();
  if (!json) return;
  reduxAction(
    globals.store.dispatch,
    "ADD_CARDS_KEYS",
    json,
    IPC_RENDERER | IPC_OVERLAY
  );
  const cards = globals.store.getState().playerdata.cards;
  playerDb.upsert("", "cards", cards);
}
