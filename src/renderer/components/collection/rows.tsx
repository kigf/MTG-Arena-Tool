import React from "react";
import OwnershipStars from "../../../shared/OwnershipStars";
import { getCardImage } from "../../../shared/utils/getCardArtCrop";
import { CollectionTableRowProps } from "./types";
import useHoverCard from "../../hooks/useHoverCard";
import { AppState } from "../../../shared/redux/stores/rendererStore";
import { useSelector } from "react-redux";

import indexCss from "../../index.css";
import { openScryfallCard } from "../../../shared/utils/openScryfallCard";

export function CardTileRow({
  row,
  contextMenuCallback,
}: CollectionTableRowProps): JSX.Element {
  const card = row.original;
  const onClick = React.useCallback(() => {
    openScryfallCard(card);
  }, [card]);
  const containerEl = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const containerDiv = containerEl.current;
    if (containerDiv) {
      contextMenuCallback(containerDiv, card);
    }
  }, [card, contextMenuCallback]);

  const [hoverIn, hoverOut] = useHoverCard(card.id, card.wanted);

  const cardSize =
    100 + useSelector((state: AppState) => state.settings.cards_size) * 15;
  const cardsQuality = useSelector(
    (state: AppState) => state.settings.cards_quality
  );

  return (
    <div
      ref={containerEl}
      title={`open ${card.name} in Scryfall (browser)`}
      onClick={onClick}
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div style={{ width: "100%", maxWidth: cardSize + "px" }}>
        <OwnershipStars card={card} wanted={card.wanted} />
      </div>
      <div
        className={indexCss.inventory_card}
        onMouseEnter={hoverIn}
        onMouseLeave={hoverOut}
        style={{ width: cardSize + "px" }}
      >
        <img
          className={indexCss.inventory_card_img}
          style={{ width: cardSize + "px" }}
          src={getCardImage(card, cardsQuality)}
        />
      </div>
    </div>
  );
}
