import { InternalDeck } from "../types/Deck";
import { constants, objectClone } from "mtgatool-shared";

const { DEFAULT_TILE } = constants;

const deckDefault: InternalDeck = {
  deckTileId: DEFAULT_TILE,
  description: "",
  format: "Standard",
  colors: [],
  id: "00000000-0000-0000-0000-000000000000",
  lastUpdated: "2018-05-31T00:06:29.7456958",
  mainDeck: [],
  name: "Undefined",
  sideboard: [],
  type: "InternalDeck",
};

export function createDeck(): InternalDeck {
  return objectClone<InternalDeck>(deckDefault);
}
