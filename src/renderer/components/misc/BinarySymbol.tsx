import styled from "styled-components";
import { SymbolBase } from "./SymbolBase";
import indexCss from "../../index.css";

const BinarySymbolBase = styled(SymbolBase).attrs<BinarySymbolProps>(
  (props) => ({
    className: `${props.className ?? ""} ${indexCss.rarityFilter} ${
      props.isOn ? indexCss.ontheplay : indexCss.onthedraw
    }`,
  })
)``;

interface BinarySymbolProps {
  isOn: boolean;
}

export const BinarySymbol = styled(BinarySymbolBase)<BinarySymbolProps>``;
