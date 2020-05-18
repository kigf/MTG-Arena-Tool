import * as React from "react";
import { DRAFT_RANKS, DRAFT_RANKS_LOLA } from "./constants";
import { DbCardData } from "../types/Metadata";
import { getRankColorClass } from "./utils/getRankColorClass";

interface DraftRankValueProps {
  index: number;
  rankValue: number;
  maxValue: number;
}

function DraftRankValue(props: DraftRankValueProps): JSX.Element {
  const { index, rankValue, maxValue } = props;
  const rv = 12 - index;
  const rank = DRAFT_RANKS[rv];
  const colorClass = getRankColorClass(rank);
  return (
    <div className="rank_value_container">
      <div className={"rank_value_title " + colorClass}>{rank}</div>
      <div
        className="rank_value_bar"
        style={{ width: (240 / maxValue) * rankValue + "px" }}
      />
    </div>
  );
}

export function DraftRatings(props: { card: DbCardData }): JSX.Element {
  const { card } = props;
  const { rank } = card;
  const rankValues = (card.rank_values || []) as number[];
  const rankControversy = card.rank_controversy;
  const maxValue = Math.max(...rankValues);

  return (
    <div className="rank_values_main_container">
      <div className="rank_value_container">
        Rank: {DRAFT_RANKS[Math.round(rank)]}
      </div>
      <div className="rank_value_container">Controversy: {rankControversy}</div>
      {rankValues.map((rankValue, index) => (
        <DraftRankValue
          index={index}
          key={"rank_value_container_" + index}
          maxValue={maxValue}
          rankValue={rankValue}
        />
      ))}
    </div>
  );
}

interface DraftRankOpinionProps {
  rank: string;
  index: number;
}

function DraftRankOpinion(props: DraftRankOpinionProps): JSX.Element {
  const { rank, index } = props;

  let byName = "By JustLolaMan: ";
  if (index == 1) byName = "By Moebius: ";
  if (index == 1) byName = "By Scottynada: ";

  const colorClass = getRankColorClass(rank);
  return (
    <div className="rank_value_container">
      <div>{byName}</div>
      <div className={"rank_value_title " + colorClass}>{rank}</div>
    </div>
  );
}

export function DraftRatingsLola(props: { card: DbCardData }): JSX.Element {
  const { card } = props;
  const { rank, side, ceil } = card;
  const rankValues = (card.rank_values || []) as string[];
  const rankStr = DRAFT_RANKS_LOLA[Math.round(rank)];
  const ceilStr = DRAFT_RANKS_LOLA[ceil || 13];
  return (
    <div className="rank_values_main_container">
      <div className={"rank_value_container " + getRankColorClass(rankStr)}>
        Rank: {rankStr}
      </div>
      <div className={"rank_value_container " + getRankColorClass(ceilStr)}>
        Rank in Color: {ceilStr}
      </div>
      <div className="rank_value_container">
        Is Sideboard: {side ? "Yes" : "No"}
      </div>
      {rankValues.map((rankValue, index) => (
        <DraftRankOpinion
          rank={rankValue}
          index={index}
          key={"rank_value_container_" + index}
        />
      ))}
    </div>
  );
}
