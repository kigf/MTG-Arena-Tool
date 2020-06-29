import React, { useState, useCallback, useEffect } from "react";
import Button from "../misc/Button";

import mainCss from "../../index.css";
import css from "./popups.css";
import ManaFilterExt from "../misc/ManaFilterExt";
import {
  WHITE,
  BLUE,
  BLACK,
  RED,
  GREEN,
  COLORLESS,
} from "../../../shared/constants";
import ReactSelect from "../../../shared/ReactSelect";
import getFiltersFromQuery from "../collection/collectionQuery";
import Colors from "../../../shared/colors";
import { ColorBitsFilter } from "../collection/types";
import SetsFilter from "../misc/SetsFilter";

const colorsToKey: Record<number, string> = {
  [WHITE]: "w",
  [BLUE]: "u",
  [BLACK]: "b",
  [RED]: "r",
  [GREEN]: "g",
  [COLORLESS]: "c",
};

const colorFilterOptions: Record<string, string> = {
  "Exactly these colors": "=",
  "Any of these colors": ":",
  "Strict superset of these colors": ">",
  "These colors and more": ">=",
  "Strict subset of these colors": "<",
  "At most these colors": "<=",
  "Not these colors": "!=",
};

interface EditKeyProps {
  defaultQuery: string;
  closeCallback?: (query: string) => void;
}

export default function AdvancedSearch(props: EditKeyProps): JSX.Element {
  const { closeCallback, defaultQuery } = props;
  const defaultFilters = getFiltersFromQuery(defaultQuery);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(0);

  // Default filters
  let defaultCol: number[] = [WHITE, BLUE, BLACK, RED, GREEN];
  let defaultSets: string[] = [];
  let defaultColorFilter = "Any of these colors";
  // Loop trough the setted filters to adjust defaults
  defaultFilters.map((f: any) => {
    // Guess color filter
    if (f.id == "colors") {
      const filter: ColorBitsFilter = f.value;
      const col = new Colors();
      col.addFromBits(filter.color);
      let df = ":";
      if (filter.mode == "not") df = "!=";
      if (filter.mode == "strict") df = "=";
      if (filter.mode == "strictNot") df = "!=";
      if (filter.mode == "strictSubset") df = "<";
      if (filter.mode == "strictSuperset") df = ">";
      if (filter.mode == "subset") df = "<=";
      if (filter.mode == "superset") df = ">=";
      defaultColorFilter = Object.keys(colorFilterOptions).filter(
        (k) => colorFilterOptions[k] == df
      )[0];
      defaultCol = col.get();
    }
  });

  // Set filters state
  const [filterColors, setFilterColors] = useState<number[]>(defaultCol);
  const [filterSets, setFilterSets] = useState<string[]>(defaultSets);
  const [colorFilterOption, setColorFilterOption] = useState(
    defaultColorFilter
  );

  const handleClose = useCallback(
    (q: string) => {
      if (!open) return;
      setOpen(0);
      setTimeout(() => {
        if (closeCallback) {
          closeCallback(q);
        }
      }, 300);
    },
    [closeCallback, open]
  );

  const handleSearch = useCallback(() => {
    handleClose(query);
  }, [handleClose, query]);

  useEffect(() => {
    // React doesnt give css time to know there was a change
    // in the properties, adding a timeout solves that.
    setTimeout(() => {
      setOpen(1);
    }, 1);
  }, []);

  // Get new query string based on filters data
  useEffect(() => {
    const filters: string[] = [];

    const colors =
      "c" +
      (colorFilterOptions[colorFilterOption] || "=") +
      filterColors.map((c) => colorsToKey[c] || "").join("");

    filters.push(colors);
    setQuery(filters.join(" "));
  }, [filterColors, colorFilterOption]);

  return (
    <div
      className={css.popupBackground}
      style={{
        opacity: open * 2,
        backgroundColor: `rgba(0, 0, 0, ${0.5 * open})`,
      }}
      onClick={(): void => {
        handleClose("");
      }}
    >
      <div
        className={css.popupDiv}
        style={{
          height: `${open * 320}px`,
          width: `${open * 640}px`,
          color: "var(--color-back)",
        }}
        onClick={(e): void => {
          e.stopPropagation();
        }}
      >
        <div className={mainCss.messageSub}>Advanced Search</div>
        <div style={{ marginBottom: "26px" }} className={mainCss.messageSub}>
          {query}
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <ManaFilterExt filter={filterColors} callback={setFilterColors} />
          <ReactSelect
            options={Object.keys(colorFilterOptions)}
            current={colorFilterOption}
            callback={(opt: string): void => {
              setColorFilterOption(opt);
            }}
          />
        </div>
        <SetsFilter filtered={filterSets} callback={setFilterSets} />
        <Button text="Search" onClick={handleSearch} />
      </div>
    </div>
  );
}
