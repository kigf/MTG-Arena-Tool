import LogEntry from "../../types/logDecoder";
import selectDeck from "../selectDeck";
import { Deck, convertDeckFromV3 } from "mtgatool-shared";
import { ArenaV3Deck } from "mtgatool-shared/dist/types/deck";

interface EntryJson {
  params: {
    deck: string;
    opponentDisplayName: string;
    playFirst: boolean;
    bo3: boolean;
  };
}

interface Entry extends LogEntry {
  json: () => EntryJson;
}

export default function OutDirectGameChallenge(entry: Entry): void {
  const json = entry.json();
  if (!json) return;
  const deck = json.params.deck;
  const parsedDeck = JSON.parse(deck) as ArenaV3Deck;
  const v2Parsed = convertDeckFromV3(parsedDeck);
  selectDeck(new Deck(v2Parsed));
}
