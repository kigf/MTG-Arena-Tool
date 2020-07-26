import { InternalDeck } from "../../types/Deck";
import { WHITE, BLUE, BLACK, RED, GREEN } from "../constants";
import database from "../database-wrapper";
import debugLog from "../debugLog";

export default function getDeckColors(deck: InternalDeck): number[] {
  let colorIndices: number[] = [];
  try {
    deck.mainDeck.forEach((card) => {
      if (card.quantity < 1) {
        return;
      }

      const cardData = database.card(card.id);

      if (!cardData) {
        return;
      }

      const isLand = cardData.type.indexOf("Land") !== -1;
      const frame = cardData.frame;
      if (isLand && frame.length < 3) {
        colorIndices = colorIndices.concat(frame);
      }

      cardData.cost.forEach((cost) => {
        if (cost === "w") {
          colorIndices.push(WHITE);
        } else if (cost === "u") {
          colorIndices.push(BLUE);
        } else if (cost === "b") {
          colorIndices.push(BLACK);
        } else if (cost === "r") {
          colorIndices.push(RED);
        } else if (cost === "g") {
          colorIndices.push(GREEN);
        }
      });
    });

    colorIndices = Array.from(new Set(colorIndices));
    colorIndices.sort((a, b) => {
      return a - b;
    });
  } catch (e) {
    // FIXME: Errors shouldn't be caught silently. If this is an
    //        expected error then there should be a test to catch only that error.
    debugLog(e, "error");
    colorIndices = [];
  }

  deck.colors = colorIndices;
  return colorIndices;
}
