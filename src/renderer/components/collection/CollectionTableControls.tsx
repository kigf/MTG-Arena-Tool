/* eslint-disable complexity */
import React from "react";
import _ from "lodash";
import { MediumTextButton } from "../misc/MediumTextButton";
import ColumnToggles from "../tables/ColumnToggles";
import PagingControls from "../tables/PagingControls";
import { CollectionTableControlsProps } from "./types";
import tableCss from "../tables/tables.css";
import { InputContainer } from "../misc/InputContainer";
import getFiltersFromQuery from "./collectionQuery";

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
