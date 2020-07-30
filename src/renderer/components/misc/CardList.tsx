import React from "react";
import db from "../../../shared/database-wrapper";
import CardTile from "../../../shared/CardTile";
import { CardsList, CardObject } from "mtgatool-shared";

interface CardListProps {
  list: CardsList;
}

export default function CardList(props: CardListProps): JSX.Element {
  const { list } = props;
  if (!list || db.version == 0) return <></>;
  return (
    <>
      {list.get().map((card: CardObject, index: number) => {
        const cardObj = db.card(card.id);
        if (cardObj) {
          return (
            <CardTile
              indent="a"
              isHighlighted={false}
              isSideboard={false}
              showWildcards={false}
              card={cardObj}
              key={"cardlist" + index + "-" + card.id}
              quantity={card.quantity}
            />
          );
        }
      })}
    </>
  );
}
