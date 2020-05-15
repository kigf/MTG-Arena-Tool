import React from "react";
import {
  MANA,
  OVERLAY_FULL,
  OVERLAY_LEFT,
  OVERLAY_LOG,
  OVERLAY_MIXED,
  OVERLAY_ODDS,
  OVERLAY_SEEN
} from "../shared/constants";
import { MatchData } from "../types/currentMatch";
import { OverlaySettingsData } from "../types/settings";
import ActionLog from "../shared/ActionLog";
import Clock from "./Clock";
import DeckList from "./DeckList";

export interface MatchElementsProps {
  actionLog: string;
  index: number;
  match: MatchData;
  setOddsCallback: (sampleSize: number) => void;
  settings: OverlaySettingsData;
  tileStyle: number;
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
    tileStyle,
    turnPriority
  } = props;
  let visibleDeck = null;
  let cardsCount = 0;
  let mainTitle = "Overlay " + (index + 1);
  let subTitle = "";

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
      className="outer_wrapper elements_wrapper"
      style={{ opacity: settings.alpha.toString() }}
    >
      {!!settings.title && <div className="overlay_deckname">{mainTitle}</div>}
      {settings.mode === OVERLAY_SEEN && (
        <div className="overlay_archetype">{match.oppArchetype}</div>
      )}
      {!!settings.title && !!visibleDeck && (
        <div className="overlay_deckcolors">
          {visibleDeck.colors.get().map((color: number) => (
            <div className={"mana_s20 mana_" + MANA[color]} key={color} />
          ))}
        </div>
      )}
      {settings.mode === OVERLAY_LOG && (
        <div className="click-on" style={{ overflowY: "auto" }}>
          <ActionLog logStr={actionLog} />
        </div>
      )}
      {!!visibleDeck && (
        <DeckList
          deck={visibleDeck}
          subTitle={subTitle}
          settings={settings}
          tileStyle={tileStyle}
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
  );
}
