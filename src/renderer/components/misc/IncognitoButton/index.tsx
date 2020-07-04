import React, { useCallback, useMemo, CSSProperties } from "react";
import { useDispatch, useSelector } from "react-redux";
import { reduxAction } from "../../../../shared/redux/sharedRedux";
import { IPC_BACKGROUND } from "../../../../shared/constants";
import { AppState } from "../../../../shared/redux/stores/rendererStore";

import Icon from "./incognito.svg";
import SvgButton from "../SvgButton";

interface IncognitoButtonProps {
  style?: CSSProperties;
  id: string;
}

export default function IncognitoButton({
  style,
  id,
}: IncognitoButtonProps): JSX.Element {
  const dispatcher = useDispatch();
  const privates = useSelector((state: AppState) => state.decks.privateDecks);

  const isPrivate = useMemo(() => privates.indexOf(id) !== -1, [privates, id]);

  const click = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
      reduxAction(
        dispatcher,
        {
          type: isPrivate ? "REMOVE_PRIVATE_DECKS" : "SET_PRIVATE_DECKS",
          arg: [id],
        },
        IPC_BACKGROUND
      );
    },
    [dispatcher, id, isPrivate]
  );

  const svg = (
    <Icon
      style={{ width: "28px", height: "28px", marginTop: "5px" }}
      fill={isPrivate ? "var(--color-r)" : "var(--color-text-hover)"}
    />
  );

  return (
    <SvgButton
      style={{ ...style }}
      title={isPrivate ? "Make deck public" : "Make deck private"}
      onClick={click}
      svg={svg}
    />
  );
}
