import styled from "styled-components";
import { SymbolBase } from "./SymbolBase";
import css from "../economy/economy.css";

export const TicketSymbol = styled(SymbolBase).attrs(props => ({
  className: `${css.economy_ticket} ${props.className ?? ""}`
}))``;
