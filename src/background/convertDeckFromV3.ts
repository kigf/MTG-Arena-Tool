import {
  ArenaV3Deck,
  InternalDeck,
  v2cardsList,
  v3cardsList
} from "../types/Deck";
import Deck from "../shared/deck";

export function convertV3ListToV2(orig: v3cardsList): v2cardsList {
  const newList: v2cardsList = [];

  for (let i = 0; i < orig.length; i += 2) {
    const id = orig[i];
    const quantity = orig[i + 1];
    newList.push({ id, quantity });
  }

  return newList;
}

export default function convertDeckFromV3(v3deck: ArenaV3Deck): InternalDeck {
  const newMain = convertV3ListToV2(v3deck.mainDeck);
  const newSide = convertV3ListToV2(v3deck.sideboard);
  const v2Deck: InternalDeck = {
    mainDeck: newMain,
    sideboard: newSide,
    id: v3deck.id,
    name: v3deck.name,
    lastUpdated: v3deck.lastUpdated,
    deckTileId: v3deck.deckTileId,
    description: v3deck.description,
    commandZoneGRPIds: v3deck.commandZoneGRPIds,
    companionGRPId: v3deck.companionGRPId,
    format: v3deck.format,
    type: "InternalDeck"
  };
  const deck = new Deck(v2Deck);
  return deck.getSave();
}
