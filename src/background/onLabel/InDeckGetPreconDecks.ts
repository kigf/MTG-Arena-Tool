import LogEntry from "../../types/logDecoder";
import { ipcSend } from "../backgroundUtil";
import { ArenaV3Deck } from "mtgatool-shared";

interface Entry extends LogEntry {
  json: () => ArenaV3Deck[];
}

export default function InDeckGetPreconDecks(entry: Entry): void {
  const json = entry.json();
  if (!json) return;
  ipcSend("set_precon_decks", JSON.stringify(json));
}
