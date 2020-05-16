import React from "react";
import {DbCardData} from "../../../types/Metadata";
import {getCardImage} from "../../../shared/util";
import indexCss from "../../index.css";

interface RoundCardProps {
  card: DbCardData;
}

export default function RoundCard(props: RoundCardProps): JSX.Element {
  const {card} = props;

  const className = `${indexCss.roundCard} ${card.rarity} ${indexCss.rarityOverlay}`;

  const style: React.CSSProperties = {
    backgroundImage: `url("${getCardImage(card, "art_crop")}")`,
  };

  return <div style={style} title={card.name} className={className}></div>;
}
