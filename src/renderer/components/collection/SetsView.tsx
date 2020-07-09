import React, { useCallback, useState } from "react";
import SetsFilter from "../misc/SetsFilter";
import { CollectionStats } from "./collectionStats";
import CompletionHeatMap from "./CompletionHeatMap";
import database from "../../../shared/database";
import Section from "../misc/Section";

import indexCss from "../../index.css";
import css from "./SetsView.css";
import CollectionStatsPanel from "./CollectionStatsPanel";
import { removeFilterFromQuery } from "./collectionQuery";
import { useSelector } from "react-redux";
import { AppState } from "../../../shared/redux/stores/rendererStore";
import { SetCompletionStats } from "./SetCompletionStats";
import Flex from "../misc/Flex";
import notFound from "../../../assets/images/notfound.png";

interface SetsViewProps {
  stats: CollectionStats;
  setQuery: (query: string) => void;
}

export default function SetsView(props: SetsViewProps): JSX.Element {
  const { stats, setQuery } = props;
  const [currentSet, setCurrentSet] = useState<string | undefined>();
  const query = useSelector(
    (state: AppState) => state.settings.collectionQuery
  );
  const {
    futureBoosters,
    rareDraftFactor,
    mythicDraftFactor,
    boosterWinFactor,
  } = useSelector((state: AppState) => state.collection);

  const currentSetName = Object.keys(database.sets).filter(
    (s) => database.sets[s].arenacode.toLowerCase() == currentSet
  )[0];
  //const currentSetData = database.sets[currentSetName];

  const setSetCallback = useCallback(
    // Update old query with new set, removing all other sets from it
    (sets: string[]) => {
      let newQuery = removeFilterFromQuery(query, ["s", "set"]);
      newQuery += sets[0] ? (sets[0] == "" ? "s:" : " s:") + sets[0] : "";
      setQuery(newQuery);
      setCurrentSet(sets[0] || undefined);
    },
    [setQuery, query]
  );

  const iconSvg =
    database.sets[currentSetName]?.svg ?? database.defaultSet?.svg;
  const setIcon = iconSvg
    ? `url(data:image/svg+xml;base64,${iconSvg})`
    : `url(${notFound})`;

  return (
    <div className={css.setsViewGrid}>
      <Section style={{ gridArea: "filters", padding: "16px" }}>
        <SetsFilter
          style={{ flexGrow: 1, margin: "auto" }}
          singleSelection={true}
          filtered={currentSet ? [currentSet] : []}
          callback={setSetCallback}
        />
      </Section>
      {stats[currentSetName] ? (
        <>
          <Section
            style={{
              flexDirection: "column",
              gridArea: "set",
              padding: "16px",
            }}
          >
            <Flex style={{ margin: "auto", lineHeight: "24px" }}>
              <div
                className={indexCss.statsSetIcon}
                style={{ backgroundImage: setIcon }}
              />
              <div>{currentSetName}</div>
            </Flex>
            <SetCompletionStats
              setStats={stats[currentSetName]}
              boosterMath={true}
              rareDraftFactor={rareDraftFactor}
              mythicDraftFactor={mythicDraftFactor}
              boosterWinFactor={boosterWinFactor}
              futureBoosters={futureBoosters}
            />
          </Section>
          <Section
            style={{
              flexDirection: "column",
              gridArea: "chart",
              padding: "16px",
            }}
          >
            <CompletionHeatMap
              key={currentSetName}
              cardData={stats[currentSetName]?.cards}
            />
          </Section>
        </>
      ) : (
        <Section
          style={{
            color: "var(--color-g)",
            fontSize: "16px",
            textAlign: "center",
            gridArea: "set",
            padding: "16px",
            display: "block !important",
          }}
        >
          Select a set to see detailed statistics
        </Section>
      )}
      <Section
        style={{ flexDirection: "column", gridArea: "stats", padding: "16px" }}
      >
        <CollectionStatsPanel
          stats={stats}
          boosterMath={true}
          clickCompletionCallback={(): void => {}}
        />
      </Section>
    </div>
  );
}
