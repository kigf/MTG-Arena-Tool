import styled from "styled-components";
import sharedCss from "../../../shared/shared.css";
import {
  WHITE,
  BLUE,
  BLACK,
  RED,
  GREEN,
  COLORLESS,
} from "../../../shared/constants";

const manaClasses: string[] = [];
manaClasses[WHITE] = sharedCss.manaW;
manaClasses[BLUE] = sharedCss.manaU;
manaClasses[BLACK] = sharedCss.manaB;
manaClasses[RED] = sharedCss.manaR;
manaClasses[GREEN] = sharedCss.manaG;
manaClasses[COLORLESS] = sharedCss.manaC;

const ManaSymbolBase = styled.div.attrs<ManaSymbolProps>((props) => ({
  className: `${sharedCss.mana_s16} ${manaClasses[props.colorIndex]} ${
    props.className ?? ""
  }`,
}))``;
interface ManaSymbolProps {
  colorIndex: number;
}

export const ManaSymbol = styled(ManaSymbolBase)<ManaSymbolProps>``;
