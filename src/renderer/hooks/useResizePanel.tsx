import { SpringValue } from "react-spring";
import { ReactEventHandlers } from "react-use-gesture/dist/types";
import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { reduxAction } from "../../shared/redux/sharedRedux";
import { IPC_ALL, IPC_RENDERER } from "../../shared/constants";
import useResize from "./useResize";
import { AppState } from "../../shared/redux/stores/rendererStore";

export default function useResizePanel(): [
  SpringValue<number>,
  (...args: any[]) => ReactEventHandlers
] {
  const [panelWidth, setPanelWidth] = useState(0);
  const selectorWidth = useSelector(
    (state: AppState) => state.settings.right_panel_width
  );
  useEffect(() => {
    if (panelWidth == 0) {
      setPanelWidth(selectorWidth);
    }
  }, [panelWidth, selectorWidth]);

  const dispatcher = useDispatch();
  const finishResize = useCallback(
    (newWidth: number) => {
      reduxAction(
        dispatcher,
        {
          type: "SET_SETTINGS",
          arg: { right_panel_width: Math.max(newWidth, 10) },
        },
        IPC_ALL ^ IPC_RENDERER
      );
    },
    [dispatcher]
  );

  const finalWidth = Math.min(
    Math.max(panelWidth == 0 ? selectorWidth : panelWidth, 4),
    window.outerWidth - 10
  );
  return useResize(finalWidth, finishResize);
}
