import React from "react";
import {
  ListItem,
  Column,
  HoverTile,
  FlexTop,
  FlexBottom,
  ArchiveButton,
} from "./ListItem";

import ShareButton from "../misc/ShareButton";
import db from "../../../shared/database-wrapper";

import { DEFAULT_TILE } from "../../../shared/constants";
import { toggleArchived } from "../../rendererUtil";
import { InternalDraftv2 } from "../../../types/draft";
import css from "./ListItem.css";
import { CardPoolRares } from "./ListItemEvent";
import { getEventPrettyName } from "mtgatool-shared";

interface ListItemDraftProps {
  draft: InternalDraftv2;
  openDraftCallback: (id: string) => void;
}

export default function ListItemDraft({
  draft,
  openDraftCallback,
}: ListItemDraftProps): JSX.Element {
  const parentId = draft.id || "";

  const onRowClick = (): void => {
    openDraftCallback(parentId);
  };

  const draftSetName =
    Object.keys(db.sets).filter(
      (name) => db.sets[name].arenacode == draft.draftSet
    )[0] || "";
  const draftSet = db.sets[draftSetName];

  return (
    <ListItem click={onRowClick}>
      <HoverTile grpId={draftSet?.tile || DEFAULT_TILE} />

      <Column class={css.listItemLeft}>
        <FlexTop>
          <div className={css.listDeckName}>
            {draftSetName + " Draft" || ""}
          </div>
        </FlexTop>
        <FlexBottom>
          <div className={css.listDeckNameIt}>
            {getEventPrettyName(draft.eventId)}
          </div>
        </FlexBottom>
      </Column>

      <div
        style={{ flexGrow: 1, display: "flex", justifyContent: "center" }}
        className={css.listItemCenter}
      >
        {draft.pickedCards ? (
          <CardPoolRares pool={[...draft.pickedCards]} />
        ) : (
          []
        )}
      </div>

      <Column class={css.listEventPhase}>
        <FlexTop>See Replay</FlexTop>
        <FlexBottom>
          <div className={css.listMatchTime}>
            {draft.date ? (
              <relative-time datetime={new Date(draft.date || 0).toISOString()}>
                {draft.date?.toString() ?? ""}
              </relative-time>
            ) : (
              "-"
            )}
          </div>
        </FlexBottom>
      </Column>

      <Column style={{ display: "flex" }}>
        <ShareButton type="draft" style={{ margin: "auto 0" }} data={draft} />
      </Column>

      <ArchiveButton
        archiveCallback={toggleArchived}
        dataId={draft.id || ""}
        isArchived={draft.archived || false}
      />
    </ListItem>
  );
}
