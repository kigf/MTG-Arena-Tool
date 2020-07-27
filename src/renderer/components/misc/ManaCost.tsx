import React from "react";
import indexCss from "../../index.css";
import sharedCss from "../../../shared/shared.css";
import { constants } from "mtgatool-shared";
const { WHITE, BLUE, BLACK, RED, GREEN, COLORLESS } = constants;

const manaClasses: string[] = [];
manaClasses[WHITE] = sharedCss.manaW;
manaClasses[BLUE] = sharedCss.manaU;
manaClasses[BLACK] = sharedCss.manaB;
manaClasses[RED] = sharedCss.manaR;
manaClasses[GREEN] = sharedCss.manaG;
manaClasses[COLORLESS] = sharedCss.manaC;

interface ManaCostProps {
  colors: number[];
  class?: string;
}

export default function ManaCost(props: ManaCostProps): JSX.Element {
  const { colors } = props;
  // Default to size 16px, Initially these had classes because "s" was for
  // shadowed mana costs, whereas no prefix was regular, non shadowed icon.
  // I supose these could be a set of props instead.
  const newclass = props.class ? props.class : sharedCss.mana_s16;

  return (
    <>
      {colors.map((mana, index) => {
        return (
          <div
            key={mana + "_" + index}
            className={`${newclass} ${indexCss.flex_end} ${manaClasses[mana]}`}
          />
        );
      })}
    </>
  );
}
