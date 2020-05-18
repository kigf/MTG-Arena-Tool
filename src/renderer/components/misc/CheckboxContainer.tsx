import styled from "styled-components";
import indexCss from "../../index.css";

export const CheckboxContainer = styled.label.attrs((props) => ({
  className: (props.className ?? "") + " " + indexCss.checkContainer,
}))`
  cursor: pointer;
  display: inline-flex;
`;
