import React, { useState, useCallback, useEffect } from "react";
import fs from "fs";
import path from "path";
import { InternalMatch, InternalPlayer } from "../../../types/match";
import ShareButton from "../misc/ShareButton";
import ManaCost from "../misc/ManaCost";
import Deck from "../../../shared/deck";
import { actionLogDir, ipcSend } from "../../rendererUtil";
import Button from "../misc/Button";
import DeckList from "../misc/DeckList";
import RankIcon from "../misc/RankIcon";
import db from "../../../shared/database";
import CardList from "../misc/CardList";
import CardsList from "../../../shared/cardsList";
import ActionLog from "../../../shared/ActionLog";
import { useDispatch } from "react-redux";
import { reduxAction } from "../../../shared/redux/sharedRedux";
import { IPC_NONE } from "../../../shared/constants";
import { getMatch } from "../../../shared/store";
import { MatchGameStats } from "../../../types/currentMatch";

import css from "./MatchView.css";
import indexCss from "../../index.css";
import sharedCss from "../../../shared/shared.css";
import actionLogCss from "../../../shared/ActionLog/ActionLog.css";
import cardTileCss from "../../../shared/CardTile/CardTile.css";

interface MatchViewProps {
  match: InternalMatch;
}

const VIEW_MATCH = 1;
const VIEW_LOG = 2;

export function MatchView(props: MatchViewProps): JSX.Element {
  const { match } = props;
  const dispatcher = useDispatch();
  const [view, setView] = useState(VIEW_MATCH);
  const playerDeck = new Deck(match.playerDeck);
  const oppDeck = new Deck(match.oppDeck);

  const logExists = fs.existsSync(path.join(actionLogDir, match.id + ".txt"));
  let actionLogDataB64 = "";
  let actionLogDataString = "";
  if (logExists) {
    const actionLogFile = path.join(actionLogDir, match.id + ".txt");
    actionLogDataB64 = fs.readFileSync(actionLogFile).toString("base64");
    actionLogDataString = fs.readFileSync(actionLogFile).toString();
  }

  const goBack = (): void => {
    reduxAction(dispatcher, { type: "SET_BACK_GRPID", arg: 0 }, IPC_NONE);
    reduxAction(dispatcher, { type: "SET_NAV_INDEX", arg: 0 }, IPC_NONE);
  };

  const openActionLog = (): void => {
    setView(VIEW_LOG);
  };

  const openMatch = (): void => {
    setView(VIEW_MATCH);
  };

  useEffect(() => {
    match.id;
    setView(VIEW_MATCH);
  }, [match.id]);
  /*
  const mulliganType =
    match.eventId === "Lore_WAR3_Singleton" ||
    match.date > new Date("2019-07-02T15:00:00.000Z").getTime()
      ? "london"
      : "vancouver";
  */
  return (
    <>
      <div className={indexCss.centeredUx}>
        <div className={indexCss.decklistTop}>
          <div
            className={`${sharedCss.button} ${sharedCss.back}`}
            onClick={goBack}
          ></div>
          <div className={indexCss.deckName}>{playerDeck.getName()}</div>
          <div className={indexCss.deckTopColors}>
            <ManaCost colors={playerDeck.getColors().get()} />
          </div>
        </div>
        {view == VIEW_MATCH ? (
          <>
            <div className={indexCss.flexItem}>
              {logExists ? (
                <>
                  <Button
                    style={{ marginLeft: "auto" }}
                    onClick={openActionLog}
                    className={indexCss.buttonSimple + " openLog"}
                    text="Action log"
                  ></Button>
                  <ShareButton
                    type="actionlog"
                    data={{ log: actionLogDataB64, id: match.id }}
                  />
                </>
              ) : (
                <></>
              )}
            </div>
            <div className={indexCss.flexItem}>
              <Seat
                player={match.player}
                deck={playerDeck}
                eventId={match.eventId}
                won={match.player.win > match.opponent.win}
              />
              <Seat
                player={match.opponent}
                deck={oppDeck}
                eventId={match.eventId}
                match={match}
                won={match.opponent.win > match.player.win}
              />
            </div>
            <div>
              {match.gameStats.map((stats: MatchGameStats, index: number) => {
                if (stats)
                  return (
                    <GameStats
                      key={"stats-" + index}
                      index={index}
                      game={stats}
                    />
                  );
              })}
            </div>
          </>
        ) : (
          <>
            <Button
              style={{ margin: "auto" }}
              onClick={openMatch}
              className={indexCss.buttonSimple + " " + indexCss.centered}
              text="Go back"
            ></Button>
            <div className={actionLogCss.actionlogDiv}>
              <ActionLog logStr={actionLogDataString} />
            </div>
          </>
        )}
      </div>
    </>
  );
}

interface SeatProps {
  deck: Deck;
  eventId: string;
  player: InternalPlayer;
  won: boolean;
  match?: InternalMatch;
}

function Seat(props: SeatProps): JSX.Element {
  const { player, eventId, won, match } = props;

  // v4.1.0: Introduced by-game cards seen
  const gameDetails = match && match.toolVersion >= 262400;
  const [gameSeen, setGameSeen] = useState(0);

  let combinedList: number[] = [];
  if (gameDetails) {
    match?.gameStats.forEach((stats: MatchGameStats) => {
      if (stats) {
        combinedList = [...combinedList, ...stats.cardsSeen];
      }
    });
  }

  const deck =
    gameDetails && match
      ? new Deck(
          {},
          gameSeen == match?.gameStats?.length
            ? combinedList
            : match.gameStats[gameSeen]?.cardsSeen || combinedList
        )
      : props.deck;

  const gamePrev = useCallback(() => {
    if (gameSeen > 0) setGameSeen(gameSeen - 1);
  }, [gameSeen]);
  const gameNext = useCallback(() => {
    if (match && gameSeen < match.gameStats.length) setGameSeen(gameSeen + 1);
  }, [gameSeen, match]);

  const isLimited = db.limited_ranked_events.includes(eventId);
  const clickAdd = (): void => {
    ipcSend("import_custom_deck", JSON.stringify(deck.getSave()));
  };

  const clickArena = (): void => {
    ipcSend("set_clipboard", deck.getExportArena());
  };

  const clickTxt = (): void => {
    const str = deck.getExportTxt();
    ipcSend("export_txt", { str, name: deck.getName() });
  };

  return (
    <>
      <div className={indexCss.decklist}>
        <div className={indexCss.flexItem} style={{ justifyContent: "center" }}>
          <RankIcon
            rank={player.rank}
            tier={player.tier}
            percentile={player.percentile || 0}
            leaderboardPlace={player.leaderboardPlace || 0}
            format={isLimited ? "limited" : "constructed"}
          />
          <div className={css.matchPlayerName}>
            {player.name.slice(0, -6)} ({player.win})
          </div>
          {won ? <div className={css.matchPlayerWin}> Winner</div> : <></>}
        </div>
        <Button text="Add to Decks" onClick={clickAdd} />
        <Button text="Export to Arena" onClick={clickArena} />
        <Button text="Export to .txt" onClick={clickTxt} />
        {gameDetails && match ? (
          <>
            <div className={css.gameSwap}>
              <div className={css.gamePrev} onClick={gamePrev} />
              <div>
                {gameSeen == match.gameStats.length
                  ? `Combined`
                  : `Seen in game ${gameSeen + 1}`}
              </div>
              <div className={css.gameNext} onClick={gameNext} />
            </div>
            <DeckList deck={deck} showWildcards={true} />
          </>
        ) : (
          <DeckList deck={deck} showWildcards={true} />
        )}
      </div>
    </>
  );
}

interface GameStatsProps {
  game: MatchGameStats;
  index: number;
}

function GameStats(props: GameStatsProps): JSX.Element {
  const { game, index } = props;

  const addedCards = new CardsList(
    game.sideboardChanges ? game.sideboardChanges.added : []
  );
  const removedCards = new CardsList(
    game.sideboardChanges ? game.sideboardChanges.removed : []
  );

  return (
    <div
      style={{
        marginTop: "24px",
        marginBottom: "24px",
        justifyContent: "center",
      }}
    >
      {game.sideboardChanges ? (
        <>
          <div className={cardTileCss.cardTileSeparator}>
            Game {index + 1} Sideboard Changes
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            {game.sideboardChanges.added.length == 0 &&
            game.sideboardChanges.removed.length == 0 ? (
              <div className={`${css.gamestats_subtitle} ${sharedCss.red}`}>
                No Changes
              </div>
            ) : (
              <>
                <div className={css.gamestatsSide}>
                  <div
                    className={`${css.gamestatsSubtitle} ${sharedCss.green}`}
                  >
                    Sideboarded In
                  </div>
                  <div className={indexCss.cardListsList}>
                    <CardList list={addedCards} />
                  </div>
                </div>
                <div className={css.gamestatsSide}>
                  <div className={`${css.gamestatsSubtitle} ${sharedCss.red}`}>
                    Sideboarded Out
                  </div>
                  <div className={indexCss.cardListsList}>
                    <CardList list={removedCards} />
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        <></>
      )}
      <div className={cardTileCss.cardTileSeparator}>
        Game {index + 1} Hands Drawn
      </div>
      {game.handsDrawn.map((hand: any, i: number) => {
        return (
          <React.Fragment key={"gsh-" + index + "-" + i}>
            <div className={css.gamestatsSubtitle}>#{i + 1}</div>
            <div className={indexCss.cardListsList}>
              <CardList list={new CardsList(hand)} />
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default function openMatchSub(matchId: string): JSX.Element {
  const match = getMatch(matchId);
  if (!match) return <div>{matchId}</div>;
  return <MatchView match={match} />;
}
