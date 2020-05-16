import styled from "styled-components";
import { MetricText } from "./MetricText";
import indexCss from "../../index.css";

export const SmallTextButton = styled(MetricText).attrs(props => ({
  className: (props.className ?? "") + " " + indexCss.buttonSimple
}))`
  margin: 0 4px 5px 4px;
  width: 90px;
`;
