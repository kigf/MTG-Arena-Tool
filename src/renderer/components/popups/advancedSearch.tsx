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
import {
  ColorBitsFilter,
  ArrayFilter,
  RarityBitsFilter,
  RARITY_COMMON,
  RARITY_TOKEN,
  RARITY_LAND,
  RARITY_UNCOMMON,
  RARITY_RARE,
  RARITY_MYTHIC,
} from "../collection/types";
import SetsFilter from "../misc/SetsFilter";
import { StringFilter } from "../tables/filters";

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

const formatFilterOptions = [
  "Not set",
  "Standard",
  "Historic",
  "Singleton",
  "Brawl",
];

const raritySeparatorOptions: Record<string, string> = {
  "Equal to": ":",
  Not: "!=",
  Above: ">",
  "Equal or above": ">=",
  "Lower than": "<",
  "Lower or equal to": "<=",
};

const rarityFilterOptions = [
  "Any",
  "Token",
  "Land",
  "Common",
  "Uncommon",
  "Rare",
  "Mythic",
];

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
  let defaultFormat = "Not set";
  let defaultRarity = "Any";
  let defaultRaritySeparator = ":";
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
    if (f.id == "set") {
      const filter: ArrayFilter = f.value;
      defaultSets = filter.arr;
    }
    if (f.id == "format") {
      const filter: StringFilter = f.value;
      defaultFormat = filter.string;
    }
    if (f.id == "rarity") {
      const filter: RarityBitsFilter = f.value;
      if (filter.rarity == RARITY_TOKEN) defaultRarity = "Token";
      if (filter.rarity == RARITY_LAND) defaultRarity = "Land";
      if (filter.rarity == RARITY_COMMON) defaultRarity = "Common";
      if (filter.rarity == RARITY_UNCOMMON) defaultRarity = "Uncommon";
      if (filter.rarity == RARITY_RARE) defaultRarity = "Rare";
      if (filter.rarity == RARITY_MYTHIC) defaultRarity = "Mythic";
      if (filter.mode == "=") defaultRaritySeparator = "Equal to";
      if (filter.mode == "!=") defaultRaritySeparator = "Not";
      if (filter.mode == ":") defaultRaritySeparator = "Equal to";
      if (filter.mode == ">") defaultRaritySeparator = "Above";
      if (filter.mode == ">=") defaultRaritySeparator = "Equal or above";
      if (filter.mode == "<") defaultRaritySeparator = "Lower than";
      if (filter.mode == "<=") defaultRaritySeparator = "Lower or equal to";
    }
  });

  // Set filters state
  const [filterColors, setFilterColors] = useState<number[]>(defaultCol);
  const [filterSets, setFilterSets] = useState<string[]>(defaultSets);
  const [colorFilterOption, setColorFilterOption] = useState(
    defaultColorFilter
  );
  const [formatFilterOption, setFormatFilterOption] = useState<string>(
    defaultFormat
  );
  const [rarityFilterOption, setRarityFilterOption] = useState<string>(
    defaultRarity
  );
  const [raritySeparatorOption, setRaritySeparatorOption] = useState<string>(
    defaultRaritySeparator
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

    const sets = "s:" + filterSets.join(",");

    const formats = "f:" + formatFilterOption.toLocaleLowerCase();

    const rarity =
      "r" +
      (raritySeparatorOptions[raritySeparatorOption] || ":") +
      rarityFilterOption.toLocaleLowerCase();

    filterColors.length !== 5 && filters.push(colors);
    filterSets.length > 0 && filters.push(sets);
    formatFilterOption !== "Not set" && filters.push(formats);
    rarityFilterOption !== "Any" && filters.push(rarity);
    setQuery(filters.join(" "));
  }, [
    rarityFilterOption,
    raritySeparatorOption,
    formatFilterOption,
    filterSets,
    filterColors,
    colorFilterOption,
  ]);

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
          overflowY: `auto`,
          maxHeight: `calc(100vh - 80px)`,
          height: `min(${open * 450}px, calc(100vh - 64px))`,
          maxWidth: `${open * 800}px`,
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "16px",
          }}
        >
          <div style={{ lineHeight: "32px" }}>Format: </div>
          <ReactSelect
            options={formatFilterOptions}
            current={formatFilterOption}
            callback={(opt: string): void => {
              setFormatFilterOption(opt);
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "16px",
          }}
        >
          <div style={{ lineHeight: "32px" }}>Rarity: </div>
          <ReactSelect
            options={Object.keys(raritySeparatorOptions)}
            current={raritySeparatorOption}
            callback={(opt: string): void => {
              setRaritySeparatorOption(opt);
            }}
          />
          <ReactSelect
            options={rarityFilterOptions}
            current={rarityFilterOption}
            callback={(opt: string): void => {
              setRarityFilterOption(opt);
            }}
          />
        </div>
        <Button
          style={{ margin: "16px auto" }}
          text="Search"
          onClick={handleSearch}
        />
      </div>
    </div>
  );
}
