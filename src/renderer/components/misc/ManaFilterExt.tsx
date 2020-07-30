import React, { useState, useEffect } from "react";
import indexCss from "../../index.css";
import sharedCss from "../../../shared/shared.css";
import { constants } from "mtgatool-shared";
const { WHITE, BLUE, BLACK, RED, GREEN, COLORLESS } = constants;

const manaClasses: string[] = [];
manaClasses[WHITE] = sharedCss.manaW;
manaClasses[BLUE] = sharedCss.manaU;
manaClasses[BLACK] = sharedCss.manaB;
manaClasses[RED] = sharedCss.manaR;
manaClasses[GREEN] = sharedCss.manaG;
manaClasses[COLORLESS] = sharedCss.manaC;

interface ManaFilterExtProps {
  filter: number[];
  callback: (filter: number[]) => void;
}

export default function ManaFilterExt(props: ManaFilterExtProps): JSX.Element {
  const { filter, callback } = props;
  const [filters, setFilters] = useState(filter);

  const filterSize = { height: "20px", width: "30px" };

  const setFilter = (filter: number): void => {
    const n = filters.indexOf(filter);
    const newFilters = [...filters];
    if (n > -1) {
      newFilters.splice(n, 1);
    } else {
      newFilters.push(filter);
    }
    setFilters(newFilters);
    callback(newFilters);
  };

  useEffect(() => {
    setFilters(filter);
  }, [filter]);

  const manas = [1, 2, 3, 4, 5, 6];

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      {manas.map((mana: number) => {
        return (
          <div
            key={"mana-filter-" + mana}
            onClick={(): void => setFilter(mana)}
            style={filterSize}
            className={`${indexCss.manaFilter} ${manaClasses[mana]} ${
              filters.includes(mana) ? "" : indexCss.manaFilterOn
            }`}
          ></div>
        );
      })}
    </div>
  );
}
