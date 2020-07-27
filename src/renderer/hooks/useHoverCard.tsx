import { useDispatch } from "react-redux";
import { reduxAction } from "../../shared/redux/sharedRedux";
import { useCallback } from "react";
import { constants } from "mtgatool-shared";

const { IPC_NONE } = constants;

type HoverCardHook = (() => void)[];

export default function useHoverCard(
  card: number,
  wanted?: number
): HoverCardHook {
  const dispatcher = useDispatch();

  const hoverIn = useCallback((): void => {
    reduxAction(
      dispatcher,
      { type: "SET_HOVER_IN", arg: { grpId: card, wanted } },
      IPC_NONE
    );
  }, [card, dispatcher, wanted]);

  const hoverOut = useCallback((): void => {
    reduxAction(dispatcher, { type: "SET_HOVER_OUT", arg: {} }, IPC_NONE);
  }, [dispatcher]);

  return [hoverIn, hoverOut];
}
