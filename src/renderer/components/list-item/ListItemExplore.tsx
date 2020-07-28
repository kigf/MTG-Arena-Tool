import React from "react";
import ManaCost from "../misc/ManaCost";
import { getWinrateClass } from "../../rendererUtil";
import { ListItem, Column, HoverTile, FlexTop, FlexBottom } from "./ListItem";
import WildcardsCostPreset from "../misc/WildcardsCostPreset";
import RankSmall from "../misc/RankSmall";
import css from "./ListItem.css";
import sharedCss from "../../../shared/shared.css";
import IconCrown from "../../../assets/images/svg/crown.svg";
import { constants, formatPercent } from "mtgatool-shared";
const { RANKS } = constants;

interface ExploreDeck {
  _id: string;
  eventId: string;
  name: string;
  mainDeck: any[];
  sideboard: any[];
  commander: any[];
  tile: number;
  rank: string[];
  player: string[];
  colors: number[];
  date: string;
  gw: number;
  gl: number;
  mw: number;
  ml: number;
  mt: number;
  gt: number;
  mwrate: number;
  w: number;
  l: number;
  patreon: boolean;
  wildcards: {
    u?: number;
    r?: number;
    m?: number;
    c?: number;
  };
}

interface ListItemExploreProps {
  row: ExploreDeck;
  openCallback: (row: any) => void;
}

export function ListItemExplore(props: ListItemExploreProps): JSX.Element {
  const { row, openCallback } = props;
  const onRowClick = (): void => {
    openCallback(row);
  };

  return (
    <ListItem click={onRowClick}>
      <HoverTile grpId={row.tile || 0} />
      <Column class={css.listItemLeft}>
        <FlexTop>
          {row.patreon ? (
            <IconCrown
              style={{ margin: "auto 8px auto 0" }}
              fill={"var(--color-g)"}
            />
          ) : (
            <></>
          )}{" "}
          <div className={css.listDeckName}>{row.name || ""}</div>
          <div
            className={css.listDeckNameIt}
            style={{
              textDecoration: row.player.length > 1 ? "underline dotted" : "",
            }}
            title={row.player.length > 1 ? row.player.join(", ") : ""}
          >
            {row.player.length > 1
              ? row.player.length + " players"
              : "by " + row.player[0]}
          </div>
        </FlexTop>
        <FlexBottom>
          <ManaCost class={sharedCss.manaS20} colors={row.colors || []} />
        </FlexBottom>
      </Column>

      <Column
        style={{ maxWidth: "50%", alignSelf: "flex-end", marginLeft: "auto" }}
        class={css.listItemCenter}
      >
        <WildcardsCostPreset wildcards={row.wildcards} showComplete={true} />
      </Column>
      <Column class={css.listItemRight}>
        <FlexTop innerClass={css.listDeckWinrate}>
          {row.mw}:{row.ml} (
          <span className={getWinrateClass(row.mwrate, true)}>
            {formatPercent(row.mwrate)}
          </span>
          )
        </FlexTop>
        <FlexBottom style={{ justifyContent: "flex-end", marginRight: "18px" }}>
          {RANKS.map((r) => {
            if (row.rank.includes(r)) {
              return <RankSmall key={row._id + "-r-" + r} rankTier={r} />;
            }
          })}
        </FlexBottom>
      </Column>
    </ListItem>
  );
}
