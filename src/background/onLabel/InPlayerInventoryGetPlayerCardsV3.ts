/* eslint-disable @typescript-eslint/camelcase */
import { playerDb } from "../../shared/db/LocalDatabase";
import LogEntry from "../../types/logDecoder";
import globals from "../globals";
import { reduxAction } from "../../shared/redux/sharedRedux";
import { constants } from "mtgatool-shared";

const { IPC_RENDERER, IPC_OVERLAY } = constants;

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
    { type: "ADD_CARDS_KEYS", arg: json },
    IPC_RENDERER | IPC_OVERLAY
  );
  const cards = globals.store.getState().playerdata.cards;
  playerDb.upsert("", "cards", cards);
}
