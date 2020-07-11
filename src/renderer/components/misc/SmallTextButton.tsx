import styled from "styled-components";
import indexCss from "../../index.css";

export const SmallTextButton = styled.div.attrs((props) => ({
  className: (props.className ?? "") + " " + indexCss.buttonSimple,
}))`
  width: 100px;
`;
