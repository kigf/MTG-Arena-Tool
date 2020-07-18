import React, { CSSProperties } from "react";
import { AppState } from "../../../shared/redux/stores/rendererStore";
import { useSelector, useDispatch } from "react-redux";
import { reduxAction } from "../../../shared/redux/sharedRedux";
import { IPC_NONE } from "../../../shared/constants";
import shareIcon from "../../../assets/images/share.png";
import IconButton from "./IconButton";

interface ShareButtonProps {
  style?: CSSProperties;
  type: "draft" | "deck" | "actionlog";
  data: any;
}

export default function ShareButton({
  style,
  type,
  data,
}: ShareButtonProps): JSX.Element {
  const offline = useSelector((state: AppState) => state.renderer.offline);
  const dispatcher = useDispatch();
  const click = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    if (type == "draft") {
      const draftData = JSON.stringify(data);
      reduxAction(
        dispatcher,
        {
          type: "SET_SHARE_DIALOG",
          arg: {
            data: draftData,
            id: data.id,
            type,
          },
        },
        IPC_NONE
      );
    } else if (type == "deck") {
      const deckString = JSON.stringify(data);
      reduxAction(
        dispatcher,
        {
          type: "SET_SHARE_DIALOG",
          arg: {
            data: deckString,
            type,
          },
        },
        IPC_NONE
      );
    } else if (type == "actionlog") {
      reduxAction(
        dispatcher,
        {
          type: "SET_SHARE_DIALOG",
          arg: {
            data: data.log,
            id: data.id,
            type,
          },
        },
        IPC_NONE
      );
    }
  };

  return (
    <IconButton
      style={style}
      title={offline ? "You need to be logged in to share!" : ""}
      onClick={click}
      disabled={offline}
      icon={shareIcon}
    />
  );
}
