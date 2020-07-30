import React, { PropsWithChildren } from "react";
import { useDispatch } from "react-redux";
import { getCardArtCrop } from "../../../shared/utils/getCardArtCrop";
import { reduxAction } from "../../../shared/redux/sharedRedux";
import { constants } from "mtgatool-shared";
import css from "./ListItem.css";
import indexCss from "../../index.css";
import ArchiveIcon from "../../../assets/images/svg/archive.svg";
import UnarchiveIcon from "../../../assets/images/svg/unarchive.svg";

const { IPC_NONE } = constants;

interface ListItemProps extends JSX.ElementChildrenAttribute {
  click: VoidFunction;
}

export function ListItem(props: PropsWithChildren<ListItemProps>): JSX.Element {
  const { click } = props;
  return (
    <div onClick={click} className={css.listItemContainer}>
      {props.children}
    </div>
  );
}

interface HoverTileProps {
  grpId: number;
}

export function HoverTile(
  props: PropsWithChildren<HoverTileProps>
): JSX.Element {
  const { grpId } = props;

  return (
    <div
      className={css.listItemImage}
      style={{ backgroundImage: `url(${getCardArtCrop(grpId)})` }}
    >
      {props.children}
    </div>
  );
}

interface ColumnProps extends JSX.ElementChildrenAttribute {
  style?: React.CSSProperties;
  class?: string;
}

export function Column(props: PropsWithChildren<ColumnProps>): JSX.Element {
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

export function FlexTop(props: PropsWithChildren<FlexProps>): JSX.Element {
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
  isArchived: boolean;
  dataId: string;
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
        { type: "SET_ARCHIVED", arg: { id: dataId, archived: !isArchived } },
        IPC_NONE
      );
      archiveCallback(dataId);
    },
    [archiveCallback, dataId, dispatcher, isArchived]
  );

  const Icon = isArchived ? ArchiveIcon : UnarchiveIcon;

  return (
    <div
      onClick={onClick}
      className={isArchived ? css.listItemUnarchive : css.listItemArchive}
      title={isArchived ? "restore" : "archive (will not delete data)"}
    >
      {
        <Icon
          style={{
            margin: "auto",
            fill: `var(--color-icon)`,
          }}
        />
      }
    </div>
  );
}
