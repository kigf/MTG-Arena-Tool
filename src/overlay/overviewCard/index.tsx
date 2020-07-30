import React from "react";
import { getCardImage } from "../../shared/utils/getCardArtCrop";
import database from "../../shared/database-wrapper";
import css from "./index.css";

interface OverviewCardProps {
  grpId: number;
  title: string;
  value?: number;
}

export default function OverviewCard(props: OverviewCardProps): JSX.Element {
  const card = database.card(props.grpId);

  if (!card) return <></>;

  const style: React.CSSProperties = {
    backgroundImage: `url("${getCardImage(card, "art_crop")}")`,
  };

  return (
    <div className={css.container}>
      <div className={css.title}>{props.title}</div>
      <div className={css.overviewCardContainer}>
        <div
          className={css.overviewCard}
          style={style}
          title={props.value ? `${card.name} (${props.value})` : card.name}
        />
      </div>
    </div>
  );
}
