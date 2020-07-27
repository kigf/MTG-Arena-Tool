import LogEntry from "../../types/logDecoder";
import inventoryUpdate from "../inventoryUpdate";
import trackUpdate from "../trackUpdate";
import {
  PostMatchUpdate,
  QuestUpdate,
} from "mtgatool-shared/dist/types/postmatch";
import { InventoryUpdate } from "mtgatool-shared/dist/types/inventory";

export interface Entry extends LogEntry {
  json: () => PostMatchUpdate;
}

export default function OnPostMatchUpdate(entry: Entry): void {
  const json = entry.json();
  if (!json) return;

  json.questUpdate.forEach((quest: QuestUpdate) => {
    if (quest.inventoryUpdate) {
      inventoryUpdate(entry, quest.inventoryUpdate);
    }
  });

  json.dailyWinUpdates.forEach((update: InventoryUpdate) => {
    inventoryUpdate(entry, update);
  });

  json.weeklyWinUpdates.forEach((update: InventoryUpdate) => {
    inventoryUpdate(entry, update);
  });

  trackUpdate(entry, json.eppUpdate);
  trackUpdate(entry, json.battlePassUpdate);
}
