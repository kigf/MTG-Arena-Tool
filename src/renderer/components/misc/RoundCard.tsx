import React from "react";
import { DbCardData, Rarity } from "../../../types/Metadata";
import indexCss from "../../index.css";
import { getCardImage } from "../../../shared/utils/getCardArtCrop";

interface RoundCardProps {
  card: DbCardData;
}

const rarityOverlay: Record<Rarity, string> = {
  common: indexCss.rarityOverlayCommon,
  uncommon: indexCss.rarityOverlayUncommon,
  rare: indexCss.rarityOverlayRare,
  mythic: indexCss.rarityOverlayMythic,
  land: indexCss.rarityOverlay,
};

export default function RoundCard(props: RoundCardProps): JSX.Element {
  const { card } = props;

  const className = `${indexCss.roundCard} ${rarityOverlay[card.rarity]} ${
    indexCss.rarityOverlay
  }`;

  const style: React.CSSProperties = {
    backgroundImage: `url("${getCardImage(card, "art_crop")}")`,
  };

  return <div style={style} title={card.name} className={className}></div>;
}
