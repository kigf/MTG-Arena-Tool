import styled from "styled-components";

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  div {
    margin: auto 4px;
  }
`;

export const FlexLeftContainer = styled(FlexContainer)`
  justify-content: flex-start;
  margin-right: auto;
  div {
    :first-child:not(.deck_tag_close) {
      margin-left: 0;
    }
    :last-child:not(.deck_tag_close) {
      margin-right: auto;
    }
  }
`;
