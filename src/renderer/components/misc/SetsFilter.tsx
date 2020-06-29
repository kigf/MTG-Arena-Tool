import React from "react";
//import { useSelector } from "react-redux";
//import { AppState } from "../../../shared/redux/stores/rendererStore";
import db from "../../../shared/database";
import index from "../../index.css";

interface SetsFilterProps {
  callback: (sets: string[]) => void;
  filtered: string[];
}

export default function SetsFilter(props: SetsFilterProps): JSX.Element {
  const {callback, filtered} = props;
  //const formats = useSelector((state: AppState) => state.renderer.formats);
  // All sets after Ixalan
  const stadardSets = Object.keys(db.sets)
    .filter((set) => db.sets[set].collation > 0)
    .map((set) => {
      return {name: set, ...db.sets[set]};
    });

  const setFilteredSet = (setCode: string): void => {
    var index = filtered.indexOf(setCode);
    if (index !== -1) {
      callback(filtered.filter(s => s !== setCode));
    } else {
      callback([...filtered, setCode]);
    }
  };

  return (
    <div style={{display: "flex"}}>
      {stadardSets.map((set) => {
        const svgData = set.svg;
        const setClass = `${index.setFilter} ${
          filtered.indexOf(set.arenacode) == -1 ? index.setFilterOn : ""
        }`;
        return (
          <div
            key={set.arenacode}
            style={{
              filter: "invert(1)",
              backgroundImage: `url(data:image/svg+xml;base64,${svgData})`,
            }}
            title={set.name}
            className={setClass}
            onClick={() => setFilteredSet(set.arenacode)}
          ></div>
        );
      })}
    </div>
  );
}
