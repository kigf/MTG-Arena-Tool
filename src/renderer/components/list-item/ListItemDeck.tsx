import format from "date-fns/format";
import _ from "lodash";
import React from "react";
import { Deck } from "mtgatool-shared";
import {
  formatPercent,
  formatWinrateInterval,
  getWinrateClass,
} from "../../rendererUtil";
import { DecksTableRowProps } from "../decks/types";
import ManaCost from "../misc/ManaCost";
import { NewTag, TagBubble } from "../misc/TagBubble";
import WildcardsCost from "../misc/WildcardsCost";
import {
  ArchiveButton,
  Column,
  FlexBottom,
  FlexTop,
  HoverTile,
  ListItem,
} from "./ListItem";
import css from "./ListItem.css";
import sharedCss from "../../../shared/shared.css";

export function ListItemDeck({
  row,
  tags,
  archiveCallback,
  openDeckCallback,
  addTagCallback,
  editTagCallback,
  deleteTagCallback,
}: DecksTableRowProps): JSX.Element {
  const deck = row.original;
  const deckObj = new Deck(deck);
  const parentId = deck.id ?? "";

  const [tagState, setTagState] = React.useState<Array<string>>(
    deck.tags ?? []
  );
  React.useEffect(() => setTagState(deck.tags ?? []), [deck.tags]);
  const deleteTag = React.useCallback(
    (deckid: string, tag: string): void => {
      setTagState(_.without(tagState, tag));
      deleteTagCallback(deckid, tag);
    },
    [deleteTagCallback, tagState]
  );
  const addTag = React.useCallback(
    (deckid: string, tag: string): void => {
      setTagState([...tagState, tag]);
      addTagCallback(deckid, tag);
    },
    [addTagCallback, tagState]
  );

  const onRowClick = (): void => {
    openDeckCallback(deck);
  };

  if (deck.name?.indexOf("?=?Loc/Decks/Precon/") != -1) {
    deck.name = deck.name?.replace("?=?Loc/Decks/Precon/", "");
  }
  if (deck.name?.indexOf("Decks/Precon_") != -1) {
    deck.name = deck.name?.replace("Decks/Precon_", "");
  }

  const lastTouch = new Date(deck.timeTouched);
  const deckLastTouchedStyle = {
    marginRight: "auto",
    lineHeight: "18px",
  };

  // Deck winrates
  let winrateInterval = "???";
  let winrateTooltip = "play at least 20 matches to estimate actual winrate";
  let winrateEditTooltip = "no data yet";
  if (deck.total > 0) {
    if (deck.total >= 20) {
      winrateInterval = formatPercent(deck.interval);
      winrateTooltip = formatWinrateInterval(deck.winrateLow, deck.winrateHigh);
    }
    if (deck.lastEditTotal > 0) {
      winrateEditTooltip = `${formatPercent(
        deck.lastEditWinrate
      )} winrate since ${format(new Date(deck.lastUpdated || 0), "Pp")}`;
    }
  }
  const formatProps = {
    parentId,
    tag: deck.format ?? "unknown",
    editTagCallback,
    fontStyle: "italic",
    hideCloseButton: true,
  };
  const newTagProps = {
    parentId,
    addTagCallback: addTag,
    tagPrompt: "Add",
    tags,
    title: "Add custom deck tag",
  };

  return (
    <ListItem click={onRowClick}>
      <HoverTile grpId={deck.deckTileId || 0} />
      <Column class={css.listItemLeft}>
        <FlexTop innerClass={css.listDeckName}>{deck.name || ""}</FlexTop>
        <FlexBottom>
          <ManaCost class={sharedCss.manaS20} colors={deck.colors || []} />
        </FlexBottom>
      </Column>

      <Column class={css.listItemCenter}>
        <FlexTop innerClass={css.deckTagsContainer}>
          <TagBubble {...formatProps} />
          {tagState.map((tag: string) => {
            const tagProps = {
              parentId,
              tag,
              editTagCallback,
              deleteTagCallback: deleteTag,
            };
            return <TagBubble key={tag} {...tagProps} />;
          })}
          <NewTag {...newTagProps} />
        </FlexTop>
        <FlexBottom innerClass={css.listDeckLast}>
          updated/played:{" "}
          <i style={deckLastTouchedStyle}>
            <relative-time datetime={lastTouch.toISOString()}>
              {lastTouch.toString()}
            </relative-time>
          </i>
        </FlexBottom>
      </Column>
      <Column class={css.listItemRight}>
        {deck.total > 0 ? (
          <>
            <FlexTop title={winrateTooltip} innerClass={css.listDeckWinrate}>
              {deck.wins}:{deck.losses} (
              <span className={getWinrateClass(deck.winrate, true)}>
                {formatPercent(deck.winrate)}
              </span>{" "}
              <i style={{ opacity: 0.6 }}>&plusmn; {winrateInterval}</i>)
            </FlexTop>
            <FlexBottom
              title={winrateEditTooltip}
              innerClass={css.listDeckWinrate}
            >
              Since last edit:{" "}
              {deck.lastEditTotal > 0 ? (
                <span className={getWinrateClass(deck.lastEditWinrate, true)}>
                  {formatPercent(deck.lastEditWinrate)}
                </span>
              ) : (
                <span>---</span>
              )}
            </FlexBottom>
          </>
        ) : (
          <WildcardsCost deck={deckObj} />
        )}
      </Column>
      {!!deck.custom && (
        <ArchiveButton
          archiveCallback={archiveCallback}
          dataId={deck.id || ""}
          isArchived={deck.archived || false}
        />
      )}
    </ListItem>
  );
}
