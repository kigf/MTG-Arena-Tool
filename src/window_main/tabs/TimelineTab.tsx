import React, { useEffect, SetStateAction, useRef, useCallback } from "react";
import format from "date-fns/format";
import { get_rank_index as getRankIndex } from "../../shared/util";
function sortByTimestamp(a: any, b: any): number {
  return a.timestamp - b.timestamp;
}
import playerData from "../../shared/PlayerData";
import { SeasonalRankData } from "../../types/Season";

/**
 * Get the ranks conversion to a Y coordinate
 * @param rank Rank name
 * @param tier Level
 * @param steps
 */
function getRankY(rank: string, tier: number, steps: number): number {
  let value = 0;
  switch (rank) {
    case "Bronze":
      value = 0;
      break;
    case "Silver":
      value = 4 * 6;
      break;
    case "Gold":
      value = 4 * 6 * 2;
      break;
    case "Platinum":
      value = 4 * 6 * 3;
      break;
    case "Diamond":
      value = 4 * 6 * 4;
      break;
    case "Mythic":
      value = 4 * 6 * 5;
      break;
  }

  return value + 6 * (4 - tier) + steps;
}

/**
 * Get the data for this season and add fields to the data for timeline processing
 * @param type season type ("constructed" or "limited")
 * @param seasonOrdinal Season number/id (optional)
 */
function getSeasonData(
  type: "constructed" | "limited" = "constructed",
  seasonOrdinal?: number
): SeasonalRankData[] {
  if (!seasonOrdinal) seasonOrdinal = playerData.rank[type].seasonOrdinal;

  let seasonalData: string[] = playerData.getSeasonalRankData(
    seasonOrdinal,
    type
  );
  seasonalData = seasonalData.filter((v, i) => seasonalData.indexOf(v) === i);

  function morphData(data: SeasonalRankData): SeasonalRankData {
    data.oldRankNumeric = getRankY(data.oldClass, data.oldLevel, data.oldStep);
    data.newRankNumeric = getRankY(data.newClass, data.newLevel, data.newStep);
    data.date = new Date(data.timestamp * 1000);
    //console.log(data);
    return data;
  }

  return seasonalData
    .map((id: string) => playerData.getSeasonal(id))
    .map((data: SeasonalRankData) => morphData(data))
    .sort(sortByTimestamp);
}

interface TimelinePartProps extends SeasonalRankData {
  width: number;
  height: number;
  hover: string;
  setHover: React.Dispatch<SetStateAction<string>>;
  lastMatchId: string;
}

/**
 * Component for a line/stroke of the timeline
 * @param props
 */
function TimeLinePart(props: TimelinePartProps): JSX.Element {
  const { width, height, hover, setHover, lastMatchId } = props;

  const deckId = playerData.matchExists(lastMatchId)
    ? playerData.match(lastMatchId)?.playerDeck.id
    : "";

  const newPointHeight = props.newRankNumeric
    ? height - props.newRankNumeric * 2
    : 0;
  const oldwPointHeight = props.oldRankNumeric
    ? height - props.oldRankNumeric * 2
    : 0;
  const rectPoints = `0 ${oldwPointHeight} ${width} ${newPointHeight} ${width} ${height} 0 ${height}`;
  const linePoints = `0 ${oldwPointHeight} ${width} ${newPointHeight}`;

  const style = {
    // Get a color that is the modulus of the hex ID
    fill: `hsl(${parseInt(deckId || "", 16) % 360}, 64%, 63%)`
  };

  return (
    <div
      style={style}
      className={"timeline-line" + (hover == deckId ? " hover" : "")}
      onMouseEnter={(): void => {
        setHover(deckId || "");
      }}
    >
      <svg width={width} height={height} version="1.1">
        <polygon points={rectPoints} strokeWidth="0" />
        <polyline points={linePoints} strokeWidth="1" />
      </svg>
      {props.oldClass !== props.newClass ? (
        <TimelineRankBullet
          left={width - 24}
          height={props.newRankNumeric ? props.newRankNumeric * 2 + 48 : 0}
          rankClass={props.newClass}
          rankLevel={props.newLevel}
        />
      ) : (
        <></>
      )}
    </div>
  );
}

interface RankBulletProps {
  left: number;
  height: number;
  rankClass: string;
  rankLevel: number;
}

/**
 * Component for a Rank "bullet" icon in the timeline
 * @param props
 */
function TimelineRankBullet(props: RankBulletProps): JSX.Element {
  const { left, height, rankClass, rankLevel } = props;

  const divStyle = {
    backgroundPosition: getRankIndex(rankClass, rankLevel) * -48 + "px 0px",
    margin: `-${height}px 0 0px ${left}px`
  };

  const divTitle = rankClass + " " + rankLevel;
  return (
    <div
      style={divStyle}
      title={divTitle}
      className="timeline-rank top_constructed_rank"
    ></div>
  );
}

/**
 * Main component for the Timeline tab
 * @param props
 */
export default function TimelineTab(): JSX.Element {
  const boxRef = useRef<HTMLDivElement>(null);
  const [hoverDeckId, setHoverDeckId] = React.useState("");
  const [dimensions, setDimensions] = React.useState({
    height: window.innerHeight,
    width: window.innerWidth
  });

  // This should be a select
  const seasonType = "constructed";
  // Notice we can see old seasons too adding the seasonOrdinal
  const data: SeasonalRankData[] = getSeasonData(seasonType);

  const handleResize = useCallback((): void => {
    if (boxRef && boxRef.current) {
      setDimensions({
        height: boxRef.current.offsetHeight,
        width: boxRef.current.offsetWidth
      });
    }
  }, [boxRef]);

  useEffect(() => {
    // We might want to add a delay here to avoid re-rendering too many times per second while resizing
    window.addEventListener("resize", handleResize);
    return (): void => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  const drawingSeason = playerData.rank[seasonType].seasonOrdinal;
  const drawingSeasonDate = new Date();

  return (
    <div className="ux_item">
      <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <div className="timeline-title">
          Season {drawingSeason} -{" "}
          {format(drawingSeasonDate as Date, "MMMM yyyy")}
        </div>
        <div className="timeline-box" ref={boxRef}>
          {data.map((value: SeasonalRankData, index: number) => {
            //console.log("From: ", value.oldClass, value.oldLevel, "step", value.oldStep, value.oldRankNumeric);
            //console.log("To:   ", value.newClass, value.newLevel, "step", value.newStep, value.newRankNumeric);
            return (
              <TimeLinePart
                height={dimensions.height}
                width={dimensions.width / data.length}
                key={index}
                hover={hoverDeckId}
                setHover={setHoverDeckId}
                {...value}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
