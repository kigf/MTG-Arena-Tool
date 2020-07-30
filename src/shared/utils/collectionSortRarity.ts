import database from "../database-wrapper";
import { getRaritySortValue } from "mtgatool-shared";

export default function collectionSortRarity(a: number, b: number): number {
  const aObj = database.card(a);
  const bObj = database.card(b);

  if (!aObj) return 1;
  if (!bObj) return -1;

  if (getRaritySortValue(aObj.rarity) < getRaritySortValue(bObj.rarity))
    return -1;
  if (getRaritySortValue(aObj.rarity) > getRaritySortValue(bObj.rarity))
    return 1;

  if (aObj.set < bObj.set) return -1;
  if (aObj.set > bObj.set) return 1;

  if (parseInt(aObj.cid) < parseInt(bObj.cid)) return -1;
  if (parseInt(aObj.cid) > parseInt(bObj.cid)) return 1;
  return 0;
}
