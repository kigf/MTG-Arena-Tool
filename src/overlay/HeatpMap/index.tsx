import React from "react";
import css from "./index.css";
import { matchStateObject as MatchState } from "../../shared/store/currentMatchStore";

interface HeatMapProps {
  playerSeat: number;
  map: typeof MatchState.statsHeatMap;
}

export default function HeatMap(props: HeatMapProps): JSX.Element {
  const { map, playerSeat } = props;

  const maxHeat = map.reduce((prev, current) => {
    return prev.value > current.value ? prev : current;
  }).value;

  let prevTurn = 1;
  return (
    <div className={css.container}>
      {map.map((heat, index) => {
        const newturn = heat.turn !== prevTurn;
        prevTurn = heat.turn || 1;
        const height = (heat.value / maxHeat) * 100;
        const isPlayer = heat.seat == playerSeat;
        const Bar = (
          <div className={css.heatBar}>
            <div className={isPlayer ? css.barTop : css.barBottom}>
              <div
                className={isPlayer ? css.heatBlue : css.heatRed}
                style={{ height: height + "%" }}
              ></div>
            </div>
          </div>
        );

        return newturn ? (
          <React.Fragment key={"heat-" + index}>
            <div className={css.heatBarSpace}></div>
            {Bar}
          </React.Fragment>
        ) : (
          Bar
        );
      })}
    </div>
  );
}
