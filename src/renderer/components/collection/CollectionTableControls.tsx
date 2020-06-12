import React from "react";
import { MediumTextButton } from "../misc/MediumTextButton";
import ColumnToggles from "../tables/ColumnToggles";
import PagingControls from "../tables/PagingControls";
import { CollectionTableControlsProps, CardsData } from "./types";
import { parseFilterValue } from "../collection/filters";
import tableCss from "../tables/tables.css";
import { InputContainer } from "../misc/InputContainer";
import { Filters } from "react-table";

const tokenToKeys: Record<string, string> = {
  name: "name",
  t: "type",
  type: "type",
  m: "cost",
  c: "cost",
  mana: "cost",
  cmc: "cmc",
  s: "set",
  set: "set",
};

function getFiltersFromQuery(query: string): Filters<CardsData> {
  const tokens = query.split(" ").filter((token) => token.length > 2);
  const filters: Filters<CardsData> = [];
  tokens.map((token) => {
    const results = parseFilterValue(token);
    if (results.length) {
      const [[tokenKey, _separator, tokenVal]] = results;
      const key = tokenToKeys[tokenKey] || undefined;
      if (key) {
        filters.push({
          id: key,
          value: tokenVal,
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
