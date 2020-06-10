import React from "react";
import { DATE_SEASON, RANKS } from "../../../shared/constants";
import Aggregator, { AggregatorFilters } from "../../aggregator";
import { formatPercent } from "../../rendererUtil";
import store from "../../../shared/redux/stores/rendererStore";

import indexCss from "../../index.css";
const { RANKED_CONST, RANKED_DRAFT } = Aggregator;

function getNextRank(currentRank: string): undefined | string {
  const rankIndex = (RANKS as any).indexOf(currentRank);
  if (rankIndex < RANKS.length - 1) {
    return RANKS[rankIndex + 1];
  }
  return undefined;
}

function getStepsUntilNextRank(mode: boolean, winrate: number): string {
  const playerRank = store.getState().playerdata.rank;
  const { rank, step, tier } = mode
    ? playerRank.limited
    : playerRank.constructed;

  // TODO extract rank tier/level props into constants
  let stepsNeeded = 1;
  let stepsWin = 1;
  let stepsLoss = 0;
  if (rank == "Bronze") {
    stepsNeeded = 6;
    stepsWin = 2;
    stepsLoss = 0;
  }
  if (rank == "Silver") {
    stepsNeeded = 6;
    stepsWin = 2;
    stepsLoss = 1;
  }
  if (rank == "Gold") {
    stepsNeeded = 6;
    stepsWin = 2;
    stepsLoss = 1;
  }
  if (rank == "Platinum") {
    stepsNeeded = 6;
    stepsWin = 1;
    stepsLoss = 1;
  }
  if (rank == "Diamond") {
    stepsNeeded = 6;
    stepsWin = 1;
    stepsLoss = 1;
  }

  const expectedValue = winrate * stepsWin - (1 - winrate) * stepsLoss;
  if (expectedValue <= 0) return "∞";
  const totalStepsNeeded = stepsNeeded * tier - step;
  return "~" + Math.ceil(totalStepsNeeded / expectedValue);
}

export default function RankedStats({
  aggregator,
  isLimited,
  setAggFiltersCallback,
}: {
  aggregator: Aggregator;
  isLimited: boolean;
  setAggFiltersCallback: (filters: AggregatorFilters) => void;
}): JSX.Element {
  if (!aggregator.stats?.total) return <></>;
  const { winrate } = aggregator.stats;
  const playerData = store.getState().playerdata;
  const seasonName = !isLimited ? "constructed" : "limited";
  const switchSeasonName = isLimited ? "constructed" : "limited";
  const switchSeasonFilters: AggregatorFilters = {
    ...Aggregator.getDefaultFilters(),
    date: DATE_SEASON,
    eventId: isLimited ? RANKED_CONST : RANKED_DRAFT,
  };
  const currentRank = isLimited
    ? playerData.rank.limited.rank
    : playerData.rank.constructed.rank;
  const expected = getStepsUntilNextRank(isLimited, winrate);
  return (
    <>
      <div
        className={
          indexCss.buttonSimple + " " + indexCss.button_thin + " season_toggle"
        }
        style={{ margin: "8px auto" }}
        onClick={(): void => setAggFiltersCallback(switchSeasonFilters)}
      >
        Show {switchSeasonName}
      </div>
      <div className={"ranks_history_title"}>Current {seasonName} season:</div>
      <div
        className={"ranks_history_title"}
        title={`Using ${formatPercent(winrate)} winrate`}
      >
        Games until {getNextRank(currentRank)}: {expected}
      </div>
    </>
  );
}
