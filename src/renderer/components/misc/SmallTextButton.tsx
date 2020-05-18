import styled from "styled-components";
import { MetricText } from "./MetricText";
import indexCss from "../../index.css";

export const SmallTextButton = styled(MetricText).attrs((props) => ({
  className: (props.className ?? "") + " " + indexCss.buttonSimple,
}))`
  margin: auto 8px;
  width: 90px;
`;
