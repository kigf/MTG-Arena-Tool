import React from "react";
import indexCss from "../../index.css";
import { getCardImage } from "../../../shared/utils/getCardArtCrop";
import { DbCardData, Rarity } from "mtgatool-shared/dist/types/metadata";

interface RoundCardProps {
  card: DbCardData;
}

const rarityOverlay: Record<Rarity, string> = {
  common: indexCss.rarityOverlayCommon,
  uncommon: indexCss.rarityOverlayUncommon,
  rare: indexCss.rarityOverlayRare,
  mythic: indexCss.rarityOverlayMythic,
  token: "",
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
