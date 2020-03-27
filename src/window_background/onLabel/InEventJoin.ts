import Deck from "../../shared/deck";
import { InternalDeck } from "../../types/Deck";
import LogEntry from "../../types/logDecoder";
import addCustomDeck from "../addCustomDeck";
import selectDeck from "../selectDeck";

interface EntryJson {
  CourseDeck: InternalDeck;
}

interface Entry extends LogEntry {
  json: () => EntryJson;
}

export default function InEventJoin(entry: Entry): void {
  const json = entry.json();
  if (!json) return;

  if (json.CourseDeck) {
    const deck = new Deck(json.CourseDeck);
    addCustomDeck(json.CourseDeck);
    selectDeck(deck);
  }
}
