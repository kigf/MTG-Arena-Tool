import styled from "styled-components";
import { SymbolBase } from "./SymbolBase";
import indexCss from "../../index.css";
import sharedCss from "../../../shared/shared.css";

function getTypeIconClass(type: string): string {
  if (type.includes("Land", 0)) return sharedCss.typeLan;
  else if (type.includes("Creature", 0)) return sharedCss.typeCre;
  else if (type.includes("Artifact", 0)) return sharedCss.typeArt;
  else if (type.includes("Enchantment", 0)) return sharedCss.typeEnc;
  else if (type.includes("Instant", 0)) return sharedCss.typeIns;
  else if (type.includes("Sorcery", 0)) return sharedCss.typeSor;
  else if (type.includes("Planeswalker", 0)) return sharedCss.typePla;
  else return "";
}

const TypeSymbolBase = styled(SymbolBase).attrs<TypeSymbolProps>((props) => ({
  className: `${indexCss.wcExploreCost} ${getTypeIconClass(props.type)} ${
    props.className ?? ""
  }`,
}))``;

interface TypeSymbolProps {
  type: string;
}

const _TypeSymbol = styled(TypeSymbolBase)<TypeSymbolProps>``;
