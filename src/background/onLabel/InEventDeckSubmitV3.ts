import { Deck, convertDeckFromV3 } from "mtgatool-shared";
import LogEntry from "../../types/logDecoder";
import selectDeck from "../selectDeck";
import { PlayerCourse } from "mtgatool-shared/dist/types/event";

interface Entry extends LogEntry {
  json: () => PlayerCourse;
}

export default function onLabelInEventDeckSubmitV3(entry: Entry): void {
  const json = entry.json();
  if (!json || !json.CourseDeck) return;
  const deck = new Deck(convertDeckFromV3(json.CourseDeck));
  selectDeck(deck);
}
