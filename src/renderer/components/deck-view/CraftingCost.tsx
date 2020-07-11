import React from "react";
import Deck from "../../../shared/deck";
import { CARD_RARITIES } from "../../../shared/constants";
import { useSelector } from "react-redux";
import { AppState } from "../../../shared/redux/stores/rendererStore";
import { getBoosterCountEstimate, get_deck_missing } from "../../rendererUtil";

import indexCss from "../../index.css";

const wcIcon: Record<string, string> = {};
wcIcon["common"] = indexCss.wcCommon;
wcIcon["uncommon"] = indexCss.wcUncommon;
wcIcon["rare"] = indexCss.wcRare;
wcIcon["mythic"] = indexCss.wcMythic;

type IndexableObject = { [key: string]: number };

interface CraftingCostProps {
  deck: Deck;
}

export default function CraftingCost(props: CraftingCostProps): JSX.Element {
  const { deck } = props;
  const { wcCommon, wcUncommon, wcRare, wcMythic } = useSelector(
    (state: AppState) => state.playerdata.economy
  );
  const ownedWildcards: IndexableObject = {
    common: wcCommon,
    uncommon: wcUncommon,
    rare: wcRare,
    mythic: wcMythic,
  };
  // Another deck.getSave() conversion here..
  const missingWildcards: any = get_deck_missing(deck);
  const boosterCost = getBoosterCountEstimate(missingWildcards);

  return (
    <div className={indexCss.wildcardsCost}>
      {CARD_RARITIES.filter(
        (rarity) => rarity !== "land" && rarity !== "token"
      ).map((cardRarity) => {
        const cardRarityLowercase = cardRarity.toLowerCase();
        const wcText = `${missingWildcards[cardRarityLowercase]} (${
          ownedWildcards[cardRarityLowercase] > 0
            ? ownedWildcards[cardRarityLowercase]
            : 0
        })`;
        return (
          <div
            key={cardRarity}
            title={cardRarity}
            className={indexCss.wcCost + " " + wcIcon[cardRarity]}
          >
            {wcText}
          </div>
        );
      })}
      <div
        title="Approximate boosters"
        className={indexCss.wcCost + " " + indexCss.wcBooster}
      >
        {Math.round(boosterCost)}
      </div>
    </div>
  );
}
