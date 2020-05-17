import React, { useCallback, useMemo } from "react";
import Deck from "../../../shared/deck";
import Button from "../misc/Button";
import Aggregator, { AggregatorFilters } from "../../aggregator";
import CardTile from "../../../shared/CardTile";
import db from "../../../shared/database";
import { CardWinrateData } from "../../aggregator";
import { getWinrateClass } from "../../rendererUtil";
import { DbCardData } from "../../../types/Metadata";
import { compare_cards, getDeckAfterChange } from "../../../shared/util";
import { getDeckChangesList } from "../../../shared/store";
import { DeckChange, CardObject } from "../../../types/Deck";
import ReactSelect from "../../../shared/ReactSelect";
import { format } from "date-fns";
import { useTable, useSortBy } from "react-table";

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
    mulligans: wr.mulligans
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
    mulligans
  } = line;

  return (
    <div className="card-wr-line" key={cardObj.id + "-" + name}>
      <div className="card-wr-line-card">
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
        className={
          getWinrateClass(winrate / 100) +
          "_bright card-wr-item card-wr-line-wr"
        }
      >
        {winrate >= 0 ? winrate + "%" : "-"}
      </div>
      <div
        className={
          getWinrateClass(initHandWinrate / 100) +
          "_bright card-wr-item card-wr-line-hand-wr"
        }
      >
        {initHandWinrate >= 0 ? initHandWinrate + "%" : "-"}
      </div>
      <div className="card-wr-item card-wr-line-mulls">{mulligans}</div>
      <div className="card-wr-item card-wr-line-sided-in">{sidedIn}</div>
      <div className="card-wr-item card-wr-line-sided-out">{sidedOut}</div>
      <div
        className={
          getWinrateClass(sideInWinrate / 100) +
          "_bright card-wr-item card-wr-line-sided-in-wr"
        }
      >
        {sideInWinrate >= 0 ? sideInWinrate + "%" : "-"}
      </div>
      <div
        className={
          getWinrateClass(sideOutWinrate / 100) +
          "_bright card-wr-item card-wr-line-sided-out-wr"
        }
      >
        {sideOutWinrate >= 0 ? sideOutWinrate + "%" : "-"}
      </div>
      <div className="card-wr-item card-wr-line-avg-turn">
        {avgTurn.toFixed(2)}
      </div>
      <div className="card-wr-item card-wr-line-avg-first">
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
      change => change.newDeckHash == aggFilters.deckVersion
    )[0];
    if (change) {
      deck = getDeckAfterChange(change);
    }
  }
  const deckVersions = Array.from(
    new Set([
      "All Versions",
      ...deckChanges.sort(sortDeckChanges).map(change => change.newDeckHash)
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
                    change => change.newDeckHash == deckVersions[index]
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
      Object.keys(winrates).map(grpid => {
        const cardObj = db.card(grpid);
        return cardObj
          ? cardWinrateLineData(winrates, cardObj, 1, cardObj.name)
          : {
              cardObj: null
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
        class: "card-wr-line-card"
      },
      {
        Header: "Cast WR",
        accessor: "winrate",
        class: "card-wr-line-wr"
      },
      {
        Header: "First Hand WR",
        accessor: "initHandWinrate",
        class: "card-wr-line-hand-wr"
      },
      {
        Header: "Mulliganed",
        accessor: "mulligans",
        class: "card-wr-line-mulls"
      },
      {
        Header: "Sided In",
        accessor: "sidedIn",
        class: "card-wr-line-sided-in"
      },
      {
        Header: "Sided Out",
        accessor: "sidedOut",
        class: "card-wr-line-sided-out"
      },
      {
        Header: "Sided In WR",
        accessor: "sideInWinrate",
        class: "card-wr-line-sided-in-wr"
      },
      {
        Header: "Sided Out WR",
        accessor: "sideOutWinrate",
        class: "card-wr-line-sided-out-wr"
      },
      {
        Header: "Avg. turn",
        accessor: "avgTurn",
        class: "card-wr-line-avg-turn"
      },
      {
        Header: "Avg. First Turn",
        accessor: "avgFirstTurn",
        class: "card-wr-line-avg-first"
      }
    ],
    []
  );

  const { headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data
    },
    useSortBy
  );

  return (
    <>
      <Button text="Normal View" onClick={setRegularView} />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          className={css.centered_setting_container}
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
        <div className={"settings_note"} style={{ textAlign: "center" }}>
          All winrates shown correspond to the times when the card in question
          was cast during a game, except for the &quot;Sided out WR&quot;
          column.
        </div>
        <div className="card-wr-stats">
          <div className="card-wr-line">
            {headerGroups.map(headerGroup => {
              return headerGroup.headers.map((column: any) => {
                return (
                  <div
                    key={"header-" + column.class}
                    className={"card-wr-item " + column.class}
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                  >
                    {column.Header}
                    <div
                      className={
                        column.isSorted
                          ? column.isSortedDesc
                            ? "sort_desc"
                            : "sort_asc"
                          : ""
                      }
                    />
                  </div>
                );
              });
            })}
          </div>
          {rows.map(row => {
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
          <div className="card-wr-line">
            {headerGroups.map(headerGroup => {
              return headerGroup.headers.map((column: any) => {
                return (
                  <div
                    key={"header-" + column.class}
                    className={"card-wr-item " + column.class}
                  >
                    {column.Header == "Mainboard" ? "Sideboard" : ""}
                  </div>
                );
              });
            })}
          </div>
          {rows.map(row => {
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
