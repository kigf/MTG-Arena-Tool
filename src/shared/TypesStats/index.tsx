import * as React from "react";
import db from "../database-wrapper";
import { constants, Deck, CardObject } from "mtgatool-shared";

import sharedCss from "../shared.css";
import css from "./TypesStats.css";

const { CARD_TYPES, CARD_TYPE_CODES } = constants;

const typeIcons: Record<string, string> = {};
typeIcons["art"] = css.type_art;
typeIcons["cre"] = css.type_cre;
typeIcons["enc"] = css.type_enc;
typeIcons["ins"] = css.type_ins;
typeIcons["lan"] = css.type_lan;
typeIcons["pla"] = css.type_pla;
typeIcons["sor"] = css.type_sor;

function getDeckTypesAmount(deck: Deck): { [key: string]: number } {
  const types = { art: 0, cre: 0, enc: 0, ins: 0, lan: 0, pla: 0, sor: 0 };
  if (!deck.getMainboard().get()) return types;

  deck
    .getMainboard()
    .get()
    .forEach(function (card: CardObject | any) {
      // TODO remove group lands hack
      if (card?.id?.id === 100) {
        return;
      }
      const c = db.card(card.id);
      if (c) {
        if (c.type.includes("Land", 0)) types.lan += card.quantity;
        if (c.type.includes("Creature", 0)) types.cre += card.quantity;
        if (c.type.includes("Artifact", 0)) types.art += card.quantity;
        if (c.type.includes("Enchantment", 0)) types.enc += card.quantity;
        if (c.type.includes("Instant", 0)) types.ins += card.quantity;
        if (c.type.includes("Sorcery", 0)) types.sor += card.quantity;
        if (c.type.includes("Planeswalker", 0)) types.pla += card.quantity;
      }
    });

  return types;
}

export default function DeckTypesStats(props: {
  className?: string;
  deck: Deck;
}): JSX.Element {
  const { className, deck } = props;
  const cardTypes = getDeckTypesAmount(deck);
  return (
    <div className={className || css.types_container}>
      {CARD_TYPE_CODES.map((cardTypeKey, index) => {
        return (
          <div
            className={sharedCss.type_icon_cont}
            key={"type_icon_cont_" + index}
          >
            <div
              className={`${css.type_icon} ${typeIcons[cardTypeKey]}`}
              title={CARD_TYPES[index]}
            />
            <span>{cardTypes[cardTypeKey]}</span>
          </div>
        );
      })}
    </div>
  );
}
