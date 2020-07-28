import database from "../database-wrapper";
import { shell } from "electron";
import debugLog from "../debugLog";
import { DbCardData } from "mtgatool-shared";

export function openScryfallCard(card?: DbCardData | number): void {
  const cardObj = typeof card == "number" ? database.card(card) : card;
  if (cardObj) {
    const { cid, set } = cardObj;
    const token = cardObj.rarity == "token" ? "t" : "";
    shell.openExternal(
      "https://scryfall.com/card/" +
        token +
        database.sets[set].scryfall +
        "/" +
        cid
    );
  } else {
    // eslint-disable-next-line no-console
    debugLog(`Cant open scryfall card: ${cardObj}`, "error");
  }
}
