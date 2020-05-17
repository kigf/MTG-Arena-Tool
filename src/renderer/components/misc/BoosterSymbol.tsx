import styled from "styled-components";
import { SymbolBase } from "./SymbolBase";
import indexCss from "../../index.css";

export const BoosterSymbol = styled(SymbolBase).attrs(props => ({
  className: `${indexCss.bo_explore_cost} ${props.className ?? ""}`
}))``;
