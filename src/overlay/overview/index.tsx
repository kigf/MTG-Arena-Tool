import React from "react";
import { remote } from "electron";
import OverlayCss from "../index.css";
import sharedCss from "../../shared/shared.css";
import css from "./index.css";
import store from "../../shared/redux/stores/overlayStore";
import RankIcon from "../../renderer/components/misc/RankIcon";
import { matchStateObject as MatchState } from "../../shared/store/currentMatchStore";
import { toMMSS } from "../../shared/utils/dateTo";
import { ComparisonBar, ComparisonBarArray } from "../comparisonBar";
import HeatMap from "../HeatpMap";
import OverviewCard from "../overviewCard";
import { CardCast } from "../../types/currentMatch";

const primaryBounds = remote.screen.getPrimaryDisplay().bounds;

function getDMGData(
  damages: Record<string, number>
): [number | undefined, number] {
  const damageId =
    Object.keys(damages).length > 0
      ? parseInt(
          Object.keys(damages).reduce((acc, cur) =>
            damages[acc] > damages[cur] ? acc : cur
          )
        )
      : undefined;
  const oppDmgIdNumber = damageId ? damages[damageId] : 0;
  return [damageId, oppDmgIdNumber];
}

function getCastData(
  casts: Record<string, number>
): [number | undefined, number] {
  const castId =
    Object.keys(casts).length > 0
      ? parseInt(
          Object.keys(casts).reduce((acc, cur, _ind, []) =>
            casts[acc] > casts[cur] ? acc : cur
          )
        )
      : undefined;
  const castIdTimes = castId ? casts[castId] : 0;

  return [castId, castIdTimes];
}

interface OverviewProps {
  matchData: typeof MatchState;
  closeCallback: () => void;
}

export default function Overview(props: OverviewProps): JSX.Element {
  const { matchData, closeCallback } = props;
  const { primaryMonitorPos, overlay_scale } = store.getState().settings;
  const pSeat = matchData.playerSeat;

  // Should constrain if monitor is smaller or fits oddly
  const width = 540;
  const height = 620;
  const scaleMultiplier = overlay_scale / 100;
  const left =
    primaryMonitorPos.x + primaryBounds.width / 2 / scaleMultiplier - width / 2;
  const top =
    primaryMonitorPos.y +
    primaryBounds.height / 2 / scaleMultiplier -
    height / 2;

  const format =
    matchData.gameInfo.superFormat == "SuperFormat_Constructed"
      ? "constructed"
      : "limited";

  let pWins = 0;
  let oWins = 0;

  matchData.gameInfo.results
    .filter((r) => r.scope == "MatchScope_Game")
    .forEach((result) => {
      if (result.winningTeamId == pSeat) pWins++;
      else oWins++;
    });

  const duration = matchData.matchGameStats.reduce(
    (acc, cur) => acc + cur.time,
    0
  );

  let pCardsCast = 0;
  let oCardsCast = 0;
  matchData.matchGameStats.forEach((stats) => {
    stats.cardsCast.forEach((card) => {
      if (card.player == pSeat) {
        pCardsCast++;
      } else {
        oCardsCast++;
      }
    });
  });

  // Get cards that were most cast
  const casts = matchData.matchGameStats.reduce(
    (acc, cur) => [...acc, ...cur.cardsCast],
    [] as CardCast[]
  );

  const oCasts = {} as Record<string, number>;
  const pCasts = {} as Record<string, number>;
  casts.forEach((c) => {
    if (c.player !== pSeat) oCasts[c.grpId] = (oCasts[c.grpId] | 0) + 1;
    else pCasts[c.grpId] = (pCasts[c.grpId] | 0) + 1;
  });

  const [opponentCastId, oppCastIdTimes] = getCastData(oCasts);
  const [playerCastId, playerCastIdTimes] = getCastData(pCasts);

  // Get cards that dealt most damage
  const pDamages = matchData.playerStats.damage;
  const [playerDamageId, playerDmgIdNumber] = getDMGData(pDamages);

  const oDamages = matchData.oppStats.damage;
  const [opponentDamageId, oppDmgIdNumber] = getDMGData(oDamages);

  return (
    <div
      className={`${css.container} ${OverlayCss.clickOn}`}
      style={{ width: width + "px", height: height + "px", left, top }}
    >
      <div className={css.wrapper}>
        <div className={css.topNav}>
          <div
            className={`${sharedCss.button} ${sharedCss.close} ${OverlayCss.clickOn}`}
            style={{ marginRight: "0px", top: "20px" }}
            onClick={closeCallback}
          />
        </div>
        <div className={css.top}>
          <div className={css.topPlayer}>
            <div className={css.pName}>
              {matchData.player.name.slice(0, -6)}
            </div>
            <RankIcon {...matchData.player} format={format} />
          </div>
          <div className={css.tooBrief}>
            <div
              className={`${css.bigTitle} ${
                pSeat == matchData.gameWinner ? sharedCss.green : sharedCss.red
              }`}
            >{`${pWins}:${oWins}`}</div>
            <div className={css.subTitle}>Duration</div>
            <div className={css.bigTitle}>{toMMSS(duration)}</div>
          </div>
          <div className={css.topOpponent}>
            <div className={css.pName}>
              {matchData.opponent.name.slice(0, -6)}
            </div>
            <RankIcon {...matchData.opponent} format={format} />
          </div>
        </div>
        <div className={css.bottom}>
          <div className={css.roundCards}>
            {playerDamageId && (
              <OverviewCard
                title="DMG"
                grpId={playerDamageId}
                value={playerDmgIdNumber}
              />
            )}
            {playerCastId && (
              <OverviewCard
                title="Cast"
                grpId={playerCastId}
                value={playerCastIdTimes}
              />
            )}
            <div className={css.roundCardSep} />
            {opponentDamageId && (
              <OverviewCard
                title="DMG"
                grpId={opponentDamageId}
                value={oppDmgIdNumber}
              />
            )}
            {opponentCastId && (
              <OverviewCard
                title="Cast"
                grpId={opponentCastId}
                value={oppCastIdTimes}
              />
            )}
          </div>
          <div className={css.subTitle}>Life Remaining</div>
          <ComparisonBarArray
            leftVal={matchData.playerStats.lifeTotals}
            rightVal={matchData.oppStats.lifeTotals}
          />
          <div className={css.subTitle}>Cards Cast</div>
          <ComparisonBar leftVal={pCardsCast} rightVal={oCardsCast} />
          <div className={css.subTitle}>Life Gained</div>
          <ComparisonBar
            leftVal={matchData.playerStats.lifeGained}
            rightVal={matchData.oppStats.lifeGained}
          />
          <div className={css.subTitle}>Life Lost</div>
          <ComparisonBar
            leftVal={matchData.playerStats.lifeLost}
            rightVal={matchData.oppStats.lifeLost}
          />
          <div className={css.subTitle}>Mana Used</div>
          <ComparisonBar
            leftVal={matchData.playerStats.manaUsed}
            rightVal={matchData.oppStats.manaUsed}
          />
          <div className={css.subTitle} style={{ marginTop: "12px" }}>
            Timeline ({matchData.totalTurns} Turns)
          </div>
          <HeatMap map={matchData.statsHeatMap} playerSeat={pSeat} />
          <div className={css.footer}>By MTG Arena Tool</div>
        </div>
      </div>
    </div>
  );
}
