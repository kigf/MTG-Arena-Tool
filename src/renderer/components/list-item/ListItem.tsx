import React from "react";
import { useDispatch } from "react-redux";
import { getCardArtCrop } from "../../../shared/utils/getCardArtCrop";
import { reduxAction } from "../../../shared/redux/sharedRedux";
import { IPC_NONE } from "../../../shared/constants";
import { useSpring, animated } from "react-spring";

import css from "./ListItem.css";
import indexCss from "../../index.css";

interface ListItemProps extends JSX.ElementChildrenAttribute {
  click: VoidFunction;
  mouseEnter: VoidFunction;
  mouseLeave: VoidFunction;
}

export function ListItem(props: ListItemProps): JSX.Element {
  const { click, mouseEnter, mouseLeave } = props;
  return (
    <div
      onClick={click}
      onMouseEnter={mouseEnter}
      onMouseLeave={mouseLeave}
      className={css.listItemContainer}
    >
      {props.children}
    </div>
  );
}

interface HoverTileProps {
  hover: boolean;
  grpId: number;
}

export function HoverTile(props: HoverTileProps): JSX.Element {
  const { hover, grpId } = props;

  const spring = useSpring({
    opacity: hover ? "1" : "0.66",
    width: hover ? "195px" : "128px",
    config: { mass: 1, tension: 235, friction: 25 },
  });

  return (
    <animated.div
      className={css.listItemImage}
      style={{ ...spring, backgroundImage: `url(${getCardArtCrop(grpId)})` }}
    />
  );
}

interface ColumnProps extends JSX.ElementChildrenAttribute {
  style?: React.CSSProperties;
  class?: string;
}

export function Column(props: ColumnProps): JSX.Element {
  const style = props.style || {};
  return (
    <div
      style={{ ...style, flexDirection: "column" }}
      className={props.class || ""}
    >
      {props.children}
    </div>
  );
}

interface FlexProps extends JSX.ElementChildrenAttribute {
  title?: string;
  style?: React.CSSProperties;
  innerClass?: string;
}

export function FlexTop(props: FlexProps): JSX.Element {
  const style = props.style || {};
  return (
    <div style={style} className={indexCss.flexTop}>
      {props.innerClass ? (
        <div title={props.title} className={props.innerClass}>
          {props.children}
        </div>
      ) : (
        props.children
      )}
    </div>
  );
}

export const FlexBottom = FlexTop;

interface ArchiveButtonProps {
  archiveCallback: (id: string) => void;
  hover: boolean;
  isArchived: boolean;
  dataId: string;
}

function archiveButtonStyle(hover: boolean): React.CSSProperties {
  return hover
    ? {
        width: "32px",
        minWidth: "32px",
      }
    : {
        width: "4px",
        minWidth: "4px",
      };
}

export function ArchiveButton(props: ArchiveButtonProps): JSX.Element {
  const { isArchived, archiveCallback, dataId } = props;
  const dispatcher = useDispatch();
  const onClick = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
      event.stopPropagation();
      event.nativeEvent.stopImmediatePropagation();
      reduxAction(
        dispatcher,
        "SET_ARCHIVED",
        { id: dataId, archived: !isArchived },
        IPC_NONE
      );
      archiveCallback(dataId);
    },
    [archiveCallback, dataId, dispatcher, isArchived]
  );
  return (
    <div
      onClick={onClick}
      className={isArchived ? css.listItemUnarchive : css.listItemArchive}
      title={isArchived ? "restore" : "archive (will not delete data)"}
      style={archiveButtonStyle(props.hover)}
    ></div>
  );
}
