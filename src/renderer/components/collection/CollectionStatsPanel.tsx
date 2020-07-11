import { shell } from "electron";
import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CARD_RARITIES, IPC_NONE } from "../../../shared/constants";
import ReactSelect from "../../../shared/ReactSelect";
import { AppState } from "../../../shared/redux/stores/rendererStore";
import { formatNumber } from "../../rendererUtil";
import { BoosterSymbol } from "../misc/BoosterSymbol";
import Input from "../misc/Input";
import { MediumTextButton } from "../misc/MediumTextButton";
import { RaritySymbol } from "../misc/RaritySymbol";
import {
  ALL_CARDS,
  CollectionStats,
  FULL_SETS,
  SINGLETONS,
} from "./collectionStats";
import CompletionProgressBar, {
  SetCompletionBar,
} from "./CompletionProgressBar";
import { reduxAction } from "../../../shared/redux/sharedRedux";

import indexCss from "../../index.css";
import economyCss from "../economy/economy.css";
import Flex from "../misc/Flex";
import { removeFilterFromQuery } from "./collectionQuery";
import { InBoolFilter, CardsData } from "./types";
import { Filters } from "react-table";

const getRarityKey = (
  rarity: string
): "rare" | "common" | "uncommon" | "mythic" | undefined => {
  const rarityCode = rarity.toLowerCase();
  if (["rare", "common", "uncommon", "mythic"].includes(rarityCode))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return rarityCode as any;
  return undefined;
};

const inBoostersMode = ["All Cards", "In boosters", "Not in boosters"];

export default function CollectionStatsPanel({
  stats,
  boosterMath,
  clickCompletionCallback,
  setQuery,
  defaultFilters,
}: {
  stats?: CollectionStats;
  boosterMath: boolean;
  clickCompletionCallback: () => void;
  setQuery: (query: string) => void;
  defaultFilters: Filters<CardsData>;
}): JSX.Element {
  const {
    countMode,
    rareDraftFactor,
    mythicDraftFactor,
    boosterWinFactor,
    futureBoosters,
  } = useSelector((state: AppState) => state.collection);
  const dispatch = useDispatch();
  const playerEconomy = useSelector(
    (state: AppState) => state.playerdata.economy
  );
  const query = useSelector(
    (state: AppState) => state.settings.collectionQuery
  );

  let boostersMode = inBoostersMode[0];

  defaultFilters.map((f: any) => {
    if (f.id == "boosters") {
      const filter: InBoolFilter = f.value;
      if (filter.not == false) boostersMode = inBoostersMode[1];
      if (filter.not == true) boostersMode = inBoostersMode[0];
    }
  });

  const setBoostersCallback = useCallback(
    // Update old query with new set, removing all other sets from it
    (boosters: boolean | undefined) => {
      let newQuery = removeFilterFromQuery(query, ["in"]);
      if (boosters !== undefined) {
        newQuery += " " + (boosters ? "" : "-") + "in:boosters";
      }
      setQuery(newQuery);
    },
    [setQuery, query]
  );

  if (!stats) {
    return <></>;
  }
  const setStats = stats.complete;
  const wanted: { [key: string]: number } = {};
  const missing: { [key: string]: number } = {};
  const filteredRarities = CARD_RARITIES.filter((rarity) => {
    const key = getRarityKey(rarity);
    return !!key && setStats[key].total > 0;
  });
  filteredRarities.forEach((rarity) => {
    const key = getRarityKey(rarity);
    if (key) {
      const countStats = setStats[key];
      wanted[key] = countStats.wanted;
      missing[key] = countStats.total - countStats.owned;
    }
  });
  const inputStyle = { width: "60px" };

  return (
    <>
      <div
        style={{
          display: "flex",
          maxWidth: "400px",
          width: "-webkit-fill-available",
          margin: "0px auto 16px auto",
          justifyContent: "space-between",
        }}
      >
        <div className={`${economyCss.economyWc} ${indexCss.wcCommon}`}></div>
        <div>{formatNumber(playerEconomy.wcCommon)}</div>
        <div className={`${economyCss.economyWc} ${indexCss.wcUncommon}`}></div>
        <div>{formatNumber(playerEconomy.wcUncommon)}</div>
        <div className={`${economyCss.economyWc} ${indexCss.wcRare}`}></div>
        <div>{formatNumber(playerEconomy.wcRare)}</div>
        <div className={`${economyCss.economyWc} ${indexCss.wcMythic}`}></div>
        <div>{formatNumber(playerEconomy.wcMythic)}</div>
      </div>
      <div style={{ textAlign: "center" }}>
        <Flex
          style={{
            lineHeight: "32px",
            justifyContent: "space-between",
            maxWidth: "600px",
            margin: "8px auto",
          }}
        >
          <ReactSelect
            options={inBoostersMode}
            current={boostersMode}
            callback={(mode: string): void => {
              if (mode == inBoostersMode[1]) {
                setBoostersCallback(true);
              } else if (mode == inBoostersMode[2]) {
                setBoostersCallback(false);
              } else {
                setBoostersCallback(undefined);
              }
            }}
          />
          <Flex>
            <div style={{ marginRight: "8px" }}>Count:</div>
            <ReactSelect
              options={[ALL_CARDS, SINGLETONS, FULL_SETS]}
              current={countMode}
              callback={(mode: string): void => {
                reduxAction(
                  dispatch,
                  { type: "SET_COUNT_MODE", arg: mode },
                  IPC_NONE
                );
              }}
            />
          </Flex>
        </Flex>
        <SetCompletionBar
          countMode={countMode}
          setStats={setStats}
          setIconCode={""}
          setName={"Total cards filtered"}
          isSidebar
        />
        {filteredRarities.map((rarityCode) => {
          const rarity = getRarityKey(rarityCode);
          if (rarity) {
            const countStats = setStats[rarity];
            const capitalizedRarity =
              rarity[0].toUpperCase() + rarity.slice(1) + "s";
            const globalStyle = getComputedStyle(document.body);
            return (
              <CompletionProgressBar
                countMode={countMode}
                key={rarity}
                countStats={countStats}
                image={globalStyle.getPropertyValue(`--wc_${rarity}_png`)}
                title={capitalizedRarity}
                isSidebar
              />
            );
          }
        })}
        {boosterMath ? (
          <>
            <div
              style={{ width: "100%", marginTop: "16px" }}
              title={"set completion estimator"}
            >
              Completion by draft calculator*:
            </div>
            <Flex
              style={{
                lineHeight: "32px",
                justifyContent: "space-between",
                margin: "8px auto 0 auto",
                maxWidth: "600px",
              }}
            >
              <Flex>
                <RaritySymbol rarity={"rare"} /> <div>Rares per draft:</div>
              </Flex>
              <Input
                value={rareDraftFactor}
                placeholder={"3"}
                title={"rare picks per draft"}
                contStyle={inputStyle}
                callback={(value: string): void => {
                  reduxAction(
                    dispatch,
                    { type: "SET_RARE_DRAFT_FACTOR", arg: parseFloat(value) },
                    IPC_NONE
                  );
                }}
              />
            </Flex>
            <Flex
              style={{
                lineHeight: "32px",
                justifyContent: "space-between",
                margin: "8px auto 0 auto",
                maxWidth: "600px",
              }}
            >
              <Flex>
                <RaritySymbol rarity={"mythic"} /> <div>Mythics per draft:</div>
              </Flex>
              <Input
                value={mythicDraftFactor}
                placeholder={"0.14"}
                title={"mythic picks per draft"}
                contStyle={inputStyle}
                callback={(value: string): void => {
                  reduxAction(
                    dispatch,
                    { type: "SET_MYTHIC_DRAFT_FACTOR", arg: parseFloat(value) },
                    IPC_NONE
                  );
                }}
              />
            </Flex>
            <Flex
              style={{
                lineHeight: "32px",
                justifyContent: "space-between",
                margin: "8px auto 0 auto",
                maxWidth: "600px",
              }}
            >
              <Flex>
                <BoosterSymbol /> Boosters per draft:
              </Flex>
              <Input
                value={boosterWinFactor}
                placeholder={"1.2"}
                title={"prize boosters awarded per draft"}
                contStyle={inputStyle}
                callback={(value: string): void => {
                  reduxAction(
                    dispatch,
                    { type: "SET_BOOSTER_WIN_FACTOR", arg: parseFloat(value) },
                    IPC_NONE
                  );
                }}
              />
            </Flex>
            <Flex
              style={{
                lineHeight: "32px",
                justifyContent: "space-between",
                margin: "8px auto 0 auto",
                maxWidth: "600px",
              }}
            >
              <Flex>
                <BoosterSymbol /> Future boosters:
              </Flex>
              <Input
                value={futureBoosters}
                placeholder={"0"}
                title={"expected additional boosters, e.g. seasonal rewards"}
                contStyle={inputStyle}
                callback={(value: string): void => {
                  reduxAction(
                    dispatch,
                    { type: "SET_FUTURE_BOOSTERS", arg: parseFloat(value) },
                    IPC_NONE
                  );
                }}
              />
            </Flex>
            <div
              style={{
                marginTop: "16px",
                cursor: "pointer",
                textDecoration: "underline",
                color: "var(--color-text-link)",
              }}
              onClick={(): void => {
                shell.openExternal(
                  "https://www.mtggoldfish.com/articles/collecting-mtg-arena-part-1-of-2"
                );
              }}
            >
              * original by caliban on mtggoldfish
            </div>
          </>
        ) : (
          <MediumTextButton onClick={clickCompletionCallback}>
            Completion Stats
          </MediumTextButton>
        )}
      </div>
    </>
  );
}
