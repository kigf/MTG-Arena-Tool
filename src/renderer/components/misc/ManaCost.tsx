import React from "react";
import indexCss from "../../index.css";
import sharedCss from "../../../shared/shared.css";

const manaClasses: string[] = [];
manaClasses[0] = sharedCss.mana_w;
manaClasses[1] = sharedCss.mana_u;
manaClasses[2] = sharedCss.mana_b;
manaClasses[3] = sharedCss.mana_r;
manaClasses[4] = sharedCss.mana_g;
manaClasses[5] = sharedCss.mana_c;

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
            className={`${newclass} ${indexCss.flex_end} ${manaClasses[mana - 1]}`}
          />
        );
      })}
    </>
  );
}
