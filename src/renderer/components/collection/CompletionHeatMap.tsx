import React from "react";
import { CARD_RARITIES, COLORS_LONG } from "../../../shared/constants";
import db from "../../../shared/database";
import { CardStats } from "./collectionStats";
import useHoverCard from "../../hooks/useHoverCard";

import notFound from "../../../assets/images/notfound.png";
import sharedCss from "../../../shared/shared.css";
import indexCss from "../../index.css";
import css from "./CompletionTableHeatMap.css";

type ColorData = { [key: string]: CardStats[] };
type CardData = ColorData[];

const compCard: string[] = [];
compCard[0] = css.completionTableCardN0;
compCard[1] = css.completionTableCardN1;
compCard[2] = css.completionTableCardN2;
compCard[3] = css.completionTableCardN3;
compCard[4] = css.completionTableCardN4;

const manaClasses: Record<string, string> = {
  white: sharedCss.manaW,
  blue: sharedCss.manaU,
  black: sharedCss.manaB,
  red: sharedCss.manaR,
  green: sharedCss.manaG,
  colorless: sharedCss.manaC,
  multi: sharedCss.manaMulti,
};

const compRarity: Record<string, string> = {
  common: css.completionTableRarityTitleCommon,
  uncommon: css.completionTableRarityTitleUncommon,
  rare: css.completionTableRarityTitleRare,
  mythic: css.completionTableRarityTitleMythic,
};

function CardCell({
  card,
  color,
  rarityIndex,
  index,
}: {
  card: CardStats;
  color: number;
  rarityIndex: number;
  index: number;
}): JSX.Element {
  const [hoverIn, hoverOut] = useHoverCard(card.id);
  return (
    <div
      key={index}
      className={`${css.completionTableCard} ${
        compCard[Math.min(card.owned, 4)]
      } ${card.wanted > 0 ? css.wanted : ""}`}
      onMouseEnter={hoverIn}
      onMouseLeave={hoverOut}
      style={{
        gridArea: `${index + 3} / ${color * 5 + 1 + rarityIndex} / auto / ${
          color * 5 + 1 + rarityIndex
        }`,
      }}
    >
      {Math.min(card.owned, 4)}
    </div>
  );
}

function RarityColumn({
  colorData,
  color,
  rarityCode,
}: {
  colorData: ColorData;
  color: number;
  rarityCode: string;
}): JSX.Element {
  const rarityIndex = CARD_RARITIES.indexOf(rarityCode as any);
  const rarity = rarityCode.toLowerCase();
  const cardsArray = colorData && colorData[rarity] ? colorData[rarity] : [];
  return (
    <>
      <div
        className={`${compRarity[rarity]} ${css.completionTableRarityTitle}`}
        title={rarity}
        style={{
          gridArea: `2 / ${color * 5 + 1 + rarityIndex} / auto / ${
            color * 5 + 1 + rarityIndex
          }`,
        }}
      />
      {cardsArray.map((card, index) => {
        const props = {
          card,
          color,
          rarityIndex,
          index,
        };
        return <CardCell key={index} {...props} />;
      })}
    </>
  );
}

function ColorColumn({
  cardData,
  colorCode,
  color,
}: {
  cardData: CardData;
  colorCode: string;
  color: number;
}): JSX.Element {
  // A little hacky to use "c + 1"..
  const colorIndex = color + 1;
  const colorData = cardData[colorIndex];
  return (
    <>
      <div
        key={color}
        className={`${css.completionTableColorTitle} ${manaClasses[colorCode]}`}
        style={{
          gridArea: `1 / ${color * 5 + 1} / auto / ${color * 5 + 6}`,
        }}
      />
      {CARD_RARITIES.filter((rarity) => rarity !== "land").map((rarityCode) => {
        const props = {
          colorData,
          color,
          rarityCode,
        };
        return <RarityColumn key={rarityCode} {...props} />;
      })}
    </>
  );
}

export default function CompletionHeatMap({
  cardData,
  setName,
}: {
  cardData: CardData;
  setName: string;
}): JSX.Element {
  const iconSvg = db.sets[setName]?.svg ?? db.defaultSet?.svg;
  const setIcon = iconSvg
    ? `url(data:image/svg+xml;base64,${iconSvg})`
    : `url(${notFound})`;
  return (
    <>
      <div style={{ margin: "auto" }}>
        <div
          className={indexCss.statsSetIcon}
          style={{ backgroundImage: setIcon }}
        >
          <span>{setName}</span>
        </div>
      </div>
      <div className={css.completionTable}>
        {COLORS_LONG.map((code, color) => {
          return (
            <ColorColumn
              key={color}
              cardData={cardData}
              colorCode={code}
              color={color}
            />
          );
        })}
      </div>
    </>
  );
}
