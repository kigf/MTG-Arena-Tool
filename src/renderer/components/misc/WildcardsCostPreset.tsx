import React from "react";
import { CARD_RARITIES } from "../../../shared/constants";
import _ from "lodash";
import { MissingWildcards } from "../decks/types";
import { getBoosterCountEstimate } from "../../rendererUtil";
import indexCss from "../../index.css";

const wcIcon: Record<string, string> = {};
wcIcon["common"] = indexCss.wcCommon;
wcIcon["uncommon"] = indexCss.wcUncommon;
wcIcon["rare"] = indexCss.wcRare;
wcIcon["mythic"] = indexCss.wcMythic;

const getRarityKey = (
  rarity: string
): "rare" | "common" | "uncommon" | "mythic" | undefined => {
  if (["rare", "common", "uncommon", "mythic"].includes(rarity))
    return rarity as any;
  return undefined;
};

interface WildcardsCostPresetProps {
  wildcards: {
    c?: number;
    u?: number;
    r?: number;
    m?: number;
  };
  showComplete?: boolean;
}

export default function WildcardsCostPreset(
  props: WildcardsCostPresetProps
): JSX.Element {
  const { c, u, r, m } = props.wildcards;
  const showComplete = props.showComplete || false;

  const missingWildcards: MissingWildcards = {
    common: c || 0,
    uncommon: u || 0,
    rare: r || 0,
    mythic: m || 0,
  };

  const totalMissing =
    missingWildcards.common +
    missingWildcards.uncommon +
    missingWildcards.rare +
    missingWildcards.mythic;

  const drawCost = totalMissing > 0;

  const boostersNeeded = Math.round(getBoosterCountEstimate(missingWildcards));

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      {CARD_RARITIES.filter(
        (rarity) => rarity !== "land" && rarity !== "token"
      ).map((cardRarity: string) => {
        const key = getRarityKey(cardRarity);
        if (key) {
          const missing = missingWildcards[key];
          if (missing) {
            return (
              <div
                key={cardRarity + "-" + missing}
                className={`${indexCss.wcExploreCost} ${wcIcon[cardRarity]}`}
                title={_.capitalize(cardRarity)}
              >
                {missing}
              </div>
            );
          }
        }
      })}
      {showComplete && boostersNeeded == 0 ? (
        <div title="You can build this deck!" className={indexCss.wcComplete} />
      ) : drawCost ? (
        <div
          title="Boosters needed (estimated)"
          className={indexCss.boExploreCost}
        >
          {boostersNeeded}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
