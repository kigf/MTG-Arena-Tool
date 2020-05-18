import styled from "styled-components";
import { SymbolBase } from "./SymbolBase";
import indexCss from "../../index.css";

const wcIcon: Record<string, string> = {};
wcIcon["common"] = indexCss.wcCommon;
wcIcon["uncommon"] = indexCss.wcUncommon;
wcIcon["rare"] = indexCss.wcRare;
wcIcon["mythic"] = indexCss.wcMythic;

const RaritySymbolBase = styled(SymbolBase).attrs<RaritySymbolProps>(
  (props) => ({
    className: `${indexCss.rarityFilter} ${wcIcon[props.rarity]} ${
      props.className ?? ""
    }`,
  })
)``;
interface RaritySymbolProps {
  rarity: string;
}

export const RaritySymbol = styled(RaritySymbolBase)<RaritySymbolProps>``;
