import playerData from "../../shared/PlayerData";
import { ArenaV3Deck } from "../../types/Deck";
import LogEntry from "../../types/logDecoder";
import { setData } from "../backgroundUtil";
import convertDeckFromV3 from "../convertDeckFromV3";

interface Entry extends LogEntry {
  json: () => ArenaV3Deck[];
}

export default function InDeckGetDeckLists(
  entry: Entry,
  json: ArenaV3Deck[] = []
): void {
  if (json.length == 0 && entry) json = entry.json();
  if (json.length == 0) return;

  const decks = { ...playerData.decks };
  const staticDecks: any[] = [];
  json.forEach(deck => {
    const deckData = { ...(playerData.deck(deck.id) || {}), ...deck };
    decks[deck.id] = convertDeckFromV3(deckData);
    staticDecks.push(deck.id);
  });

  setData({ decks, staticDecks });
}
