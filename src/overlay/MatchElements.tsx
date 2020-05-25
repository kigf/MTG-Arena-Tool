import { ipcRenderer as ipc } from "electron";
import React from "react";
import useMeasure from "react-use-measure";

import {
  OVERLAY_FULL,
  OVERLAY_LEFT,
  OVERLAY_LOG,
  OVERLAY_MIXED,
  OVERLAY_ODDS,
  OVERLAY_SEEN,
  IPC_ALL,
} from "../shared/constants";
import { MatchData } from "../types/currentMatch";
import { OverlaySettingsData } from "../types/settings";
import ActionLog from "../shared/ActionLog";
import Clock from "./Clock";
import DeckList from "./DeckList";

import css from "./index.css";
import ManaCost from "../renderer/components/misc/ManaCost";
import { useSelector } from "react-redux";
import { AppState } from "../shared/redux/stores/backgroundStore";

export interface MatchElementsProps {
  actionLog: string;
  index: number;
  match: MatchData;
  setOddsCallback: (sampleSize: number) => void;
  settings: OverlaySettingsData;
  turnPriority: number;
}

/**
 * This is a display component that renders most of the contents of an overlay
 * window set in one of the match-related modes.
 */
export default function MatchElements(props: MatchElementsProps): JSX.Element {
  const {
    actionLog,
    index,
    match,
    setOddsCallback,
    settings,
    turnPriority,
  } = props;
  let visibleDeck = null;
  let cardsCount = 0;
  let mainTitle = "Overlay " + (index + 1);
  let subTitle = "";
  const [ref, bounds] = useMeasure();
  const fullSettings = useSelector((state: AppState) => state.settings);

  // Auto adjust
  if (
    settings &&
    settings.show &&
    bounds &&
    bounds.height > 0 &&
    bounds.height !== settings.bounds.height
  ) {
    const newOverlays = [...fullSettings.overlays];
    newOverlays[index] = {
      ...fullSettings.overlays[index], // old overlay
      bounds: {
        ...settings.bounds,
        height: bounds.height,
      },
    };

    // Send to ipc, dispatching here creates an overflow.
    ipc.send(
      "redux-action",
      "SET_SETTINGS",
      JSON.stringify({ overlays: newOverlays }),
      IPC_ALL
    );
  }

  let cleanName = match.opponent && match.opponent.name;
  if (cleanName && cleanName !== "Sparky") {
    cleanName = cleanName.slice(0, -6);
  }
  const oppName = cleanName || "Opponent";

  const cardOdds = match.playerCardsOdds;
  const sampleSize = cardOdds.sampleSize || 1;

  switch (settings.mode) {
    case OVERLAY_LOG:
      mainTitle = "Action Log";
      // TODO add subtitle with current turn number
      break;
    case OVERLAY_FULL:
      visibleDeck = match.player.deck;
      cardsCount = visibleDeck.getMainboard().count();
      mainTitle = visibleDeck.getName();
      subTitle = "Full Deck: " + cardsCount + " cards";
      break;
    case OVERLAY_LEFT:
      visibleDeck = match.playerCardsLeft;
      cardsCount = visibleDeck.getMainboard().count();
      mainTitle = visibleDeck.getName();
      subTitle = "Library: " + cardsCount + " cards";
      break;
    case OVERLAY_ODDS:
    case OVERLAY_MIXED:
      visibleDeck = match.playerCardsLeft;
      cardsCount = visibleDeck.getMainboard().count();
      mainTitle = visibleDeck.getName();
      subTitle = `Next Draw: ${sampleSize}/${cardsCount} cards`;
      break;
    case OVERLAY_SEEN:
      visibleDeck = match.oppCards;
      cardsCount = visibleDeck.getMainboard().count();
      mainTitle = "Played by " + oppName;
      subTitle = "Total Seen: " + cardsCount + " cards";
      break;
  }
  visibleDeck?.getMainboard().removeZeros(true);
  visibleDeck?.getSideboard().removeZeros(true);
  return (
    <div
      className={`${css.outerWrapper} elements_wrapper`}
      style={{ opacity: settings.alpha.toString() }}
    >
      <div ref={ref}>
        {!!settings.title && (
          <div className={css.overlayDeckname}>{mainTitle}</div>
        )}
        {settings.mode === OVERLAY_SEEN && (
          <div className={css.overlayArchetype}>{match.oppArchetype}</div>
        )}
        {!!settings.title && !!visibleDeck && (
          <div className={css.overlayDeckcolors}>
            <ManaCost colors={visibleDeck.colors.get()} />
          </div>
        )}
        {settings.mode === OVERLAY_LOG && (
          <div className={css.clickOn} style={{ overflowY: "auto" }}>
            <ActionLog logStr={actionLog} />
          </div>
        )}
        {!!visibleDeck && (
          <DeckList
            deck={visibleDeck}
            subTitle={subTitle}
            settings={settings}
            setOddsCallback={setOddsCallback}
          />
        )}
        {!!settings.clock && (
          <Clock
            key={"overlay_clock_" + index}
            matchBeginTime={new Date(match.beginTime)}
            oppName={oppName}
            playerSeat={match.player ? match.player.seat : 1}
            priorityTimers={match.priorityTimers}
            turnPriority={turnPriority}
          />
        )}
      </div>
    </div>
  );
}
