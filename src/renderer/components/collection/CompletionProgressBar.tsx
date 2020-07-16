import React from "react";
import db from "../../../shared/database";
import {
  ALL_CARDS,
  CountStats,
  FULL_SETS,
  SetStats,
  SINGLETONS,
} from "./collectionStats";

import notFound from "../../../assets/images/notfound.png";
import indexCss from "../../index.css";
import css from "./CompletionProgressBar.css";
import Flex from "../misc/Flex";

interface CompletionProgressBarProps {
  countMode: string;
  countStats: CountStats;
  image: string;
  title: string;
}

export default function CompletionProgressBar(
  props: CompletionProgressBarProps
): JSX.Element {
  const { countMode, countStats, image, title } = props;
  if (!countStats) return <></>;

  let numerator, denominator;
  switch (countMode) {
    case SINGLETONS:
      numerator = countStats.uniqueOwned;
      denominator = countStats.unique;
      break;
    case FULL_SETS:
      numerator = countStats.complete;
      denominator = countStats.unique;
      break;
    default:
    case ALL_CARDS:
      numerator = countStats.owned;
      denominator = countStats.total;
      break;
  }

  const completionRatio = numerator / denominator;

  return (
    <div
      style={{
        width: "-webkit-fill-available",
        marginBottom: "16px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Flex
        style={{
          display: "flex",
          justifyContent: "space-between",
          minWidth: "160px",
          margin: "auto",
        }}
      >
        <div
          className={indexCss.statsSetIcon}
          style={{ backgroundImage: image }}
        ></div>
        <span>{title}</span>
      </Flex>
      <div>
        <div className={css.statsSetDetails}>
          <div>
            <span>
              {numerator} / {denominator}
            </span>
            <span style={{ color: "var(--color-text-dark)" }}>
              {completionRatio.toLocaleString([], {
                style: "percent",
                maximumSignificantDigits: 2,
              })}
            </span>
          </div>

          <span>
            {countStats.wanted}{" "}
            <abbr title="missing copies of cards in current decks">
              wanted cards
            </abbr>
          </span>
        </div>
      </div>
      <div className={css.statsSetBarContainer}>
        <div
          className={css.statsSetBar}
          style={{ width: Math.round(completionRatio * 100) + "%" }}
        />
      </div>
    </div>
  );
}

export function SetCompletionBar({
  countMode,
  setStats,
  setIconCode,
  setName,
}: {
  countMode: string;
  setStats: SetStats;
  setIconCode: string;
  setName: string;
}): JSX.Element {
  const iconSvg = db.sets[setIconCode]?.svg ?? db.defaultSet?.svg;
  const setIcon = iconSvg
    ? `url(data:image/svg+xml;base64,${iconSvg})`
    : `url(${notFound})`;
  return (
    <CompletionProgressBar
      countMode={countMode}
      countStats={setStats.all}
      image={setIcon}
      title={setName}
    />
  );
}
