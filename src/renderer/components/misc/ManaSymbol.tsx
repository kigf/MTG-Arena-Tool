import styled from "styled-components";
import sharedCss from "../../../shared/shared.css";

const manaClasses: string[] = [];
manaClasses[0] = sharedCss.mana_w;
manaClasses[1] = sharedCss.mana_u;
manaClasses[2] = sharedCss.mana_b;
manaClasses[3] = sharedCss.mana_r;
manaClasses[4] = sharedCss.mana_g;
manaClasses[5] = sharedCss.mana_c;

const ManaSymbolBase = styled.div.attrs<ManaSymbolProps>(props => ({
  className: `${sharedCss.mana_s16} ${manaClasses[props.colorIndex]} ${props.className ?? ""}`
}))``;
interface ManaSymbolProps {
  colorIndex: number;
}

export const ManaSymbol = styled(ManaSymbolBase)<ManaSymbolProps>``;
