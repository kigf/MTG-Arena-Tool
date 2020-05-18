import React, { useCallback, useMemo } from "react";
import { getDeckAfterChange } from "../../../shared/utils/getDeckAfterChange";
import Deck from "../../../shared/deck";
import Button from "../misc/Button";
import Aggregator, { AggregatorFilters } from "../../aggregator";
import CardTile from "../../../shared/CardTile";
import db from "../../../shared/database";
import { CardWinrateData } from "../../aggregator";
import { getWinrateClass } from "../../rendererUtil";
import { DbCardData } from "../../../types/Metadata";
import { compare_cards } from "../../../shared/util";
import { getDeckChangesList } from "../../../shared/store";
import { DeckChange, CardObject } from "../../../types/Deck";
import ReactSelect from "../../../shared/ReactSelect";
import { format } from "date-fns";
import { useTable, useSortBy } from "react-table";

import sectionCss from "../settings/Sections.css";
import indexCss from "../../index.css";
import css from "./CardsWinrateView.css";

function getWinrateValue(wins: number, losses: number): number {
  return wins + losses == 0 ? -1 : Math.round((100 / (wins + losses)) * wins);
}

interface LineData {
  cardObj: DbCardData;
  quantity: number;
  name: string;
  winrate: number;
  initHandWinrate: number;
  sidedIn: number;
  sidedOut: number;
  sideInWinrate: number;
  sideOutWinrate: number;
  avgTurn: number;
  avgFirstTurn: number;
  mulligans: number;
}

function cardWinrateLineData(
  winrates: Record<number, CardWinrateData>,
  cardObj: DbCardData,
  quantity: number,
  name: string
): LineData {
  const wr = winrates[cardObj.id];
  const winrate = getWinrateValue(wr.wins, wr.losses);
  const sideInWinrate = getWinrateValue(wr.sideInWins, wr.sideInLosses);
  const initHandWinrate = getWinrateValue(wr.initHandWins, wr.initHandsLosses);
  const sideOutWinrate = getWinrateValue(wr.sideOutWins, wr.sideOutLosses);

  const sum = wr.turnsUsed.reduce((a, b) => a + b, 0);
  const avgTurn = sum / wr.turnsUsed.length || 0;

  const firstSum = wr.turnsFirstUsed.reduce((a, b) => a + b, 0);
  const avgFirstTurn = firstSum / wr.turnsFirstUsed.length || 0;

  return {
    cardObj,
    quantity,
    name,
    winrate,
    initHandWinrate,
    sidedIn: wr.sidedIn,
    sidedOut: wr.sidedOut,
    sideInWinrate,
    sideOutWinrate,
    avgTurn,
    avgFirstTurn,
    mulligans: wr.mulligans,
  };
}

function cardWinrateLine(line: LineData): JSX.Element {
  const {
    cardObj,
    quantity,
    name,
    winrate,
    initHandWinrate,
    sidedIn,
    sidedOut,
    sideInWinrate,
    sideOutWinrate,
    avgTurn,
    avgFirstTurn,
    mulligans,
  } = line;

  return (
    <div className={css.cardWrLine} key={cardObj.id + "-" + name}>
      <div className={css.cardWrLineCard}>
        <CardTile
          indent="c"
          isHighlighted={false}
          isSideboard={false}
          showWildcards={false}
          card={cardObj}
          key={"main-" + name + "-" + cardObj.id}
          quantity={quantity}
        />
      </div>
      <div
        className={`${getWinrateClass(winrate / 100, true)} ${css.cardWrItem} ${
          css.cardWrLineWr
        }`}
      >
        {winrate >= 0 ? winrate + "%" : "-"}
      </div>
      <div
        className={`${getWinrateClass(initHandWinrate / 100, true)} ${
          css.cardWrItem
        } ${css.cardWrLineHandWr}`}
      >
        {initHandWinrate >= 0 ? initHandWinrate + "%" : "-"}
      </div>
      <div className={`${css.cardWrItem} ${css.cardWrLineMulls}`}>
        {mulligans}
      </div>
      <div className={`${css.cardWrItem} ${css.cardWrLineSidedIn}`}>
        {sidedIn}
      </div>
      <div className={`${css.cardWrItem} ${css.cardWrLineSidedOut}`}>
        {sidedOut}
      </div>
      <div
        className={`${getWinrateClass(sideInWinrate / 100, true)} ${
          css.cardWrItem
        } ${css.cardWrLineSidedInWr}`}
      >
        {sideInWinrate >= 0 ? sideInWinrate + "%" : "-"}
      </div>
      <div
        className={`${getWinrateClass(sideOutWinrate / 100, true)} ${
          css.cardWrItem
        } ${css.cardWrLineSidedOutWr}`}
      >
        {sideOutWinrate >= 0 ? sideOutWinrate + "%" : "-"}
      </div>
      <div className={`${css.cardWrItem} ${css.cardWrLineAvgTurn}`}>
        {avgTurn.toFixed(2)}
      </div>
      <div className={`${css.cardWrItem} ${css.cardWrLineAvgFirst}`}>
        {avgFirstTurn.toFixed(2)}
      </div>
    </div>
  );
}

function sortDeckChanges(a: DeckChange, b: DeckChange): number {
  const ad = new Date(a.date).getTime();
  const bd = new Date(b.date).getTime();
  return ad - bd;
}

interface CardsWinratesViewProps {
  deck: Deck;
  aggregator: Aggregator;
  setRegularView: { (): void };
  aggFilters: AggregatorFilters;
  setAggFilters: (filters: AggregatorFilters) => void;
}

export default function CardsWinratesView(
  props: CardsWinratesViewProps
): JSX.Element {
  const { aggregator, setRegularView, aggFilters, setAggFilters } = props;
  let { deck } = props;
  const deckChanges = getDeckChangesList(deck.id);
  if (aggFilters.deckVersion !== Aggregator.DEFAULT_DECK_VERSION) {
    const change = deckChanges.filter(
      (change) => change.newDeckHash == aggFilters.deckVersion
    )[0];
    if (change) {
      deck = getDeckAfterChange(change);
    }
  }
  const deckVersions = Array.from(
    new Set([
      "All Versions",
      ...deckChanges.sort(sortDeckChanges).map((change) => change.newDeckHash),
    ])
  );

  const deckVersionFormatter = useCallback(
    (id: string) => {
      const index = deckVersions.indexOf(id);
      return id == "All Versions" ? (
        "All Versions"
      ) : (
        <>
          <div>Version {deckVersions.length - index}</div>
          <div className="list_deck_name_it">
            {" (" +
              format(
                new Date(
                  deckChanges.filter(
                    (change) => change.newDeckHash == deckVersions[index]
                  )[0].date
                ),
                "dd/MM/yy"
              ) +
              ")"}
          </div>
        </>
      );
    },
    [deckVersions, deckChanges]
  );

  const setDeckVersionFilter = useCallback(
    (version: string) => {
      // Set deck hash filter
      setAggFilters({ ...aggFilters, deckVersion: version });
    },
    [aggFilters, setAggFilters]
  );

  const winrates = useMemo(() => aggregator.getCardsWinrates(), [aggregator]);
  const data = useMemo(
    () =>
      Object.keys(winrates).map((grpid) => {
        const cardObj = db.card(grpid);
        return cardObj
          ? cardWinrateLineData(winrates, cardObj, 1, cardObj.name)
          : {
              cardObj: null,
            };
      }),
    [winrates]
  );
  deck.sortMainboard(compare_cards);
  deck.sortSideboard(compare_cards);

  const columns = useMemo(
    () => [
      {
        Header: "Mainboard",
        accessor: "name",
        class: css.cardWrLineCard,
      },
      {
        Header: "Cast WR",
        accessor: "winrate",
        class: css.cardWrLineWr,
      },
      {
        Header: "First Hand WR",
        accessor: "initHandWinrate",
        class: css.cardWrLineHandWr,
      },
      {
        Header: "Mulliganed",
        accessor: "mulligans",
        class: css.cardWrLineMulls,
      },
      {
        Header: "Sided In",
        accessor: "sidedIn",
        class: css.cardWrLineSidedIn,
      },
      {
        Header: "Sided Out",
        accessor: "sidedOut",
        class: css.cardWrLineSidedOut,
      },
      {
        Header: "Sided In WR",
        accessor: "sideInWinrate",
        class: css.cardWrLineSidedInWr,
      },
      {
        Header: "Sided Out WR",
        accessor: "sideOutWinrate",
        class: css.cardWrLineSidedOutWr,
      },
      {
        Header: "Avg. turn",
        accessor: "avgTurn",
        class: css.cardWrLineAvgTurn,
      },
      {
        Header: "Avg. First Turn",
        accessor: "avgFirstTurn",
        class: css.cardWrLineAvgFirst,
      },
    ],
    []
  );

  const { headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data,
    },
    useSortBy
  );

  return (
    <>
      <Button text="Normal View" onClick={setRegularView} />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          className={sectionCss.centered_setting_container}
          style={{ justifyContent: "center" }}
        >
          <label>Deck Version:</label>
          <ReactSelect
            options={deckVersions}
            optionFormatter={deckVersionFormatter}
            current={deckVersions[0]}
            callback={setDeckVersionFilter}
          />
        </div>
        <div
          className={sectionCss.settingsNote}
          style={{ textAlign: "center" }}
        >
          All winrates shown correspond to the times when the card in question
          was cast during a game, except for the &quot;Sided out WR&quot;
          column.
        </div>
        <div className={css.cardWrStats}>
          <div className={css.cardWrLine}>
            {headerGroups.map((headerGroup: any) => {
              return headerGroup.headers.map((column: any) => {
                return (
                  <div
                    key={"header-" + column.class}
                    className={css.cardWrItem + " " + column.class}
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                  >
                    {column.Header}
                    <div
                      className={
                        column.isSorted
                          ? column.isSortedDesc
                            ? indexCss.sortDesc
                            : indexCss.sortAsc
                          : ""
                      }
                    />
                  </div>
                );
              });
            })}
          </div>
          {rows.map((row: any) => {
            prepareRow(row);
            {
              const q = deck
                .getMainboard()
                .countFilter(
                  "quantity",
                  (card: CardObject) => row.original.cardObj?.id == card.id
                );
              if (q > 0 && row.original.cardObj !== null) {
                return cardWinrateLine({ ...row.original, quantity: q });
              }
            }
          })}
          <div className={css.cardWrLine}>
            {headerGroups.map((headerGroup: any) => {
              return headerGroup.headers.map((column: any) => {
                return (
                  <div
                    key={"header-" + column.class}
                    className={css.cardWrItem + " " + column.class}
                  >
                    {column.Header == "Mainboard" ? "Sideboard" : ""}
                  </div>
                );
              });
            })}
          </div>
          {rows.map((row: any) => {
            prepareRow(row);
            {
              const q = deck
                .getSideboard()
                .countFilter(
                  "quantity",
                  (card: CardObject) => row.original.cardObj?.id == card.id
                );
              if (q > 0 && row.original.cardObj !== null) {
                return cardWinrateLine({ ...row.original, quantity: q });
              }
            }
          })}
        </div>
      </div>
    </>
  );
}
