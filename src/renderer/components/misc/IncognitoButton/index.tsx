import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { reduxAction } from "../../../../shared/redux/sharedRedux";
import { IPC_BACKGROUND } from "../../../../shared/constants";
import css from "./index.scss";
import { AppState } from "../../../../shared/redux/stores/rendererStore";

import Icon from "./incognito.svg";

interface IncognitoButtonProps {
  id: string;
}

export default function IncognitoButton({
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

  return (
    <div
      onClick={click}
      className={css.incognitoButton}
      title={isPrivate ? "Make deck public" : "Make deck private"}
    >
      <Icon fill={isPrivate ? "var(--color-r)" : "var(--color-text)"} />
    </div>
  );
}
