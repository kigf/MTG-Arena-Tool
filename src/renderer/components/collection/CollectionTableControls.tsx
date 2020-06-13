import React from "react";
import { MediumTextButton } from "../misc/MediumTextButton";
import ColumnToggles from "../tables/ColumnToggles";
import PagingControls from "../tables/PagingControls";
import { CollectionTableControlsProps, CardsData } from "./types";
import tableCss from "../tables/tables.css";
import { InputContainer } from "../misc/InputContainer";
import { Filters } from "react-table";

type QuerySeparators = ">=" | "<=" | ":" | "=" | "<" | ">";
type QueryKeys = "name" | "type" | "colors" | "cmc" | "set";
type ParsedToken = [string, QuerySeparators, string];

export function parseFilterValue(filterValue: string): ParsedToken[] {
  const exp = /(?<normal>(?<tok>[^\s"]+)(?<sep>\b[>=|<=|:|=|<|<]{1,2})(?<val>[^\s"]+))|(?<quoted>(?<qtok>[^\s"]+)(?<qsep>\b[>=|<=|:|=|<|<]{1,2})(?<qval>"[^"]*"))/;
  const filterPattern = new RegExp(exp, "g");

  let match;
  const results: ParsedToken[] = [];
  while ((match = filterPattern.exec(filterValue))) {
    console.log("filterPattern match: ", match.groups);
    let token, separator: QuerySeparators | undefined, value;
    if (match.groups?.normal) {
      token = match.groups.tok;
      separator = match.groups.sep as QuerySeparators;
      value = match.groups.val; // should remove quotes too
    } else if (match.groups?.quoted) {
      token = match.groups.qtok;
      separator = match.groups.qsep as QuerySeparators;
      value = match.groups.qval; // should remove quotes too
    }
    if (token && separator && value) {
      results.push([token, separator, value]);
    }
  }
  return results;
}

const tokenToKeys: Record<string, QueryKeys | undefined> = {
  name: "name",
  t: "type",
  type: "type",
  m: "colors",
  c: "colors",
  mana: "colors",
  cmc: "cmc",
  s: "set",
  set: "set",
};

function getTokenVal(
  key: QueryKeys,
  separator: QuerySeparators,
  val: any
): any {
  switch (key) {
    case "name":
      if (separator === ":") return val;
      break;
    case "cmc":
      let min: number | undefined = parseInt(val);
      let max: number | undefined = parseInt(val);
      if (separator === ">") max = undefined;
      if (separator === "<") min = undefined;
      if (separator === ">=") {
        min = parseInt(val) - 1;
        max = undefined;
      }
      if (separator === "<=") {
        min = undefined;
        max = parseInt(val) + 1;
      }
      return [min, max];
      break;
    case "colors":
      const str = val.toLowerCase();
      let colors = {
        w: false,
        u: false,
        b: false,
        r: false,
        g: false,
        multi: false,
      };
      if (separator == ">=") colors.multi = true;

      colors.w = str.indexOf("w") !== -1;
      colors.u = str.indexOf("u") !== -1;
      colors.b = str.indexOf("b") !== -1;
      colors.r = str.indexOf("r") !== -1;
      colors.g = str.indexOf("g") !== -1;
      if (str == "white")
        colors = { ...colors, w: true, u: false, b: false, r: false, g: false };
      if (str == "blue")
        colors = { ...colors, w: false, u: true, b: false, r: false, g: false };
      if (str == "black")
        colors = { ...colors, w: false, u: false, b: true, r: false, g: false };
      if (str == "red")
        colors = { ...colors, w: false, u: false, b: false, r: true, g: false };
      if (str == "green")
        colors = { ...colors, w: false, u: false, b: false, r: false, g: true };
      if (str == "azorious")
        colors = { ...colors, w: true, u: true, b: false, r: false, g: false };
      if (str == "dimir")
        colors = { ...colors, w: false, u: true, b: true, r: false, g: false };
      if (str == "rakdos")
        colors = { ...colors, w: false, u: false, b: true, r: true, g: false };
      if (str == "gruul")
        colors = { ...colors, w: false, u: false, b: false, r: true, g: true };
      if (str == "selesnya")
        colors = { ...colors, w: true, u: false, b: false, r: false, g: true };
      if (str == "orzhov")
        colors = { ...colors, w: true, u: false, b: true, r: false, g: false };
      if (str == "izzet")
        colors = { ...colors, w: false, u: true, b: false, r: true, g: false };
      if (str == "golgari")
        colors = { ...colors, w: false, u: false, b: true, r: false, g: true };
      if (str == "boros")
        colors = { ...colors, w: true, u: false, b: false, r: true, g: false };
      if (str == "simic")
        colors = { ...colors, w: false, u: true, b: false, r: false, g: true };
      if (str == "esper")
        colors = { ...colors, w: true, u: true, b: true, r: false, g: false };
      if (str == "grixis")
        colors = { ...colors, w: false, u: true, b: true, r: true, g: false };
      if (str == "jund")
        colors = { ...colors, w: false, u: false, b: true, r: true, g: true };
      if (str == "naya")
        colors = { ...colors, w: true, u: false, b: false, r: true, g: true };
      if (str == "bant")
        colors = { ...colors, w: true, u: true, b: false, r: false, g: true };
      if (str == "mardu")
        colors = { ...colors, w: true, u: false, b: true, r: true, g: false };
      if (str == "temur")
        colors = { ...colors, w: false, u: true, b: false, r: true, g: true };
      if (str == "abzan")
        colors = { ...colors, w: true, u: false, b: true, r: false, g: true };
      if (str == "jeskai")
        colors = { ...colors, w: true, u: true, b: false, r: true, g: false };
      if (str == "sultai")
        colors = { ...colors, w: false, u: true, b: true, r: false, g: true };

      return colors;
      break;
  }
}

function getFiltersFromQuery(query: string): Filters<CardsData> {
  const filters: Filters<CardsData> = [];
  const results = parseFilterValue(query);
  console.log(results);
  results.map((match: any) => {
    const [tokenKey, separator, tokenVal] = match;
    const key = tokenToKeys[tokenKey] || undefined;
    if (key) {
      const value = getTokenVal(key, separator, tokenVal);
      if (value) {
        filters.push({
          id: key,
          value: value,
        });
      }
    }
  });

  if (filters.length == 0) {
    filters.push({
      id: "name",
      value: query,
    });
  }

  return filters;
}

export default function CollectionTableControls(
  props: CollectionTableControlsProps
): JSX.Element {
  const {
    exportCallback,
    setAllFilters,
    toggleSortBy,
    toggleHideColumn,
    globalFilter,
    setGlobalFilter,
    pagingProps,
    rows,
    setTogglesVisible,
    toggleableColumns,
    togglesVisible,
  } = props;
  const exportRows = React.useCallback(() => {
    exportCallback(rows.map((row) => row.values.id));
  }, [exportCallback, rows]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      const filters = getFiltersFromQuery(e.currentTarget.value || "");
      setGlobalFilter(undefined);
      setAllFilters(filters);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        color: "var(--color-light)",
        paddingBottom: "8px",
      }}
    >
      <div className={tableCss.reactTableToggles}>
        <MediumTextButton onClick={exportRows}>Export</MediumTextButton>
        <MediumTextButton
          onClick={(): void => {
            setAllFilters([]);
            toggleSortBy("grpId", true, false);
            for (const column of toggleableColumns) {
              toggleHideColumn(column.id, !column.defaultVisible);
            }
          }}
        >
          Reset
        </MediumTextButton>
        <MediumTextButton
          onClick={(): void => setTogglesVisible(!togglesVisible)}
        >
          {togglesVisible ? "Hide" : "Show"} Column Toggles
        </MediumTextButton>
      </div>
      <ColumnToggles
        toggleableColumns={toggleableColumns}
        togglesVisible={togglesVisible}
      />
      <div className={tableCss.react_table_search_cont}>
        <InputContainer title="Search">
          <input
            defaultValue={globalFilter ?? ""}
            placeholder={"Search.."}
            onKeyDown={handleKeyDown}
          />
        </InputContainer>
        <PagingControls {...pagingProps} />
      </div>
    </div>
  );
}
