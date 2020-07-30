import { playerDb } from "../../shared/db/LocalDatabase";
import LogEntry from "../../types/logDecoder";
import { reduxAction } from "../../shared/redux/sharedRedux";
import globals from "../globals";
import { constants, PlayerInventory } from "mtgatool-shared";

const { IPC_RENDERER } = constants;

interface Entry extends LogEntry {
  json: () => PlayerInventory;
}

export default function InPlayerInventoryGetPlayerInventory(
  entry: Entry
): void {
  const json = entry.json();
  if (!json) return;
  const economy = {
    gold: json.gold,
    gems: json.gems,
    vault: json.vaultProgress,
    wcTrack: json.wcTrackPosition,
    wcCommon: json.wcCommon,
    wcUncommon: json.wcUncommon,
    wcRare: json.wcRare,
    wcMythic: json.wcMythic,
    boosters: json.boosters,
  };
  reduxAction(
    globals.store.dispatch,
    { type: "SET_PLAYER_ECONOMY", arg: economy },
    IPC_RENDERER
  );
  playerDb.upsert("", "economy", economy);
}
