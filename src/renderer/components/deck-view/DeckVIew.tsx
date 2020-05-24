import React, { useState, useMemo, useEffect } from "react";
import { InternalDeck, CardObject } from "../../../types/Deck";
import ManaCost from "../misc/ManaCost";
import { MANA_COLORS, IPC_NONE } from "../../../shared/constants";
import DeckList from "../misc/DeckList";
import DeckTypesStats from "../../../shared/DeckTypesStats";
import DeckManaCurve from "../../../shared/DeckManaCurve";
import Deck from "../../../shared/deck";
import Button from "../misc/Button";
import { ipcSend } from "../../rendererUtil";
import { useDispatch, useSelector } from "react-redux";
import db from "../../../shared/database";
import ShareButton from "../misc/ShareButton";
import CraftingCost from "./CraftingCost";
import { reduxAction } from "../../../shared/redux/sharedRedux";
import { getDeck, decksList } from "../../../shared/store";
import VisualDeckView from "./VisualDeckView";
import ChangesDeckView from "./ChangesDeckView";
import { AppState } from "../../../shared/redux/stores/rendererStore";
import MatchResultsStatsPanel from "../misc/MatchResultsStatsPanel";
import Aggregator from "../../aggregator";
import { useAggregatorData } from "../tables/useAggregatorData";
import { animated } from "react-spring";
import useResizePanel from "../../hooks/useResizePanel";
import CardsWinratesView from "./CardsWinrateView";

import sharedCss from "../../../shared/shared.css";
import tablesCss from "../tables/tables.css";
import indexCss from "../../index.css";
import ReactSvgPieChart from "react-svg-piechart";
import { timestamp } from "../../../shared/util";

const VIEW_VISUAL = 0;
const VIEW_REGULAR = 1;
const VIEW_CHANGES = 2;
const VIEW_WINRATES = 3;

interface DeckViewProps {
  deck: InternalDeck;
}

interface ColorsAmmount {
  total: number;
  w: number;
  u: number;
  b: number;
  r: number;
  g: number;
  c: number;
}

function getDeckColorsAmmount(deck: Deck): ColorsAmmount {
  const colors = { total: 0, w: 0, u: 0, b: 0, r: 0, g: 0, c: 0 };

  deck
    .getMainboard()
    .get()
    .forEach(function (card: CardObject) {
      if (card.quantity > 0) {
        db.card(card.id)?.cost.forEach((c: string) => {
          if (c.indexOf("w") !== -1) {
            colors.w += card.quantity;
            colors.total += card.quantity;
          }
          if (c.indexOf("u") !== -1) {
            colors.u += card.quantity;
            colors.total += card.quantity;
          }
          if (c.indexOf("b") !== -1) {
            colors.b += card.quantity;
            colors.total += card.quantity;
          }
          if (c.indexOf("r") !== -1) {
            colors.r += card.quantity;
            colors.total += card.quantity;
          }
          if (c.indexOf("g") !== -1) {
            colors.g += card.quantity;
            colors.total += card.quantity;
          }
          if (c.indexOf("c") !== -1) {
            colors.c += card.quantity;
            colors.total += card.quantity;
          }
        });
      }
    });

  return colors;
}

function getDeckLandsAmmount(deck: Deck): ColorsAmmount {
  const colors = { total: 0, w: 0, u: 0, b: 0, r: 0, g: 0, c: 0 };

  deck
    .getMainboard()
    .get()
    .forEach(function (c: CardObject) {
      const quantity = c.quantity;
      const card = db.card(c.id);
      if (quantity > 0 && card) {
        if (
          card.type.indexOf("Land") != -1 ||
          card.type.indexOf("land") != -1
        ) {
          if (card.frame.length < 5) {
            card.frame.forEach(function (c) {
              if (c == 1) {
                colors.w += quantity;
                colors.total += quantity;
              }
              if (c == 2) {
                colors.u += quantity;
                colors.total += quantity;
              }
              if (c == 3) {
                colors.b += quantity;
                colors.total += quantity;
              }
              if (c == 4) {
                colors.r += quantity;
                colors.total += quantity;
              }
              if (c == 5) {
                colors.g += quantity;
                colors.total += quantity;
              }
              if (c == 6) {
                colors.c += quantity;
                colors.total += quantity;
              }
            });
          }
        }
      }
    });

  return colors;
}

export function DeckView(props: DeckViewProps): JSX.Element {
  const deck = new Deck(props.deck);
  const [deckView, setDeckView] = useState(VIEW_REGULAR);
  const dispatcher = useDispatch();

  const goBack = (): void => {
    reduxAction(dispatcher, { type: "SET_BACK_GRPID", arg: 0 }, IPC_NONE);
    reduxAction(dispatcher, { type: "SET_NAV_INDEX", arg: 0 }, IPC_NONE);
  };

  const deckWinratesView = (): void => {
    setDeckView(VIEW_WINRATES);
  };

  const deckChangesView = (): void => {
    setDeckView(VIEW_CHANGES);
  };

  const visualView = (): void => {
    setDeckView(VIEW_VISUAL);
  };

  const regularView = (): void => {
    setDeckView(VIEW_REGULAR);
  };

  useEffect(() => {
    deck.id;
    setDeckView(VIEW_REGULAR);
  }, [deck.id]);

  const arenaExport = (): void => {
    const list = deck.getExportArena();
    ipcSend("set_clipboard", list);
    const newTime = timestamp() + 2000;
    reduxAction(
      dispatcher,
      {
        type: "SET_POPUP",
        arg: {
          text: "Copied to clipboard",
          time: newTime,
          duration: 2000,
        },
      },
      IPC_NONE
    );
  };

  const txtExport = (): void => {
    const list = deck.getExportArena();
    ipcSend("export_txt", { str: list, name: deck.getName() });
  };

  const colorCounts = getDeckColorsAmmount(deck);
  const colorsPie = [
    { title: "White", value: colorCounts.w, color: MANA_COLORS[0] },
    { title: "Blue", value: colorCounts.u, color: MANA_COLORS[1] },
    { title: "Black", value: colorCounts.b, color: MANA_COLORS[2] },
    { title: "Red", value: colorCounts.r, color: MANA_COLORS[3] },
    { title: "Green", value: colorCounts.g, color: MANA_COLORS[4] },
  ];
  const landCounts = getDeckLandsAmmount(deck);
  const landsPie = [
    { title: "White", value: landCounts.w, color: MANA_COLORS[0] },
    { title: "Blue", value: landCounts.u, color: MANA_COLORS[1] },
    { title: "Black", value: landCounts.b, color: MANA_COLORS[2] },
    { title: "Red", value: landCounts.r, color: MANA_COLORS[3] },
    { title: "Green", value: landCounts.g, color: MANA_COLORS[4] },
  ];

  const [width, bind] = useResizePanel();

  const dateFilter = useSelector(
    (state: AppState) => state.settings.last_date_filter
  );
  const DecksTableState = useSelector(
    (state: AppState) => state.settings.decksTableState
  );

  const initFilters = useMemo(() => {
    dateFilter && DecksTableState;
    return { deckId: deck.id };
  }, [deck.id, dateFilter, DecksTableState]);

  const { aggFilters, setAggFilters } = useAggregatorData({
    aggFiltersArg: initFilters,
    getData: decksList,
    showArchived: false,
  });

  const aggregator = useMemo(() => {
    return new Aggregator({ ...aggFilters });
  }, [aggFilters]);

  return (
    <>
      <div className={indexCss.wrapperColumn}>
        <div className={indexCss.centeredUx}>
          <div className={indexCss.decklistTop}>
            <div
              className={sharedCss.button + " " + sharedCss.back}
              onClick={goBack}
            ></div>
            <div className={indexCss.deckName}>{deck.getName()}</div>
            <ShareButton type="deck" data={deck.getSave()} />
            <div className={indexCss.deckTopColors}>
              <ManaCost colors={deck.getColors().get()} />
            </div>
          </div>
          <div
            className={indexCss.flexItem}
            style={deckView !== VIEW_REGULAR ? { flexDirection: "column" } : {}}
          >
            {deckView == VIEW_VISUAL && (
              <VisualDeckView deck={deck} setRegularView={regularView} />
            )}
            {deckView == VIEW_CHANGES && (
              <ChangesDeckView deck={deck} setRegularView={regularView} />
            )}
            {deckView == VIEW_WINRATES && (
              <CardsWinratesView
                deck={deck}
                setRegularView={regularView}
                aggFilters={aggFilters}
                setAggFilters={setAggFilters}
                aggregator={aggregator}
              />
            )}
            {deckView == VIEW_REGULAR && (
              <>
                <div className={indexCss.decklist}>
                  <DeckList deck={deck} showWildcards={true} />
                </div>
                <div className={indexCss.stats}>
                  <Button
                    className={
                      indexCss.buttonSimple + " " + indexCss.exportDeck
                    }
                    text="Deck Changes"
                    onClick={deckChangesView}
                  />
                  <Button
                    className={
                      indexCss.buttonSimple + " " + indexCss.exportDeck
                    }
                    text="Card Winrates"
                    onClick={deckWinratesView}
                  />
                  <Button
                    className={
                      indexCss.buttonSimple + " " + indexCss.exportDeck
                    }
                    text="Visual View"
                    onClick={visualView}
                  />
                  <Button
                    className={
                      indexCss.buttonSimple + " " + indexCss.exportDeck
                    }
                    text="Export to Arena"
                    onClick={arenaExport}
                  />
                  <Button
                    className={
                      indexCss.buttonSimple + " " + indexCss.exportDeck
                    }
                    text="Export to .txt"
                    onClick={txtExport}
                  />
                  <DeckTypesStats deck={deck} />
                  <DeckManaCurve deck={deck} />
                  <div className={sharedCss.pieContainerOuter}>
                    <div className={sharedCss.pieContainer}>
                      <span>Mana Symbols</span>
                      <ReactSvgPieChart strokeWidth={0} data={colorsPie} />
                    </div>
                    <div className={sharedCss.pieContainer}>
                      <span>Mana Sources</span>
                      <ReactSvgPieChart strokeWidth={0} data={landsPie} />
                    </div>
                  </div>
                  <CraftingCost deck={deck} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <animated.div
        {...bind()}
        className={tablesCss.sidebarDragger}
      ></animated.div>
      <animated.div
        className={tablesCss.sidebarMain}
        style={{ width, minWidth: width, maxWidth: width }}
      >
        <MatchResultsStatsPanel
          prefixId={"deck_view"}
          aggregator={aggregator}
          showCharts
        />
      </animated.div>
    </>
  );
}

export default function openDeckSub(
  deckId: string,
  deck: InternalDeck | null = null
): JSX.Element {
  const decklist = deck ?? getDeck(deckId);
  if (!decklist) return <div>{deckId}</div>;
  return <DeckView deck={decklist} />;
}
