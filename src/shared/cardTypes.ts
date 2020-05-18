import _ from "lodash";
import { DbCardData } from "../types/Metadata";

//
// this order matters because things like Artifact Creatures exist
export const cardTypes = [
  "Basic Land",
  "Land",
  "Creature",
  "Artifact",
  "Enchantment",
  "Instant",
  "Sorcery",
  "Planeswalker",
] as const;
type CardType = typeof cardTypes[number];

export function cardHasType(card: DbCardData, type: CardType): boolean {
  if (!_.has(card, "type"))
    throw new Error("The specified card object does not have a type property");
  return card.type.includes(type + " ");
}

export const cardType = (card: DbCardData): CardType => {
  const result = cardTypes.find((ct) => cardHasType(card, ct));
  if (!result) throw new Error("Card type could not be determined");
  return result;
};
